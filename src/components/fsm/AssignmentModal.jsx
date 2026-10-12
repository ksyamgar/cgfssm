import React, { useState, useMemo } from 'react';
import { calculateDistanceKm, findNearestFstp } from '../../services/locationService';
import {
  Truck,
  Building2,
  MapPin,
  CheckCircle2,
  X,
  Navigation,
  Sparkles,
  Radio,
  Fuel,
  User,
  Phone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AssignmentModal = ({
  isOpen,
  onClose,
  request,
  vehicles = [],
  fstps = [],
  vendors = [],
  onConfirmAssignment
}) => {
  if (!isOpen || !request) return null;

  const citizenLat = request.latitude || 21.2514;
  const citizenLng = request.longitude || 81.6296;

  // Compute nearest FSTP dynamically
  const nearestFstp = useMemo(() => {
    return findNearestFstp(citizenLat, citizenLng, fstps) || fstps[0] || null;
  }, [citizenLat, citizenLng, fstps]);

  // Compute vehicles sorted by distance to citizen
  const vehiclesWithDistance = useMemo(() => {
    return vehicles
      .map((veh) => {
        const vLat = veh.currentLat || 21.2514;
        const vLng = veh.currentLng || 81.6296;
        const dist = calculateDistanceKm(citizenLat, citizenLng, vLat, vLng);
        return {
          ...veh,
          distanceKm: dist
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [vehicles, citizenLat, citizenLng]);

  // Initial state selection (defaults to closest)
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    vehiclesWithDistance[0]?.id || ''
  );
  const [selectedFstpId, setSelectedFstpId] = useState(
    request.targetFstpId || nearestFstp?.id || fstps[0]?.id || ''
  );

  const selectedVehicle = vehiclesWithDistance.find((v) => v.id === selectedVehicleId) || vehiclesWithDistance[0];
  const selectedFstp = fstps.find((f) => f.id === selectedFstpId) || nearestFstp;

  // Auto-assign nearest vehicle + FSTP
  const handleAutoAssign = () => {
    if (vehiclesWithDistance.length > 0) {
      setSelectedVehicleId(vehiclesWithDistance[0].id);
    }
    if (nearestFstp) {
      setSelectedFstpId(nearestFstp.id);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const chosenVendor =
      vendors.find((v) => v.id === selectedVehicle.vendorId) ||
      vendors[0] || { id: 'ven_01', name: 'Shree Mahamaya Sanitation Services' };

    const distanceToFstp = selectedFstp
      ? calculateDistanceKm(citizenLat, citizenLng, selectedFstp.lat, selectedFstp.lng)
      : (request.distanceToFstpKm || 12);

    onConfirmAssignment({
      assignedVendorId: chosenVendor.id,
      assignedVendorName: chosenVendor.name,
      assignedVehicleId: selectedVehicle.id,
      assignedVehicleNo: selectedVehicle.regNo,
      assignedDriverName: selectedVehicle.driverName || 'Designated Driver',
      driverPhone: selectedVehicle.driverPhone || '9876543210',
      targetFstpId: selectedFstp?.id,
      targetFstpName: selectedFstp?.name,
      distanceToFstpKm: distanceToFstp,
      vehicleDistanceToCitizenKm: selectedVehicle.distanceKm
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-transparent">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                GPS Smart Dispatch & Route Assignment
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Request #{request.requestNo} • Citizen: {request.citizenName} ({request.village})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-200">
          {/* Citizen Location Banner */}
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-sky-600 dark:text-sky-400 shrink-0" />
              <div>
                <div className="font-semibold text-sky-950 dark:text-sky-200">
                  Citizen Household GPS: {Number(citizenLat).toFixed(4)}, {Number(citizenLng).toFixed(4)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Location: {request.village}, {request.gp}, {request.district} • Tank: {request.tankVolumeLitres || 3000} L
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoAssign}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Sparkles size={13} />
              <span>Auto-Select Closest</span>
            </button>
          </div>

          {/* 1. Nearest Treatment Plant (FSTP/STP) Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 size={15} className="text-teal-600" />
                <span>1. Assign Treatment Facility (FSTP / STP)</span>
              </label>
              {nearestFstp && (
                <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-200 dark:border-transparent">
                  ★ Closest: {nearestFstp.name} ({nearestFstp.distanceKm} km away)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fstps.map((fstp) => {
                const dist = calculateDistanceKm(citizenLat, citizenLng, fstp.lat, fstp.lng);
                const isSelected = selectedFstpId === fstp.id;
                const isClosest = nearestFstp?.id === fstp.id;

                return (
                  <div
                    key={fstp.id}
                    onClick={() => setSelectedFstpId(fstp.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-500/15 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:border-teal-400 bg-white dark:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{fstp.name}</span>
                          {isClosest && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 px-1 rounded font-mono">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {fstp.location} • Type: {fstp.type || 'FSTP'}
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedFstpId(fstp.id)}
                        className="mt-1"
                      />
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-600 dark:text-slate-400">
                        Cap: {fstp.capacityKld || 15} KLD ({fstp.utilization || '42%'} full)
                      </span>
                      <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-0.5">
                        <Navigation size={11} />
                        {dist} km
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Select Desludging Vehicle & Driver */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck size={15} className="text-teal-600" />
                <span>2. Assign Desludging Vehicle & Driver</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Sorted by closest distance to citizen
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {vehiclesWithDistance.map((veh, idx) => {
                const isSelected = selectedVehicleId === veh.id;
                const isClosest = idx === 0;

                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-500/15 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:border-teal-300 bg-white dark:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedVehicleId(veh.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {veh.regNo}
                          </span>
                          {veh.isApiGps ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-500/30 text-sky-800 dark:text-sky-300 font-bold">
                              🛰️ Traq Live GPS
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                              Standard GPS
                            </span>
                          )}
                          {isClosest && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 px-1 rounded font-mono font-bold">
                              CLOSEST VEHICLE
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1">
                            <User size={11} />
                            {veh.driverName}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-slate-500">
                            <Phone size={11} />
                            {veh.driverPhone || '98261XXXXX'}
                          </span>
                          <span>• Cap: {veh.capacityLitres || 3000} L</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-teal-700 dark:text-teal-300 text-xs flex items-center justify-end gap-1">
                        <Navigation size={12} />
                        {veh.distanceKm} km
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {veh.status || 'AVAILABLE'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Summary */}
          {selectedVehicle && selectedFstp && (
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] space-y-1 font-mono">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1 text-xs">
                <Navigation size={13} className="text-teal-600" />
                <span>Computed Dispatch Logistics:</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Vehicle to Household Site:</span>
                <strong>{selectedVehicle.distanceKm} km</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Household to Treatment Plant ({selectedFstp.name}):</span>
                <strong>
                  {calculateDistanceKm(citizenLat, citizenLng, selectedFstp.lat, selectedFstp.lng)} km
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.01]"
          >
            <CheckCircle2 size={15} />
            <span>Confirm & Dispatch Vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
