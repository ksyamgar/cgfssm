import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFsm } from '../../context/FsmContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../../components/common/GlassCard';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { LiveGpsMap } from '../../components/maps/LiveGpsMap';
import {
  ClipboardList,
  Truck,
  Factory,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Radio,
  Sparkles,
  Users,
  Building2,
  DollarSign,
  Activity
} from 'lucide-react';

export const RoleDashboard = () => {
  const { currentUser, currentRole, currentRoleConfig } = useAuth();
  const { requests, vehicles, fstps, vendors } = useFsm();
  const { selectedDistrict, selectedBlock, selectedGp } = useGeoScope();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Filter requests according to selected geo-scope
  const filteredRequests = requests.filter((r) => {
    if (selectedDistrict && r.district !== selectedDistrict) return false;
    if (selectedBlock && r.block !== selectedBlock) return false;
    if (selectedGp && r.gp !== selectedGp) return false;
    return true;
  });

  const pendingRequests = filteredRequests.filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'PENDING_ASSIGNMENT');
  const activeTrips = filteredRequests.filter(r => r.status === 'EN_ROUTE' || r.status === 'TRANSPORTING' || r.status === 'ARRIVED');
  const completedRequests = filteredRequests.filter(r => r.status === 'CLOSED' || r.status === 'DISPOSED' || r.status === 'PAYMENT_COMPLETED');

  return (
    <div className="space-y-6">
      {/* Top Banner: Role Context & Scope */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-clean-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DataTag color="teal">{currentRoleConfig?.badge || currentRole}</DataTag>
            <DataTag color="cyan">{currentUser?.district || 'STATEWIDE'}</DataTag>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans">
            {currentRoleConfig?.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/requests"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-1.5 transition-all"
          >
            <ClipboardList size={15} />
            <span>Manage Queue ({pendingRequests.length})</span>
          </Link>
          <Link
            to="/app/map"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-transparent flex items-center gap-1.5 transition-all shadow-clean"
          >
            <Radio size={15} className="text-sky-600 dark:text-sky-400" />
            <span>Live Radar</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pending Dispatch Queue"
          value={pendingRequests.length}
          unit="Orders"
          kpiCode="1.1.1"
          delta="SLA 24h timer active"
          isPositive={pendingRequests.length < 5}
          sparklineData={[4, 6, 5, 8, 7, 5, pendingRequests.length]}
          color="amber"
        />
        <KpiCard
          label="Vehicles in Active Transit"
          value={activeTrips.length}
          unit="Trucks"
          kpiCode="3.1.1"
          delta="TraqIndia GPS live"
          isPositive={true}
          sparklineData={[2, 3, 3, 4, 3, 4, activeTrips.length]}
          color="teal"
        />
        <KpiCard
          label="Completed Desludgings"
          value={completedRequests.length + 1420}
          unit="Houses"
          kpiCode="1.1.2"
          delta="99.2% verified safe"
          isPositive={true}
          sparklineData={[1100, 1180, 1240, 1300, 1360, 1400, 1420]}
          color="green"
        />
        <KpiCard
          label="FSTP Treatment Intake"
          value="48.5"
          unit="KLD"
          kpiCode="2.2.1"
          delta="Capacity 78%"
          isPositive={true}
          sparklineData={[30, 34, 38, 41, 44, 46, 48]}
          color="cyan"
        />
      </div>

      {/* Main Grid: Live Fleet Radar & Urgent Action Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live GPS Map Mini View (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Live GPS Fleet & FSTP Infrastructure Map
              </h3>
            </div>
            <Link to="/app/map" className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>Fullscreen Map</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <LiveGpsMap vehicles={vehicles} fstps={fstps} height="400px" />
        </div>

        {/* Priority Action Tasks / Requests (1 col) */}
        <div className="space-y-4">
          <GlassCard title="Active Operational Queue" moduleTag="ACTION REQUIRED">
            <div className="space-y-3">
              {filteredRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  onClick={() => navigate('/app/requests')}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-teal-400 transition-all cursor-pointer space-y-1.5 shadow-clean"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-900 dark:text-white font-bold">{req.requestNo.split('-').pop()}</span>
                    <StatusChip status={req.status} />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">{req.village}</strong> ({req.gp})
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/5">
                    <span>Vol: {req.tankVolumeLitres} L</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold">₹{req.estimatedCost}</span>
                  </div>
                </div>
              ))}

              <Link
                to="/app/requests"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors block text-center border border-slate-200 dark:border-transparent shadow-clean"
              >
                <span>View All {filteredRequests.length} Requests</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
