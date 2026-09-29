// TraqIndia GPS integration adapter & live telemetry engine
// TraqIndia docs: https://documenter.getpostman.com/view/3184032/UVXgMHcy

import { getStorageData, setStorageData, STORAGE_KEYS } from './storageService';

// Calculate distance in kilometers between two GPS points using Haversine formula
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if a vehicle is within an FSTP / STP geo-fence
export const checkGeoFence = (vehicleLat, vehicleLng, fstp) => {
  if (!fstp || !fstp.lat || !fstp.lng) return false;
  const distKm = calculateDistanceKm(vehicleLat, vehicleLng, fstp.lat, fstp.lng);
  const radiusKm = (fstp.radiusMeters || 300) / 1000;
  return distKm <= radiusKm;
};

// Simulate small vehicle movements along roads in Chhattisgarh
export const stepVehicleSimulation = () => {
  const vehicles = getStorageData(STORAGE_KEYS.VEHICLES, []);
  const fstps = getStorageData(STORAGE_KEYS.FSTPS, []);

  const updatedVehicles = vehicles.map((v) => {
    // Only move vehicles that are EN_ROUTE or TRANSPORTING
    if (v.status === 'EN_ROUTE' || v.status === 'TRANSPORTING') {
      // Jitter lat/lng slightly towards next target
      const deltaLat = (Math.random() - 0.45) * 0.002;
      const deltaLng = (Math.random() - 0.45) * 0.002;
      const newLat = v.currentLat + deltaLat;
      const newLng = v.currentLng + deltaLng;
      const newSpeed = Math.floor(25 + Math.random() * 20);
      const newHeading = Math.floor(Math.random() * 360);

      // Check if entering geo-fence of any FSTP
      let nearFstp = null;
      for (const f of fstps) {
        if (checkGeoFence(newLat, newLng, f)) {
          nearFstp = f;
          break;
        }
      }

      return {
        ...v,
        currentLat: Number(newLat.toFixed(5)),
        currentLng: Number(newLng.toFixed(5)),
        speedKmh: newSpeed,
        headingDeg: newHeading,
        lastGpsPing: new Date().toISOString(),
        isInsideFstpGeoFence: !!nearFstp,
        insideFstpName: nearFstp ? nearFstp.name : null
      };
    }
    return {
      ...v,
      lastGpsPing: new Date().toISOString()
    };
  });

  setStorageData(STORAGE_KEYS.VEHICLES, updatedVehicles);
  return updatedVehicles;
};
