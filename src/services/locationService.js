// Location service parsing locationData.json and providing coordinate mapping for CG

let locationCache = null;

export const CG_DISTRICT_COORDINATES = {
  'Raipur': { lat: 21.2514, lng: 81.6296, zoom: 11 },
  'Durg': { lat: 21.1904, lng: 81.2849, zoom: 11 },
  'Bilaspur': { lat: 22.0797, lng: 82.1409, zoom: 11 },
  'Rajnandgaon': { lat: 21.0971, lng: 81.0378, zoom: 10 },
  'Balod': { lat: 20.7303, lng: 81.2052, zoom: 10 },
  'Bemetara': { lat: 21.7028, lng: 81.5471, zoom: 10 },
  'Dhamtari': { lat: 20.7071, lng: 81.5498, zoom: 10 },
  'Mahasamund': { lat: 21.1084, lng: 82.0965, zoom: 10 },
  'Gariaband': { lat: 20.9575, lng: 82.0624, zoom: 10 },
  'Baloda Bazar': { lat: 21.6587, lng: 82.1627, zoom: 10 },
  'Korba': { lat: 22.3595, lng: 82.7501, zoom: 10 },
  'Janjgir-Champa': { lat: 22.0064, lng: 82.5714, zoom: 10 },
  'Raigarh': { lat: 21.8974, lng: 83.3950, zoom: 10 },
  'Surguja': { lat: 23.1189, lng: 83.1979, zoom: 10 },
  'Surajpur': { lat: 23.2185, lng: 82.8712, zoom: 10 },
  'Balrampur': { lat: 23.6111, lng: 83.6186, zoom: 10 },
  'Koriya': { lat: 23.2623, lng: 82.5588, zoom: 10 },
  'Jashpur': { lat: 22.8841, lng: 84.1444, zoom: 10 },
  'Bastar': { lat: 19.0744, lng: 82.0305, zoom: 10 },
  'Kondagaon': { lat: 19.5991, lng: 81.6669, zoom: 10 },
  'Kanker': { lat: 20.2718, lng: 81.4925, zoom: 10 },
  'Dantewada': { lat: 18.8932, lng: 81.3503, zoom: 10 },
  'Sukma': { lat: 18.3978, lng: 81.6644, zoom: 10 },
  'Bijapur': { lat: 18.7951, lng: 80.8166, zoom: 10 },
  'Kabirdham': { lat: 22.0125, lng: 81.2483, zoom: 10 },
  'Mungeli': { lat: 22.0644, lng: 81.6888, zoom: 10 },
  'Gaurela-Pendra-Marwahi': { lat: 22.7667, lng: 81.9167, zoom: 10 },
  'Manendragarh-Chirmiri-Bharatpur': { lat: 23.2167, lng: 82.3500, zoom: 10 },
  'Mohla-Manpur-Ambagarh Chowki': { lat: 20.6500, lng: 80.7500, zoom: 10 },
  'Sakti': { lat: 22.0289, lng: 82.9628, zoom: 10 },
  'Sarangarh-Bilaigarh': { lat: 21.5900, lng: 83.0800, zoom: 10 },
  'Khairagarh-Chhuikhadan-Gandai': { lat: 21.4167, lng: 80.9833, zoom: 10 }
};

export const CHHATTISGARH_CENTER = {
  lat: 21.2787,
  lng: 81.8661,
  zoom: 7
};

export const loadLocationHierarchy = async () => {
  if (locationCache) return locationCache;
  try {
    const response = await fetch('/locationData.json');
    if (!response.ok) throw new Error('Failed to load location database');
    const data = await response.json();
    locationCache = data;
    return data;
  } catch (err) {
    console.warn('Using fallback location structure:', err);
    return getFallbackHierarchy();
  }
};

export const getDistricts = (data) => {
  if (!data) return Object.keys(getFallbackHierarchy());
  return Object.keys(data).sort();
};

export const getBlocks = (data, district) => {
  if (!data || !district || !data[district]) {
    const fallback = getFallbackHierarchy();
    return fallback[district] ? Object.keys(fallback[district]) : [];
  }
  return Object.keys(data[district]).sort();
};

export const getGramPanchayats = (data, district, block) => {
  if (!data || !district || !block || !data[district] || !data[district][block]) {
    const fallback = getFallbackHierarchy();
    return fallback[district]?.[block] ? Object.keys(fallback[district][block]) : [];
  }
  return Object.keys(data[district][block]).sort();
};

export const getVillages = (data, district, block, gp) => {
  if (!data || !district || !block || !gp || !data[district] || !data[district][block] || !data[district][block][gp]) {
    const fallback = getFallbackHierarchy();
    return fallback[district]?.[block]?.[gp] || [];
  }
  return data[district][block][gp] || [];
};

// Fallback hierarchy in case fetch is delayed
export const getFallbackHierarchy = () => ({
  "Raipur (378)": {
    "Dharsiwa (3836)": {
      "Mandir Hasaud (124805)": [
        "Mandir Hasaud (444102)",
        "Giraud (444103)",
        "Kolar (444104)"
      ],
      "Seoni (124810)": [
        "Seoni (444115)",
        "Nardaha (444116)"
      ],
      "Serikhedi (124815)": [
        "Serikhedi (444120)",
        "Baronda (444121)"
      ]
    },
    "Arang (3835)": {
      "Arang Rural (124750)": [
        "Arang Kalan (444001)",
        "Bhanpuri (444002)",
        "Gidhouri (444003)"
      ],
      "Gullu (124755)": [
        "Gullu (444010)",
        "Lakhna (444011)"
      ]
    },
    "Abhanpur (3834)": {
      "Manor (124700)": [
        "Manor (443900)",
        "Chhura (443901)"
      ],
      "Nawapara (124705)": [
        "Nawapara Rural (443910)"
      ]
    }
  },
  "Durg (377)": {
    "Patan (3830)": {
      "Jamgaon R (124600)": [
        "Jamgaon R (443800)",
        "Batang (443801)"
      ],
      "Selud (124605)": [
        "Selud (443810)",
        "Kukda (443811)"
      ]
    },
    "Dhamdha (3829)": {
      "Dhamdha Rural (124550)": [
        "Dhamdha (443700)",
        "Nankathi (443701)"
      ]
    }
  },
  "Bilaspur (375)": {
    "Bilha (3810)": {
      "Bodhri (124400)": [
        "Bodhri (443500)",
        "Chakarbhatha (443501)"
      ],
      "Hirri (124405)": [
        "Hirri (443510)",
        "Beltukri (443511)"
      ]
    },
    "Kota (3812)": {
      "Ratanpur Rural (124450)": [
        "Ratanpur (443600)",
        "Lormi Road (443601)"
      ]
    }
  },
  "Balod (646)": {
    "Balod (3629)": {
      "Amora (124051)": [
        "Amora (443193)",
        "Godri (443192)"
      ],
      "Angari (124052)": [
        "Angari (443186)"
      ]
    }
  }
});

// Clean name helper to strip LGD codes for display if needed
export const cleanLgdName = (nameWithLgd) => {
  if (!nameWithLgd) return '';
  return nameWithLgd.replace(/\s*\(\d+\)$/, '').trim();
};

export const extractLgdCode = (nameWithLgd) => {
  if (!nameWithLgd) return '';
  const match = nameWithLgd.match(/\((\d+)\)$/);
  return match ? match[1] : '';
};
