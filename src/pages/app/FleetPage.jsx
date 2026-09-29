import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { StatusChip } from '../../components/common/StatusChip';
import { Truck, Plus, ShieldCheck, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';

export const FleetPage = () => {
  const { vehicles, setVehicles } = useFsm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    regNo: 'CG-04-NX-5520',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorName: 'Shree Mahamaya Sanitation Services',
    driverName: 'Kailash Sahu',
    driverPhone: '9826188331',
    gpsDeviceId: 'TRQ-CG-8809',
    pucExpiry: '2027-05-20',
    insuranceExpiry: '2027-07-15',
    fitnessExpiry: '2027-09-10',
    district: 'Raipur (378)'
  });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const created = {
      ...newVehicle,
      id: `veh_${Date.now()}`,
      currentLat: 21.2514,
      currentLng: 81.6296,
      speedKmh: 0,
      headingDeg: 0,
      status: 'AVAILABLE'
    };
    setVehicles([created, ...vehicles]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">FLEET & COMPLIANCE</DataTag>
            <DataTag color="amber">AUTO-SUSPEND CRON ACTIVE</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Desludging Fleet Registry & Compliance
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Onboard New Vehicle</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((veh) => {
          const isFitnessValid = new Date(veh.fitnessExpiry) > new Date();
          const isInsuranceValid = new Date(veh.insuranceExpiry) > new Date();
          const isPucValid = new Date(veh.pucExpiry) > new Date();
          const isFullyCompliant = isFitnessValid && isInsuranceValid && isPucValid;

          return (
            <GlassCard
              key={veh.id}
              title={veh.regNo}
              icon={Truck}
              moduleTag={veh.type}
            >
              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">GPS Device ID:</span>
                  <strong className="font-mono text-sky-700 dark:text-cg-cyan">{veh.gpsDeviceId}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Capacity:</span>
                    <strong className="text-slate-900 dark:text-white">{veh.capacityLitres} Litres</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Driver:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{veh.driverName} ({veh.driverPhone})</span>
                  </div>
                  <div className="flex justify-between">
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
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddVehicle} className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 border border-slate-200 dark:border-cg-teal space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Onboard Desludging Vehicle</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Registration No</label>
                <input
                  type="text"
                  value={newVehicle.regNo}
                  onChange={(e) => setNewVehicle({ ...newVehicle, regNo: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Vehicle Type</label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                >
                  <option value="VACUUM_TRUCK">Vacuum Truck (4000L)</option>
                  <option value="TRACTOR_MOUNTED">Tractor Mounted (3000L)</option>
                  <option value="MINI_UNIT">Mini Vacuum Unit (1500L)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Capacity (Litres)</label>
                <input
                  type="number"
                  value={newVehicle.capacityLitres}
                  onChange={(e) => setNewVehicle({ ...newVehicle, capacityLitres: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">TraqIndia GPS Device ID</label>
                <input
                  type="text"
                  value={newVehicle.gpsDeviceId}
                  onChange={(e) => setNewVehicle({ ...newVehicle, gpsDeviceId: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Assigned Driver Name</label>
                <input
                  type="text"
                  value={newVehicle.driverName}
                  onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Driver Mobile</label>
                <input
                  type="text"
                  value={newVehicle.driverPhone}
                  onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 dark:bg-white/10 dark:text-white border border-slate-200 dark:border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-xs font-bold text-white shadow-md"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
