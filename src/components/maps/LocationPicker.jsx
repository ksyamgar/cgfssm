import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CHHATTISGARH_CENTER, CG_DISTRICT_COORDINATES, calculateDistanceKm, findNearestFstp } from '../../services/locationService';
import { MapPin, Navigation, Crosshair, Sparkles, Radio, Factory } from 'lucide-react';

// Custom Pin Marker Icon
const createPinIcon = (color = '#0D9488') => {
  return L.divIcon({
    className: 'custom-location-pin',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-18px, -36px);
      ">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="#FFFFFF"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Map click handler to place pin
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    }
  });
  return null;
};

// Map Controller for smooth pan / zoom
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const LocationPicker = ({
  lat,
  lng,
  latitude,
  longitude,
  onLocationChange,
  onChange,
  radiusMeters = null,
  onRadiusChange = null,
  fstps = [],
  district = null,
  height = '320px',
  label = 'Pin Point Location on Map',
  helpText = null
}) => {
  const effectiveLat = latitude !== undefined ? latitude : (lat !== undefined ? lat : 21.2514);
  const effectiveLng = longitude !== undefined ? longitude : (lng !== undefined ? lng : 81.6296);

  const [currentLat, setCurrentLat] = useState(effectiveLat);
  const [currentLng, setCurrentLng] = useState(effectiveLng);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const triggerChange = (newLat, newLng) => {
    if (onLocationChange) onLocationChange(newLat, newLng);
    if (onChange) onChange({ lat: newLat, lng: newLng });
  };

  // If district prop changes and coordinates not yet customized, jump map to district center
  useEffect(() => {
    if (district) {
      const cleanDist = district.replace(/\s*\(\d+\)$/, '').trim();
      const distCoord = CG_DISTRICT_COORDINATES[cleanDist];
      if (distCoord && (!effectiveLat || effectiveLat === 21.2514)) {
        setCurrentLat(distCoord.lat);
        setCurrentLng(distCoord.lng);
        triggerChange(distCoord.lat, distCoord.lng);
      }
    }
  }, [district]);

  useEffect(() => {
    if (effectiveLat && effectiveLng && (effectiveLat !== currentLat || effectiveLng !== currentLng)) {
      setCurrentLat(effectiveLat);
      setCurrentLng(effectiveLng);
    }
  }, [effectiveLat, effectiveLng]);

  const handlePointSelect = (newLat, newLng) => {
    setCurrentLat(newLat);
    setCurrentLng(newLng);
    setGeoError(null);
    triggerChange(newLat, newLng);
  };

  // Browser Geolocation API
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = Number(pos.coords.latitude.toFixed(6));
        const detectedLng = Number(pos.coords.longitude.toFixed(6));
        setCurrentLat(detectedLat);
        setCurrentLng(detectedLng);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setIsLocating(false);
        if (onLocationChange) onLocationChange(detectedLat, detectedLng);
      },
      (err) => {
        setIsLocating(false);
        setGeoError(err.message || 'Unable to retrieve your GPS location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Find nearest FSTP if fstps list is provided
  const nearestFstp = fstps && fstps.length > 0 ? findNearestFstp(currentLat, currentLng, fstps) : null;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <MapPin size={14} className="text-teal-600 dark:text-teal-400" />
          <span>{label}</span>
        </label>

        <button
          type="button"
          onClick={handleDetectGps}
          disabled={isLocating}
          className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 text-xs font-mono font-bold hover:bg-teal-100 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          title="Detect my current device GPS coordinates"
        >
          <Crosshair size={13} className={isLocating ? 'animate-spin text-teal-600' : 'text-teal-600'} />
          <span>{isLocating ? 'Detecting GPS...' : '🎯 Detect Live GPS'}</span>
        </button>
      </div>

      {geoError && (
        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-[11px] font-mono">
          {geoError}
        </div>
      )}

      {/* Interactive Map Box */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 dark:border-white/15 shadow-clean" style={{ height }}>
        {/* Instruction overlay */}
        <div className="absolute top-2 right-2 z-[400] bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm pointer-events-none">
          📍 Click map or drag pin to position
        </div>

        <MapContainer
          center={[currentLat, currentLng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#091c2b' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewController center={[currentLat, currentLng]} zoom={13} />
          <MapClickHandler onLocationSelect={handlePointSelect} />

          {/* Selected Pin Marker (Draggable) */}
          <Marker
            position={[currentLat, currentLng]}
            icon={createPinIcon('#0D9488')}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handlePointSelect(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)));
              }
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 text-xs font-mono space-y-1">
                <div className="font-bold text-teal-800">Selected Location Pin</div>
                <div>Lat: <strong>{currentLat}</strong></div>
                <div>Lng: <strong>{currentLng}</strong></div>
              </div>
            </Popup>
          </Marker>

          {/* Optional Geo-Fence Circle (for FSTP registration) */}
          {radiusMeters && (
            <Circle
              center={[currentLat, currentLng]}
              radius={radiusMeters}
              pathOptions={{
                color: '#8B5CF6',
                fillColor: '#8B5CF6',
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 5'
              }}
            />
          )}

          {/* Existing FSTP Facility Markers (for proximity reference) */}
          {fstps && fstps.map((f) => (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={createPinIcon('#8B5CF6')}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1.5 text-xs font-mono">
                  <div className="font-bold text-purple-900">{f.name}</div>
                  <div>Type: {f.type} ({f.capacityKLD} KLD)</div>
                  <div className="text-teal-700 font-bold">
                    Distance: {calculateDistanceKm(currentLat, currentLng, f.lat, f.lng)} km
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Lat/Lng readout & Nearest FSTP automated insight strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="text-slate-500 dark:text-slate-400">GPS COORDINATES:</div>
          <div className="font-bold text-slate-900 dark:text-white">
            {currentLat}, {currentLng}
            {gpsAccuracy && <span className="text-[10px] text-teal-600 font-normal ml-1">(&plusmn;{gpsAccuracy}m)</span>}
          </div>
        </div>

        {nearestFstp ? (
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 flex items-center justify-between text-teal-900 dark:text-teal-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Factory size={13} className="text-teal-600 shrink-0" />
              <span className="truncate max-w-[150px]" title={nearestFstp.name}>{nearestFstp.name}</span>
            </div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              {nearestFstp.distanceKm} km away
            </div>
          </div>
        ) : radiusMeters && onRadiusChange ? (
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between">
            <span className="text-purple-900 dark:text-purple-300 font-bold">Geo-Fence Radius:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={radiusMeters}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="w-20 bg-white dark:bg-cg-navy border border-purple-300 rounded px-2 py-0.5 text-xs text-center font-bold"
              />
              <span className="text-purple-700 dark:text-purple-400 font-bold">meters</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
