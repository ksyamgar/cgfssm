import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Users, UserPlus, CheckCircle2, ShieldCheck, Phone, Mail, Award } from 'lucide-react';

export const PeoplePage = () => {
  const { allMockUsers } = useAuth();
  const [filterRole, setFilterRole] = useState('ALL');

  const filtered = filterRole === 'ALL' ? allMockUsers : allMockUsers.filter(u => u.role === filterRole);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">HUMAN RESOURCES</DataTag>
            <DataTag color="green">SWACHHAGRAHI CADRE</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Personnel Directory & Field Crew
          </h1>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'DRIVER', 'SANITATION_WORKER', 'GP_OPERATOR', 'FSTP_OPERATOR', 'DISTRICT_COORDINATOR'].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              filterRole === r
                ? 'bg-cg-teal text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-transparent'
            }`}
          >
            {r.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((user) => (
          <GlassCard key={user.id} title={user.name} icon={Users} moduleTag={user.role.split('_')[0]}>
            <div className="space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Designation:</span>
                <span className="text-slate-900 dark:text-white font-medium truncate max-w-[170px]">{user.designation}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone size={13} className="text-teal-600 dark:text-cg-teal" />
                  <span>{user.phone}</span>
                </div>
                {user.email && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail size={13} className="text-sky-700 dark:text-cg-cyan" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                <div className="text-slate-500 dark:text-slate-400">
                  Location: <strong className="text-slate-900 dark:text-white">{user.district}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-emerald-700 dark:text-cg-green font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Verified & Empaneled</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">ID: {user.id}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
