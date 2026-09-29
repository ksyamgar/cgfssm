import React, { createContext, useContext, useState, useEffect } from 'react';
import { FSM_STATUS } from '../constants/fsm';
import {
  getStorageData,
  setStorageData,
  initializeStorage,
  STORAGE_KEYS
} from '../services/storageService';
import { stepVehicleSimulation } from '../services/traqIndia';
import { db, queueOfflineAction } from '../services/db';
import { useAuth } from './AuthContext';

const FsmContext = createContext();

export const FsmProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [fstps, setFstps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tariffs, setTariffs] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Initialize storage on mount
  useEffect(() => {
    initializeStorage();
    setRequests(getStorageData(STORAGE_KEYS.REQUESTS, []));
    setVehicles(getStorageData(STORAGE_KEYS.VEHICLES, []));
    setFstps(getStorageData(STORAGE_KEYS.FSTPS, []));
    setVendors(getStorageData(STORAGE_KEYS.VENDORS, []));
    setTariffs(getStorageData(STORAGE_KEYS.TARIFFS, {}));
    setAuditLogs(getStorageData(STORAGE_KEYS.AUDIT_LOGS, []));

    // Online/offline listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // GPS Telemetry Simulation Interval (every 10s)
    const gpsInterval = setInterval(() => {
      const movedVehicles = stepVehicleSimulation();
      setVehicles(movedVehicles);
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(gpsInterval);
    };
  }, []);

  // Update offline sync counter
  useEffect(() => {
    db.syncQueue.count().then(count => setPendingSyncCount(count));
  }, [requests, isOnline]);

  // Write audit log entry
  const logAudit = (action, details, entityId = null) => {
    const entry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      action,
      entityId,
      actor: currentUser?.name || 'Anonymous User',
      actorRole: currentUser?.role || 'SYSTEM',
      ip: '10.20.44.12',
      timestamp: new Date().toISOString(),
      details
    };
    const updated = [entry, ...getStorageData(STORAGE_KEYS.AUDIT_LOGS, [])];
    setAuditLogs(updated);
    setStorageData(STORAGE_KEYS.AUDIT_LOGS, updated);
  };

  // Create new desludging request (Citizen / CSC)
  const createRequest = async (payload) => {
    const requestNo = `CG-D${Math.floor(10 + Math.random() * 90)}-B${Math.floor(10 + Math.random() * 90)}-GP${Math.floor(10 + Math.random() * 90)}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReq = {
      id: `req_${Date.now()}`,
      requestNo,
      status: FSM_STATUS.PENDING_APPROVAL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: payload.citizenName || currentUser?.name || 'Citizen User',
      citizenPhone: payload.citizenPhone || currentUser?.phone || '9826100000',
      district: payload.district,
      block: payload.block,
      gp: payload.gp,
      village: payload.village,
      habitation: payload.habitation || 'Main Village',
      tankType: payload.tankType || 'CONVENTIONAL_TWO_CHAMBER',
      tankVolumeLitres: Number(payload.tankVolumeLitres || 3000),
      roadWidthMeters: Number(payload.roadWidthMeters || 4.0),
      distanceFromRoadMeters: Number(payload.distanceFromRoadMeters || 10),
      isEmergency: !!payload.isEmergency,
      scheduledDate: payload.scheduledDate || new Date().toISOString().split('T')[0],
      estimatedCost: payload.estimatedCost || 1200,
      paymentMethod: payload.paymentMethod || 'UPI',
      paymentStatus: 'UNPAID',
      lat: payload.lat || 21.2514,
      lng: payload.lng || 81.6296,
      history: [
        {
          step: 1,
          action: 'REQUEST_SUBMITTED',
          actor: payload.citizenName || currentUser?.name || 'Citizen',
          time: new Date().toISOString(),
          note: payload.isEmergency ? 'EMERGENCY: Immediate desludging requested' : 'Standard scheduled request'
        }
      ]
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    setStorageData(STORAGE_KEYS.REQUESTS, updated);

    // Save to Dexie offline DB
    await db.requests.put(newReq);
    if (!isOnline) {
      await queueOfflineAction('REQUEST', 'CREATE', newReq);
    }

    logAudit('CREATE_REQUEST', `Desludging request ${requestNo} created for ${payload.village}`, newReq.id);
    return newReq;
  };

  // State machine transition handler
  const transitionRequest = async (requestId, nextStatus, note = '', extraData = {}) => {
    const updated = requests.map(req => {
      if (req.id !== requestId) return req;

      const historyEntry = {
        step: (req.history?.length || 0) + 1,
        action: `TRANSITION_TO_${nextStatus}`,
        actor: `${currentUser?.name || 'User'} (${currentUser?.role || 'SYSTEM'})`,
        time: new Date().toISOString(),
        note: note || `Status updated to ${nextStatus}`
      };

      const newHistory = [...(req.history || []), historyEntry];

      return {
        ...req,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        history: newHistory,
        ...extraData
      };
    });

    setRequests(updated);
    setStorageData(STORAGE_KEYS.REQUESTS, updated);

    // Cache to Dexie
    const updatedReq = updated.find(r => r.id === requestId);
    if (updatedReq) {
      await db.requests.put(updatedReq);
      if (!isOnline) {
        await queueOfflineAction('REQUEST', 'TRANSITION', { requestId, nextStatus, note, extraData });
      }
    }

    logAudit('TRANSITION_REQUEST', `Request ${updatedReq?.requestNo} moved to ${nextStatus}. Note: ${note}`, requestId);
    return updatedReq;
  };

  // Reassign / Breakdown handler
  const handleBreakdownReassignment = (requestId, vehicleId, reason = 'Vehicle technical breakdown') => {
    // Free the vehicle and mark request for reassignment
    const updatedVehicles = vehicles.map(v => v.id === vehicleId ? { ...v, status: 'MAINTENANCE', assignedRequestId: null } : v);
    setVehicles(updatedVehicles);
    setStorageData(STORAGE_KEYS.VEHICLES, updatedVehicles);

    return transitionRequest(requestId, FSM_STATUS.REQUIRES_REASSIGNMENT, reason, {
      breakdownVehicleId: vehicleId,
      reassignmentRequestedAt: new Date().toISOString()
    });
  };

  // Payment settle handler
  const recordPayment = (requestId, method = 'UPI', referenceNo = '') => {
    return transitionRequest(requestId, FSM_STATUS.PAYMENT_COMPLETED, `Payment received via ${method}. Ref: ${referenceNo}`, {
      paymentStatus: 'PAID',
      paymentMethod: method,
      paymentReference: referenceNo || `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paidAt: new Date().toISOString()
    });
  };

  // FSTP Decant & QR Manifest verify
  const verifyFstpDisposal = (requestId, fstpId, decantedLitres) => {
    const targetFstp = fstps.find(f => f.id === fstpId) || fstps[0];
    
    // Update FSTP current capacity
    const updatedFstps = fstps.map(f => {
      if (f.id === targetFstp.id) {
        const addedKLD = (Number(decantedLitres) || 3000) / 1000;
        return {
          ...f,
          currentVolumeKLD: Math.min(f.capacityKLD, Number((f.currentVolumeKLD + addedKLD).toFixed(1))),
          compostStockTons: Number((f.compostStockTons + addedKLD * 0.08).toFixed(1))
        };
      }
      return f;
    });
    setFstps(updatedFstps);
    setStorageData(STORAGE_KEYS.FSTPS, updatedFstps);

    return transitionRequest(requestId, FSM_STATUS.DISPOSED, `Safely decanted at ${targetFstp.name}. Volume: ${decantedLitres} L verified.`, {
      targetFstpId: targetFstp.id,
      targetFstpName: targetFstp.name,
      decantedVolumeLitres: Number(decantedLitres),
      manifestSignedAt: new Date().toISOString(),
      manifestSignedBy: currentUser?.name || 'FSTP Operator'
    });
  };

  return (
    <FsmContext.Provider
      value={{
        requests,
        vehicles,
        fstps,
        vendors,
        tariffs,
        auditLogs,
        isOnline,
        pendingSyncCount,
        createRequest,
        transitionRequest,
        handleBreakdownReassignment,
        recordPayment,
        verifyFstpDisposal,
        setVehicles,
        setFstps,
        setVendors,
        logAudit
      }}
    >
      {children}
    </FsmContext.Provider>
  );
};

export const useFsm = () => useContext(FsmContext);
