import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { Factory, Recycle, Droplets, MapPin, Plus, CheckCircle2 } from 'lucide-react';

export const FstpPage = () => {
  const { fstps } = useFsm();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="violet">TREATMENT INFRASTRUCTURE</DataTag>
            <DataTag color="green">CIRCULAR ECONOMY</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            FSTP & STP Treatment Facility Network
          </h1>
        </div>
      </div>

      {/* Grid of Treatment Plants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fstps.map((plant) => {
          const utilPct = Math.round((plant.currentVolumeKLD / plant.capacityKLD) * 100);

          return (
            <GlassCard
              key={plant.id}
              title={plant.name}
              icon={Factory}
              moduleTag={`${plant.capacityKLD} KLD • ${plant.type}`}
            >
              <div className="space-y-4 text-xs font-sans">
                {/* Location & Operator */}
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-teal-600 dark:text-cg-teal" />
                    <span>{plant.district} &bull; {plant.block}</span>
                  </div>
                  <span className="font-mono text-emerald-700 dark:text-cg-green font-bold">● {plant.status}</span>
                </div>

                {/* Capacity Progress Meter */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-700 dark:text-slate-300">Daily Sludge Intake:</span>
                    <strong className="text-slate-900 dark:text-white">{plant.currentVolumeKLD} / {plant.capacityKLD} KLD ({utilPct}%)</strong>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-cg-navy overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        utilPct > 85 ? 'bg-amber-500 dark:bg-cg-amber' : 'bg-teal-600 dark:bg-cg-teal'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* By-Product Recovery Inventory */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2.5">
                    <Recycle size={20} className="text-emerald-700 dark:text-cg-green shrink-0" />
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">BIO-COMPOST STOCK</div>
                      <div className="font-display font-bold text-sm text-slate-900 dark:text-white">{plant.compostStockTons} Tons</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30 flex items-center gap-2.5">
                    <Droplets size={20} className="text-sky-700 dark:text-cg-cyan shrink-0" />
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">TREATED WATER</div>
                      <div className="font-display font-bold text-sm text-slate-900 dark:text-white">{plant.treatedWaterStockKL} kL</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
                  <span>Geo-Fence: {plant.radiusMeters}m radius</span>
                  <span className="text-purple-700 dark:text-cg-violet font-bold">{plant.connectedGPsCount} Linked GPs</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
