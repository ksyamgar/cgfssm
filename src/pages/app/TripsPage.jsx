import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { Navigation, Truck, QrCode, ShieldCheck, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { exportToPdf, exportToExcel } from '../../services/exportService';

export const TripsPage = () => {
  const { requests, vehicles } = useFsm();

  // Trips derived from requests with assigned vehicles
  const trips = requests.filter(r => r.assignedVehicleNo || r.status === 'EN_ROUTE' || r.status === 'TRANSPORTING' || r.status === 'CLOSED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">LOGISTICS & DISPATCH</DataTag>
            <DataTag color="cyan">MANIFEST VERIFICATION</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Trip Management & Cluster Manifests
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">SCHEDULED TRIPS TODAY</div>
          <div className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">{trips.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">ACTIVE IN TRANSIT</div>
          <div className="font-display font-bold text-2xl text-teal-700 dark:text-cg-teal mt-1">
            {trips.filter(t => t.status === 'EN_ROUTE' || t.status === 'TRANSPORTING').length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">DISPOSED & CLOSED</div>
          <div className="font-display font-bold text-2xl text-emerald-700 dark:text-cg-green mt-1">
            {trips.filter(t => t.status === 'CLOSED' || t.status === 'DISPOSED').length + 84}
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <GlassCard
            key={trip.id}
            title={trip.assignedVehicleNo || 'CG-04-ME-4821'}
            icon={Truck}
            moduleTag={`TRIP-${trip.requestNo.split('-').pop()}`}
          >
            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <StatusChip status={trip.status} />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <div>ORIGIN: <strong className="text-slate-900 dark:text-white">{trip.village}</strong></div>
                <div>DESTINATION: <strong className="text-purple-700 dark:text-cg-violet">{trip.targetFstpName || 'Arang Cluster Rural FSTP'}</strong></div>
                <div>DRIVER: <span className="text-sky-700 dark:text-cg-cyan font-semibold">{trip.assignedDriverName || 'Ramesh Patel'}</span></div>
                <div>SLUDGE VOLUME: <span className="text-slate-900 dark:text-white font-medium">{trip.tankVolumeLitres} Litres</span></div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
                <span>Date: {trip.scheduledDate}</span>
                <span className="text-teal-700 dark:text-cg-teal font-bold">₹{trip.estimatedCost}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
