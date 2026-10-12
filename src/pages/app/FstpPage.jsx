import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { LocationPicker } from '../../components/maps/LocationPicker';
import { useGeoScope } from '../../context/GeoScopeContext';
import { getBlocks, CG_DISTRICT_COORDINATES } from '../../services/locationService';
import { notifySuccess } from '../../services/toastService';
import { Factory, Recycle, Droplets, MapPin, Plus, CheckCircle2, Navigation, Layers, ShieldCheck, X } from 'lucide-react';

export const FstpPage = () => {
  const { fstps, setFstps } = useFsm();
  const { districts, locationHierarchy, selectedDistrict } = useGeoScope();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlantPreview, setSelectedPlantPreview] = useState(null);

  const initialDistrict = selectedDistrict || (districts && districts[0]) || 'Raipur (378)';
  const initialBlocks = getBlocks(locationHierarchy, initialDistrict);

  const [newPlant, setNewPlant] = useState({
    name: 'Dhamtari Central Cluster FSTP',
    type: 'FSTP', // FSTP, URBAN_STP, CO_TREATMENT
    district: initialDistrict,
    block: initialBlocks[0] || 'Dharsiwa (3836)',
    capacityKLD: 20,
    currentVolumeKLD: 5.0,
    status: 'OPERATIONAL',
    lat: 20.7071,
    lng: 81.5498,
    radiusMeters: 300,
    operatorName: 'Mahendra Kumar Sahu',
    operatorPhone: '9826199044',
    compostStockTons: 15.0,
    treatedWaterStockKL: 80,
    connectedGPsCount: 16
  });

  // Dynamically compute available blocks for the chosen plant district
  const plantBlocks = getBlocks(locationHierarchy, newPlant.district);

  const handlePlantDistrictChange = (d) => {
    const availableBlocks = getBlocks(locationHierarchy, d);
    const cleanDist = d.replace(/\s*\(\d+\)$/, '').trim();
    const coords = CG_DISTRICT_COORDINATES[cleanDist];

    setNewPlant((prev) => ({
      ...prev,
      district: d,
      block: availableBlocks[0] || '',
      lat: coords ? coords.lat : prev.lat,
      lng: coords ? coords.lng : prev.lng
    }));
  };

  const handleCreateFstp = (e) => {
    e.preventDefault();
    const created = {
      ...newPlant,
      id: `fstp_${Date.now()}`,
      capacityKLD: Number(newPlant.capacityKLD),
      currentVolumeKLD: Number(newPlant.currentVolumeKLD || 0),
      radiusMeters: Number(newPlant.radiusMeters || 300),
      connectedGPsCount: Number(newPlant.connectedGPsCount || 10)
    };
    setFstps([...fstps, created]);
    setIsAddModalOpen(false);
    notifySuccess(
      `Treatment facility "${created.name}" registered with ${created.capacityKLD} KLD capacity and ±${created.radiusMeters}m geofence.`,
      'FSTP Successfully Empaneled'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DataTag color="violet">TREATMENT INFRASTRUCTURE</DataTag>
            <DataTag color="green">GEOFENCED DISPOSAL HUBS</DataTag>
            <span className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 px-2.5 py-0.5 rounded-full">
              {fstps.length} Active Plants Registered
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            FSTP & STP Treatment Facility Network
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>Register New Treatment Plant (FSTP/STP)</span>
        </button>
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

                {/* GPS Coordinates Badge Strip */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Navigation size={12} className="text-purple-600 dark:text-purple-400" />
                    <span>GPS: <strong>{plant.lat}, {plant.lng}</strong></span>
                  </div>
                  <span className="text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded font-bold">
                    &plusmn;{plant.radiusMeters}m Geofence
                  </span>
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

                {/* Operator Info & By-Product Recovery */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2.5">
                    <Recycle size={20} className="text-emerald-700 dark:text-cg-green shrink-0" />
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">BIO-COMPOST</div>
                      <div className="font-display font-bold text-sm text-slate-900 dark:text-white">{plant.compostStockTons || 0} Tons</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30 flex items-center gap-2.5">
                    <Droplets size={20} className="text-sky-700 dark:text-cg-cyan shrink-0" />
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">TREATED WATER</div>
                      <div className="font-display font-bold text-sm text-slate-900 dark:text-white">{plant.treatedWaterStockKL || 0} kL</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
                  <span>Operator: <strong className="text-slate-900 dark:text-white">{plant.operatorName}</strong> ({plant.operatorPhone})</span>
                  <span className="text-purple-700 dark:text-cg-violet font-bold">{plant.connectedGPsCount} Linked GPs</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Register New FSTP Modal with Interactive Map Pin Dropper */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleCreateFstp} className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl p-6 border border-slate-200 dark:border-purple-500/40 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Factory size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Register Treatment Plant (FSTP / STP)</h3>
                  <p className="text-[11px] text-slate-500">Pinpoint plant location on map for automated vehicle routing & geofenced decanting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Facility / Plant Name</label>
                <input
                  type="text"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                  placeholder="e.g. Arang Cluster Rural FSTP"
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Plant Type</label>
                <select
                  value={newPlant.type}
                  onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                >
                  <option value="FSTP">Standalone Rural FSTP</option>
                  <option value="URBAN_STP">Urban STP (Plug-in Facility)</option>
                  <option value="CO_TREATMENT">Co-Treatment Facility</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Capacity (KLD - Kilolitres/Day)</label>
                <input
                  type="number"
                  value={newPlant.capacityKLD}
                  onChange={(e) => setNewPlant({ ...newPlant, capacityKLD: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">District (जिला) *</label>
                <select
                  value={newPlant.district}
                  onChange={(e) => handlePlantDistrictChange(e.target.value)}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Block (विकासखंड) *</label>
                <select
                  value={newPlant.block}
                  onChange={(e) => setNewPlant({ ...newPlant, block: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                >
                  {plantBlocks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator Full Name</label>
                <input
                  type="text"
                  value={newPlant.operatorName}
                  onChange={(e) => setNewPlant({ ...newPlant, operatorName: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator Phone</label>
                <input
                  type="text"
                  value={newPlant.operatorPhone}
                  onChange={(e) => setNewPlant({ ...newPlant, operatorPhone: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                  required
                />
              </div>
            </div>

            {/* Interactive Location Pin Dropper & Geo-Fence Radius */}
            <div className="pt-2">
              <LocationPicker
                lat={newPlant.lat}
                lng={newPlant.lng}
                district={newPlant.district}
                radiusMeters={newPlant.radiusMeters}
                onRadiusChange={(radius) => setNewPlant({ ...newPlant, radiusMeters: radius })}
                onLocationChange={(newLat, newLng) => setNewPlant({ ...newPlant, lat: newLat, lng: newLng })}
                label="Pin Exact Plant Location & Geofence Boundary"
                height="260px"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs text-slate-800 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Register Facility</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
