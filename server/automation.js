import { dbAll, dbRun } from './db.js';

// Background automation runner
export const startAutomation = () => {
  console.log('🤖 Background Automation Service started');

  // 1. Live Vehicle Movement & Telemetry Simulation (every 12 seconds)
  setInterval(async () => {
    try {
      const vehicles = await dbAll('SELECT * FROM vehicles WHERE status != ?', ['MAINTENANCE']);
      for (const v of vehicles) {
        if (v.status === 'ON_ROUTE_TO_FSTP' || v.status === 'DECANTING_AT_FSTP') {
          // Small coordinate shift simulation
          const dLat = (Math.random() - 0.48) * 0.0015;
          const dLng = (Math.random() - 0.48) * 0.0015;
          const newLat = v.lat + dLat;
          const newLng = v.lng + dLng;
          const newSpeed = Math.floor(20 + Math.random() * 25);
          const battery = Math.max(10, v.battery - (Math.random() > 0.8 ? 1 : 0));

          await dbRun(
            'UPDATE vehicles SET lat = ?, lng = ?, speed = ?, battery = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?',
            [newLat, newLng, newSpeed, battery, v.id]
          );
        }
      }
    } catch (err) {
      console.error('Automation telemetry error:', err.message);
    }
  }, 12000);

  // 2. SLA Escalation & Overdue Alert Scanner (every 60 seconds)
  setInterval(async () => {
    try {
      // Find open requests created more than 48 hours ago
      const staleRequests = await dbAll(
        "SELECT id, request_no, status, created_at FROM fsm_requests WHERE status IN ('REQUEST_RECEIVED', 'ASSIGNED') AND datetime(created_at) < datetime('now', '-2 days')"
      );

      if (staleRequests.length > 0) {
        for (const req of staleRequests) {
          await dbRun(
            `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.id, 'SLA_BREACH', 'AUTOMATED_ESCALATION', 'SLA Automation Bot', 'SYSTEM', `Alert: Request ${req.request_no} exceeded standard 48h SLA turnaround limit.`]
          );
        }
      }
    } catch (err) {
      console.error('Automation SLA scan error:', err.message);
    }
  }, 60000);
};
