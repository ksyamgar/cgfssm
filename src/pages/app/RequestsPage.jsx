import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
import { AssignmentModal } from '../../components/fsm/AssignmentModal';
import { FSM_STATUS, REJECTION_REASONS } from '../../constants/fsm';
import { exportToPdf, exportToExcel } from '../../services/exportService';
import { notifySuccess, notifyInfo, notifyWarning, notifyInteractive } from '../../services/toastService';
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
  RefreshCw,
  Key,
  Shield,
  User,
  Clock,
  Check,
  Plus,
  Phone,
  Navigation,
  Factory
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
  const [citizenTab, setCitizenTab] = useState('ALL'); // ALL, ONGOING, PAST (for Citizen view)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Workflow modals state
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0].code);

  const isPastStatus = (status) => [
    FSM_STATUS.DISPOSED,
    FSM_STATUS.PAYMENT_COMPLETED,
    FSM_STATUS.CLOSED,
    FSM_STATUS.REJECTED,
    FSM_STATUS.CANCELLED
  ].includes(status);

  // 1. Filter Requests strictly based on logged-in User Role and Ownership Scope
  const roleScopedRequests = useMemo(() => {
    return requests.filter((r) => {
      // A. Super Admin & State Officer: Statewide visibility
      if (['SUPER_ADMIN', 'STATE_OFFICER', 'ADMIN'].includes(currentRole)) {
        return true;
      }

      // B. District Coordinator: sees all requests within their district
      if (currentRole === 'DISTRICT_COORDINATOR') {
        if (!currentUser?.district || currentUser.district.includes('All') || currentUser.district.includes('State')) {
          return true;
        }
        const userDist = currentUser.district.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        const reqDist = (r.district || '').replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        return reqDist.includes(userDist) || userDist.includes(reqDist);
      }

      // C. Block Coordinator: sees all requests within their block
      if (currentRole === 'BLOCK_COORDINATOR') {
        if (!currentUser?.block || currentUser.block.includes('All')) return true;
        const userBlock = currentUser.block.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        const reqBlock = (r.block || '').replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        return reqBlock.includes(userBlock) || userBlock.includes(reqBlock);
      }

      // D. Gram Panchayat (GP) Operator: sees all requests originating in their GP
      if (currentRole === 'GP_OPERATOR') {
        if (!currentUser?.gp || currentUser.gp.includes('All')) return true;
        const userGp = currentUser.gp.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        const reqGp = (r.gp || '').replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
        return reqGp.includes(userGp) || userGp.includes(reqGp);
      }

      // E. Citizen: sees ONLY their own past and ongoing requests
      if (currentRole === 'CITIZEN') {
        const uPhone = (currentUser?.phone || '').trim().replace(/\D/g, '');
        const rPhone = (r.citizenPhone || '').trim().replace(/\D/g, '');
        const phoneMatch = uPhone && rPhone && (uPhone === rPhone || uPhone.endsWith(rPhone) || rPhone.endsWith(uPhone));
        const nameMatch = currentUser?.name && r.citizenName && (currentUser.name.trim().toLowerCase() === r.citizenName.trim().toLowerCase());
        const idMatch = currentUser?.id && r.userId && (currentUser.id === r.userId);
        return Boolean(phoneMatch || nameMatch || idMatch);
      }

      // F. Driver: sees ONLY requests assigned to them
      if (currentRole === 'DRIVER') {
        const uPhone = (currentUser?.phone || '').trim().replace(/\D/g, '');
        const dPhone = (r.assignedDriverPhone || '').trim().replace(/\D/g, '');
        const phoneMatch = uPhone && dPhone && (uPhone === dPhone || uPhone.endsWith(dPhone) || dPhone.endsWith(uPhone));
        const nameMatch = currentUser?.name && r.assignedDriverName && (currentUser.name.trim().toLowerCase() === r.assignedDriverName.trim().toLowerCase());
        const idMatch = currentUser?.id && r.assignedDriverId && (currentUser.id === r.assignedDriverId);
        return Boolean(phoneMatch || nameMatch || idMatch);
      }

      // G. FSTP Operator: sees ONLY requests routed to their treatment facility
      if (currentRole === 'FSTP_OPERATOR') {
        const operatedPlant = fstps.find(f =>
          (f.operatorPhone && currentUser?.phone && f.operatorPhone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) ||
          (f.operatorName && currentUser?.name && f.operatorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase()) ||
          (currentUser?.plantName && f.name?.toLowerCase().includes(currentUser.plantName.toLowerCase())) ||
          f.id === currentUser?.plantId ||
          f.id === currentUser?.fstpId
        );

        if (operatedPlant) {
          if (r.targetFstpId && r.targetFstpId === operatedPlant.id) return true;
          if (r.targetFstpName && (r.targetFstpName === operatedPlant.name || r.targetFstpName.toLowerCase().includes(operatedPlant.name.toLowerCase()))) return true;
        }

        if (currentUser?.plantName && r.targetFstpName) {
          const cleanUserP = currentUser.plantName.toLowerCase().replace(/f?stp|\(.*?\)|\d+\s*kld/gi, '').trim();
          const cleanReqP = r.targetFstpName.toLowerCase().replace(/f?stp|\(.*?\)|\d+\s*kld/gi, '').trim();
          if (cleanUserP && cleanReqP && (cleanReqP.includes(cleanUserP) || cleanUserP.includes(cleanReqP))) {
            return true;
          }
        }

        if (currentUser?.fstpId && r.targetFstpId === currentUser.fstpId) return true;

        return false;
      }

      // H. Vendor Admin: sees ONLY requests assigned to their agency
      if (currentRole === 'VENDOR_ADMIN') {
        if (currentUser?.id && r.assignedVendorId === currentUser.id) return true;
        if (currentUser?.name && r.assignedVendorName && currentUser.name.trim().toLowerCase() === r.assignedVendorName.trim().toLowerCase()) return true;
        return false;
      }

      // I. Sanitation Worker: sees ONLY requests assigned to them
      if (currentRole === 'SANITATION_WORKER') {
        if (currentUser?.id && r.assignedWorkerId === currentUser.id) return true;
        if (currentUser?.name && r.assignedWorkerName && currentUser.name.trim().toLowerCase() === r.assignedWorkerName.trim().toLowerCase()) return true;
        return false;
      }

      return true;
    });
  }, [requests, currentRole, currentUser, fstps]);

  // Citizen counts
  const citizenOngoingCount = useMemo(() => {
    return roleScopedRequests.filter(r => !isPastStatus(r.status)).length;
  }, [roleScopedRequests]);

  const citizenPastCount = useMemo(() => {
    return roleScopedRequests.filter(r => isPastStatus(r.status)).length;
  }, [roleScopedRequests]);

  // 2. Secondary Filter (Search query, Status filter, Citizen ongoing/past tab, Geo dropdowns)
  const filtered = useMemo(() => {
    return roleScopedRequests.filter((r) => {
      // Citizen ongoing vs past tab filter
      if (currentRole === 'CITIZEN') {
        if (citizenTab === 'ONGOING' && isPastStatus(r.status)) return false;
        if (citizenTab === 'PAST' && !isPastStatus(r.status)) return false;
      }

      // Geo dropdown filter (applies for officials)
      if (['SUPER_ADMIN', 'STATE_OFFICER', 'ADMIN', 'DISTRICT_COORDINATOR'].includes(currentRole)) {
        if (selectedDistrict && r.district !== selectedDistrict) return false;
        if (selectedBlock && r.block !== selectedBlock) return false;
        if (selectedGp && r.gp !== selectedGp) return false;
      }

      // Status dropdown filter
      if (statusFilter && r.status !== statusFilter) return false;

      // Text search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNo = r.requestNo?.toLowerCase().includes(q);
        const matchName = r.citizenName?.toLowerCase().includes(q);
        const matchVillage = r.village?.toLowerCase().includes(q);
        const matchDriver = r.assignedDriverName?.toLowerCase().includes(q);
        const matchVeh = r.assignedVehicleNo?.toLowerCase().includes(q);
        if (!matchNo && !matchName && !matchVillage && !matchDriver && !matchVeh) return false;
      }
      return true;
    });
  }, [roleScopedRequests, currentRole, citizenTab, selectedDistrict, selectedBlock, selectedGp, statusFilter, searchQuery]);

  // Auto-select first request if none selected or if previously selected is no longer in filtered list
  React.useEffect(() => {
    if (filtered.length > 0) {
      if (!selectedRequest || !filtered.some(r => r.id === selectedRequest.id)) {
        setSelectedRequest(filtered[0]);
      }
    } else {
      setSelectedRequest(null);
    }
  }, [filtered, selectedRequest]);

  // Export handler
  const handleExport = (format) => {
    if (format === 'pdf') {
      exportToPdf(filtered);
    } else {
      exportToExcel(filtered);
    }
  };

  // Action handlers (guarded by role privileges)
  const handleApprove = (req) => {
    transitionRequest(req.id, FSM_STATUS.ACKNOWLEDGED, 'Request acknowledged by GP');
    notifySuccess(`Request #${req.requestNo} acknowledged & approved by Gram Panchayat.`, 'Request Acknowledged');
  };

  const handleInspect = (req) => {
    transitionRequest(req.id, FSM_STATUS.INSPECTED, 'Site verified for vehicle accessibility');
    notifySuccess(`Household site and road clearance verified for #${req.requestNo}. Ready for dispatch.`, 'Site Verified');
  };

  const handleAssignVendor = (req) => {
    setSelectedRequest(req);
    setIsAssignmentModalOpen(true);
  };

  const handleConfirmAssignment = (assignmentData) => {
    if (!selectedRequest) return;

    transitionRequest(
      selectedRequest.id,
      FSM_STATUS.VEHICLE_ASSIGNED,
      `Assigned to ${assignmentData.assignedVendorName}, Vehicle ${assignmentData.assignedVehicleNo} (Driver: ${assignmentData.assignedDriverName}). Designated Treatment: ${assignmentData.targetFstpName || 'Nearest FSTP'}`,
      {
        ...assignmentData
      }
    );

    notifyInteractive({
      title: `🚚 Vehicle Assigned to #${selectedRequest.requestNo}`,
      message: `Assigned ${assignmentData.assignedVehicleNo} (Driver: ${assignmentData.assignedDriverName}) • Target FSTP: ${assignmentData.targetFstpName || 'Nearest Plant'} (${assignmentData.distanceToFstpKm || 10} km)`,
      type: 'success'
    });
  };

  const handleStartTrip = (req) => {
    transitionRequest(req.id, FSM_STATUS.EN_ROUTE, 'Driver initiated transit with live GPS telemetry');
    notifyInfo(`Driver has commenced transit to household (${req.village}). Live GPS telemetry active.`, 'Vehicle En Route');
  };

  const handleMarkArrived = (req) => {
    transitionRequest(req.id, FSM_STATUS.ARRIVED, 'Vehicle arrived at household site');
    notifySuccess(`Vehicle arrived at site for #${req.requestNo}. Citizen verification handshake active.`, 'Vehicle Arrived');
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
    notifySuccess(`PPE verified & geotagged photos uploaded. Decanted ${evidenceData.extractedVolumeLitres} L.`, 'Desludging Completed');
  };

  const handleTransportToFstp = (req) => {
    transitionRequest(req.id, FSM_STATUS.TRANSPORTING, 'Driver transporting faecal sludge to designated FSTP/STP');
    notifyInfo(`Sludge being transported to designated treatment facility (${req.targetFstpName || 'FSTP'}). Geofence active.`, 'Transit to FSTP');
  };

  const handleFstpSign = (data) => {
    verifyFstpDisposal(selectedRequest.id, data.targetFstpId, data.decantedVolumeLitres);
    notifySuccess(`FSTP manifest cryptographically sealed. Sludge successfully offloaded at ${data.targetFstpName || 'FSTP'}.`, 'FSTP Decanting Complete');
  };

  const handleRecordPaymentSubmit = (paymentData) => {
    recordPayment(selectedRequest.id, paymentData.amount, paymentData.method);
    notifySuccess(`Payment of ₹${paymentData.amount} received via ${paymentData.method}. Digital receipt issued.`, 'Payment Confirmed');
  };

  const handleRejectSubmit = () => {
    if (!selectedRequest) return;
    const reasonObj = REJECTION_REASONS.find(r => r.code === rejectionReason);
    transitionRequest(selectedRequest.id, FSM_STATUS.REJECTED, `Request rejected: ${reasonObj?.label || 'Ineligible site'}`);
    setIsRejectModalOpen(false);
    notifyWarning(`Request #${selectedRequest.requestNo} rejected: ${reasonObj?.label}`, 'Request Rejected');
  };

  // Determine user permission flags
  const isSuperOrState = ['SUPER_ADMIN', 'STATE_OFFICER', 'ADMIN'].includes(currentRole);
  const isDistrictCoord = currentRole === 'DISTRICT_COORDINATOR';
  const isGpOrBlock = ['GP_OPERATOR', 'BLOCK_COORDINATOR'].includes(currentRole);
  const isDriver = currentRole === 'DRIVER';
  const isFstp = currentRole === 'FSTP_OPERATOR';
  const isCitizen = currentRole === 'CITIZEN';

  return (
    <div className="space-y-6">
      {/* Top Title & Export Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DataTag color="teal">FSM WORKFLOW ENGINE</DataTag>
            <DataTag color="cyan">18-STEP STATE MACHINE</DataTag>

            {/* Scope Badge Based on Active Role */}
            {isCitizen && (
              <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <User size={12} />
                <span>My Desludging Requests ({roleScopedRequests.length})</span>
              </span>
            )}

            {isDriver && (
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Truck size={12} />
                <span>My Assigned Trips ({roleScopedRequests.length})</span>
              </span>
            )}

            {isFstp && (
              <span className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Factory size={12} />
                <span>Facility Intake Inflow ({roleScopedRequests.length})</span>
              </span>
            )}

            {isDistrictCoord && (
              <span className="text-xs font-mono font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-500/30 px-2.5 py-0.5 rounded-full">
                📍 District Ledger ({roleScopedRequests.length})
              </span>
            )}

            {isSuperOrState && (
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                🌐 Statewide Master Oversight ({roleScopedRequests.length})
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Desludging Service Requests Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isCitizen
              ? 'View your ongoing and past desludging service requests and track vehicle collection status in real-time.'
              : isDriver
              ? 'Mission dispatch ledger: View and execute trips assigned to your desludging vehicle.'
              : isFstp
              ? 'Treatment intake ledger: Decant and verify incoming faecal sludge deliveries for your treatment plant.'
              : 'End-to-end chain of custody governance from household request to geofenced FSTP decanting.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCitizen && (
            <Link
              to="/book"
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Book New Request</span>
            </Link>
          )}

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
      <div className="glass-panel p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-clean">
        {/* Citizen Specific Sub-Filter Tabs */}
        {isCitizen ? (
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/10 p-1 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setCitizenTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                citizenTab === 'ALL'
                  ? 'bg-white dark:bg-teal-600 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All My Requests ({roleScopedRequests.length})
            </button>
            <button
              onClick={() => setCitizenTab('ONGOING')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                citizenTab === 'ONGOING'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Clock size={12} />
              <span>Ongoing ({citizenOngoingCount})</span>
            </button>
            <button
              onClick={() => setCitizenTab('PAST')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                citizenTab === 'PAST'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <CheckCircle2 size={12} />
              <span>Past & Closed ({citizenPastCount})</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
            >
              <option value="">All Statuses ({roleScopedRequests.length})</option>
              {Object.keys(FSM_STATUS).map((st) => (
                <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        )}

        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
            placeholder={isCitizen ? "Search your request no, village..." : "Search request no, citizen, village..."}
          />
        </div>
      </div>

      {/* Main Table & Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-clean">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <ClipboardList size={36} className="mx-auto text-teal-600/60 dark:text-teal-400/60" />
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  {isCitizen
                    ? 'No Desludging Requests Found'
                    : isDriver
                    ? 'No Trips Dispatched'
                    : isFstp
                    ? 'No Intake Routed to This Facility'
                    : 'No Matching Requests'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {isCitizen
                    ? 'You have not submitted any desludging requests yet. Need your household septic tank cleaned?'
                    : isDriver
                    ? 'There are currently no active desludging missions assigned to your pilot roster.'
                    : isFstp
                    ? 'No vacuum tankers are currently routed or staged for decanting at your facility.'
                    : 'No requests match the selected filters or search query.'}
                </p>
              </div>
              {isCitizen && (
                <Link
                  to="/book"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all mt-2"
                >
                  <Plus size={15} />
                  <span>Book Desludging Service Now</span>
                </Link>
              )}
            </div>
          ) : (
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
                    const isPast = isPastStatus(req.status);

                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-teal-50/80 dark:bg-teal-950/40 border-l-4 border-teal-600'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{req.requestNo.split('-').pop()}</span>
                            {isCitizen && isPast && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-sans font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                Past
                              </span>
                            )}
                            {isCitizen && !isPast && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-sans font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{req.scheduledDate}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{req.village}</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">
                            {isCitizen ? req.gp : `${req.citizenName} (${req.citizenPhone})`}
                          </div>
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
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-[11px] font-semibold border border-slate-200 dark:border-transparent transition-all"
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
          )}
        </div>

        {/* Selected Request Detail Drawer & Lifecycle Controls (1 col) */}
        <div className="space-y-4">
          {selectedRequest ? (
            <GlassCard
              title={isCitizen ? "My Service Request Details" : "Request Lifecycle Control"}
              moduleTag={selectedRequest.requestNo.split('-').pop()}
            >
              <div className="space-y-3.5 font-sans text-xs">
                {/* Citizen Specific Verification Code Banner */}
                {isCitizen && (
                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/40 space-y-1.5 text-xs text-purple-900 dark:text-purple-200">
                    <div className="font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key size={14} className="text-purple-600 dark:text-purple-400" />
                        <span>Your Citizen Handshake Code</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-mono font-bold text-sm tracking-widest shadow-xs">
                        {selectedRequest.verificationCode || selectedRequest.otp || selectedRequest.requestNo.slice(-4)}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800 dark:text-purple-300 opacity-90">
                      Show or read this 4-digit verification code to the desludging tanker driver upon arrival to authorize safe septic tank emptying.
                    </p>
                  </div>
                )}

                {/* Summary Info */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Beneficiary:</span>
                    <strong className="text-slate-900 dark:text-white">{selectedRequest.citizenName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Mobile:</span>
                    <strong className="text-sky-700 dark:text-cg-cyan">{selectedRequest.citizenPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Location:</span>
                    <span className="text-slate-900 dark:text-white truncate">{selectedRequest.village}, {selectedRequest.gp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Capacity & Rate:</span>
                    <strong className="text-teal-700 dark:text-cg-teal">{selectedRequest.tankVolumeLitres} L • ₹{selectedRequest.estimatedCost}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <StatusChip status={selectedRequest.status} />
                  </div>
                </div>

                {/* Assigned Logistics Info */}
                {selectedRequest.assignedVehicleNo && (
                  <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-500/20 space-y-1 text-[11px]">
                    <div className="font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <Truck size={13} className="text-teal-600" />
                      <span>Assigned Desludging Unit: {selectedRequest.assignedVehicleNo}</span>
                    </div>
                    {selectedRequest.assignedDriverName && (
                      <div className="text-slate-600 dark:text-slate-300 text-[10.5px]">
                        Pilot: <strong>{selectedRequest.assignedDriverName}</strong>
                        {selectedRequest.assignedDriverPhone && ` (${selectedRequest.assignedDriverPhone})`}
                      </div>
                    )}
                    {selectedRequest.targetFstpName && (
                      <div className="text-slate-600 dark:text-slate-300 text-[10.5px]">
                        Target FSTP: <strong>{selectedRequest.targetFstpName}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* CITIZEN VIEW: Rating / Payment / Status Notification */}
                {isCitizen && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    {selectedRequest.status === FSM_STATUS.CLOSED && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-center font-medium text-xs">
                        ✓ Desludging Completed & Verified. Thank you for practicing safe sanitation!
                      </div>
                    )}

                    {selectedRequest.status === FSM_STATUS.DISPOSED && (
                      <button
                        type="button"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                      >
                        <IndianRupee size={15} />
                        <span>Pay Desludging Fee (₹{selectedRequest.estimatedCost})</span>
                      </button>
                    )}

                    {!isPastStatus(selectedRequest.status) && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs text-center">
                        ⏳ Your request is active. You will receive SMS updates as the vehicle is dispatched.
                      </div>
                    )}
                  </div>
                )}

                {/* OFFICIAL / DISPATCHER / OPERATOR ACTIONS (Hidden from Citizen) */}
                {!isCitizen && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Available Next Lifecycle Action:</div>

                    {/* Step 1: GP Approval (Officials only) */}
                    {selectedRequest.status === FSM_STATUS.PENDING_APPROVAL && (isSuperOrState || isDistrictCoord || isGpOrBlock) && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(selectedRequest)}
                          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
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

                    {/* Step 2: Site Verification */}
                    {selectedRequest.status === FSM_STATUS.ACKNOWLEDGED && (isSuperOrState || isDistrictCoord || isGpOrBlock) && (
                      <button
                        type="button"
                        onClick={() => handleInspect(selectedRequest)}
                        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} />
                        <span>Verify Site & Road Access</span>
                      </button>
                    )}

                    {/* Step 3: Assign Vendor & Vehicle */}
                    {selectedRequest.status === FSM_STATUS.INSPECTED && (isSuperOrState || isDistrictCoord || isGpOrBlock) && (
                      <button
                        type="button"
                        onClick={() => handleAssignVendor(selectedRequest)}
                        className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Truck size={15} />
                        <span>Assign Vendor & Vehicle Unit</span>
                      </button>
                    )}

                    {/* Step 4: Pilot Acceptance */}
                    {selectedRequest.status === FSM_STATUS.VEHICLE_ASSIGNED && (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
                          <div className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-amber-600" />
                            <span>Assigned Pilot: {selectedRequest.assignedDriverName || 'Driver'}</span>
                          </div>
                          <div className="text-[11px] opacity-80 mt-0.5">
                            Awaiting pilot acceptance. As an official or assigned driver, confirm acceptance to proceed:
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            transitionRequest(
                              selectedRequest.id,
                              FSM_STATUS.TRIP_SCHEDULED,
                              `Trip confirmed for Driver ${selectedRequest.assignedDriverName || 'Pilot'}. Vehicle staged for dispatch.`,
                              { driverAcceptanceStatus: 'ACCEPTED' }
                            );
                            notifySuccess(`Trip accepted for Driver ${selectedRequest.assignedDriverName}. Ready for transit.`, 'Trip Scheduled');
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>Confirm Pilot Acceptance & Unlock Vehicle</span>
                        </button>
                      </div>
                    )}

                    {/* Step 5: Start Transit (Driver / Official) */}
                    {selectedRequest.status === FSM_STATUS.TRIP_SCHEDULED && (isDriver || isSuperOrState || isDistrictCoord) && (
                      <button
                        type="button"
                        onClick={() => handleStartTrip(selectedRequest)}
                        className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Truck size={15} />
                        <span>Start Transit (Live Telemetry Active)</span>
                      </button>
                    )}

                    {/* Step 6: Arrival & Handshake Verification */}
                    {selectedRequest.status === FSM_STATUS.EN_ROUTE && (isDriver || isSuperOrState || isDistrictCoord) && (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs">
                          <div className="font-bold flex items-center gap-1.5">
                            <Key size={13} className="text-purple-600" />
                            <span>Household Arrival Handshake Security</span>
                          </div>
                          <div className="text-[11px] opacity-80 mt-0.5">
                            Citizen Verification Code: <strong className="font-mono">{selectedRequest.verificationCode || selectedRequest.otp || selectedRequest.requestNo.slice(-4)}</strong>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleMarkArrived(selectedRequest)}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>Verify Right House Handshake & Arrive</span>
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

                    {/* Step 7: Worker Evidence Upload */}
                    {selectedRequest.status === FSM_STATUS.ARRIVED && (
                      <button
                        type="button"
                        onClick={() => setIsEvidenceModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Camera size={15} />
                        <span>Worker: PPE & Geotag Photo Evidence</span>
                      </button>
                    )}

                    {/* Step 8: Transport to FSTP */}
                    {selectedRequest.status === FSM_STATUS.CLEANING_COMPLETED && (isDriver || isSuperOrState || isDistrictCoord) && (
                      <button
                        type="button"
                        onClick={() => handleTransportToFstp(selectedRequest)}
                        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Truck size={15} />
                        <span>Transport to FSTP Treatment Site</span>
                      </button>
                    )}

                    {/* Step 9: FSTP Decanting */}
                    {selectedRequest.status === FSM_STATUS.TRANSPORTING && (isFstp || isSuperOrState || isDistrictCoord) && (
                      <button
                        type="button"
                        onClick={() => setIsManifestModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                      >
                        <QrCode size={15} />
                        <span>FSTP: Scan QR & Decant Sludge</span>
                      </button>
                    )}

                    {/* Step 10: Settlement */}
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

                    {/* Step 11: Close & Seal */}
                    {selectedRequest.status === FSM_STATUS.PAYMENT_COMPLETED && (isSuperOrState || isDistrictCoord || isGpOrBlock) && (
                      <button
                        type="button"
                        onClick={() => transitionRequest(selectedRequest.id, FSM_STATUS.CLOSED, 'Final rating received and audit sealed')}
                        className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
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
                )}

                {/* Audit Timeline */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
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

      {/* Modals for assignment, worker evidence, manifest, and payment */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        request={selectedRequest}
        vehicles={vehicles}
        fstps={fstps}
        vendors={vendors}
        onConfirmAssignment={handleConfirmAssignment}
      />

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
