import React, { useState } from 'react';
import {
  X,
  Truck,
  Radio,
  Fuel,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Gauge,
  Phone,
  Navigation,
  DollarSign,
  Activity,
  Layers,
  CheckCircle2,
  ExternalLink,
  Download,
  Flame,
  BatteryCharging,
  Maximize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { StatusChip } from '../common/StatusChip';
import { DataTag } from '../common/DataTag';
import { calculateDistanceKm } from '../../services/traqIndia';

// Helper to generate deterministic synthetic telemetry metrics based on vehicle ID/regNo
const getVehicleAnalytics = (veh) => {
  if (!veh) return null;
  const seed = (veh.id || veh.regNo || 'veh').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  const isMoving = veh.speedKmh > 0;
  const runningKm = Number(((seed % 35) + (isMoving ? 38.5 : 19.2)).toFixed(1));
  const weeklyKm = Math.round(runningKm * 6.3);
  const monthlyKm = Math.round(runningKm * 25.4);

  const isMini = veh.type === 'MINI_UNIT' || veh.regNo?.includes('ERICKSHAW');
  const fuelCapacityLitres = isMini ? 40 : 120;
  const mileageKmL = isMini ? 8.5 : 4.2;
  const fuelUsedLitres = Number((runningKm / mileageKmL).toFixed(1));
  const fuelRateInr = 95.5; // CG diesel rate / electricity equivalent
  const fuelCostInr = Math.round(fuelUsedLitres * fuelRateInr);

  const tripsCount = runningKm > 40 ? 3 : (runningKm > 20 ? 2 : 1);
  const revenueInr = tripsCount * 1100;
  const driverAllowanceInr = 450;
  const helperAllowanceInr = 250;
  const gpShareInr = tripsCount * 100;
  const totalCostInr = fuelCostInr + driverAllowanceInr + helperAllowanceInr + gpShareInr;
  const netMarginInr = revenueInr - totalCostInr;

  const fuelRemainingPct = Math.max(18, 92 - (seed % 42));
  const currentFuelLitres = Math.round((fuelRemainingPct / 100) * fuelCapacityLitres);
  const engineHours = (runningKm / 16.5).toFixed(1);

  // Hourly movement profile data for charts
  const hourlyData = [
    { time: '07:00', speed: 0, distance: 0, fuel: 0 },
    { time: '08:30', speed: Math.min(35, Math.round(seed % 30 + 15)), distance: Number((runningKm * 0.18).toFixed(1)), fuel: Number((fuelUsedLitres * 0.15).toFixed(1)) },
    { time: '10:00', speed: Math.min(45, Math.round(seed % 35 + 20)), distance: Number((runningKm * 0.42).toFixed(1)), fuel: Number((fuelUsedLitres * 0.38).toFixed(1)) },
    { time: '11:45', speed: 8, distance: Number((runningKm * 0.58).toFixed(1)), fuel: Number((fuelUsedLitres * 0.55).toFixed(1)) },
    { time: '13:15', speed: 0, distance: Number((runningKm * 0.65).toFixed(1)), fuel: Number((fuelUsedLitres * 0.62).toFixed(1)) },
    { time: '14:30', speed: Math.min(42, Math.round(seed % 28 + 18)), distance: Number((runningKm * 0.85).toFixed(1)), fuel: Number((fuelUsedLitres * 0.82).toFixed(1)) },
    { time: '16:00', speed: veh.speedKmh, distance: runningKm, fuel: fuelUsedLitres }
  ];

  return {
    runningKm,
    weeklyKm,
    monthlyKm,
    fuelCapacityLitres,
    mileageKmL,
    fuelUsedLitres,
    fuelCostInr,
    fuelRemainingPct,
    currentFuelLitres,
    tripsCount,
    revenueInr,
    totalCostInr,
    netMarginInr,
    engineHours,
    hourlyData
  };
};

export const VehicleIntelModal = ({
  vehicle,
  fstps = [],
  requests = [],
  isOpen,
  onClose,
  onFocusMap
}) => {
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry', 'movement', 'economics', 'mission'

  if (!isOpen || !vehicle) return null;

  const analytics = getVehicleAnalytics(vehicle);

  // Find nearest FSTP
  let nearestFstp = null;
  let minDistanceKm = Infinity;
  fstps.forEach((f) => {
    if (f.lat && f.lng && vehicle.currentLat && vehicle.currentLng) {
      const d = calculateDistanceKm(vehicle.currentLat, vehicle.currentLng, f.lat, f.lng);
      if (d < minDistanceKm) {
        minDistanceKm = d;
        nearestFstp = f;
      }
    }
  });

  // Find active or recent request associated with vehicle
  const activeBooking =
    requests.find((r) => r.assignedVehicleId === vehicle.id || r.id === vehicle.assignedRequestId) ||
    requests[0] ||
    null;

  const isFitnessValid = new Date(vehicle.fitnessExpiry) > new Date();
  const isInsuranceValid = new Date(vehicle.insuranceExpiry) > new Date();
  const isPucValid = new Date(vehicle.pucExpiry) > new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Intelligence Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
              <Truck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-lg text-white tracking-wide">
                  {vehicle.regNo}
                </span>
                <StatusChip status={vehicle.status} />
                {vehicle.hasGpsDevice ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold">
                    <Radio size={10} className="animate-pulse" />
                    🛰️ TRAQINDIA LIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                    📲 DRIVER APP GPS
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>{vehicle.vendorName || 'Empaneled Sanitation Fleet'}</span>
                <span>•</span>
                <span className="text-teal-300 font-medium">{vehicle.district}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">{vehicle.capacityLitres}L {vehicle.type}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onFocusMap && (
              <button
                onClick={() => {
                  onFocusMap(vehicle);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Center vehicle on live map"
              >
                <Maximize2 size={13} />
                <span>Center Map</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
          {[
            { id: 'telemetry', label: 'Overview & GPS Telemetry', icon: Activity },
            { id: 'movement', label: 'Movement & Running KM', icon: TrendingUp },
            { id: 'economics', label: 'Fuel & Costing Intelligence', icon: Fuel },
            { id: 'mission', label: 'FSSM Mission & Compliance', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                  isActive
                    ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-800 shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              {/* Primary Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30">
                  <div className="text-[11px] font-mono text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <Gauge size={13} />
                    <span>CURRENT SPEED</span>
                  </div>
                  <div className="font-mono font-bold text-2xl text-teal-900 dark:text-teal-200 mt-1">
                    {vehicle.speedKmh} <span className="text-xs font-normal">km/h</span>
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">
                    Heading: {vehicle.headingDeg}&deg; (Bearing)
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-500/30">
                  <div className="text-[11px] font-mono text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                    <TrendingUp size={13} />
                    <span>TODAY RUNNING</span>
                  </div>
                  <div className="font-mono font-bold text-2xl text-sky-900 dark:text-sky-200 mt-1">
                    {analytics.runningKm} <span className="text-xs font-normal">km</span>
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 mt-0.5">
                    Engine: {analytics.engineHours} hrs today
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30">
                  <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Fuel size={13} />
                    <span>FUEL LEVEL</span>
                  </div>
                  <div className="font-mono font-bold text-2xl text-amber-900 dark:text-amber-200 mt-1">
                    {analytics.fuelRemainingPct}%
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                    {analytics.currentFuelLitres}L / {analytics.fuelCapacityLitres}L remaining
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30">
                  <div className="text-[11px] font-mono text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>FSTP PROXIMITY</span>
                  </div>
                  <div className="font-mono font-bold text-2xl text-purple-900 dark:text-purple-200 mt-1 truncate">
                    {minDistanceKm < 999 ? `${minDistanceKm.toFixed(1)} km` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 truncate">
                    To {nearestFstp?.name || 'Nearest Plant'}
                  </div>
                </div>
              </div>

              {/* Hardware Device Telemetry Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Radio size={16} className="text-teal-600 dark:text-teal-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      TraqIndia Telemetry & Geofence Sensor Stream
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">GPS Tracker Device ID:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {vehicle.gpsDeviceId || `TRQ-CG-${vehicle.traqDeviceId || '8801'}`}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Geo-Coordinates (WGS84):</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {Number(vehicle.currentLat || 21.2514).toFixed(5)}, {Number(vehicle.currentLng || 81.6296).toFixed(5)}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Last Telemetry Ping:</span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                      {vehicle.lastGpsPing ? new Date(vehicle.lastGpsPing).toLocaleTimeString() : 'Just now'} (TraqIndia WSS)
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Battery / Alternator:</span>
                    <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      {vehicle.battery || 95}% (Healthy 13.8V)
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Geofence Enclosure:</span>
                    <p className="mt-0.5">
                      {vehicle.isInsideFstpGeoFence ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 size={13} /> Inside {vehicle.insideFstpName}
                        </span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          In Transit / Rural Catchment
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Ignition & Engine Relay:</span>
                    <p className="mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        vehicle.speedKmh > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-300'
                      }`}>
                        {vehicle.speedKmh > 0 ? 'IGNITION ON' : 'ENGINE IDLE'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver & Operator Quick Contact */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                    {vehicle.driverName?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {vehicle.driverName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assigned Driver • Operator: {vehicle.vendorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${vehicle.driverPhone || '9826100099'}`}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Phone size={13} />
                    <span>Call Driver ({vehicle.driverPhone || '9826100099'})</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOVEMENT & RUNNING KM */}
          {activeTab === 'movement' && (
            <div className="space-y-6">
              {/* Odometer & Trips Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Today's Distance Run</span>
                  <div className="font-mono font-bold text-2xl text-teal-700 dark:text-teal-300 mt-1">
                    {analytics.runningKm} km
                  </div>
                  <span className="text-[11px] text-slate-500">Target daily route: ~65 km</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Weekly Cumulative</span>
                  <div className="font-mono font-bold text-2xl text-sky-700 dark:text-sky-300 mt-1">
                    {analytics.weeklyKm} km
                  </div>
                  <span className="text-[11px] text-slate-500">Across 18 rural clusters</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Monthly Cumulative</span>
                  <div className="font-mono font-bold text-2xl text-purple-700 dark:text-purple-300 mt-1">
                    {analytics.monthlyKm} km
                  </div>
                  <span className="text-[11px] text-slate-500">Odometer in service</span>
                </div>
              </div>

              {/* Hourly Speed & Distance Chart */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Today's Speed & Movement Profile (km/h)
                    </h3>
                    <p className="text-xs text-slate-500">Telemetry speed variation recorded every 30 seconds</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                    Peak: 45 km/h
                  </span>
                </div>

                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="speed"
                        name="Speed (km/h)"
                        stroke="#0D9488"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#speedGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Waypoint Log Strip */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recent Movement Waypoints
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">Departed Sanitation Depot ({vehicle.district})</span>
                    </div>
                    <span className="font-mono text-slate-500">08:00 AM • 0 km</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">Arrived at Household Site (Septic Tank Emptying)</span>
                    </div>
                    <span className="font-mono text-slate-500">10:15 AM • 18.4 km</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">En Route to Decanting FSTP ({nearestFstp?.name || 'Cluster Plant'})</span>
                    </div>
                    <span className="font-mono text-slate-500">Current Position • {analytics.runningKm} km</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FUEL & COSTING */}
          {activeTab === 'economics' && (
            <div className="space-y-6">
              {/* Fuel Gauge & Efficiency Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Fuel Consumed Today</span>
                    <Fuel size={16} className="text-amber-600" />
                  </div>
                  <div className="font-mono font-bold text-2xl text-amber-900 dark:text-amber-100 mt-2">
                    {analytics.fuelUsedLitres} <span className="text-xs font-normal">Litres</span>
                  </div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 block">
                    Mileage: ~{analytics.mileageKmL} km/L
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Fuel Expenditure</span>
                    <DollarSign size={16} className="text-emerald-600" />
                  </div>
                  <div className="font-mono font-bold text-2xl text-emerald-900 dark:text-emerald-100 mt-2">
                    ₹{analytics.fuelCostInr}
                  </div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 block">
                    @ ₹95.50/L diesel rate
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 dark:text-sky-300">Cost per Kilometer</span>
                    <Activity size={16} className="text-sky-600" />
                  </div>
                  <div className="font-mono font-bold text-2xl text-sky-900 dark:text-sky-100 mt-2">
                    ₹{(analytics.fuelCostInr / analytics.runningKm).toFixed(2)}
                  </div>
                  <span className="text-[11px] text-sky-700 dark:text-sky-400 mt-1 block">
                    Standard CG SBM-G benchmark
                  </span>
                </div>
              </div>

              {/* FSSM Trip Financial Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      FSSM Desludging Economics & Cost Recovery (Today)
                    </h3>
                    <p className="text-xs text-slate-500">Service fees collected vs operating expenses</p>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    Net Surplus: +₹{analytics.netMarginInr}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-800/80">
                    <span className="text-slate-600 dark:text-slate-400">Total Desludging Fees Billed ({analytics.tripsCount} trips):</span>
                    <strong className="font-mono text-slate-900 dark:text-white">₹{analytics.revenueInr}</strong>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-800/80">
                    <span className="text-slate-600 dark:text-slate-400">Diesel Fuel Consumed ({analytics.fuelUsedLitres} L):</span>
                    <span className="font-mono text-red-600 dark:text-red-400">-₹{analytics.fuelCostInr}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-800/80">
                    <span className="text-slate-600 dark:text-slate-400">Driver & Sanitation Crew Allowance:</span>
                    <span className="font-mono text-red-600 dark:text-red-400">-₹700</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-800/80">
                    <span className="text-slate-600 dark:text-slate-400">Gram Panchayat Administrative Cess:</span>
                    <span className="font-mono text-red-600 dark:text-red-400">-₹{analytics.tripsCount * 100}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-500/30 font-bold text-sm">
                    <span className="text-teal-900 dark:text-teal-200">Net Operating Margin (PSSO Fleet):</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{analytics.netMarginInr}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MISSION & COMPLIANCE */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              {/* Active Desludging Mission Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation size={16} className="text-teal-600 dark:text-teal-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Active Desludging Assignment
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-600 text-white font-bold">
                    {activeBooking?.requestNo || 'REQ-CG-2026-00104'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Beneficiary Citizen:</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {activeBooking?.citizenName || 'Devendra Chandrakar'} ({activeBooking?.citizenPhone || '9826188201'})
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Target Village & GP:</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {activeBooking?.village || 'Mandir Hasaud'}, {activeBooking?.block || 'Dharsiwa'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Sludge Tank Payload:</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      ~{activeBooking?.tankVolumeLitres || 3500} Litres (Capacity: {vehicle.capacityLitres}L)
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Designated Decanting Plant:</span>
                    <p className="font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                      {nearestFstp?.name || 'Arang Cluster FSTP (15 KLD)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Compliance Strip */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Statutory Motor Vehicle & Crew Safety Compliance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500">Pollution Under Control (PUC)</span>
                    <div className="font-mono font-bold text-sm mt-1 text-slate-900 dark:text-white">
                      {vehicle.pucExpiry || '2027-04-15'}
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 block ${isPucValid ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPucValid ? '✓ VALID & CERTIFIED' : '⚠ EXPIRED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500">Comprehensive Insurance</span>
                    <div className="font-mono font-bold text-sm mt-1 text-slate-900 dark:text-white">
                      {vehicle.insuranceExpiry || '2027-06-30'}
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 block ${isInsuranceValid ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isInsuranceValid ? '✓ ACTIVE POLICY' : '⚠ RENEWAL DUE'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500">Vehicle Fitness Certificate</span>
                    <div className="font-mono font-bold text-sm mt-1 text-slate-900 dark:text-white">
                      {vehicle.fitnessExpiry || '2027-08-20'}
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 block ${isFitnessValid ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isFitnessValid ? '✓ RTO CERTIFIED' : '⚠ EXPIRED'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-teal-600" />
                    <span>PPE Safety Kit Verified: Rubber Boots, Nitrile Gloves, Gas Detector, First Aid Box</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono">
            <span>DEVICE: {vehicle.gpsDeviceId || 'N/A'}</span>
            <span>•</span>
            <span>LAT: {Number(vehicle.currentLat || 21.2514).toFixed(4)}</span>
            <span>•</span>
            <span>LNG: {Number(vehicle.currentLng || 81.6296).toFixed(4)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Exporting official FSSM Telemetry & Trip Report for ${vehicle.regNo}...`);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-all"
            >
              <Download size={13} />
              <span>Export Telemetry PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
