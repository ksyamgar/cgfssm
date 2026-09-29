import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { LiveGpsMap } from '../../components/maps/LiveGpsMap';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { Radio, Truck, Factory, ShieldAlert, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

export const LiveMapPage = () => {
  const { vehicles, fstps } = useFsm();
  const { selectedDistrict } = useGeoScope();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Filter vehicles by selected district
  const filteredVehicles = vehicles.filter(v => {
    if (selectedDistrict && v.district !== selectedDistrict) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Telemetry Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">TRAQINDIA WSS STREAM</DataTag>
            <DataTag color="green">LATENCY: &le; 30s</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Live GPS Fleet Tracking & Geofence Monitor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-teal-800 dark:text-cg-teal bg-teal-50 dark:bg-cg-teal/10 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-cg-teal/30 flex items-center gap-2 font-medium">
            <Radio size={14} className="animate-pulse text-teal-600 dark:text-cg-teal" />
            <span>POLL RATE: 30s • 5 ACTIVE GPS NODES</span>
          </span>
        </div>
      </div>

      {/* Main Map & Vehicle Control Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Fullscreen Map (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <LiveGpsMap
            vehicles={filteredVehicles}
            fstps={fstps}
            selectedVehicleId={selectedVehicleId}
            height="650px"
          />
        </div>

        {/* Vehicle Telemetry Cards (1 col) */}
        <div className="space-y-4">
          <GlassCard title="Active GPS Telemetry Stream" moduleTag="FLEET LIST">
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredVehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-cg-teal/20 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className={v.speedKmh > 0 ? 'text-teal-600 dark:text-cg-teal' : 'text-slate-400'} />
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{v.regNo}</span>
                      </div>
                      <StatusChip status={v.status} />
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      <div>Driver: <strong className="text-slate-900 dark:text-white">{v.driverName}</strong></div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{v.vendorName}</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/5">
                      <span>Speed: <strong className="text-sky-700 dark:text-cg-cyan">{v.speedKmh} km/h</strong></span>
                      <span>Heading: {v.headingDeg}&deg;</span>
                    </div>

                    {v.isInsideFstpGeoFence && (
                      <div className="p-1 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-purple-800 dark:text-purple-300 text-[10px] font-mono font-bold">
                        ✓ Inside Geo-Fence: {v.insideFstpName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
