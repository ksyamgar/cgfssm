import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { CHHATTISGARH_CENTER } from '../../services/locationService';
import { StatusChip } from '../common/StatusChip';
import { DataTag } from '../common/DataTag';
import { Truck, Navigation, ShieldCheck, AlertTriangle, Radio } from 'lucide-react';

// Custom SVG marker for vehicles
const createVehicleIcon = (status, heading = 0) => {
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

export const LiveGpsMap = ({ vehicles = [], fstps = [], selectedVehicleId = null, height = '550px' }) => {
  const [activeVehicle, setActiveVehicle] = useState(null);

  // Center on selected vehicle if specified
  const targetVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const centerLat = targetVehicle ? targetVehicle.currentLat : CHHATTISGARH_CENTER.lat;
  const centerLng = targetVehicle ? targetVehicle.currentLng : CHHATTISGARH_CENTER.lng;

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
          <div>ACTIVE VEHICLES: <strong className="text-slate-900 dark:text-white">{vehicles.length}</strong></div>
          <div>GEOFENCED FSTPs: <strong className="text-slate-900 dark:text-white">{fstps.length}</strong></div>
        </div>
      </div>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#081c2c' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

        {/* Vehicle Markers */}
        {vehicles.map((veh) => (
          <Marker
            key={veh.id}
            position={[veh.currentLat, veh.currentLng]}
            icon={createVehicleIcon(veh.status, veh.headingDeg)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-2.5 space-y-2 font-sans min-w-[220px]">
                <div className="flex items-center justify-between gap-2 border-b pb-1.5">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{veh.regNo}</div>
                    <div className="text-[11px] font-mono text-slate-500">{veh.gpsDeviceId}</div>
                  </div>
                  <StatusChip status={veh.status} />
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Driver:</span>
                    <strong>{veh.driverName} ({veh.driverPhone})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <strong className="font-mono text-cg-tealDark">{veh.speedKmh} km/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <strong>{veh.capacityLitres} L ({veh.type})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendor:</span>
                    <span className="truncate max-w-[120px]">{veh.vendorName}</span>
                  </div>
                  {veh.isInsideFstpGeoFence && (
                    <div className="bg-emerald-100 text-emerald-800 p-1 rounded font-semibold text-[11px]">
                      ✓ Inside Geo-Fence: {veh.insideFstpName}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
