import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FSM_STATUS } from '../constants/fsm';
import {
  getStorageData,
  setStorageData,
  initializeStorage,
  STORAGE_KEYS
} from '../services/storageService';
import { apiService } from '../services/apiService';
import { stepVehicleSimulation, syncTraqIndiaDevicesToVehicles } from '../services/traqIndia';
import { db, queueOfflineAction } from '../services/db';
import { useAuth } from './AuthContext';

const FsmContext = createContext();

export const FsmProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [fstps, setFstps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tariffs, setTariffs] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load all dynamic data from SQLite Backend API with local fallback
  const loadDynamicData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        fetchedRequests,
        fetchedVehicles,
        fetchedFstps,
        fetchedVendors,
        fetchedTariffs,
        fetchedAuditLogs,
        fetchedStats
      ] = await Promise.all([
        apiService.getRequests(),
        apiService.getVehicles(),
        apiService.getFstps(),
        apiService.getVendors(),
        apiService.getTariffs(),
        apiService.getAuditLogs(),
        apiService.getStats()
      ]);

      if (fetchedRequests && fetchedRequests.length > 0) {
        setRequests(fetchedRequests);
        setStorageData(STORAGE_KEYS.REQUESTS, fetchedRequests);
      } else {
        setRequests(getStorageData(STORAGE_KEYS.REQUESTS, []));
      }

      if (fetchedVehicles && fetchedVehicles.length >= 17) {
        setVehicles(fetchedVehicles);
        setStorageData(STORAGE_KEYS.VEHICLES, fetchedVehicles);
      } else {
        const synced = await syncTraqIndiaDevicesToVehicles();
        if (synced && synced.length > 0) {
          setVehicles(synced);
        } else if (fetchedVehicles && fetchedVehicles.length > 0) {
          setVehicles(fetchedVehicles);
        }
      }

      if (fetchedFstps && fetchedFstps.length > 0) {
        setFstps(fetchedFstps);
        setStorageData(STORAGE_KEYS.FSTPS, fetchedFstps);
      } else {
        setFstps(getStorageData(STORAGE_KEYS.FSTPS, []));
      }

      if (fetchedVendors && fetchedVendors.length > 0) {
        setVendors(fetchedVendors);
        setStorageData(STORAGE_KEYS.VENDORS, fetchedVendors);
      } else {
        setVendors(getStorageData(STORAGE_KEYS.VENDORS, []));
      }

      if (fetchedTariffs && Object.keys(fetchedTariffs).length > 0) {
        setTariffs(fetchedTariffs);
        setStorageData(STORAGE_KEYS.TARIFFS, fetchedTariffs);
      } else {
        setTariffs(getStorageData(STORAGE_KEYS.TARIFFS, {}));
      }

      if (fetchedAuditLogs && fetchedAuditLogs.length > 0) {
        setAuditLogs(fetchedAuditLogs);
        setStorageData(STORAGE_KEYS.AUDIT_LOGS, fetchedAuditLogs);
      } else {
        setAuditLogs(getStorageData(STORAGE_KEYS.AUDIT_LOGS, []));
      }

      if (fetchedStats) {
        setStats(fetchedStats);
      }
    } catch (err) {
      console.warn('Backend SQLite load fallback to local storage:', err);
      setRequests(getStorageData(STORAGE_KEYS.REQUESTS, []));
      const syncedFallback = await syncTraqIndiaDevicesToVehicles();
      setVehicles(syncedFallback);
      setFstps(getStorageData(STORAGE_KEYS.FSTPS, []));
      setVendors(getStorageData(STORAGE_KEYS.VENDORS, []));
      setTariffs(getStorageData(STORAGE_KEYS.TARIFFS, {}));
      setAuditLogs(getStorageData(STORAGE_KEYS.AUDIT_LOGS, []));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeStorage();
    loadDynamicData();

    // Online/offline listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial TraqIndia GPS sync on boot to ensure all 17 vehicles are loaded
    syncTraqIndiaDevicesToVehicles().then((synced) => {
      if (synced && synced.length > 0) setVehicles(synced);
    });

    // Live GPS Telemetry Polling (every 8s) - non-destructive merge preserves all vehicles
    const telemetryInterval = setInterval(async () => {
      try {
        const liveVehicles = await apiService.getVehicles();
        if (liveVehicles && liveVehicles.length > 0) {
          const normalized = liveVehicles.map(v => ({
            ...v,
            hasGpsDevice: Boolean(v.hasGpsDevice || v.gpsDeviceId?.startsWith('TRQ') || v.gpsDeviceId?.includes('TRQ') || v.traqDeviceId)
          }));

          setVehicles(prev => {
            // Non-destructively merge so no vehicles ever vanish
            const mergedMap = new Map();
            (prev || []).forEach(v => {
              if (v) mergedMap.set(v.id || v.regNo, v);
            });
            normalized.forEach(lv => {
              if (lv) {
                const key = lv.id || lv.regNo;
                const existing = mergedMap.get(key);
                mergedMap.set(key, { ...existing, ...lv });
              }
            });
            const mergedList = Array.from(mergedMap.values());
            return stepVehicleSimulation(mergedList);
          });
        } else {
          setVehicles(prev => stepVehicleSimulation(prev));
        }
      } catch {
        setVehicles(prev => stepVehicleSimulation(prev));
      }
    }, 8000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(telemetryInterval);
    };
  }, [loadDynamicData]);

  // Update offline sync counter
  useEffect(() => {
    db.syncQueue.count().then(count => setPendingSyncCount(count));
  }, [requests, isOnline]);

  // Write audit log entry (persisted to SQLite + local)
  const logAudit = async (action, details, entityId = null) => {
    const entry = {
      entityId,
      entityType: 'FSM',
      action,
      actorName: currentUser?.name || 'Anonymous User',
      actorRole: currentUser?.role || 'SYSTEM',
      ip: '10.20.44.12',
      details,
      timestamp: new Date().toISOString()
    };

    try {
      await apiService.createAuditLog(entry);
    } catch (err) {
      console.error('Failed to send audit log to SQLite:', err);
    }

    const updated = [{ id: `aud_${Date.now()}`, ...entry }, ...auditLogs];
    setAuditLogs(updated);
    setStorageData(STORAGE_KEYS.AUDIT_LOGS, updated);
  };

  // Create new desludging request (Citizen / CSC) -> Saved in SQLite
  const createRequest = async (payload) => {
    const newReqPayload = {
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
      lat: payload.lat || 21.2514,
      lng: payload.lng || 81.6296
    };

    let createdReq = null;
    try {
      const res = await apiService.createRequest(newReqPayload);
      if (res && res.success && res.request) {
        createdReq = res.request;
      }
    } catch (err) {
      console.warn('API error creating request, falling back locally:', err);
    }

    if (!createdReq) {
      const requestNo = `CG-D${Math.floor(10 + Math.random() * 90)}-B${Math.floor(10 + Math.random() * 90)}-GP${Math.floor(10 + Math.random() * 90)}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      createdReq = {
        id: `req_${Date.now()}`,
        requestNo,
        status: FSM_STATUS.PENDING_APPROVAL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{ step: 1, action: 'REQUEST_SUBMITTED', actor: newReqPayload.citizenName, time: new Date().toISOString() }],
        ...newReqPayload
      };
    }

    const updated = [createdReq, ...requests];
    setRequests(updated);
    setStorageData(STORAGE_KEYS.REQUESTS, updated);

    // Save to Dexie offline DB
    await db.requests.put(createdReq);
    if (!isOnline) {
      await queueOfflineAction('REQUEST', 'CREATE', createdReq);
    }

    return createdReq;
  };

  // State machine transition handler -> Saved in SQLite
  const transitionRequest = async (requestId, nextStatus, note = '', extraData = {}) => {
    const targetReq = requests.find(r => r.id === requestId);
    const historyEntry = {
      step: (targetReq?.history?.length || 0) + 1,
      action: `TRANSITION_TO_${nextStatus}`,
      actor: `${currentUser?.name || 'User'} (${currentUser?.role || 'SYSTEM'})`,
      time: new Date().toISOString(),
      note: note || `Status updated to ${nextStatus}`
    };

    const newHistory = [...(targetReq?.history || []), historyEntry];
    const updatePayload = {
      status: nextStatus,
      history: newHistory,
      ...extraData
    };

    let updatedReq = null;
    try {
      const res = await apiService.updateRequest(requestId, updatePayload);
      if (res && res.success && res.request) {
        updatedReq = res.request;
      }
    } catch (err) {
      console.warn('Failed to update request via API:', err);
    }

    if (!updatedReq) {
      updatedReq = {
        ...targetReq,
        ...updatePayload,
        updatedAt: new Date().toISOString()
      };
    }

    const updated = requests.map(r => (r.id === requestId ? updatedReq : r));
    setRequests(updated);
    setStorageData(STORAGE_KEYS.REQUESTS, updated);

    // Cache to Dexie
    await db.requests.put(updatedReq);
    if (!isOnline) {
      await queueOfflineAction('REQUEST', 'TRANSITION', { requestId, nextStatus, note, extraData });
    }

    logAudit('TRANSITION_REQUEST', `Request ${updatedReq?.requestNo} moved to ${nextStatus}. Note: ${note}`, requestId);
    return updatedReq;
  };

  // Reassign / Breakdown handler
  const handleBreakdownReassignment = async (requestId, vehicleId, reason = 'Vehicle technical breakdown') => {
    try {
      await apiService.updateVehicle(vehicleId, { status: 'MAINTENANCE', assignedRequestId: null });
    } catch {}

    const updatedVehicles = vehicles.map(v => (v.id === vehicleId ? { ...v, status: 'MAINTENANCE', assignedRequestId: null } : v));
    setVehicles(updatedVehicles);
    setStorageData(STORAGE_KEYS.VEHICLES, updatedVehicles);

    return transitionRequest(requestId, FSM_STATUS.REQUIRES_REASSIGNMENT, reason, {
      breakdownVehicleId: vehicleId,
      reassignmentRequestedAt: new Date().toISOString()
    });
  };

  // Payment settle handler
  const recordPayment = async (requestId, method = 'UPI', referenceNo = '') => {
    return transitionRequest(requestId, FSM_STATUS.PAYMENT_COMPLETED, `Payment received via ${method}. Ref: ${referenceNo}`, {
      paymentStatus: 'PAID',
      paymentMethod: method,
      paymentReference: referenceNo || `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paidAt: new Date().toISOString()
    });
  };

  // FSTP Decant & QR Manifest verify
  const verifyFstpDisposal = async (requestId, fstpId, decantedLitres) => {
    const targetFstp = fstps.find(f => f.id === fstpId) || fstps[0];
    const addedKLD = (Number(decantedLitres) || 3000) / 1000;
    const newVolume = Math.min(targetFstp.capacityKLD || 20, Number(((targetFstp.currentVolumeKLD || 0) + addedKLD).toFixed(1)));
    const newCompost = Number(((targetFstp.compostStockTons || 0) + addedKLD * 0.08).toFixed(1));

    try {
      await apiService.updateFstp(targetFstp.id, {
        currentVolumeKLD: newVolume,
        compostStockTons: newCompost
      });
    } catch {}

    const updatedFstps = fstps.map(f => {
      if (f.id === targetFstp.id) {
        return {
          ...f,
          currentVolumeKLD: newVolume,
          compostStockTons: newCompost
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

  // Manually or automatically synchronize vehicles with TraqIndia GPS API
  const syncTraqGps = async () => {
    try {
      const syncedVehicles = await syncTraqIndiaDevicesToVehicles();
      if (syncedVehicles && syncedVehicles.length > 0) {
        setVehicles(syncedVehicles);
        setStorageData(STORAGE_KEYS.VEHICLES, syncedVehicles);
        try {
          await apiService.bulkUpsertVehicles(syncedVehicles);
        } catch (e) {
          console.warn('Backend bulk upsert sync notice:', e);
        }
        return { success: true, count: syncedVehicles.length };
      }
      return { success: false, message: 'No devices found' };
    } catch (error) {
      console.error('TraqIndia GPS sync error:', error);
      return { success: false, error: error.message };
    }
  };

  // Re-fetch all fresh data on demand
  const refreshData = () => {
    return loadDynamicData();
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
        stats,
        loading,
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
        logAudit,
        refreshData,
        syncTraqGps
      }}
    >
      {children}
    </FsmContext.Provider>
  );
};

export const useFsm = () => useContext(FsmContext);
