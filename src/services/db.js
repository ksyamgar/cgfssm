import Dexie from 'dexie';

export const db = new Dexie('CGRuralFSSM_DB');

db.version(1).stores({
  requests: 'id, requestNo, district, block, gp, village, status, citizenPhone, createdAt, isOfflineCreated',
  trips: 'id, tripNo, requestId, vehicleId, driverId, status, departureTime, arrivalTime',
  evidenceMedia: 'id, requestId, step, photoUrl, latitude, longitude, ppeChecklist, timestamp, synced',
  syncQueue: '++id, entity, action, payload, createdAt, attempts',
  auditLogs: '++id, entityId, entityType, action, actorId, actorRole, details, timestamp',
  cachedMasters: 'key, data, lastUpdated'
});

// Helper for offline queueing
export const queueOfflineAction = async (entity, action, payload) => {
  return await db.syncQueue.add({
    entity,
    action,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0
  });
};

export const getPendingSyncCount = async () => {
  return await db.syncQueue.count();
};

export const clearSyncQueue = async () => {
  return await db.syncQueue.clear();
};
