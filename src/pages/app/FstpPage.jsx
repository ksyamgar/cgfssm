import React, { useState, useMemo } from 'react';
import { useFsm } from '../../context/FsmContext';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { LocationPicker } from '../../components/maps/LocationPicker';
import { useGeoScope } from '../../context/GeoScopeContext';
import { getBlocks, CG_DISTRICT_COORDINATES } from '../../services/locationService';
import { notifySuccess, notifyWarning } from '../../services/toastService';
import {
  Factory,
  Recycle,
  Droplets,
  MapPin,
  Plus,
  CheckCircle2,
  Navigation,
  Layers,
  ShieldCheck,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  Check
} from 'lucide-react';

export const FstpPage = () => {
  const { fstps, addFstp, editFstp, removeFstp } = useFsm();
  const { currentUser, currentRole } = useAuth();
  const { districts, hierarchyData, selectedDistrict } = useGeoScope();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState(null);
  const [plantToDelete, setPlantToDelete] = useState(null);

  // Filters & Search
  const [areaFilter, setAreaFilter] = useState('ALL'); // ALL, RURAL, URBAN
  const [searchQuery, setSearchQuery] = useState('');

  // Authorized roles check
  const isAuthorizedOfficial = [
    'SUPER_ADMIN',
    'STATE_OFFICER',
    'DISTRICT_COORDINATOR',
    'FSTP_OPERATOR',
    'ADMIN'
  ].includes(currentRole);

  const initialDistrict = selectedDistrict || (districts && districts[0]) || 'Raipur (378)';
  const initialBlocks = getBlocks(hierarchyData, initialDistrict);

  // Default plant form state
  const defaultPlantData = {
    name: 'Dhamtari Central Cluster FSTP',
    type: 'FSTP', // FSTP, URBAN_STP, CO_TREATMENT
    areaType: 'RURAL', // 'RURAL' or 'URBAN'
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
  };

  const [formData, setFormData] = useState(defaultPlantData);

  // Cascading blocks for form's active district
  const formBlocks = useMemo(() => {
    return getBlocks(hierarchyData, formData.district);
  }, [hierarchyData, formData.district]);

  // Handle District Change in Add/Edit modal
  const handleDistrictChange = (d) => {
    const availableBlocks = getBlocks(hierarchyData, d);
    const cleanDist = d.replace(/\s*\(\d+\)$/, '').trim();
    const coords = CG_DISTRICT_COORDINATES[cleanDist];

    setFormData((prev) => ({
      ...prev,
      district: d,
      block: availableBlocks[0] || '',
      lat: coords ? coords.lat : prev.lat,
      lng: coords ? coords.lng : prev.lng
    }));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultDist = selectedDistrict || (districts && districts[0]) || 'Raipur (378)';
    const distBlocks = getBlocks(hierarchyData, defaultDist);
    const cleanDist = defaultDist.replace(/\s*\(\d+\)$/, '').trim();
    const coords = CG_DISTRICT_COORDINATES[cleanDist];

    setFormData({
      ...defaultPlantData,
      district: defaultDist,
      block: distBlocks[0] || '',
      lat: coords ? coords.lat : 21.2514,
      lng: coords ? coords.lng : 81.6296
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (plant) => {
    setPlantToEdit(plant);
    setFormData({
      id: plant.id,
      name: plant.name,
      type: plant.type || 'FSTP',
      areaType: plant.areaType || (plant.type === 'URBAN_STP' ? 'URBAN' : 'RURAL'),
      district: plant.district || initialDistrict,
      block: plant.block || '',
      capacityKLD: plant.capacityKLD || 15,
      currentVolumeKLD: plant.currentVolumeKLD || 0,
      status: plant.status || 'OPERATIONAL',
      lat: plant.lat || 21.2514,
      lng: plant.lng || 81.6296,
      radiusMeters: plant.radiusMeters || 300,
      operatorName: plant.operatorName || '',
      operatorPhone: plant.operatorPhone || '',
      compostStockTons: plant.compostStockTons || 0,
      treatedWaterStockKL: plant.treatedWaterStockKL || 0,
      connectedGPsCount: plant.connectedGPsCount || 10
    });
    setIsEditModalOpen(true);
  };

  // Submit Add Plant
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: `fstp_${Date.now()}`,
      capacityKLD: Number(formData.capacityKLD),
      currentVolumeKLD: Number(formData.currentVolumeKLD || 0),
      radiusMeters: Number(formData.radiusMeters || 300),
      connectedGPsCount: Number(formData.connectedGPsCount || 10),
      compostStockTons: Number(formData.compostStockTons || 0),
      treatedWaterStockKL: Number(formData.treatedWaterStockKL || 0)
    };

    await addFstp(payload);
    setIsAddModalOpen(false);
    notifySuccess(
      `Treatment facility "${payload.name}" (${payload.areaType} • ${payload.capacityKLD} KLD) registered with ±${payload.radiusMeters}m geofence.`,
      'Facility Successfully Empaneled'
    );
  };

  // Submit Edit Plant
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!plantToEdit) return;

    const payload = {
      ...formData,
      capacityKLD: Number(formData.capacityKLD),
      currentVolumeKLD: Number(formData.currentVolumeKLD || 0),
      radiusMeters: Number(formData.radiusMeters || 300),
      connectedGPsCount: Number(formData.connectedGPsCount || 10),
      compostStockTons: Number(formData.compostStockTons || 0),
      treatedWaterStockKL: Number(formData.treatedWaterStockKL || 0)
    };

    await editFstp(plantToEdit.id, payload);
    setIsEditModalOpen(false);
    setPlantToEdit(null);
    notifySuccess(
      `Treatment plant "${payload.name}" updated successfully.`,
      'Facility Profile Updated'
    );
  };

  // Submit Delete Plant (Deletion with Caution)
  const handleDeleteConfirm = async () => {
    if (!plantToDelete) return;
    await removeFstp(plantToDelete.id);
    notifySuccess(`Treatment facility "${plantToDelete.name}" decommissioned and removed.`, 'Facility Deleted');
    setPlantToDelete(null);
  };

  // Filter plants based on Area and Search query
  const filteredFstps = fstps.filter(plant => {
    const isRural = (plant.areaType || (plant.type === 'URBAN_STP' ? 'URBAN' : 'RURAL')) === 'RURAL';
    if (areaFilter === 'RURAL' && !isRural) return false;
    if (areaFilter === 'URBAN' && isRural) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = plant.name?.toLowerCase().includes(q);
      const matchDist = plant.district?.toLowerCase().includes(q);
      const matchBlock = plant.block?.toLowerCase().includes(q);
      const matchOp = plant.operatorName?.toLowerCase().includes(q);
      const matchType = plant.type?.toLowerCase().includes(q);
      if (!matchName && !matchDist && !matchBlock && !matchOp && !matchType) return false;
    }
    return true;
  });

  const ruralCount = fstps.filter(p => (p.areaType || (p.type === 'URBAN_STP' ? 'URBAN' : 'RURAL')) === 'RURAL').length;
  const urbanCount = fstps.filter(p => (p.areaType || (p.type === 'URBAN_STP' ? 'URBAN' : 'RURAL')) === 'URBAN').length;

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DataTag color="violet">TREATMENT INFRASTRUCTURE</DataTag>
            <DataTag color="green">GEOFENCED DISPOSAL HUBS</DataTag>
            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              🌾 {ruralCount} Rural FSTPs
            </span>
            <span className="text-xs font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/30 px-2.5 py-0.5 rounded-full">
              🏙️ {urbanCount} Urban STPs
            </span>
            <span className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 px-2.5 py-0.5 rounded-full">
              {fstps.length} Active Facilities
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            FSTP & STP Treatment Facility Network
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geofenced co-treatment and standalone faecal sludge treatment plants with bio-resource recovery tracking
          </p>
        </div>

        {isAuthorizedOfficial && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus size={16} />
            <span>Register New Treatment Plant (FSTP/STP)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-clean">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">Filter Facilities:</span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/10 p-1 text-xs font-semibold">
            <button
              onClick={() => setAreaFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${areaFilter === 'ALL' ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              All Plants ({fstps.length})
            </button>
            <button
              onClick={() => setAreaFilter('RURAL')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${areaFilter === 'RURAL' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <span>🌾 Rural</span>
              <span className="text-[10px] opacity-80">({ruralCount})</span>
            </button>
            <button
              onClick={() => setAreaFilter('URBAN')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${areaFilter === 'URBAN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <span>🏙️ Urban</span>
              <span className="text-[10px] opacity-80">({urbanCount})</span>
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search plant name, district, block, operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid of Treatment Plants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFstps.map((plant) => {
          const utilPct = Math.round((plant.currentVolumeKLD / (plant.capacityKLD || 1)) * 100);
          const isRural = (plant.areaType || (plant.type === 'URBAN_STP' ? 'URBAN' : 'RURAL')) === 'RURAL';

          return (
            <GlassCard
              key={plant.id}
              title={plant.name}
              icon={Factory}
              moduleTag={`${plant.capacityKLD} KLD • ${plant.type}`}
            >
              <div className="space-y-3.5 text-xs font-sans">
                {/* Area Classification Badge & Operational Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isRural
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                      : 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40'
                  }`}>
                    {isRural ? '🌾 Rural Treatment Facility' : '🏙️ Urban Treatment Facility'}
                  </span>

                  <StatusChip status={plant.status || 'OPERATIONAL'} />
                </div>

                {/* Location & Jurisdiction */}
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-teal-600 dark:text-cg-teal" />
                    <span>{plant.district} &bull; {plant.block}</span>
                  </div>
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">
                    {plant.connectedGPsCount} Linked GPs
                  </span>
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
                      style={{ width: `${Math.min(utilPct, 100)}%` }}
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
                </div>

                {/* Official Actions: Edit / Delete (Deletion with Caution) */}
                {isAuthorizedOfficial && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleOpenEdit(plant)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Edit facility parameters"
                    >
                      <Edit2 size={13} />
                      <span>Edit Facility</span>
                    </button>
                    <button
                      onClick={() => setPlantToDelete(plant)}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-all"
                      title="Decommission & delete facility"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Register New FSTP Modal with Interactive Map Pin Dropper */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl p-6 border border-slate-200 dark:border-purple-500/40 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
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
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Facility / Plant Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arang Cluster Rural FSTP"
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              {/* RURAL vs URBAN Option */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
                <label className="text-slate-800 dark:text-white font-bold block mb-1">
                  Facility Operating Jurisdiction (Rural or Urban) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formData.areaType === 'RURAL'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="addAreaType"
                      value="RURAL"
                      checked={formData.areaType === 'RURAL'}
                      onChange={() => setFormData({ ...formData, areaType: 'RURAL', type: formData.type === 'URBAN_STP' ? 'FSTP' : formData.type })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div>🌾 Rural Facility</div>
                      <div className="text-[10px] font-normal opacity-75">Gram Panchayat Clusters & Rural Blocks</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formData.areaType === 'URBAN'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-bold'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="addAreaType"
                      value="URBAN"
                      checked={formData.areaType === 'URBAN'}
                      onChange={() => setFormData({ ...formData, areaType: 'URBAN', type: formData.type === 'FSTP' ? 'URBAN_STP' : formData.type })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div>🏙️ Urban Facility</div>
                      <div className="text-[10px] font-normal opacity-75">Municipal ULB & Co-Treatment / STP Network</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Plant Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                >
                  <option value="FSTP">Standalone Rural FSTP</option>
                  <option value="URBAN_STP">Urban STP (Plug-in Facility)</option>
                  <option value="CO_TREATMENT">Co-Treatment Facility</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Capacity (KLD - Kilolitres/Day) *</label>
                <input
                  type="number"
                  value={formData.capacityKLD}
                  onChange={(e) => setFormData({ ...formData, capacityKLD: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">District (जिला) *</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
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
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                >
                  {formBlocks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator Full Name</label>
                <input
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator Phone</label>
                <input
                  type="text"
                  value={formData.operatorPhone}
                  onChange={(e) => setFormData({ ...formData, operatorPhone: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Linked Gram Panchayats Count</label>
                <input
                  type="number"
                  value={formData.connectedGPsCount}
                  onChange={(e) => setFormData({ ...formData, connectedGPsCount: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* Interactive Location Pin Dropper & Geo-Fence Radius */}
            <div className="pt-2">
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                district={formData.district}
                radiusMeters={formData.radiusMeters}
                onRadiusChange={(radius) => setFormData({ ...formData, radiusMeters: radius })}
                onLocationChange={(newLat, newLng) => setFormData({ ...formData, lat: newLat, lng: newLng })}
                label="Pin Exact Plant Location & Geofence Boundary"
                height="240px"
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

      {/* Edit Treatment Plant Modal */}
      {isEditModalOpen && plantToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl p-6 border border-slate-200 dark:border-purple-500/40 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Update Treatment Plant: {plantToEdit.name}</h3>
                  <p className="text-[11px] text-slate-500">Modify operating jurisdiction, capacity, operator & geofence parameters</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsEditModalOpen(false); setPlantToEdit(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Facility / Plant Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              {/* RURAL vs URBAN Option */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
                <label className="text-slate-800 dark:text-white font-bold block mb-1">
                  Facility Operating Jurisdiction (Rural or Urban) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formData.areaType === 'RURAL'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="editAreaType"
                      value="RURAL"
                      checked={formData.areaType === 'RURAL'}
                      onChange={() => setFormData({ ...formData, areaType: 'RURAL' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div>🌾 Rural Facility</div>
                      <div className="text-[10px] font-normal opacity-75">Gram Panchayat Clusters & Rural Blocks</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formData.areaType === 'URBAN'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-bold'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="editAreaType"
                      value="URBAN"
                      checked={formData.areaType === 'URBAN'}
                      onChange={() => setFormData({ ...formData, areaType: 'URBAN' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div>🏙️ Urban Facility</div>
                      <div className="text-[10px] font-normal opacity-75">Municipal ULB & Co-Treatment / STP Network</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Plant Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                >
                  <option value="FSTP">Standalone Rural FSTP</option>
                  <option value="URBAN_STP">Urban STP (Plug-in Facility)</option>
                  <option value="CO_TREATMENT">Co-Treatment Facility</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Capacity (KLD) *</label>
                <input
                  type="number"
                  value={formData.capacityKLD}
                  onChange={(e) => setFormData({ ...formData, capacityKLD: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">District (जिला) *</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
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
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                >
                  {formBlocks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Daily Intake (KLD)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentVolumeKLD}
                  onChange={(e) => setFormData({ ...formData, currentVolumeKLD: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operational Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                >
                  <option value="OPERATIONAL">OPERATIONAL</option>
                  <option value="MAINTENANCE">UNDER MAINTENANCE</option>
                  <option value="OFFLINE">OFFLINE / SUSPENDED</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator Full Name</label>
                <input
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator Phone</label>
                <input
                  type="text"
                  value={formData.operatorPhone}
                  onChange={(e) => setFormData({ ...formData, operatorPhone: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Bio-Compost Stock (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.compostStockTons}
                  onChange={(e) => setFormData({ ...formData, compostStockTons: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Treated Water Stock (kL)</label>
                <input
                  type="number"
                  value={formData.treatedWaterStockKL}
                  onChange={(e) => setFormData({ ...formData, treatedWaterStockKL: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* Interactive Location Pin Dropper & Geo-Fence Radius */}
            <div className="pt-2">
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                district={formData.district}
                radiusMeters={formData.radiusMeters}
                onRadiusChange={(radius) => setFormData({ ...formData, radiusMeters: radius })}
                onLocationChange={(newLat, newLng) => setFormData({ ...formData, lat: newLat, lng: newLng })}
                label="Pin Exact Plant Location & Geofence Boundary"
                height="240px"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => { setIsEditModalOpen(false); setPlantToEdit(null); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs text-slate-800 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Treatment Plant Modal (Deletion with Caution) */}
      {plantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-red-300 dark:border-red-500/40 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center animate-pulse">
              <AlertTriangle size={30} />
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-500/30">
                ⚠️ Deletion with Caution (सावधानीपूर्वक हटाएं)
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
                Decommission Facility?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to decommission and permanently remove <strong className="font-semibold text-slate-900 dark:text-white">{plantToDelete.name}</strong> ({plantToDelete.district}) from the active treatment network?
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 text-left space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                <AlertTriangle size={13} />
                <span>Operational Impact Warning:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] opacity-90">
                <li>Capacity of <strong>{plantToDelete.capacityKLD} KLD</strong> will be removed from district quota.</li>
                <li><strong>{plantToDelete.connectedGPsCount} linked Gram Panchayats</strong> will lose automatic geofenced disposal routing.</li>
                <li>This action is logged in the permanent official audit trail.</li>
              </ul>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setPlantToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:text-white text-xs text-slate-800 font-semibold"
              >
                Cancel (सुरक्षित रखें)
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs text-white font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Trash2 size={14} />
                <span>Confirm Decommission & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
