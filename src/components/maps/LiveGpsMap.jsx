import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CHHATTISGARH_CENTER } from '../../services/locationService';
import { StatusChip } from '../common/StatusChip';
import { DataTag } from '../common/DataTag';
import { Truck, Navigation, ShieldCheck, AlertTriangle, Radio, Activity, MapPin, RotateCcw, Plus, Minus } from 'lucide-react';

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Floating Map Action Controls located in the Bottom-Right
const MapBottomRightControls = ({ onReset, vehicles, fstps }) => {
  const map = useMap();

  const handleZoomIn = (e) => {
    e.stopPropagation();
    map.zoomIn();
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    map.zoomOut();
  };

  const handleReset = (e) => {
    e.stopPropagation();
    if (vehicles && vehicles.length > 0) {
      const points = [];
      vehicles.forEach((v) => {
        const lat = v.currentLat || v.lat;
        const lng = v.currentLng || v.lng;
        if (lat && lng) points.push([lat, lng]);
      });
      fstps.forEach((f) => {
        if (f.lat && f.lng) points.push([f.lat, f.lng]);
      });

      if (points.length > 1) {
        try {
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds, { padding: [50, 50], animate: true, maxZoom: 10 });
        } catch {
          map.setView([CHHATTISGARH_CENTER.lat, CHHATTISGARH_CENTER.lng], 7.5, { animate: true });
        }
      } else {
        map.setView([CHHATTISGARH_CENTER.lat, CHHATTISGARH_CENTER.lng], 7.5, { animate: true });
      }
    } else {
      map.setView([CHHATTISGARH_CENTER.lat, CHHATTISGARH_CENTER.lng], 7.5, { animate: true });
    }

    if (onReset) onReset();
  };

  return (
    <div className="leaflet-bottom leaflet-right !mb-6 !mr-4 z-[1000] pointer-events-auto flex flex-col items-end gap-2">
      {/* Reset Map Button */}
      <button
        type="button"
        onClick={handleReset}
        title="Reset Map to Full Chhattisgarh View"
        className="px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 border border-slate-300 dark:border-white/20 shadow-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <RotateCcw size={14} className="text-teal-600 dark:text-teal-400" />
        <span>Reset Map</span>
      </button>

      {/* Move Zoom Buttons to Bottom Right */}
      <div className="flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-300 dark:border-white/20 shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center justify-center border-b border-slate-200 dark:border-white/10 cursor-pointer"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center justify-center cursor-pointer"
        >
          <Minus size={16} />
        </button>
      </div>
    </div>
  );
};

// Custom SVG marker for vehicles
const createVehicleIcon = (status, heading = 0, hasGpsDevice = false) => {
  const isMoving = status === 'EN_ROUTE' || status === 'TRANSPORTING';
  const color = isMoving ? '#14B8A6' : status === 'AT_SITE' ? '#F59E0B' : '#38BDF8';

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        background: rgba(3, 53, 80, 0.9);
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 12px ${color}88;
        transform: rotate(${heading}deg);
      ">
        <div style="color: ${color}; transform: rotate(-${heading}deg);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        </div>
        ${hasGpsDevice ? `<span style="position: absolute; top:-3px; left:-3px; font-size: 10px; line-height: 1;" title="TraqIndia Hardware GPS Tracker">🛰️</span>` : ''}
        ${isMoving ? `<span style="position: absolute; top:-2px; right:-2px; width: 10px; height: 10px; background: #22C55E; border-radius: 50%; border: 1.5px solid #033550; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

// Custom SVG marker for FSTP sites
const createFstpIcon = (type) => {
  return L.divIcon({
    className: 'custom-fstp-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: rgba(139, 92, 246, 0.9);
        border: 2px solid #C4B5FD;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 14px rgba(139, 92, 246, 0.6);
        color: white;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Custom SVG marker for Citizen Household Requests
const createCitizenIcon = (status) => {
  const isCompleted = status === 'CLOSED' || status === 'PAYMENT_COMPLETED';
  const color = isCompleted ? '#10B981' : '#0284C7';

  return L.divIcon({
    className: 'custom-citizen-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: rgba(15, 23, 42, 0.9);
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${color}88;
        color: ${color};
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const LiveGpsMap = ({
  vehicles = [],
  fstps = [],
  requests = [],
  selectedVehicleId = null,
  onSelectVehicle = null,
  onResetView = null,
  height = '550px'
}) => {
  const hardwareGpsCount = vehicles.filter(v => v.hasGpsDevice).length;
  const mobileGpsCount = vehicles.length - hardwareGpsCount;

  // Center on selected vehicle if specified, otherwise state center
  const targetVehicle = selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null;
  const centerLat = targetVehicle ? (targetVehicle.currentLat || targetVehicle.lat || CHHATTISGARH_CENTER.lat) : CHHATTISGARH_CENTER.lat;
  const centerLng = targetVehicle ? (targetVehicle.currentLng || targetVehicle.lng || CHHATTISGARH_CENTER.lng) : CHHATTISGARH_CENTER.lng;
  const mapZoom = targetVehicle ? 13 : 8;

  // Calculate nearest FSTP to selected vehicle for destination trajectory
  let nearestFstp = null;
  if (targetVehicle && targetVehicle.currentLat && targetVehicle.currentLng) {
    let minD = Infinity;
    fstps.forEach(f => {
      if (f.lat && f.lng) {
        const d = (f.lat - targetVehicle.currentLat) ** 2 + (f.lng - targetVehicle.currentLng) ** 2;
        if (d < minD) {
          minD = d;
          nearestFstp = f;
        }
      }
    });
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl" style={{ height }}>
      {/* Telemetry Overlay Card */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl max-w-xs pointer-events-auto border border-teal-200 dark:border-cg-teal/30 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-teal-800 dark:text-cg-teal font-bold mb-1">
          <Radio size={14} className="animate-pulse text-teal-600 dark:text-cg-teal" />
          <span>TRAQINDIA LIVE GPS TELEMETRY</span>
        </div>
        <div className="text-[11px] text-slate-700 dark:text-slate-300 font-mono space-y-0.5">
          <div>POLL RATE: 30s • PROTOCOL: WSS/TCP</div>
          <div className="flex items-center justify-between">
            <span>🛰️ HARDWARE GPS:</span>
            <strong className="text-teal-700 dark:text-teal-400">{hardwareGpsCount} Active</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>📲 APP / PLANNED GPS:</span>
            <strong className="text-amber-700 dark:text-amber-400">{mobileGpsCount} Units</strong>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-0.5 mt-0.5">
            <span>GEOFENCED FSTPs:</span>
            <strong className="text-slate-900 dark:text-white">{fstps.length} Plants</strong>
          </div>
        </div>
      </div>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={mapZoom}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#081c2c' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={[centerLat, centerLng]} zoom={mapZoom} />

        {/* Floating Reset Map & Bottom-Right Zoom Buttons */}
        <MapBottomRightControls
          onReset={onResetView}
          vehicles={vehicles}
          fstps={fstps}
        />

        {/* FSTP Sites & Geo-Fence Circles */}
        {fstps.map((fstp) => (
          <React.Fragment key={fstp.id}>
            <Marker position={[fstp.lat, fstp.lng]} icon={createFstpIcon(fstp.type)}>
              <Popup className="custom-leaflet-popup">
                <div className="p-2 space-y-1.5 font-sans min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-slate-900 text-sm">{fstp.name}</span>
                    <DataTag color="violet">{fstp.type}</DataTag>
                  </div>
                  <div className="text-xs text-slate-600">
                    <div>Capacity: <strong>{fstp.capacityKLD} KLD</strong></div>
                    <div>Current Intake: <strong>{fstp.currentVolumeKLD} KLD</strong></div>
                    <div>Compost Stock: <strong>{fstp.compostStockTons} Tons</strong></div>
                    <div className="text-emerald-700 font-medium">● Geo-Fence Active ({fstp.radiusMeters}m radius)</div>
                  </div>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[fstp.lat, fstp.lng]}
              radius={fstp.radiusMeters || 300}
              pathOptions={{
                color: '#8B5CF6',
                fillColor: '#8B5CF6',
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: '4, 4'
              }}
            />
          </React.Fragment>
        ))}

        {/* Citizen Household Requests (Pinned Locations) */}
        {requests.map((req) => {
          const rLat = req.latitude || (req.district === 'Durg' ? 21.1904 : 21.2514);
          const rLng = req.longitude || (req.district === 'Durg' ? 81.2849 : 81.6296);

          return (
            <Marker
              key={req.id}
              position={[rLat, rLng]}
              icon={createCitizenIcon(req.status)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2 space-y-1.5 font-sans min-w-[220px]">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-slate-900 text-xs">🏠 {req.requestNo}</span>
                    <StatusChip status={req.status} />
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <div>Citizen: <strong>{req.citizenName}</strong> ({req.citizenPhone})</div>
                    <div>Location: <strong>{req.village}, {req.gp}</strong></div>
                    <div>Tank Volume: <strong>{req.tankVolumeLitres || 3000} L</strong></div>
                    <div className="text-[11px] font-mono text-teal-700">
                      GPS: {Number(rLat).toFixed(4)}, {Number(rLng).toFixed(4)}
                    </div>
                    {req.targetFstpName && (
                      <div className="text-[11px] text-purple-700 bg-purple-50 p-1 rounded font-medium">
                        Target FSTP: {req.targetFstpName}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Path & Trajectory for Selected Vehicle */}
        {targetVehicle && targetVehicle.currentLat && targetVehicle.currentLng && selectedVehicleId && (
          <>
            <Polyline
              positions={[
                [targetVehicle.currentLat - 0.022, targetVehicle.currentLng - 0.032],
                [targetVehicle.currentLat - 0.012, targetVehicle.currentLng - 0.018],
                [targetVehicle.currentLat - 0.005, targetVehicle.currentLng - 0.007],
                [targetVehicle.currentLat, targetVehicle.currentLng]
              ]}
              pathOptions={{
                color: '#0D9488',
                weight: 4,
                opacity: 0.85
              }}
            />
            {nearestFstp && (
              <Polyline
                positions={[
                  [targetVehicle.currentLat, targetVehicle.currentLng],
                  [nearestFstp.lat, nearestFstp.lng]
                ]}
                pathOptions={{
                  color: '#8B5CF6',
                  weight: 2.5,
                  opacity: 0.7,
                  dashArray: '6, 6'
                }}
              />
            )}
          </>
        )}

        {/* Vehicle Markers */}
        {vehicles.map((veh) => {
          const vLat = veh.currentLat !== undefined && veh.currentLat !== null ? veh.currentLat : (veh.lat || 21.2514);
          const vLng = veh.currentLng !== undefined && veh.currentLng !== null ? veh.currentLng : (veh.lng || 81.6296);
          if (!vLat || !vLng) return null;

          return (
            <Marker
              key={veh.id || veh.regNo}
              position={[vLat, vLng]}
              icon={createVehicleIcon(veh.status, veh.headingDeg, veh.hasGpsDevice)}
              eventHandlers={{
                click: () => {
                  if (onSelectVehicle) onSelectVehicle(veh);
                }
              }}
            >
            <Popup className="custom-leaflet-popup">
              <div className="p-2.5 space-y-2 font-sans min-w-[240px]">
                <div className="flex items-center justify-between gap-2 border-b pb-1.5">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{veh.regNo}</div>
                    <div className="text-[11px] font-mono text-slate-500">{veh.gpsDeviceId}</div>
                  </div>
                  <StatusChip status={veh.status} />
                </div>

                {/* GPS Type Tag */}
                {veh.hasGpsDevice ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-mono font-bold shadow-xs">
                    <Radio size={11} className="text-teal-600 animate-pulse" />
                    <span>🛰️ TRAQINDIA HARDWARE GPS INSTALLED</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono font-semibold">
                    <span>📲 DRIVER APP GPS (HARDWARE UPGRADE PLANNED)</span>
                  </div>
                )}

                <div className="text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Driver:</span>
                    <strong>{veh.driverName} ({veh.driverPhone})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <strong className="font-mono text-teal-800">{veh.speedKmh} km/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <strong>{veh.capacityLitres} L ({veh.type})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendor:</span>
                    <span className="truncate max-w-[130px]">{veh.vendorName}</span>
                  </div>
                  {veh.isInsideFstpGeoFence && (
                    <div className="bg-emerald-100 text-emerald-800 p-1 rounded font-semibold text-[11px]">
                      ✓ Inside Geo-Fence: {veh.insideFstpName}
                    </div>
                  )}
                </div>

                {/* Open Management Intel & Costing Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectVehicle) onSelectVehicle(veh);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Activity size={13} />
                  <span>Open Management Intel & Costing</span>
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
};
