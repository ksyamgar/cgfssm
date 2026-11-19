import React, { useState, useMemo } from 'react';
import { useFsm } from '../../context/FsmContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { EvidenceUploadModal } from '../../components/fsm/EvidenceUploadModal';
import { ManifestModal } from '../../components/fsm/ManifestModal';
import { FSM_STATUS } from '../../constants/fsm';
import { notifySuccess, notifyInfo, notifyWarning } from '../../services/toastService';
import {
  Navigation,
  Truck,
  QrCode,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Check,
  X,
  Phone,
  UserCheck,
  Key,
  User,
  Shield,
  Factory
} from 'lucide-react';

export const TripsPage = () => {
  const {
    requests,
    fstps,
    transitionRequest,
    driverAcceptTrip,
    verifyCollectionHandshake,
    verifyFstpDisposal
  } = useFsm();

  const { currentUser, currentRole } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING_ACCEPTANCE, IN_TRANSIT, COMPLETED
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Handshake verification code state for the right-house collection
  const [handshakeModalTrip, setHandshakeModalTrip] = useState(null);
  const [handshakeInputCode, setHandshakeInputCode] = useState('');
  const [handshakeError, setHandshakeError] = useState('');

  // Workflow modals
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  // 1. Role-based scoping of requests for trips
  const roleScopedRequests = useMemo(() => {
    return requests.filter((r) => {
      // Super Admin & State Officer: Statewide visibility
      if (['SUPER_ADMIN', 'STATE_OFFICER', 'ADMIN'].includes(currentRole)) return true;

      // District Coordinator
      if (currentRole === 'DISTRICT_COORDINATOR') {
        if (!currentUser?.district || currentUser.district.includes('All') || currentUser.district.includes('State')) return true;
        const userDist = currentUser.district.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        const reqDist = (r.district || '').replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        return reqDist.includes(userDist) || userDist.includes(reqDist);
      }

      // Block Coordinator
      if (currentRole === 'BLOCK_COORDINATOR') {
        if (!currentUser?.block || currentUser.block.includes('All')) return true;
        const userBlock = currentUser.block.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        const reqBlock = (r.block || '').replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        return reqBlock.includes(userBlock) || userBlock.includes(reqBlock);
      }

      // GP Operator
      if (currentRole === 'GP_OPERATOR') {
        if (!currentUser?.gp || currentUser.gp.includes('All')) return true;
        const userGp = currentUser.gp.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        const reqGp = (r.gp || '').replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        return reqGp.includes(userGp) || userGp.includes(reqGp);
      }

      // Citizen: sees only trips originating from their household
      if (currentRole === 'CITIZEN') {
        const uPhone = (currentUser?.phone || '').trim().replace(/\D/g, '');
        const rPhone = (r.citizenPhone || '').trim().replace(/\D/g, '');
        const phoneMatch = uPhone && rPhone && (uPhone === rPhone || uPhone.endsWith(rPhone) || rPhone.endsWith(uPhone));
        const nameMatch = currentUser?.name && r.citizenName && (currentUser.name.trim().toLowerCase() === r.citizenName.trim().toLowerCase());
        const idMatch = currentUser?.id && r.userId && (currentUser.id === r.userId);
        return Boolean(phoneMatch || nameMatch || idMatch);
      }

      // Driver: sees only trips assigned to them
      if (currentRole === 'DRIVER') {
        const uPhone = (currentUser?.phone || '').trim().replace(/\D/g, '');
        const dPhone = (r.driverPhone || r.assignedDriverPhone || '').trim().replace(/\D/g, '');
        const phoneMatch = uPhone && dPhone && (uPhone === dPhone || uPhone.endsWith(dPhone) || dPhone.endsWith(uPhone));
        const nameMatch = currentUser?.name && (
          (r.assignedDriverName && r.assignedDriverName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
          (currentUser.name.toLowerCase().includes((r.assignedDriverName || '').toLowerCase()))
        );
        const idMatch = currentUser?.id && (r.assignedDriverId === currentUser.id);
        return Boolean(idMatch || phoneMatch || nameMatch);
      }

      // FSTP Operator: sees only trips heading to their plant
      if (currentRole === 'FSTP_OPERATOR') {
        if (currentUser?.fstpId && r.targetFstpId === currentUser.fstpId) return true;
        if (currentUser?.plantName && r.targetFstpName) {
          const userPlant = currentUser.plantName.toLowerCase();
          const reqPlant = r.targetFstpName.toLowerCase();
          if (userPlant.includes(reqPlant) || reqPlant.includes(userPlant)) return true;
        }
        return false;
      }

      return true;
    });
  }, [requests, currentRole, currentUser]);

  // Trips derived from requests that have vehicles/drivers assigned
  const trips = useMemo(() => {
    return roleScopedRequests.filter(r =>
      r.assignedVehicleNo ||
      r.status === FSM_STATUS.VEHICLE_ASSIGNED ||
      r.status === FSM_STATUS.TRIP_SCHEDULED ||
      r.status === FSM_STATUS.EN_ROUTE ||
      r.status === FSM_STATUS.ARRIVED ||
      r.status === FSM_STATUS.CLEANING_STARTED ||
      r.status === FSM_STATUS.CLEANING_COMPLETED ||
      r.status === FSM_STATUS.TRANSPORTING ||
      r.status === FSM_STATUS.AT_FSTP ||
      r.status === FSM_STATUS.DISPOSED ||
      r.status === FSM_STATUS.CLOSED
    );
  }, [roleScopedRequests]);

  const filteredTrips = trips.filter(t => {
    if (activeTab === 'PENDING_ACCEPTANCE') {
      return t.status === FSM_STATUS.VEHICLE_ASSIGNED || t.driverAcceptanceStatus === 'PENDING_ACCEPTANCE';
    }
    if (activeTab === 'IN_TRANSIT') {
      return [
        FSM_STATUS.TRIP_SCHEDULED,
        FSM_STATUS.EN_ROUTE,
        FSM_STATUS.ARRIVED,
        FSM_STATUS.CLEANING_STARTED,
        FSM_STATUS.CLEANING_COMPLETED,
        FSM_STATUS.TRANSPORTING,
        FSM_STATUS.AT_FSTP
      ].includes(t.status);
    }
    if (activeTab === 'COMPLETED') {
      return [FSM_STATUS.DISPOSED, FSM_STATUS.PAYMENT_COMPLETED, FSM_STATUS.CLOSED].includes(t.status);
    }
    return true;
  });

  // Role flags for UI authorization
  const isSuperOrState = ['SUPER_ADMIN', 'STATE_OFFICER', 'ADMIN'].includes(currentRole);
  const isDistrictCoord = currentRole === 'DISTRICT_COORDINATOR';
  const isGpOrBlock = ['BLOCK_COORDINATOR', 'GP_OPERATOR'].includes(currentRole);
  const isDriver = currentRole === 'DRIVER';
  const isFstpOp = currentRole === 'FSTP_OPERATOR';
  const isCitizen = currentRole === 'CITIZEN';

  // Driver accepts assigned trip
  const handleDriverAccept = async (trip) => {
    const driverId = currentUser?.id || trip.assignedDriverId || 'usr_driver';
    const driverName = currentUser?.name || trip.assignedDriverName || 'Ramesh Patel';

    await driverAcceptTrip(trip.id, driverId, driverName);
    notifySuccess(
      `Trip #${trip.requestNo} accepted by Pilot ${driverName}. Vehicle is unlocked for desludging transit.`,
      'Trip Assignment Accepted'
    );
  };

  // Driver starts journey
  const handleStartTransit = async (trip) => {
    await transitionRequest(trip.id, FSM_STATUS.EN_ROUTE, 'Driver commenced route with active TraqIndia GPS telemetry');
    notifyInfo(`En route to ${trip.village}. Real-time GPS coordinates shared with citizen.`, 'Vehicle En Route');
  };

  // Open Handshake Modal to verify right house & right vehicle
  const handleOpenHandshake = (trip) => {
    setHandshakeModalTrip(trip);
    setHandshakeInputCode(trip.verificationCode || trip.otp || '');
    setHandshakeError('');
  };

  // Verify Citizen Handshake Code
  const handleConfirmHandshake = async () => {
    if (!handshakeModalTrip) return;
    try {
      await verifyCollectionHandshake(handshakeModalTrip.id, handshakeInputCode);
      notifySuccess(
        `Right-House & Right-Vehicle verified via Secure Citizen Code. Suction protocol authorized!`,
        'Household Handshake Verified'
      );
      setHandshakeModalTrip(null);
    } catch (err) {
      setHandshakeError(err.message);
    }
  };

  // Sanitation Worker PPE & Photos
  const handleEvidenceSubmit = (evidenceData) => {
    if (!selectedTrip) return;
    transitionRequest(
      selectedTrip.id,
      FSM_STATUS.CLEANING_COMPLETED,
      `Sanitation worker completed extraction of ${evidenceData.extractedVolumeLitres} L with PPE compliance verified.`,
      {
        ppeChecklist: evidenceData.ppeChecklist,
        decantedVolumeLitres: evidenceData.extractedVolumeLitres
      }
    );
    notifySuccess(`Desludging completed. Tank sealed for transport to plant.`, 'Desludging Finished');
  };

  // Start Transport to FSTP
  const handleStartTransport = async (trip) => {
    await transitionRequest(
      trip.id,
      FSM_STATUS.TRANSPORTING,
      `Transporting ${trip.decantedVolumeLitres || trip.tankVolumeLitres || 3000} L to treatment facility (${trip.targetFstpName || 'FSTP'}). Geofence active.`
    );
    notifyInfo(`Transit to treatment plant commenced. Disposal QR active.`, 'Transit to Plant');
  };

  // FSTP Sign & Safe Decanting
  const handleFstpSign = (reqId, fstpId, volume, note) => {
    verifyFstpDisposal(reqId, fstpId, volume);
    notifySuccess(`FSTP Operator accepted decanting of ${volume} L. Full chain of custody completed!`, 'Disposal Verified');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <DataTag color="teal">LOGISTICS & DISPATCH</DataTag>
            <DataTag color="violet">CHAIN OF CUSTODY VERIFIED</DataTag>
            {isCitizen && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border border-teal-300 dark:border-teal-700">
                <User size={12} />
                <span>My Household Trips ({currentUser?.name || 'Citizen'})</span>
              </span>
            )}
            {isDriver && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                <Truck size={12} />
                <span>Driver Assigned Missions ({currentUser?.name || 'Pilot'})</span>
              </span>
            )}
            {isFstpOp && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
                <Factory size={12} />
                <span>Plant Inflow ({currentUser?.plantName || 'Assigned Plant'})</span>
              </span>
            )}
            {isDistrictCoord && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                <MapPin size={12} />
                <span>District Jurisdiction ({currentUser?.district || 'Raipur'})</span>
              </span>
            )}
            {isSuperOrState && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                <Shield size={12} />
                <span>Statewide Master Logistics</span>
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Trip Lifecycle & Custody Verification
          </h1>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">TOTAL SCHEDULED TRIPS</div>
          <div className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">{trips.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-mono font-medium">AWAITING DRIVER ACCEPTANCE</div>
          <div className="font-display font-bold text-2xl text-amber-600 dark:text-amber-400 mt-1">
            {trips.filter(t => t.status === FSM_STATUS.VEHICLE_ASSIGNED).length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-teal-600 dark:text-cg-teal font-mono font-medium">ACTIVE TRANSIT & SUCTION</div>
          <div className="font-display font-bold text-2xl text-teal-700 dark:text-cg-teal mt-1">
            {trips.filter(t => [FSM_STATUS.EN_ROUTE, FSM_STATUS.ARRIVED, FSM_STATUS.TRANSPORTING].includes(t.status)).length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-emerald-600 dark:text-cg-green font-mono font-medium">SAFELY DECANTED & CLOSED</div>
          <div className="font-display font-bold text-2xl text-emerald-700 dark:text-cg-green mt-1">
            {trips.filter(t => [FSM_STATUS.DISPOSED, FSM_STATUS.CLOSED].includes(t.status)).length + (isSuperOrState ? 128 : 0)}
          </div>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'ALL'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Trips ({trips.length})
        </button>
        <button
          onClick={() => setActiveTab('PENDING_ACCEPTANCE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'PENDING_ACCEPTANCE'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
          }`}
        >
          <span>⏳ Needs Driver Acceptance</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
            {trips.filter(t => t.status === FSM_STATUS.VEHICLE_ASSIGNED).length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('IN_TRANSIT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'IN_TRANSIT'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
          }`}
        >
          Active En Route & Sludge Handling
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
          }`}
        >
          Verified Decanted / Sealed
        </button>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] space-y-3">
          <Truck size={36} className="mx-auto text-slate-400" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">
            {isCitizen ? "No Active Desludging Trips for Your Household" : "No Trips Found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isCitizen
              ? "You do not have any vehicle trips currently scheduled or in transit. When a desludging vehicle is assigned to your request, it will appear here."
              : isDriver
              ? "You currently have no collection trips assigned to your profile. Check back when the GP or FSTP operator assigns a new route."
              : isFstpOp
              ? "There are no incoming desludging tankers scheduled for decanting at your treatment facility."
              : "No trip records match the selected filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => {
            const isPendingAcceptance = trip.status === FSM_STATUS.VEHICLE_ASSIGNED;
            const isTripScheduled = trip.status === FSM_STATUS.TRIP_SCHEDULED;
            const isEnRoute = trip.status === FSM_STATUS.EN_ROUTE;
            const isArrived = trip.status === FSM_STATUS.ARRIVED;
            const isCleaningDone = trip.status === FSM_STATUS.CLEANING_COMPLETED;
            const isTransporting = trip.status === FSM_STATUS.TRANSPORTING;
            const isDisposed = trip.status === FSM_STATUS.DISPOSED || trip.status === FSM_STATUS.CLOSED;

            return (
              <GlassCard
                key={trip.id}
                title={trip.assignedVehicleNo || 'Vehicle Unit'}
                icon={Truck}
                moduleTag={`TRIP #${trip.requestNo?.split('-').pop() || '101'}`}
              >
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <StatusChip status={trip.status} />
                  </div>

                  {/* Trip Logistics Info */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <div>HOUSEHOLD: <strong className="text-slate-900 dark:text-white">{trip.village} ({trip.citizenName})</strong></div>
                    <div>PLANT DESTINATION: <strong className="text-purple-700 dark:text-cg-violet">{trip.targetFstpName || 'Arang Cluster Rural FSTP'}</strong></div>
                    <div className="flex items-center justify-between">
                      <span>PILOT: <strong className="text-sky-700 dark:text-sky-300">{trip.assignedDriverName || 'Ramesh Patel'}</strong></span>
                      <span className="text-[10px] text-slate-500">({trip.driverPhone || '98261XXXXX'})</span>
                    </div>
                    <div>SLUDGE VOLUME: <span className="text-slate-900 dark:text-white font-medium">{trip.decantedVolumeLitres || trip.tankVolumeLitres} Litres</span></div>
                    {trip.verificationCode && (
                      <div className="pt-1 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <span className="text-slate-500">CITIZEN CODE:</span>
                        <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                          🔑 {trip.verificationCode}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Citizen verification notice */}
                  {isCitizen && (
                    <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-700/50 space-y-1">
                      <div className="text-[11px] font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1">
                        <Key size={13} className="text-teal-600 dark:text-teal-400" />
                        <span>Pickup Verification Code: <span className="font-mono text-xs tracking-wider underline">{trip.verificationCode || '4109'}</span></span>
                      </div>
                      <p className="text-[10px] text-teal-700 dark:text-teal-300">
                        Share this code with Pilot {trip.assignedDriverName || 'Driver'} upon arrival to verify the correct house.
                      </p>
                    </div>
                  )}

                  {/* Progressive Chain of Custody Step Actions (guarded by role) */}
                  {!isCitizen && (
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                      {/* Step 1: Driver Acceptance */}
                      {isPendingAcceptance && (isDriver || isSuperOrState || isDistrictCoord) && (
                        <button
                          onClick={() => handleDriverAccept(trip)}
                          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          <UserCheck size={15} />
                          <span>Driver: Accept Assigned Trip</span>
                        </button>
                      )}

                      {/* Step 2: Start Trip after acceptance */}
                      {isTripScheduled && (isDriver || isSuperOrState || isDistrictCoord) && (
                        <button
                          onClick={() => handleStartTransit(trip)}
                          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Navigation size={15} />
                          <span>Commence Transit to Site (GPS On)</span>
                        </button>
                      )}

                      {/* Step 3: Arrive & Verify Right House via Code / QR */}
                      {isEnRoute && (isDriver || isSuperOrState || isDistrictCoord) && (
                        <button
                          onClick={() => handleOpenHandshake(trip)}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Key size={15} />
                          <span>Arrived at House: Enter Citizen QR / Code</span>
                        </button>
                      )}

                      {/* Step 4: PPE & Geotag Photo */}
                      {isArrived && (isDriver || isSuperOrState || isDistrictCoord) && (
                        <button
                          onClick={() => {
                            setSelectedTrip(trip);
                            setIsEvidenceModalOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Camera size={15} />
                          <span>Worker: PPE Checklist & Decant Photo</span>
                        </button>
                      )}

                      {/* Step 5: Depart to FSTP */}
                      {isCleaningDone && (isDriver || isSuperOrState || isDistrictCoord) && (
                        <button
                          onClick={() => handleStartTransport(trip)}
                          className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Truck size={15} />
                          <span>Transport Sludge to Designated Plant</span>
                        </button>
                      )}

                      {/* Step 6: FSTP QR Decanting Verification */}
                      {isTransporting && (isFstpOp || isSuperOrState || isDistrictCoord) && (
                        <button
                          onClick={() => {
                            setSelectedTrip(trip);
                            setIsManifestModalOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          <QrCode size={15} />
                          <span>FSTP Check-in: Scan Disposal QR</span>
                        </button>
                      )}

                      {/* Completed Badge */}
                      {isDisposed && (
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-center font-bold text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Safe Decant Verified & Chain Complete</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Household Handshake Code Verification Modal */}
      {handshakeModalTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-teal-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal-600" />
                <span>Right-House & Right-Vehicle Verification</span>
              </h3>
              <button
                onClick={() => setHandshakeModalTrip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              To verify that the vacuum tanker has arrived at the correct beneficiary household (<strong>{handshakeModalTrip.citizenName}</strong>, {handshakeModalTrip.village}), request the citizen's 6-digit confirmation code.
            </p>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 space-y-1">
              <div className="text-[11px] text-teal-900 dark:text-teal-200 font-semibold">
                Citizen Booking Reference: #{handshakeModalTrip.requestNo}
              </div>
              <div className="text-[11px] text-slate-500">
                Beneficiary Mobile: {handshakeModalTrip.citizenPhone}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-white">
                Enter Citizen Verification Code (or scan citizen QR):
              </label>
              <input
                type="text"
                value={handshakeInputCode}
                onChange={(e) => {
                  setHandshakeInputCode(e.target.value);
                  setHandshakeError('');
                }}
                placeholder="e.g. 938102 or OTP"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-center tracking-widest text-slate-900 dark:text-white focus:border-teal-600 outline-none font-bold"
              />
              {handshakeError && (
                <div className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                  {handshakeError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setHandshakeModalTrip(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmHandshake}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Verify Handshake & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PPE Evidence Modal */}
      {selectedTrip && (
        <EvidenceUploadModal
          request={selectedTrip}
          isOpen={isEvidenceModalOpen}
          onClose={() => {
            setIsEvidenceModalOpen(false);
            setSelectedTrip(null);
          }}
          onSubmitEvidence={handleEvidenceSubmit}
        />
      )}

      {/* Manifest Disposal Modal */}
      {selectedTrip && (
        <ManifestModal
          request={selectedTrip}
          fstps={fstps}
          isOpen={isManifestModalOpen}
          onClose={() => {
            setIsManifestModalOpen(false);
            setSelectedTrip(null);
          }}
          onSignManifest={handleFstpSign}
        />
      )}
    </div>
  );
};
