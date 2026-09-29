import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { useAuth } from '../../context/AuthContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { RequestTimeline } from '../../components/fsm/RequestTimeline';
import { EvidenceUploadModal } from '../../components/fsm/EvidenceUploadModal';
import { ManifestModal } from '../../components/fsm/ManifestModal';
import { PaymentModal } from '../../components/fsm/PaymentModal';
import { FSM_STATUS, REJECTION_REASONS } from '../../constants/fsm';
import { exportToPdf, exportToExcel } from '../../services/exportService';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Truck,
  Camera,
  QrCode,
  IndianRupee,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';

export const RequestsPage = () => {
  const {
    requests,
    vehicles,
    fstps,
    vendors,
    transitionRequest,
    handleBreakdownReassignment,
    recordPayment,
    verifyFstpDisposal
  } = useFsm();

  const { currentUser, currentRole } = useAuth();
  const { selectedDistrict, selectedBlock, selectedGp } = useGeoScope();
  const { t } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Workflow modals state
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0].code);

  // Filter requests
  const filtered = requests.filter((r) => {
    if (selectedDistrict && r.district !== selectedDistrict) return false;
    if (selectedBlock && r.block !== selectedBlock) return false;
    if (selectedGp && r.gp !== selectedGp) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNo = r.requestNo?.toLowerCase().includes(q);
      const matchName = r.citizenName?.toLowerCase().includes(q);
      const matchVillage = r.village?.toLowerCase().includes(q);
      if (!matchNo && !matchName && !matchVillage) return false;
    }
    return true;
  });

  // Action handlers
  const handleApprove = (req) => {
    transitionRequest(req.id, FSM_STATUS.ACKNOWLEDGED, 'Request acknowledged by GP');
  };

  const handleInspect = (req) => {
    transitionRequest(req.id, FSM_STATUS.INSPECTED, 'Site verified for vehicle accessibility');
  };

  const handleAssignVendor = (req) => {
    const defaultVendor = vendors[0] || { id: 'ven_01', name: 'Shree Mahamaya Sanitation Services' };
    const defaultVehicle = vehicles[0] || { id: 'veh_01', regNo: 'CG-04-ME-4821', driverName: 'Ramesh Patel' };

    transitionRequest(
      req.id,
      FSM_STATUS.VEHICLE_ASSIGNED,
      `Assigned to vendor ${defaultVendor.name}, Vehicle ${defaultVehicle.regNo}`,
      {
        assignedVendorId: defaultVendor.id,
        assignedVendorName: defaultVendor.name,
        assignedVehicleId: defaultVehicle.id,
        assignedVehicleNo: defaultVehicle.regNo,
        assignedDriverName: defaultVehicle.driverName
      }
    );
  };

  const handleStartTrip = (req) => {
    transitionRequest(req.id, FSM_STATUS.EN_ROUTE, 'Driver initiated transit with live GPS telemetry');
  };

  const handleMarkArrived = (req) => {
    transitionRequest(req.id, FSM_STATUS.ARRIVED, 'Vehicle arrived at household site');
  };

  const handleWorkerEvidenceSubmit = (evidenceData) => {
    transitionRequest(
      selectedRequest.id,
      FSM_STATUS.CLEANING_COMPLETED,
      `Sanitation worker verified PPE and uploaded Before/After photos. Decanted volume: ${evidenceData.extractedVolumeLitres} L`,
      {
        ppeChecklist: evidenceData.ppeChecklist,
        decantedVolumeLitres: evidenceData.extractedVolumeLitres,
        beforePhotoUrl: evidenceData.beforePhoto,
        afterPhotoUrl: evidenceData.afterPhoto
      }
    );
  };

  const handleTransportToFstp = (req) => {
    transitionRequest(req.id, FSM_STATUS.TRANSPORTING, 'Driver transporting faecal sludge to designated FSTP/STP');
  };

  const handleFstpSign = (reqId, fstpId, volume, note) => {
    verifyFstpDisposal(reqId, fstpId, volume);
  };

  const handleRecordPaymentSubmit = (reqId, method, refNo) => {
    recordPayment(reqId, method, refNo);
  };

  const handleRejectSubmit = () => {
    if (!selectedRequest) return;
    const reasonObj = REJECTION_REASONS.find(r => r.code === rejectionReason);
    transitionRequest(
      selectedRequest.id,
      FSM_STATUS.REJECTED,
      `Rejected: ${reasonObj?.label || rejectionReason}`,
      { rejectionCode: rejectionReason }
    );
    setIsRejectModalOpen(false);
  };

  const handleExport = (format) => {
    const columns = [
      { header: 'Request No', key: 'requestNo' },
      { header: 'Village', key: 'village' },
      { header: 'Status', key: 'status' },
      { header: 'Applicant', key: 'citizenName' },
      { header: 'Phone', key: 'citizenPhone' },
      { header: 'Volume (L)', key: 'tankVolumeLitres' },
      { header: 'Cost (₹)', key: 'estimatedCost' },
      { header: 'Date', key: 'scheduledDate' }
    ];

    if (format === 'pdf') {
      exportToPdf({
        title: 'FSM Requests Ledger Report',
        subtitle: `Filter: ${statusFilter || 'All Statuses'} • Geo: ${selectedDistrict || 'Statewide'}`,
        columns,
        rows: filtered,
        filename: 'CG_FSSM_Requests.pdf'
      });
    } else {
      exportToExcel({
        title: 'Requests Ledger',
        columns,
        rows: filtered,
        filename: 'CG_FSSM_Requests.xlsx'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Export Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">FSM WORKFLOW ENGINE</DataTag>
            <DataTag color="cyan">18-STEP STATE MACHINE</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Desludging Service Requests Ledger
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-transparent"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-cg-teal/20 dark:hover:bg-cg-teal/30 dark:text-cg-teal text-xs font-semibold flex items-center gap-1.5 border border-teal-200 dark:border-transparent"
          >
            <Download size={14} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
            placeholder="Search by Request No, Citizen, Village..."
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
          >
            <option value="">All Statuses ({requests.length})</option>
            {Object.keys(FSM_STATUS).map((st) => (
              <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table & Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Request No</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Volume & Cost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {filtered.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-teal-50 dark:bg-cg-teal/15 border-l-4 border-teal-600' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <div>{req.requestNo.split('-').pop()}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{req.scheduledDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{req.village}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">{req.citizenName} ({req.citizenPhone})</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-slate-900 dark:text-white font-medium">{req.tankVolumeLitres} L</div>
                        <div className="text-teal-700 dark:text-cg-teal font-bold">₹{req.estimatedCost}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip status={req.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-[11px] font-semibold border border-slate-200 dark:border-transparent"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Request Detail Drawer & Lifecycle Controls (1 col) */}
        <div className="space-y-4">
          {selectedRequest ? (
            <GlassCard
              title="Request Lifecycle Action Control"
              moduleTag={selectedRequest.requestNo.split('-').pop()}
            >
              <div className="space-y-4 font-sans text-xs">
                {/* Header Summary */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Citizen:</span>
                    <strong className="text-slate-900 dark:text-white">{selectedRequest.citizenName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                    <strong className="text-sky-700 dark:text-cg-cyan">{selectedRequest.citizenPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Village:</span>
                    <span className="text-slate-900 dark:text-white truncate">{selectedRequest.village}, {selectedRequest.gp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Current State:</span>
                    <StatusChip status={selectedRequest.status} />
                  </div>
                </div>

                {/* Dynamic Next Step Action Gate according to current state */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Available Next Lifecycle Action:</div>

                  {selectedRequest.status === FSM_STATUS.PENDING_APPROVAL && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(selectedRequest)}
                        className="w-full py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} />
                        <span>GP Approve Request</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRejectModalOpen(true)}
                        className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-300 font-semibold text-xs border border-red-200 dark:border-red-500/30"
                      >
                        Reject with Reason Code
                      </button>
                    </div>
                  )}

                  {selectedRequest.status === FSM_STATUS.ACKNOWLEDGED && (
                    <button
                      type="button"
                      onClick={() => handleInspect(selectedRequest)}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={15} />
                      <span>Verify Site & Road Access</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.INSPECTED && (
                    <button
                      type="button"
                      onClick={() => handleAssignVendor(selectedRequest)}
                      className="w-full py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Truck size={15} />
                      <span>Assign Vendor & Vehicle Unit</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.VEHICLE_ASSIGNED && (
                    <button
                      type="button"
                      onClick={() => handleStartTrip(selectedRequest)}
                      className="w-full py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Truck size={15} />
                      <span>Driver: Start Transit (GPS Active)</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.EN_ROUTE && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleMarkArrived(selectedRequest)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} />
                        <span>Mark Vehicle Arrived (≤150m)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBreakdownReassignment(selectedRequest.id, selectedRequest.assignedVehicleId)}
                        className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 font-semibold text-xs border border-amber-200 dark:border-amber-500/30"
                      >
                        Report Vehicle Breakdown & Reassign
                      </button>
                    </div>
                  )}

                  {selectedRequest.status === FSM_STATUS.ARRIVED && (
                    <button
                      type="button"
                      onClick={() => setIsEvidenceModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Camera size={15} />
                      <span>Worker: PPE & Geotag Photo Evidence</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.CLEANING_COMPLETED && (
                    <button
                      type="button"
                      onClick={() => handleTransportToFstp(selectedRequest)}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Truck size={15} />
                      <span>Transport to FSTP Treatment Site</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.TRANSPORTING && (
                    <button
                      type="button"
                      onClick={() => setIsManifestModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <QrCode size={15} />
                      <span>FSTP: Scan QR & Decant Sludge</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.DISPOSED && (
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <IndianRupee size={15} />
                      <span>Settle Payment (UPI / Cash)</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.PAYMENT_COMPLETED && (
                    <button
                      type="button"
                      onClick={() => transitionRequest(selectedRequest.id, FSM_STATUS.CLOSED, 'Final rating received and audit sealed')}
                      className="w-full py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={15} />
                      <span>Close & Seal Audit Record</span>
                    </button>
                  )}

                  {selectedRequest.status === FSM_STATUS.CLOSED && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-cg-green/15 border border-emerald-300 dark:border-cg-green/30 text-emerald-800 dark:text-cg-green text-center font-mono font-bold">
                      ✓ REQUEST CLOSED & AUDIT SEALED
                    </div>
                  )}
                </div>

                {/* Audit Timeline */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Full Event Audit Trail:</div>
                  <RequestTimeline history={selectedRequest.history} />
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <ClipboardList size={32} className="mx-auto text-teal-600 dark:text-cg-teal opacity-60" />
              <div>Select a request from the ledger to inspect live details & execute state transitions.</div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-red-200 dark:border-red-500/40 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>Reject Request with Reason Code</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Select mandatory justification code for citizen notification and audit record.
            </p>
            <div className="space-y-2">
              {REJECTION_REASONS.map((r) => (
                <label
                  key={r.code}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer ${
                    rejectionReason === r.code ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-white font-medium' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectionReason === r.code}
                    onChange={() => setRejectionReason(r.code)}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 dark:bg-white/10 dark:text-white border border-slate-200 dark:border-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for worker evidence, manifest, and payment */}
      <EvidenceUploadModal
        request={selectedRequest}
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSubmitEvidence={handleWorkerEvidenceSubmit}
      />

      <ManifestModal
        request={selectedRequest}
        fstps={fstps}
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
        onSignManifest={handleFstpSign}
      />

      <PaymentModal
        request={selectedRequest}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onRecordPayment={handleRecordPaymentSubmit}
      />
    </div>
  );
};
