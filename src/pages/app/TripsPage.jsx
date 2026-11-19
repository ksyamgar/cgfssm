import React, { useState } from 'react';
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
  Key
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

  // Trips derived from requests that have vehicles/drivers assigned
  const trips = requests.filter(r =>
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
          <div className="flex items-center gap-2">
            <DataTag color="teal">LOGISTICS & DISPATCH</DataTag>
            <DataTag color="violet">CHAIN OF CUSTODY VERIFIED</DataTag>
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
            {trips.filter(t => [FSM_STATUS.DISPOSED, FSM_STATUS.CLOSED].includes(t.status)).length + 128}
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

                {/* Progressive Chain of Custody Step Actions */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                  {/* Step 1: Driver Acceptance */}
                  {isPendingAcceptance && (
                    <button
                      onClick={() => handleDriverAccept(trip)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <UserCheck size={15} />
                      <span>Driver: Accept Assigned Trip</span>
                    </button>
                  )}

                  {/* Step 2: Start Trip after acceptance */}
                  {isTripScheduled && (
                    <button
                      onClick={() => handleStartTransit(trip)}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Navigation size={15} />
                      <span>Commence Transit to Site (GPS On)</span>
                    </button>
                  )}

                  {/* Step 3: Arrive & Verify Right House via Code / QR */}
                  {isEnRoute && (
                    <button
                      onClick={() => handleOpenHandshake(trip)}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Key size={15} />
                      <span>Arrived at House: Enter Citizen QR / Code</span>
                    </button>
                  )}

                  {/* Step 4: PPE & Geotag Photo */}
                  {isArrived && (
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
                  {isCleaningDone && (
                    <button
                      onClick={() => handleStartTransport(trip)}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Truck size={15} />
                      <span>Transport Sludge to Designated Plant</span>
                    </button>
                  )}

                  {/* Step 6: FSTP QR Decanting Verification */}
                  {isTransporting && (
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
              </div>
            </GlassCard>
          );
        })}
      </div>

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
