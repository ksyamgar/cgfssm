import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import { CHHATTISGARH_CENTER } from '../../services/locationService';
import { DataTag } from '../common/DataTag';

export const ChoroplethMap = ({ height = '500px', metric = 'requests' }) => {
  const [geoData, setGeoData] = useState(null);
  const [selectedDistrictData, setSelectedDistrictData] = useState(null);

  useEffect(() => {
    fetch('/chhattisgarh.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  // Synthetic district statistics mapping
  const districtStats = {
    'Raipur': { requests: 1420, treatedML: 4.8, fstpCount: 4, coverage: 94 },
    'Durg': { requests: 1180, treatedML: 3.9, fstpCount: 3, coverage: 91 },
    'Bilaspur': { requests: 980, treatedML: 3.2, fstpCount: 3, coverage: 88 },
    'Rajnandgaon': { requests: 740, treatedML: 2.4, fstpCount: 2, coverage: 85 },
    'Balod': { requests: 620, treatedML: 1.9, fstpCount: 2, coverage: 82 },
    'Bemetara': { requests: 510, treatedML: 1.6, fstpCount: 1, coverage: 79 },
    'Dhamtari': { requests: 690, treatedML: 2.1, fstpCount: 2, coverage: 86 },
    'Mahasamund': { requests: 580, treatedML: 1.8, fstpCount: 1, coverage: 80 },
    'Janjgir-Champa': { requests: 640, treatedML: 2.0, fstpCount: 2, coverage: 83 },
    'Korba': { requests: 530, treatedML: 1.7, fstpCount: 2, coverage: 81 },
    'Raigarh': { requests: 610, treatedML: 1.9, fstpCount: 2, coverage: 84 },
    'Surguja': { requests: 480, treatedML: 1.5, fstpCount: 1, coverage: 78 },
    'Bastar': { requests: 520, treatedML: 1.6, fstpCount: 2, coverage: 76 }
  };

  const getDistrictName = (feature) => {
    return feature.properties.dtname || feature.properties.DISTRICT || feature.properties.name || 'District';
  };

  const getColor = (val) => {
    return val > 1000 ? '#0E9488'
      : val > 700  ? '#14B8A6'
      : val > 500  ? '#2DD4BF'
      : val > 300  ? '#5EEAD4'
      : '#99F6E4';
  };

  const styleFeature = (feature) => {
    const name = getDistrictName(feature);
    const stats = districtStats[name] || { requests: 350 };
    return {
      fillColor: getColor(stats.requests),
      weight: 1.5,
      opacity: 1,
      color: '#033550',
      dashArray: '2',
      fillOpacity: 0.75
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = getDistrictName(feature);
    const stats = districtStats[name] || { requests: 350, treatedML: 1.1, fstpCount: 1, coverage: 75 };

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: '#38BDF8',
          fillOpacity: 0.95
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(styleFeature(feature));
      },
      click: () => {
        setSelectedDistrictData({ name, ...stats });
      }
    });

    layer.bindTooltip(`
      <div style="font-family: Inter, sans-serif; font-size: 12px; font-weight: 600;">
        <strong>${name}</strong><br/>
        Requests: ${stats.requests} • Coverage: ${stats.coverage}%
      </div>
    `, { sticky: true });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl" style={{ height }}>
      {/* Legend Card */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl pointer-events-auto border border-slate-300 dark:border-white/10 text-xs shadow-lg">
        <div className="font-semibold text-slate-900 dark:text-white mb-2">Desludging Density (Requests)</div>
        <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded" style={{ background: '#0F766E' }}></span>
            <span>&gt; 1,000 requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded" style={{ background: '#0D9488' }}></span>
            <span>700 – 1,000 requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded" style={{ background: '#14B8A6' }}></span>
            <span>500 – 700 requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded" style={{ background: '#99F6E4' }}></span>
            <span>&lt; 500 requests</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[21.2787, 81.8661]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#081c2c' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
};
