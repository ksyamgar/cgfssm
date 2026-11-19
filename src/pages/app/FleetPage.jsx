import React, { useState, useEffect, useMemo } from 'react';
import { useFsm } from '../../context/FsmContext';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { useGeoScope } from '../../context/GeoScopeContext';
import { getBlocks, getGramPanchayats, getVillages } from '../../services/locationService';
import { apiService } from '../../services/apiService';
import { notifySuccess, notifyGpsSync, notifyInfo, notifyWarning } from '../../services/toastService';
import {
  Truck,
  Plus,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Radio,
  RefreshCw,
  MapPin,
  Edit2,
  Trash2,
  Users,
  Search,
  Check,
  X,
  Phone,
  UserPlus,
  Filter,
  IdCard,
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const FleetPage = () => {
  const { vehicles, syncTraqGps, addVehicle, editVehicle, removeVehicle, registerNewDriver } = useFsm();
  const { currentUser, currentRole } = useAuth();
  const { districts, hierarchyData, selectedDistrict } = useGeoScope();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Synchronization & filter state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [areaFilter, setAreaFilter] = useState('ALL'); // ALL, RURAL, URBAN
  const [searchQuery, setSearchQuery] = useState('');

  // Driver pool state
  const [driverList, setDriverList] = useState([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [driverDistrictFilter, setDriverDistrictFilter] = useState('ALL');
  const [isRegisteringDriver, setIsRegisteringDriver] = useState(false);

  // Driver registration form state
  const [driverFormData, setDriverFormData] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNo: '',
    designation: 'Vacuum Tanker Pilot',
    district: '',
    block: '',
    gp: '',
    village: ''
  });

  // Check if role is authorized to edit/delete/assign
  const isAuthorizedOfficial = ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'ADMIN'].includes(currentRole);

  const initialDistrict = selectedDistrict || (districts && districts[0]) || 'Raipur (378)';
  const initialBlocks = getBlocks(hierarchyData, initialDistrict);
  const initialBlock = initialBlocks[0] || 'Dharsiwa (3836)';
  const initialGps = getGramPanchayats(hierarchyData, initialDistrict, initialBlock);
  const initialGp = initialGps[0] || '';
  const initialVillages = (initialBlock && initialGp) ? getVillages(hierarchyData, initialDistrict, initialBlock, initialGp) : [];
  const initialVillage = initialVillages[0] || '';

  // Vehicle form state (for Add / Edit)
  const [formData, setFormData] = useState({
    regNo: 'CG-04-NX-5520',
    type: 'VACUUM_TRUCK',
    areaType: 'RURAL', // 'RURAL' or 'URBAN'
    capacityLitres: 4000,
    vendorName: 'Shree Mahamaya Sanitation Services',
    hasGpsDevice: true,
    gpsDeviceId: 'TRQ-CG-8809',
    pucExpiry: '2027-05-20',
    insuranceExpiry: '2027-07-15',
    fitnessExpiry: '2027-09-10',
    district: initialDistrict,
    block: initialBlock,
    gp: initialGp,
    village: initialVillage,
    assignedDrivers: []
  });

  // Fetch drivers from backend based on district filter
  const loadDrivers = async (filterDist) => {
    setIsLoadingDrivers(true);
    try {
      const res = await apiService.getDrivers(filterDist);
      setDriverList(res || []);
    } catch (err) {
      console.warn('Could not load drivers from API:', err);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  // Initial driver loading
  useEffect(() => {
    loadDrivers('ALL');
  }, []);

  // Compute cascading options for vehicle form
  const currentFormBlocks = useMemo(() => {
    return getBlocks(hierarchyData, formData.district);
  }, [hierarchyData, formData.district]);

  const currentFormGps = useMemo(() => {
    if (!formData.district || !formData.block) return [];
    return getGramPanchayats(hierarchyData, formData.district, formData.block);
  }, [hierarchyData, formData.district, formData.block]);

  const currentFormVillages = useMemo(() => {
    if (!formData.district || !formData.block || !formData.gp) return [];
    return getVillages(hierarchyData, formData.district, formData.block, formData.gp);
  }, [hierarchyData, formData.district, formData.block, formData.gp]);

  // Vehicle Form Cascading Handlers
  const handleFormDistrictChange = (d) => {
    const blocksForDist = getBlocks(hierarchyData, d);
    const firstBlock = blocksForDist[0] || '';
    const gpsForBlock = firstBlock ? getGramPanchayats(hierarchyData, d, firstBlock) : [];
    const firstGp = gpsForBlock[0] || '';
    const vilsForGp = (firstBlock && firstGp) ? getVillages(hierarchyData, d, firstBlock, firstGp) : [];
    const firstVil = vilsForGp[0] || '';

    setFormData(prev => ({
      ...prev,
      district: d,
      block: firstBlock,
      gp: firstGp,
      village: firstVil
    }));

    // Auto-update driver filter to vehicle's district by default
    setDriverDistrictFilter(d);
    loadDrivers(d);
  };

  const handleFormBlockChange = (b) => {
    const gpsForBlock = b ? getGramPanchayats(hierarchyData, formData.district, b) : [];
    const firstGp = gpsForBlock[0] || '';
    const vilsForGp = (b && firstGp) ? getVillages(hierarchyData, formData.district, b, firstGp) : [];
    const firstVil = vilsForGp[0] || '';

    setFormData(prev => ({
      ...prev,
      block: b,
      gp: firstGp,
      village: firstVil
    }));
  };

  const handleFormGpChange = (gp) => {
    const vilsForGp = (formData.block && gp) ? getVillages(hierarchyData, formData.district, formData.block, gp) : [];
    const firstVil = vilsForGp[0] || '';

    setFormData(prev => ({
      ...prev,
      gp: gp,
      village: firstVil
    }));
  };

  const handleFormVillageChange = (vil) => {
    setFormData(prev => ({
      ...prev,
      village: vil
    }));
  };

  // Driver Registration Form Cascading Handlers
  const currentDriverFormBlocks = useMemo(() => {
    return getBlocks(hierarchyData, driverFormData.district);
  }, [hierarchyData, driverFormData.district]);

  const currentDriverFormGps = useMemo(() => {
    if (!driverFormData.district || !driverFormData.block) return [];
    return getGramPanchayats(hierarchyData, driverFormData.district, driverFormData.block);
  }, [hierarchyData, driverFormData.district, driverFormData.block]);

  const currentDriverFormVillages = useMemo(() => {
    if (!driverFormData.district || !driverFormData.block || !driverFormData.gp) return [];
    return getVillages(hierarchyData, driverFormData.district, driverFormData.block, driverFormData.gp);
  }, [hierarchyData, driverFormData.district, driverFormData.block, driverFormData.gp]);

  const handleDriverDistrictChange = (d) => {
    const blocksForDist = getBlocks(hierarchyData, d);
    const firstBlock = blocksForDist[0] || '';
    const gpsForBlock = firstBlock ? getGramPanchayats(hierarchyData, d, firstBlock) : [];
    const firstGp = gpsForBlock[0] || '';
    const vilsForGp = (firstBlock && firstGp) ? getVillages(hierarchyData, d, firstBlock, firstGp) : [];
    const firstVil = vilsForGp[0] || '';

    setDriverFormData(prev => ({
      ...prev,
      district: d,
      block: firstBlock,
      gp: firstGp,
      village: firstVil
    }));
  };

  const handleDriverBlockChange = (b) => {
    const gpsForBlock = b ? getGramPanchayats(hierarchyData, driverFormData.district, b) : [];
    const firstGp = gpsForBlock[0] || '';
    const vilsForGp = (b && firstGp) ? getVillages(hierarchyData, driverFormData.district, b, firstGp) : [];
    const firstVil = vilsForGp[0] || '';

    setDriverFormData(prev => ({
      ...prev,
      block: b,
      gp: firstGp,
      village: firstVil
    }));
  };

  const handleDriverGpChange = (gp) => {
    const vilsForGp = (driverFormData.block && gp) ? getVillages(hierarchyData, driverFormData.district, driverFormData.block, gp) : [];
    const firstVil = vilsForGp[0] || '';

    setDriverFormData(prev => ({
      ...prev,
      gp: gp,
      village: firstVil
    }));
  };

  const handleDriverVillageChange = (vil) => {
    setDriverFormData(prev => ({
      ...prev,
      village: vil
    }));
  };

  // Open Driver Registration Modal
  const handleOpenDriverRegisterModal = (prefillDist) => {
    const targetDist = prefillDist || formData.district || initialDistrict;
    const blocksForDist = getBlocks(hierarchyData, targetDist);
    const firstBlock = blocksForDist[0] || '';
    const gpsForBlock = firstBlock ? getGramPanchayats(hierarchyData, targetDist, firstBlock) : [];
    const firstGp = gpsForBlock[0] || '';
    const vilsForGp = (firstBlock && firstGp) ? getVillages(hierarchyData, targetDist, firstBlock, firstGp) : [];
    const firstVil = vilsForGp[0] || '';

    setDriverFormData({
      name: '',
      phone: '',
      email: '',
      licenseNo: `CG-${Math.floor(10 + Math.random() * 89)}-2025-${Math.floor(100000 + Math.random() * 900000)}`,
      designation: 'Vacuum Tanker Pilot',
      district: targetDist,
      block: firstBlock,
      gp: firstGp,
      village: firstVil
    });
    setIsDriverModalOpen(true);
  };

  // Submit Driver Registration
  const handleRegisterDriverSubmit = async (e) => {
    e.preventDefault();
    if (!driverFormData.name.trim() || !driverFormData.phone.trim()) {
      notifyWarning('Please provide Driver Name and Mobile Number', 'Driver Registration');
      return;
    }

    setIsRegisteringDriver(true);
    try {
      const payload = {
        name: driverFormData.name.trim(),
        phone: driverFormData.phone.trim(),
        email: driverFormData.email?.trim() || `${driverFormData.phone.trim()}@cgfsms.gov.in`,
        licenseNo: driverFormData.licenseNo?.trim() || `DL-${driverFormData.phone.trim().slice(-6)}`,
        designation: driverFormData.designation || 'Vacuum Tanker Pilot',
        district: driverFormData.district || formData.district,
        block: driverFormData.block || formData.block,
        gp: driverFormData.gp || formData.gp,
        village: driverFormData.village || formData.village
      };

      const created = await registerNewDriver(payload);
      if (created) {
        notifySuccess(
          `Certified driver ${created.name} registered for ${created.district}.`,
          'Driver Successfully Registered'
        );

        // Auto-assign newly created driver to the vehicle
        setFormData(prev => {
          const alreadyAssigned = prev.assignedDrivers.some(d => d.id === created.id || d.phone === created.phone);
          if (!alreadyAssigned) {
            return {
              ...prev,
              assignedDrivers: [
                ...prev.assignedDrivers,
                {
                  id: created.id,
                  name: created.name,
                  phone: created.phone,
                  designation: created.designation,
                  district: created.district
                }
              ]
            };
          }
          return prev;
        });

        // Re-fetch drivers for the active filter
        await loadDrivers(driverDistrictFilter);
        setIsDriverModalOpen(false);
      }
    } catch (err) {
      notifyWarning(err.message || 'Driver registration failed', 'Error');
    } finally {
      setIsRegisteringDriver(false);
    }
  };

  // Toggle assigned driver in driver pool
  const toggleDriverAssignment = (driver) => {
    setFormData(prev => {
      const exists = prev.assignedDrivers.some(d => d.id === driver.id || (d.phone && d.phone === driver.phone) || d.name === driver.name);
      if (exists) {
        if (prev.assignedDrivers.length === 1) {
          notifyWarning('At least one driver should remain assigned to the vehicle.', 'Driver Selection');
          return prev;
        }
        return {
          ...prev,
          assignedDrivers: prev.assignedDrivers.filter(d => d.id !== driver.id && d.name !== driver.name && d.phone !== driver.phone)
        };
      } else {
        return {
          ...prev,
          assignedDrivers: [
            ...prev.assignedDrivers,
            {
              id: driver.id,
              name: driver.name,
              phone: driver.phone,
              designation: driver.designation,
              district: driver.district
            }
          ]
        };
      }
    });
  };

  // Filtered displayed drivers: combines fetched district pool + any already-assigned drivers so none disappear
  const displayedDrivers = useMemo(() => {
    const list = [...driverList];
    formData.assignedDrivers.forEach(assigned => {
      const alreadyInList = list.some(d => d.id === assigned.id || (d.phone && d.phone === assigned.phone));
      if (!alreadyInList) {
        list.unshift(assigned);
      }
    });
    return list;
  }, [driverList, formData.assignedDrivers]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const targetDist = selectedDistrict || (districts && districts[0]) || 'Raipur (378)';
    const blocksForDist = getBlocks(hierarchyData, targetDist);
    const firstBlock = blocksForDist[0] || '';
    const gpsForBlock = firstBlock ? getGramPanchayats(hierarchyData, targetDist, firstBlock) : [];
    const firstGp = gpsForBlock[0] || '';
    const vilsForGp = (firstBlock && firstGp) ? getVillages(hierarchyData, targetDist, firstBlock, firstGp) : [];
    const firstVil = vilsForGp[0] || '';

    setFormData({
      regNo: `CG-04-NX-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'VACUUM_TRUCK',
      areaType: 'RURAL',
      capacityLitres: 4000,
      vendorName: 'Shree Mahamaya Sanitation Services',
      hasGpsDevice: true,
      gpsDeviceId: `TRQ-CG-${Math.floor(1000 + Math.random() * 9000)}`,
      pucExpiry: '2027-05-20',
      insuranceExpiry: '2027-07-15',
      fitnessExpiry: '2027-09-10',
      district: targetDist,
      block: firstBlock,
      gp: firstGp,
      village: firstVil,
      assignedDrivers: []
    });

    setDriverDistrictFilter(targetDist);
    loadDrivers(targetDist);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal with prefilled vehicle data down to village
  const handleOpenEdit = (veh) => {
    const assigned = veh.assignedDrivers && veh.assignedDrivers.length > 0
      ? veh.assignedDrivers
      : (veh.driverName ? [{ id: veh.driverId || 'drv_1', name: veh.driverName, phone: veh.driverPhone || '' }] : []);

    const vehDist = veh.district || initialDistrict;
    const blocksForDist = getBlocks(hierarchyData, vehDist);
    const vehBlock = veh.block || blocksForDist[0] || '';
    const gpsForBlock = vehBlock ? getGramPanchayats(hierarchyData, vehDist, vehBlock) : [];
    const vehGp = veh.gp || gpsForBlock[0] || '';
    const vilsForGp = (vehBlock && vehGp) ? getVillages(hierarchyData, vehDist, vehBlock, vehGp) : [];
    const vehVil = veh.village || vilsForGp[0] || '';

    setVehicleToEdit(veh);
    setFormData({
      id: veh.id,
      regNo: veh.regNo,
      type: veh.type || 'VACUUM_TRUCK',
      areaType: veh.areaType || 'RURAL',
      capacityLitres: veh.capacityLitres || 4000,
      vendorName: veh.vendorName || 'Empaneled Sanitation Fleet',
      hasGpsDevice: !!veh.hasGpsDevice,
      gpsDeviceId: veh.gpsDeviceId || '',
      pucExpiry: veh.pucExpiry || '2027-05-20',
      insuranceExpiry: veh.insuranceExpiry || '2027-07-15',
      fitnessExpiry: veh.fitnessExpiry || '2027-09-10',
      district: vehDist,
      block: vehBlock,
      gp: vehGp,
      village: vehVil,
      assignedDrivers: assigned
    });

    setDriverDistrictFilter(vehDist);
    loadDrivers(vehDist);
    setIsEditModalOpen(true);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncTraqGps();
      if (res.success) {
        setSyncStatus(`Successfully synced ${res.count} fleet vehicles with TraqIndia API`);
        notifyGpsSync(res.count, 'app.traqindia.com');
      } else {
        setSyncStatus(`TraqIndia sync active (using live telemetry stream)`);
        notifyInfo('Telemetry stream active with cached coordinates', 'GPS Status');
      }
    } catch {
      setSyncStatus('Sync complete');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const primaryDriver = formData.assignedDrivers[0] || { id: 'usr_driver', name: 'Ramesh Patel', phone: '9826100008' };
    const payload = {
      ...formData,
      id: `veh_${Date.now()}`,
      gpsSource: formData.hasGpsDevice ? 'TRAQINDIA_HARDWARE' : 'MOBILE_APP',
      currentLat: 21.2514,
      currentLng: 81.6296,
      speedKmh: 0,
      headingDeg: 0,
      status: 'AVAILABLE',
      driverId: primaryDriver.id,
      driverName: primaryDriver.name,
      driverPhone: primaryDriver.phone
    };

    await addVehicle(payload);
    setIsAddModalOpen(false);
    notifySuccess(
      `Vehicle ${payload.regNo} (${payload.areaType} • ${payload.capacityLitres}L) onboarded for ${payload.district} down to ${payload.village || payload.gp || payload.block || 'village'} level.`,
      'Vehicle Added to Registry'
    );
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleToEdit) return;

    const primaryDriver = formData.assignedDrivers[0] || { id: 'usr_driver', name: 'Ramesh Patel', phone: '9826100008' };
    const payload = {
      ...formData,
      driverId: primaryDriver.id,
      driverName: primaryDriver.name,
      driverPhone: primaryDriver.phone
    };

    await editVehicle(vehicleToEdit.id, payload);
    setIsEditModalOpen(false);
    setVehicleToEdit(null);
    notifySuccess(
      `Vehicle ${payload.regNo} details & driver roster successfully updated.`,
      'Vehicle Updated'
    );
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    await removeVehicle(vehicleToDelete.id);
    notifySuccess(`Vehicle ${vehicleToDelete.regNo} removed from registry.`, 'Vehicle Deleted');
    setVehicleToDelete(null);
  };

  // Filter vehicles by area type and search query
  const filteredVehicles = vehicles.filter(v => {
    if (areaFilter !== 'ALL' && (v.areaType || 'RURAL') !== areaFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchReg = v.regNo?.toLowerCase().includes(q);
      const matchDist = v.district?.toLowerCase().includes(q);
      const matchBlock = v.block?.toLowerCase().includes(q);
      const matchGp = v.gp?.toLowerCase().includes(q);
      const matchVil = v.village?.toLowerCase().includes(q);
      const matchDriver = v.driverName?.toLowerCase().includes(q) || (v.assignedDrivers || []).some(d => d.name?.toLowerCase().includes(q));
      if (!matchReg && !matchDist && !matchBlock && !matchGp && !matchVil && !matchDriver) return false;
    }
    return true;
  });

  const hardwareCount = vehicles.filter(v => v.hasGpsDevice).length;
  const ruralCount = vehicles.filter(v => (v.areaType || 'RURAL') === 'RURAL').length;
  const urbanCount = vehicles.filter(v => (v.areaType || 'RURAL') === 'URBAN').length;

  return (
    <div className="space-y-6">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DataTag color="teal">FLEET & COMPLIANCE</DataTag>
            <DataTag color="green">TRAQINDIA INTEGRATED</DataTag>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 font-bold">
              🛰️ {hardwareCount}/{vehicles.length} Hardware GPS Trackers
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold">
              🌾 {ruralCount} Rural Units
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 font-bold">
              🏙️ {urbanCount} Urban Units
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Desludging Fleet Registry & Compliance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            District → Block → Gram Panchayat → Village jurisdiction management with multi-driver roster allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-white/10 flex items-center gap-1.5 transition-all"
            title="Poll TraqIndia API and sync devices"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync TraqIndia API'}</span>
          </button>

          {isAuthorizedOfficial && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus size={16} />
              <span>Onboard New Vehicle</span>
            </button>
          )}
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-500/40 text-teal-900 dark:text-teal-200 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-teal-600 dark:text-teal-400" />
            <span>{syncStatus}</span>
          </div>
          <span className="text-[10px] font-bold">LIVE TELEMETRY ACTIVE</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-clean">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">Filter Area:</span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/10 p-1 text-xs font-semibold">
            <button
              onClick={() => setAreaFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${areaFilter === 'ALL' ? 'bg-white dark:bg-teal-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              All ({vehicles.length})
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
            placeholder="Search reg no, driver, district, block, GP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((veh) => {
          const isFitnessValid = new Date(veh.fitnessExpiry) > new Date();
          const isInsuranceValid = new Date(veh.insuranceExpiry) > new Date();
          const isPucValid = new Date(veh.pucExpiry) > new Date();
          const isFullyCompliant = isFitnessValid && isInsuranceValid && isPucValid;
          const isRural = (veh.areaType || 'RURAL') === 'RURAL';

          // Multi-driver display
          const driversList = veh.assignedDrivers && veh.assignedDrivers.length > 0
            ? veh.assignedDrivers
            : (veh.driverName ? [{ id: veh.driverId || 'drv_1', name: veh.driverName, phone: veh.driverPhone || '' }] : []);

          return (
            <GlassCard
              key={veh.id}
              title={veh.regNo}
              icon={Truck}
              moduleTag={veh.type}
            >
              <div className="space-y-3.5 text-xs font-sans">
                {/* Area Badge & GPS Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isRural
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                      : 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40'
                  }`}>
                    {isRural ? '🌾 Rural Operating Unit' : '🏙️ Urban Operating Unit'}
                  </span>

                  <StatusChip status={veh.status || 'AVAILABLE'} />
                </div>

                {/* GPS Hardware vs Mobile Indicator */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {veh.hasGpsDevice ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 font-mono text-[10px] font-bold border border-teal-300 dark:border-teal-500/40">
                        <Radio size={11} className="text-teal-600 animate-pulse" />
                        <span>🛰️ HARDWARE GPS</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-mono text-[10px] font-semibold border border-amber-300 dark:border-amber-500/30">
                        <span>📲 DRIVER APP GPS</span>
                      </span>
                    )}
                  </div>
                  <strong className="font-mono text-[11px] text-sky-700 dark:text-sky-300">
                    {veh.gpsDeviceId || 'N/A'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Capacity:</span>
                    <strong className="text-slate-900 dark:text-white">{veh.capacityLitres} Litres</strong>
                  </div>

                  {/* Complete 4-tier location breakdown */}
                  <div className="pt-1.5 border-t border-slate-200 dark:border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                        <MapPin size={12} className="text-teal-600" />
                        <span>Operating Jurisdiction:</span>
                      </span>
                      <strong className="text-slate-900 dark:text-white font-medium">{veh.district}</strong>
                    </div>

                    {(veh.block || veh.gp || veh.village) && (
                      <div className="p-2 rounded-lg bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-500/20 text-[11px] space-y-0.5">
                        <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono text-[10.5px]">
                          <span className="text-slate-500">Block:</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{veh.block || 'All Blocks'}</span>
                        </div>
                        {veh.gp && (
                          <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono text-[10.5px]">
                            <span className="text-slate-500">GP:</span>
                            <span className="font-semibold text-teal-700 dark:text-teal-300">{veh.gp}</span>
                          </div>
                        )}
                        {veh.village && (
                          <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono text-[10.5px]">
                            <span className="text-slate-500">Village:</span>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300">{veh.village}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Multi-Driver Pool Display */}
                  <div className="pt-1.5 border-t border-slate-200 dark:border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                        <Users size={12} className="text-teal-600" />
                        <span>Assigned Drivers ({driversList.length}):</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {driversList.map((d, idx) => (
                        <div
                          key={d.id || idx}
                          className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-900 dark:text-teal-200 text-[11px] flex items-center gap-1"
                        >
                          <span className="font-medium">{d.name}</span>
                          <span className="text-[10px] opacity-75 font-mono">({d.phone})</span>
                          {idx === 0 && (
                            <span className="text-[9px] bg-teal-600 text-white px-1 rounded font-bold">PRIMARY</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Operator:</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{veh.vendorName}</span>
                  </div>
                </div>

                {/* Compliance Documents Strip */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>DOCUMENT COMPLIANCE:</span>
                    {isFullyCompliant ? (
                      <span className="text-emerald-700 dark:text-cg-green font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>VALID</span>
                      </span>
                    ) : (
                      <span className="text-red-700 dark:text-cg-red font-bold flex items-center gap-1">
                        <AlertTriangle size={12} />
                        <span>SUSPENDED</span>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                    <div className="p-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                      <div>PUC</div>
                      <div className="text-teal-700 dark:text-cg-teal font-bold">{veh.pucExpiry}</div>
                    </div>
                    <div className="p-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                      <div>INSURANCE</div>
                      <div className="text-teal-700 dark:text-cg-teal font-bold">{veh.insuranceExpiry}</div>
                    </div>
                    <div className="p-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                      <div>FITNESS</div>
                      <div className="text-teal-700 dark:text-cg-teal font-bold">{veh.fitnessExpiry}</div>
                    </div>
                  </div>
                </div>

                {/* Official Actions: Edit / Assign Drivers / Delete */}
                {isAuthorizedOfficial && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleOpenEdit(veh)}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Edit vehicle, location & assign drivers"
                    >
                      <Edit2 size={13} />
                      <span>Edit & Assign Drivers</span>
                    </button>
                    <button
                      onClick={() => setVehicleToDelete(veh)}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-all"
                      title="Delete vehicle"
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

      {/* Onboard / Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleAddSubmit} className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 space-y-4 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="text-teal-600" size={20} />
                  <span>Onboard Desludging Vehicle</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Register vehicle down to Village level & assign certified pilots
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Registration No *</label>
                <input
                  type="text"
                  value={formData.regNo}
                  onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Vehicle Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                >
                  <option value="VACUUM_TRUCK">Vacuum Truck (4000L)</option>
                  <option value="TRACTOR_MOUNTED">Tractor Mounted (3000L)</option>
                  <option value="MINI_UNIT">Mini Vacuum Unit (1500L)</option>
                </select>
              </div>

              {/* RURAL vs URBAN Selection Option */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
                <label className="text-slate-800 dark:text-white font-bold block mb-1">
                  Operating Service Jurisdiction (Rural or Urban) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formData.areaType === 'RURAL'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="areaType"
                      value="RURAL"
                      checked={formData.areaType === 'RURAL'}
                      onChange={() => setFormData({ ...formData, areaType: 'RURAL' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div>🌾 Rural Vehicle</div>
                      <div className="text-[10px] font-normal opacity-75">Gram Panchayats & Village Clusters</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formData.areaType === 'URBAN'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-bold'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="areaType"
                      value="URBAN"
                      checked={formData.areaType === 'URBAN'}
                      onChange={() => setFormData({ ...formData, areaType: 'URBAN' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div>🏙️ Urban Vehicle</div>
                      <div className="text-[10px] font-normal opacity-75">Municipal / ULB & Peri-Urban Areas</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Capacity (Litres)</label>
                <input
                  type="number"
                  value={formData.capacityLitres}
                  onChange={(e) => setFormData({ ...formData, capacityLitres: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator / Vendor</label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                />
              </div>

              {/* Hardware GPS Option Toggle */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 dark:text-white font-bold flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasGpsDevice}
                      onChange={(e) => setFormData({ ...formData, hasGpsDevice: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>🛰️ TraqIndia Hardware GPS Tracker Installed</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.hasGpsDevice ? 'Live Hardware Sync' : 'Mobile GPS (Upgrade Later)'}
                  </span>
                </div>

                {formData.hasGpsDevice && (
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      TraqIndia Device ID / IMEI
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TRQ-1001 or numeric Device ID"
                      value={formData.gpsDeviceId}
                      onChange={(e) => setFormData({ ...formData, gpsDeviceId: e.target.value })}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 4-TIER LOCATION HIERARCHY (District -> Block -> GP -> Village) */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 dark:text-white font-bold flex items-center gap-1.5 text-xs">
                    <MapPin size={14} className="text-teal-600" />
                    <span>Operational Jurisdiction (District → Block → GP → Village) *</span>
                  </label>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                    {formData.areaType === 'RURAL' ? '🌾 Rural Coverage Tier' : '🏙️ Urban Coverage Tier'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {/* 1. District */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      1. District (जिला) *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleFormDistrictChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                      required
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Block */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      2. Block (विकासखंड) *
                    </label>
                    <select
                      value={formData.block}
                      onChange={(e) => handleFormBlockChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                      required
                    >
                      <option value="">-- Select Block --</option>
                      {currentFormBlocks.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Gram Panchayat (GP) */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      3. Gram Panchayat (GP)
                    </label>
                    <select
                      value={formData.gp}
                      onChange={(e) => handleFormGpChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                    >
                      <option value="">-- All GPs in Block --</option>
                      {currentFormGps.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Village */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      4. Village (गाँव / ग्राम)
                    </label>
                    <select
                      value={formData.village}
                      onChange={(e) => handleFormVillageChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                    >
                      <option value="">-- All Villages in GP --</option>
                      {currentFormVillages.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Trail Indicator */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-teal-50/70 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-200/60 dark:border-teal-500/20 flex flex-wrap items-center gap-1">
                  <span className="font-semibold text-teal-800 dark:text-teal-300">Coverage Jurisdiction:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formData.district || 'Any'}</span>
                  <span>→</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formData.block || 'All Blocks'}</span>
                  {formData.gp && (
                    <>
                      <span>→</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formData.gp}</span>
                    </>
                  )}
                  {formData.village && (
                    <>
                      <span>→</span>
                      <span className="font-medium text-teal-700 dark:text-teal-300 font-semibold">{formData.village}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Multi-Driver Assignment & District Pool Selector */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-slate-800 dark:text-white font-bold flex items-center gap-1.5 text-xs">
                      <Users size={14} className="text-teal-600" />
                      <span>Assigned Drivers Pool (Multi-Driver Allocation)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Showing drivers for <strong>{driverDistrictFilter === 'ALL' ? 'All Districts' : driverDistrictFilter}</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* District Dropdown to filter or assign from other districts */}
                    <div className="flex items-center gap-1">
                      <Filter size={12} className="text-slate-400" />
                      <select
                        value={driverDistrictFilter}
                        onChange={(e) => {
                          setDriverDistrictFilter(e.target.value);
                          loadDrivers(e.target.value);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
                      >
                        <option value={formData.district}>📍 Vehicle District: {formData.district}</option>
                        <option value="ALL">🌐 All Districts (Statewide)</option>
                        <optgroup label="Select Other District">
                          {districts.filter(d => d !== formData.district).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Button to Register New Driver */}
                    <button
                      type="button"
                      onClick={() => handleOpenDriverRegisterModal(formData.district)}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <UserPlus size={13} />
                      <span>+ Register Driver</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-white/5">
                  <span>Select 1 or more pilots. Operator will stage the collection with an available driver:</span>
                  <span className="text-teal-700 dark:text-teal-400 font-bold">
                    {formData.assignedDrivers.length} Selected
                  </span>
                </div>

                {isLoadingDrivers ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-teal-600" />
                    <span>Loading certified drivers...</span>
                  </div>
                ) : displayedDrivers.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-center text-xs text-slate-500 space-y-2">
                    <p>No certified drivers registered for {driverDistrictFilter === 'ALL' ? 'selected filter' : driverDistrictFilter} yet.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenDriverRegisterModal(driverDistrictFilter === 'ALL' ? formData.district : driverDistrictFilter)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <UserPlus size={13} />
                      <span>Register First Driver Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
                    {displayedDrivers.map((driver) => {
                      const isSelected = formData.assignedDrivers.some(d => d.id === driver.id || (d.phone && d.phone === driver.phone) || d.name === driver.name);
                      return (
                        <div
                          key={driver.id}
                          onClick={() => toggleDriverAssignment(driver)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200'
                              : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="font-semibold text-xs flex items-center gap-1.5 truncate">
                              <span className="truncate">{driver.name}</span>
                              {isSelected && <Check size={12} className="text-teal-600 shrink-0" />}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone size={10} className="shrink-0" />
                              <span>{driver.phone}</span>
                            </div>
                            {driver.district && (
                              <div className="text-[9.5px] text-slate-400 dark:text-slate-500 truncate">
                                📍 {driver.district}
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                          }`}>
                            {isSelected ? 'Assigned' : 'Assign'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 dark:bg-white/10 dark:text-white border border-slate-200 dark:border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-md transition-all"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Vehicle & Driver Assignment Modal */}
      {isEditModalOpen && vehicleToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 space-y-4 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="text-teal-600" size={18} />
                  <span>Update Vehicle: {vehicleToEdit.regNo}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Update coverage jurisdiction down to Village level & assign pilots
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsEditModalOpen(false); setVehicleToEdit(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Registration No</label>
                <input
                  type="text"
                  value={formData.regNo}
                  onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Vehicle Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                >
                  <option value="VACUUM_TRUCK">Vacuum Truck (4000L)</option>
                  <option value="TRACTOR_MOUNTED">Tractor Mounted (3000L)</option>
                  <option value="MINI_UNIT">Mini Vacuum Unit (1500L)</option>
                </select>
              </div>

              {/* RURAL vs URBAN Selection Option */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
                <label className="text-slate-800 dark:text-white font-bold block mb-1">
                  Operating Service Jurisdiction (Rural or Urban) *
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
                      <div>🌾 Rural Vehicle</div>
                      <div className="text-[10px] font-normal opacity-75">Gram Panchayats & Village Clusters</div>
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
                      <div>🏙️ Urban Vehicle</div>
                      <div className="text-[10px] font-normal opacity-75">Municipal / ULB & Peri-Urban Areas</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Capacity (Litres)</label>
                <input
                  type="number"
                  value={formData.capacityLitres}
                  onChange={(e) => setFormData({ ...formData, capacityLitres: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Operator / Vendor</label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                />
              </div>

              {/* 4-TIER LOCATION HIERARCHY (District -> Block -> GP -> Village) */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 dark:text-white font-bold flex items-center gap-1.5 text-xs">
                    <MapPin size={14} className="text-teal-600" />
                    <span>Operational Jurisdiction (District → Block → GP → Village) *</span>
                  </label>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                    {formData.areaType === 'RURAL' ? '🌾 Rural Coverage Tier' : '🏙️ Urban Coverage Tier'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {/* 1. District */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      1. District (जिला) *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleFormDistrictChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                      required
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Block */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      2. Block (विकासखंड) *
                    </label>
                    <select
                      value={formData.block}
                      onChange={(e) => handleFormBlockChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                      required
                    >
                      <option value="">-- Select Block --</option>
                      {currentFormBlocks.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Gram Panchayat (GP) */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      3. Gram Panchayat (GP)
                    </label>
                    <select
                      value={formData.gp}
                      onChange={(e) => handleFormGpChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                    >
                      <option value="">-- All GPs in Block --</option>
                      {currentFormGps.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Village */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium text-[11px]">
                      4. Village (गाँव / ग्राम)
                    </label>
                    <select
                      value={formData.village}
                      onChange={(e) => handleFormVillageChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                    >
                      <option value="">-- All Villages in GP --</option>
                      {currentFormVillages.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Trail Indicator */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-teal-50/70 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-200/60 dark:border-teal-500/20 flex flex-wrap items-center gap-1">
                  <span className="font-semibold text-teal-800 dark:text-teal-300">Coverage Jurisdiction:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formData.district || 'Any'}</span>
                  <span>→</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formData.block || 'All Blocks'}</span>
                  {formData.gp && (
                    <>
                      <span>→</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formData.gp}</span>
                    </>
                  )}
                  {formData.village && (
                    <>
                      <span>→</span>
                      <span className="font-medium text-teal-700 dark:text-teal-300 font-semibold">{formData.village}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Multi-Driver Assignment & District Pool Selector in Edit Modal */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-slate-800 dark:text-white font-bold flex items-center gap-1.5 text-xs">
                      <Users size={14} className="text-teal-600" />
                      <span>Assigned Drivers Pool (Multi-Driver Assignment)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Showing drivers for <strong>{driverDistrictFilter === 'ALL' ? 'All Districts' : driverDistrictFilter}</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* District Dropdown to filter or assign from other districts */}
                    <div className="flex items-center gap-1">
                      <Filter size={12} className="text-slate-400" />
                      <select
                        value={driverDistrictFilter}
                        onChange={(e) => {
                          setDriverDistrictFilter(e.target.value);
                          loadDrivers(e.target.value);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
                      >
                        <option value={formData.district}>📍 Vehicle District: {formData.district}</option>
                        <option value="ALL">🌐 All Districts (Statewide)</option>
                        <optgroup label="Select Other District">
                          {districts.filter(d => d !== formData.district).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Button to Register New Driver */}
                    <button
                      type="button"
                      onClick={() => handleOpenDriverRegisterModal(formData.district)}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <UserPlus size={13} />
                      <span>+ Register Driver</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-white/5">
                  <span>Select 1 or more certified pilots to operate this vehicle:</span>
                  <span className="text-teal-700 dark:text-teal-400 font-bold">
                    {formData.assignedDrivers.length} Assigned
                  </span>
                </div>

                {isLoadingDrivers ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-teal-600" />
                    <span>Loading certified drivers...</span>
                  </div>
                ) : displayedDrivers.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-center text-xs text-slate-500 space-y-2">
                    <p>No certified drivers registered for {driverDistrictFilter === 'ALL' ? 'selected filter' : driverDistrictFilter} yet.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenDriverRegisterModal(driverDistrictFilter === 'ALL' ? formData.district : driverDistrictFilter)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <UserPlus size={13} />
                      <span>Register First Driver Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
                    {displayedDrivers.map((driver) => {
                      const isSelected = formData.assignedDrivers.some(d => d.id === driver.id || (d.phone && d.phone === driver.phone) || d.name === driver.name);
                      return (
                        <div
                          key={driver.id}
                          onClick={() => toggleDriverAssignment(driver)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200'
                              : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="font-semibold text-xs flex items-center gap-1.5 truncate">
                              <span className="truncate">{driver.name}</span>
                              {isSelected && <Check size={12} className="text-teal-600 shrink-0" />}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone size={10} className="shrink-0" />
                              <span>{driver.phone}</span>
                            </div>
                            {driver.district && (
                              <div className="text-[9.5px] text-slate-400 dark:text-slate-500 truncate">
                                📍 {driver.district}
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                          }`}>
                            {isSelected ? 'Assigned' : 'Assign'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => { setIsEditModalOpen(false); setVehicleToEdit(null); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 dark:bg-white/10 dark:text-white border border-slate-200 dark:border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Register New Driver Modal */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleRegisterDriverSubmit} className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 space-y-4 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="text-teal-600" size={20} />
                  <span>Register Certified Fleet Driver</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add driver details, DL verification & geographic jurisdiction
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDriverModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Full Name (चालक का नाम) *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={driverFormData.name}
                  onChange={(e) => setDriverFormData({ ...driverFormData, name: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Mobile Number (मोबाइल नं.) *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9826188990"
                  value={driverFormData.phone}
                  onChange={(e) => setDriverFormData({ ...driverFormData, phone: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Commercial DL Number (लाइसेंस नं.) *</label>
                <input
                  type="text"
                  placeholder="e.g. CG-04-2024-009871"
                  value={driverFormData.licenseNo}
                  onChange={(e) => setDriverFormData({ ...driverFormData, licenseNo: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Designation / Role</label>
                <select
                  value={driverFormData.designation}
                  onChange={(e) => setDriverFormData({ ...driverFormData, designation: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                >
                  <option value="Vacuum Tanker Pilot">Vacuum Tanker Pilot</option>
                  <option value="Desludging Specialist Pilot">Desludging Specialist Pilot</option>
                  <option value="Heavy Vehicle Pilot">Heavy Vehicle Pilot</option>
                  <option value="Mini Vacuum Unit Pilot">Mini Vacuum Unit Pilot</option>
                  <option value="Sanitation Fleet Driver">Sanitation Fleet Driver</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. driver@cgfsms.gov.in"
                  value={driverFormData.email}
                  onChange={(e) => setDriverFormData({ ...driverFormData, email: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                />
              </div>

              {/* Driver Operating Jurisdiction */}
              <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
                <label className="text-slate-800 dark:text-white font-bold block text-xs flex items-center gap-1.5">
                  <MapPin size={13} className="text-teal-600" />
                  <span>Driver Base Jurisdiction (District → Block → GP → Village)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">District *</label>
                    <select
                      value={driverFormData.district}
                      onChange={(e) => handleDriverDistrictChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">Block *</label>
                    <select
                      value={driverFormData.block}
                      onChange={(e) => handleDriverBlockChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      <option value="">-- Select Block --</option>
                      {currentDriverFormBlocks.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">Gram Panchayat</label>
                    <select
                      value={driverFormData.gp}
                      onChange={(e) => handleDriverGpChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      <option value="">-- All GPs --</option>
                      {currentDriverFormGps.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">Village</label>
                    <select
                      value={driverFormData.village}
                      onChange={(e) => handleDriverVillageChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      <option value="">-- All Villages --</option>
                      {currentDriverFormVillages.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsDriverModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 dark:bg-white/10 dark:text-white border border-slate-200 dark:border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRegisteringDriver}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all"
              >
                {isRegisteringDriver ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Register & Assign Driver</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-2xl p-6 border border-red-300 dark:border-red-500/40 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Delete Vehicle</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Are you sure you want to remove <strong className="font-mono text-slate-900 dark:text-white">{vehicleToDelete.regNo}</strong> from the active fleet registry?
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setVehicleToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs text-slate-800 dark:text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs text-white font-bold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
