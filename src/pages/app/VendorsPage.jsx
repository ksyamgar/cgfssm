import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Building2, Award, Phone, CheckCircle2, IndianRupee, Truck } from 'lucide-react';

export const VendorsPage = () => {
  const { vendors } = useFsm();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="amber">PRIVATE SANITATION OPERATORS (PSSO)</DataTag>
            <DataTag color="teal">EMPANELMENT DIRECTORY</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Empaneled Sanitation Vendors & Performance
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((ven) => (
          <GlassCard key={ven.id} title={ven.name} icon={Building2} moduleTag={ven.regNo}>
            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contact:</span>
                <span className="text-slate-900 dark:text-white font-medium">{ven.contactPerson} ({ven.phone})</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">SLA Compliance Score:</span>
                  <strong className="text-teal-700 dark:text-cg-teal font-mono text-sm">{ven.slaScore}%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Total Trips Completed:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{ven.totalTripsCompleted}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Total Revenue Realized:</span>
                  <strong className="text-emerald-700 dark:text-cg-green font-mono">₹{ven.revenueTotalINR.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                UPI VPA: <strong className="text-sky-700 dark:text-cg-cyan">{ven.upiVpa}</strong>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] font-mono text-emerald-700 dark:text-cg-green">
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>District Empaneled</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{ven.activeVehicles} Active Vehicles</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
