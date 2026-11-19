import React, { useState, useMemo, useEffect } from 'react';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useFsm } from '../../context/FsmContext';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { ALL_33_DISTRICTS, DEFAULT_GLOBAL_TARIFF } from '../../services/storageService';
import { notifySuccess, notifyInfo, notifyWarning } from '../../services/toastService';
import {
  Database,
  IndianRupee,
  Clock,
  ShieldCheck,
  Save,
  Search,
  Check,
  Globe,
  MapPin,
  Calculator,
  FileText,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Layers,
  Download,
  Filter
} from 'lucide-react';

export const MastersPage = () => {
  const { districts: geoDistricts, hierarchyData } = useGeoScope();
  const { tariffs, getDistrictTariff, updateTariff } = useFsm();
  const { currentRole, currentUser } = useAuth();

  // 1. Comprehensive 33-District Master Roster
  const allDistricts = useMemo(() => {
    return (geoDistricts && geoDistricts.length > 0) ? geoDistricts : ALL_33_DISTRICTS;
  }, [geoDistricts]);

  // Selected district for live tariff editing ('GLOBAL' or a specific district name)
  const [selectedDistrict, setSelectedDistrict] = useState('Balod (646)');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [districtFilterTab, setDistrictFilterTab] = useState('ALL'); // ALL, CUSTOM, DEFAULT

  // Form state for current selected district
  const [tariffForm, setTariffForm] = useState({
    basePriceINR: 800,
    baseDistanceKm: 5,
    ratePerAdditionalKmINR: 25,
    gpAdministrativeFeeINR: 100,
    emergencyMultiplier: 1.25,
    tankSizeMultipliers: {
      '1500': 1.0,
      '2500': 1.2,
      '3500': 1.4,
      '5000': 1.8,
      '8000': 2.4
    }
  });

  const [applyToAllDistricts, setApplyToAllDistricts] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Live Bill Simulator State
  const [simDistanceKm, setSimDistanceKm] = useState(12);
  const [simTankSize, setSimTankSize] = useState('3500');
  const [simIsEmergency, setSimIsEmergency] = useState(false);

  // Table search & sort state
  const [tableSearch, setTableSearch] = useState('');

  // Load active tariff whenever selectedDistrict or tariffs change
  useEffect(() => {
    const loaded = getDistrictTariff ? getDistrictTariff(selectedDistrict) : DEFAULT_GLOBAL_TARIFF;
    if (loaded) {
      setTariffForm({
        basePriceINR: loaded.basePriceINR ?? 800,
        baseDistanceKm: loaded.baseDistanceKm ?? 5,
        ratePerAdditionalKmINR: loaded.ratePerAdditionalKmINR ?? 25,
        gpAdministrativeFeeINR: loaded.gpAdministrativeFeeINR ?? 100,
        emergencyMultiplier: loaded.emergencyMultiplier ?? 1.25,
        tankSizeMultipliers: loaded.tankSizeMultipliers || {
          '1500': 1.0,
          '2500': 1.2,
          '3500': 1.4,
          '5000': 1.8,
          '8000': 2.4
        }
      });
    }
  }, [selectedDistrict, tariffs, getDistrictTariff]);

  // Filtered districts list for the left browser
  const filteredDistricts = useMemo(() => {
    return allDistricts.filter(d => {
      if (searchDistrict) {
        const q = searchDistrict.toLowerCase();
        if (!d.toLowerCase().includes(q)) return false;
      }
      const t = tariffs?.[d];
      const isCustom = t && (t.basePriceINR !== 800 || t.ratePerAdditionalKmINR !== 25);
      if (districtFilterTab === 'CUSTOM' && !isCustom) return false;
      if (districtFilterTab === 'DEFAULT' && isCustom) return false;
      return true;
    });
  }, [allDistricts, searchDistrict, districtFilterTab, tariffs]);

  // Count of custom configured districts
  const customCount = useMemo(() => {
    return allDistricts.filter(d => {
      const t = tariffs?.[d];
      return t && (t.basePriceINR !== 800 || t.ratePerAdditionalKmINR !== 25);
    }).length;
  }, [allDistricts, tariffs]);

  // Live bill computation
  const simulatedCost = useMemo(() => {
    const base = Number(tariffForm.basePriceINR) || 800;
    const baseKm = Number(tariffForm.baseDistanceKm) || 5;
    const rateKm = Number(tariffForm.ratePerAdditionalKmINR) || 25;
    const gpFee = Number(tariffForm.gpAdministrativeFeeINR) || 100;
    const emergencyFactor = simIsEmergency ? (Number(tariffForm.emergencyMultiplier) || 1.25) : 1.0;
    const tankMult = Number(tariffForm.tankSizeMultipliers?.[simTankSize]) || 1.4;

    const extraKm = Math.max(0, simDistanceKm - baseKm);
    const distanceCost = extraKm * rateKm;
    const preTax = (base + distanceCost) * tankMult + gpFee;
    const total = Math.round(preTax * emergencyFactor);

    return {
      base,
      baseKm,
      extraKm,
      distanceCost,
      gpFee,
      tankMult,
      emergencyFactor,
      total
    };
  }, [tariffForm, simDistanceKm, simTankSize, simIsEmergency]);

  // Handle Save
  const handleSaveTariff = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateTariff) {
        await updateTariff(selectedDistrict, tariffForm, applyToAllDistricts);
      }
      setIsSaved(true);
      notifySuccess(
        applyToAllDistricts
          ? `Tariff rules updated statewide across all 33 districts of Chhattisgarh!`
          : `Tariff rules for ${selectedDistrict} updated successfully.`,
        'Tariff Configuration Synchronized'
      );
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      notifyWarning('Failed to persist tariff rules. Please verify connectivity.', 'Update Failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to statewide default
  const handleResetToDefault = () => {
    setTariffForm({
      basePriceINR: DEFAULT_GLOBAL_TARIFF.basePriceINR,
      baseDistanceKm: DEFAULT_GLOBAL_TARIFF.baseDistanceKm,
      ratePerAdditionalKmINR: DEFAULT_GLOBAL_TARIFF.ratePerAdditionalKmINR,
      gpAdministrativeFeeINR: DEFAULT_GLOBAL_TARIFF.gpAdministrativeFeeINR,
      emergencyMultiplier: DEFAULT_GLOBAL_TARIFF.emergencyMultiplier,
      tankSizeMultipliers: { ...DEFAULT_GLOBAL_TARIFF.tankSizeMultipliers }
    });
    setApplyToAllDistricts(false);
    notifyInfo(`Tariff parameters for ${selectedDistrict} reset to Chhattisgarh standard benchmark.`, 'Defaults Restored');
  };

  // Export CSV of all district tariffs
  const handleExportCsv = () => {
    const headers = ['District,LGD_Code,Base_Tariff_INR,Base_Distance_KM,Extra_Km_Rate_INR,GP_Admin_Cess_INR,Emergency_Multiplier,Status'];
    const rows = allDistricts.map(d => {
      const t = getDistrictTariff(d);
      const isCustom = t.basePriceINR !== 800 || t.ratePerAdditionalKmINR !== 25;
      const codeMatch = d.match(/\((\d+)\)/);
      const code = codeMatch ? codeMatch[1] : 'N/A';
      return `"${d}","${code}",${t.basePriceINR || 800},${t.baseDistanceKm || 5},${t.ratePerAdditionalKmINR || 25},${t.gpAdministrativeFeeINR || 100},${t.emergencyMultiplier || 1.25},"${isCustom ? 'CUSTOM' : 'GOVT_BENCHMARK'}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CG_FSSM_District_Tariff_Schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifySuccess('33-District Official Tariff Schedule exported to CSV.', 'Export Complete');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <DataTag color="teal">MASTERS & CONFIGURATION</DataTag>
            <DataTag color="cyan">LGD CODE MAPPING</DataTag>
            <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700/50 px-2.5 py-0.5 rounded-full">
              🏛️ 33 Districts Configurable
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Geographic Hierarchy & Tariff Configuration
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download size={14} />
            <span>Export Tariff Schedule (CSV)</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: LGD Administrative Scope Browser & District Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard
            title="LGD Administrative Scope Browser"
            icon={Database}
            moduleTag="33 DISTRICTS"
          >
            <div className="space-y-4 text-xs font-sans">
              <p className="text-slate-600 dark:text-slate-300">
                Complete hierarchical mapping of Chhattisgarh Local Government Directory (LGD) codes for revenue villages and Gram Panchayats. Click any district to configure its dynamic fee rules.
              </p>

              {/* Administrative Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">DISTRICTS</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{allDistricts.length || 33}</div>
                </div>
                <div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400">PANCHAYATS</div>
                  <div className="text-base font-bold text-teal-700 dark:text-cg-teal">11,664</div>
                </div>
                <div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400">VILLAGES</div>
                  <div className="text-base font-bold text-sky-700 dark:text-cg-cyan">20,126</div>
                </div>
              </div>

              {/* Search & Tabs */}
              <div className="space-y-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    placeholder="Search district or LGD code (e.g. Balod, 378)..."
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDistrictFilterTab('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      districtFilterTab === 'ALL'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    All ({allDistricts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictFilterTab('CUSTOM')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      districtFilterTab === 'CUSTOM'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Customized ({customCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictFilterTab('DEFAULT')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      districtFilterTab === 'DEFAULT'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Govt Default ({allDistricts.length - customCount})
                  </button>
                </div>
              </div>

              {/* Special Global Option */}
              <div
                onClick={() => {
                  setSelectedDistrict('GLOBAL');
                  setApplyToAllDistricts(true);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedDistrict === 'GLOBAL'
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-950 dark:text-teal-200 shadow-sm'
                    : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe size={18} className="text-teal-600 dark:text-teal-400" />
                  <div>
                    <div className="font-bold text-xs">🌐 Statewide Master Benchmark</div>
                    <div className="text-[10px] opacity-75">Base tariff rules applying across all 33 districts</div>
                  </div>
                </div>
                {selectedDistrict === 'GLOBAL' && (
                  <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>

              {/* 33 Districts Interactive List */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                  <span>SELECT DISTRICT TO CONFIGURE</span>
                  <span>{filteredDistricts.length} shown</span>
                </div>

                <div className="max-h-[440px] overflow-y-auto space-y-1.5 p-1.5 bg-slate-50/80 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/10">
                  {filteredDistricts.map((d) => {
                    const isSelected = selectedDistrict === d;
                    const dTariff = getDistrictTariff(d);
                    const isCustom = dTariff && (dTariff.basePriceINR !== 800 || dTariff.ratePerAdditionalKmINR !== 25);

                    return (
                      <div
                        key={d}
                        onClick={() => {
                          setSelectedDistrict(d);
                          setApplyToAllDistricts(false);
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500 text-teal-950 dark:text-teal-100 shadow-sm'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin size={14} className={isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
                          <div className="truncate">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white block truncate">
                              {d}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Base: ₹{dTariff.basePriceINR || 800} &bull; +₹{dTariff.ratePerAdditionalKmINR || 25}/km
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isCustom ? (
                            <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded">
                              CUSTOM
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                              STANDARD
                            </span>
                          )}
                          <ChevronRight size={14} className={isSelected ? 'text-teal-600' : 'text-slate-300 dark:text-slate-600'} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Dynamic Tariff Rules Editor & Live Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard
            title={selectedDistrict === 'GLOBAL' ? 'Statewide Master Tariff Rules' : `Tariff Rules: ${selectedDistrict}`}
            icon={IndianRupee}
            moduleTag="DYNAMIC PRICING & SLABS"
          >
            <form onSubmit={handleSaveTariff} className="space-y-4 text-xs font-sans">
              {/* Active Profile Scope Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    {selectedDistrict === 'GLOBAL' ? <Globe size={15} /> : <MapPin size={15} />}
                    <span>
                      {selectedDistrict === 'GLOBAL' ? 'Editing Statewide Default Benchmark' : `Configuring Tariffs for ${selectedDistrict}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Modifying this profile updates instant cost calculations, receipts, and offline booking estimates.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <RotateCcw size={12} />
                  <span>Reset to Govt Standard</span>
                </button>
              </div>

              {/* Primary Tariff Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Base Price */}
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold flex items-center justify-between">
                    <span>Base Desludging Tariff (₹) *</span>
                    <span className="text-[10px] text-teal-600 font-normal">Starting Fee</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="100"
                      max="10000"
                      value={tariffForm.basePriceINR}
                      onChange={(e) => setTariffForm({ ...tariffForm, basePriceINR: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl pl-7 pr-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:border-teal-600 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">Covers vehicle mobilization and initial travel perimeter.</span>
                </div>

                {/* 2. Base Distance Included */}
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold flex items-center justify-between">
                    <span>Base Travel Perimeter (km) *</span>
                    <span className="text-[10px] text-teal-600 font-normal">Included in Base</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={tariffForm.baseDistanceKm}
                      onChange={(e) => setTariffForm({ ...tariffForm, baseDistanceKm: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:border-teal-600 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">km</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Distance from treatment facility before extra mileage charges apply.</span>
                </div>

                {/* 3. Rate Per Additional KM */}
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold flex items-center justify-between">
                    <span>Rate per Extra Km (₹/km) *</span>
                    <span className="text-[10px] text-teal-600 font-normal">Odometer Rate</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      max="200"
                      value={tariffForm.ratePerAdditionalKmINR}
                      onChange={(e) => setTariffForm({ ...tariffForm, ratePerAdditionalKmINR: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl pl-7 pr-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:border-teal-600 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px]">/ km</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Computed via TraqIndia GPS telemetry beyond the base perimeter.</span>
                </div>

                {/* 4. Gram Panchayat Sanitation Cess */}
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold flex items-center justify-between">
                    <span>Gram Panchayat Cess (₹) *</span>
                    <span className="text-[10px] text-teal-600 font-normal">Local Corpus</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      max="1000"
                      value={tariffForm.gpAdministrativeFeeINR}
                      onChange={(e) => setTariffForm({ ...tariffForm, gpAdministrativeFeeINR: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl pl-7 pr-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:border-teal-600 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">Credited to the village Gram Panchayat Swachhata fund.</span>
                </div>

                {/* 5. Emergency Surcharge Factor */}
                <div className="sm:col-span-2">
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold flex items-center justify-between">
                    <span>Emergency & 12-Hour Priority Surcharge Multiplier (x) *</span>
                    <span className="text-[10px] text-amber-600 font-mono font-bold">
                      {Math.round(((Number(tariffForm.emergencyMultiplier) || 1.25) - 1) * 100)}% Surge
                    </span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1.0, 1.15, 1.25, 1.5].map((multiplier) => (
                      <button
                        key={multiplier}
                        type="button"
                        onClick={() => setTariffForm({ ...tariffForm, emergencyMultiplier: multiplier })}
                        className={`py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                          tariffForm.emergencyMultiplier === multiplier
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {multiplier === 1.0 ? 'None (1.0x)' : `${multiplier}x (+${Math.round((multiplier - 1) * 100)}%)`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tank Size Multipliers */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">Tank Volume Capacity Multipliers</span>
                  <span className="text-[10px] text-slate-500 font-mono">Relative Slabs</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
                  {[
                    { key: '1500', label: 'Pit (1500L)' },
                    { key: '2500', label: 'Small (2500L)' },
                    { key: '3500', label: 'Medium (3500L)' },
                    { key: '5000', label: 'Large (5000L)' },
                    { key: '8000', label: 'Commercial (8000L)' }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                      <div className="text-[10px] text-slate-500 font-medium truncate">{label}</div>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="5.0"
                        value={tariffForm.tankSizeMultipliers?.[key] || 1.0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTariffForm({
                            ...tariffForm,
                            tankSizeMultipliers: {
                              ...tariffForm.tankSizeMultipliers,
                              [key]: val
                            }
                          });
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-900 dark:text-white focus:border-teal-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Citizen Cost Simulator Widget */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-teal-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                    <Calculator size={15} className="text-teal-600" />
                    <span>Live Tariff Simulator ({selectedDistrict})</span>
                  </div>
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 font-bold bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                    Instant Citizen Preview
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Simulated Distance ({simDistanceKm} km)</label>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      value={simDistanceKm}
                      onChange={(e) => setSimDistanceKm(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Septic Tank Volume</label>
                    <select
                      value={simTankSize}
                      onChange={(e) => setSimTankSize(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-slate-900 dark:text-white outline-none"
                    >
                      <option value="1500">1,500 L (Pit)</option>
                      <option value="2500">2,500 L (Small)</option>
                      <option value="3500">3,500 L (Medium)</option>
                      <option value="5000">5,000 L (Large)</option>
                      <option value="8000">8,000 L (Commercial)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={simIsEmergency}
                        onChange={(e) => setSimIsEmergency(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Emergency Dispatch (+25%)</span>
                    </label>
                  </div>
                </div>

                {/* Simulation Breakdown Banner */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <div className="space-x-2 text-slate-600 dark:text-slate-400">
                    <span>Base: ₹{simulatedCost.base}</span>
                    <span>+</span>
                    <span>Distance ({simulatedCost.extraKm} km extra): ₹{simulatedCost.distanceCost}</span>
                    <span>+</span>
                    <span>GP Cess: ₹{simulatedCost.gpFee}</span>
                    <span>&times;</span>
                    <span>Tank {simulatedCost.tankMult}x</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] mr-1.5">FINAL CITIZEN TARIFF:</span>
                    <strong className="text-base text-teal-700 dark:text-teal-300 font-extrabold">
                      ₹{simulatedCost.total}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bulk Apply to all 33 districts checkbox */}
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-700/40">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyToAllDistricts}
                    onChange={(e) => setApplyToAllDistricts(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-amber-950 dark:text-amber-200 block">
                      Apply this tariff rule uniformly to ALL 33 districts across Chhattisgarh
                    </span>
                    <span className="text-[11px] text-amber-800 dark:text-amber-300/80">
                      When checked, saving will synchronize these exact pricing parameters to all revenue districts simultaneously.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Controls & Confirmation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <div className="text-xs">
                  {isSaved && (
                    <span className="text-emerald-700 dark:text-cg-green font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      <span>Tariff rules for {applyToAllDistricts ? 'ALL 33 Districts' : selectedDistrict} updated!</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save size={15} />
                    <span>{isSaving ? 'Saving Tariffs...' : `Save Tariff for ${applyToAllDistricts ? 'ALL 33 Districts' : selectedDistrict}`}</span>
                  </button>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>

      {/* Full 33-District Master Tariff Matrix Table */}
      <GlassCard
        title="Chhattisgarh 33-District Tariff Master Matrix"
        icon={Layers}
        moduleTag="STATEWIDE GAZETTE SCHEDULE"
      >
        <div className="space-y-3 font-sans text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              District-by-district gazette notification schedule and fee parameters. Click "Configure" to modify any district.
            </p>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter matrix by district..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">DISTRICT & LGD</th>
                  <th className="py-2.5 px-3">BASE TARIFF</th>
                  <th className="py-2.5 px-3">BASE KM</th>
                  <th className="py-2.5 px-3">EXTRA KM RATE</th>
                  <th className="py-2.5 px-3">GP CESS</th>
                  <th className="py-2.5 px-3">EMERGENCY MULT.</th>
                  <th className="py-2.5 px-3">EST. 3500L (10 KM)</th>
                  <th className="py-2.5 px-3">PROFILE STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-mono text-[11px]">
                {allDistricts
                  .filter(d => !tableSearch || d.toLowerCase().includes(tableSearch.toLowerCase()))
                  .map((d) => {
                    const t = getDistrictTariff(d);
                    const isCustom = t && (t.basePriceINR !== 800 || t.ratePerAdditionalKmINR !== 25);
                    const isSelected = selectedDistrict === d;

                    // Sample cost at 10km for 3500L tank
                    const extraKm = Math.max(0, 10 - (t.baseDistanceKm || 5));
                    const sampleCost = Math.round(((t.basePriceINR || 800) + extraKm * (t.ratePerAdditionalKmINR || 25)) * 1.4 + (t.gpAdministrativeFeeINR || 100));

                    return (
                      <tr
                        key={d}
                        className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${
                          isSelected ? 'bg-teal-50/50 dark:bg-teal-950/20' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MapPin size={12} className={isSelected ? 'text-teal-600' : 'text-slate-400'} />
                          <span>{d}</span>
                        </td>
                        <td className="py-2.5 px-3 text-teal-700 dark:text-teal-300 font-bold">
                          ₹{t.basePriceINR || 800}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {t.baseDistanceKm || 5} km
                        </td>
                        <td className="py-2.5 px-3 text-sky-700 dark:text-sky-300 font-medium">
                          +₹{t.ratePerAdditionalKmINR || 25}/km
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          ₹{t.gpAdministrativeFeeINR || 100}
                        </td>
                        <td className="py-2.5 px-3 text-amber-700 dark:text-amber-400">
                          {t.emergencyMultiplier || 1.25}x
                        </td>
                        <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                          ₹{sampleCost}
                        </td>
                        <td className="py-2.5 px-3">
                          {isCustom ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              CUSTOM PROFILE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] text-slate-500 bg-slate-100 dark:bg-white/5">
                              GOVT BENCHMARK
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDistrict(d);
                              setApplyToAllDistricts(false);
                              window.scrollTo({ top: 120, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white dark:bg-white/10 dark:hover:bg-teal-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                          >
                            Configure
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
