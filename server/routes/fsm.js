import express from 'express';
import { dbGet, dbRun, dbAll } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ----------------------------------------------------
// 1. FSM REQUESTS
// ----------------------------------------------------
router.get('/requests', async (req, res) => {
  try {
    const { district, status } = req.query;
    let query = 'SELECT * FROM fsm_requests WHERE 1=1';
    const params = [];

    if (district) {
      query += ' AND district LIKE ?';
      params.push(`%${district}%`);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const requests = await dbAll(query, params);
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests.' });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const {
      citizenName,
      citizenPhone,
      district,
      block,
      gp,
      village,
      propertyType = 'RESIDENTIAL',
      containmentType = 'SEPTIC_TANK',
      distanceKm = 6.2,
      estimatedFee = 1200
    } = req.body;

    const id = `req_${Date.now()}`;
    const requestNo = `CG-D02-B07-GP11-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await dbRun(
      `INSERT INTO fsm_requests (id, request_no, district, block, gp, village, status, citizen_name, citizen_phone, property_type, containment_type, distance_km, estimated_fee, otp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        requestNo,
        district || 'Raipur (378)',
        block || 'Dharsiwa (3836)',
        gp || 'Mandir Hasaud (124805)',
        village || 'Mandir Hasaud',
        'REQUEST_RECEIVED',
        citizenName || 'Citizen Beneficiary',
        citizenPhone || '9826100000',
        propertyType,
        containmentType,
        distanceKm,
        estimatedFee,
        otp
      ]
    );

    const newReq = await dbGet('SELECT * FROM fsm_requests WHERE id = ?', [id]);

    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'REQUEST', 'CREATE_REQUEST', citizenName, 'CITIZEN', `Generated Desludging Token ${requestNo} with OTP ${otp}`]
    );

    res.status(201).json({ success: true, request: newReq });
  } catch (err) {
    console.error('Request creation error:', err);
    res.status(500).json({ success: false, message: 'Failed to create request.' });
  }
});

router.put('/requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, vehicleId, driverId, actorName = 'System', actorRole = 'OFFICIAL' } = req.body;

    await dbRun(
      `UPDATE fsm_requests 
       SET status = ?, assigned_vehicle_id = COALESCE(?, assigned_vehicle_id), assigned_driver_id = COALESCE(?, assigned_driver_id), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, vehicleId || null, driverId || null, id]
    );

    const updated = await dbGet('SELECT * FROM fsm_requests WHERE id = ?', [id]);

    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'REQUEST', 'UPDATE_STATUS', actorName, actorRole, `Updated status of ${updated?.request_no} to ${status}`]
    );

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update request.' });
  }
});

// ----------------------------------------------------
// 2. FLEET VEHICLES & TELEMETRY
// ----------------------------------------------------
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await dbAll('SELECT * FROM vehicles ORDER BY registration_no ASC');
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles.' });
  }
});

// ----------------------------------------------------
// 3. FSTP TREATMENT PLANTS
// ----------------------------------------------------
router.get('/fstps', async (req, res) => {
  try {
    const fstps = await dbAll('SELECT * FROM fstps ORDER BY name ASC');
    res.json({ success: true, fstps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch FSTPs.' });
  }
});

// ----------------------------------------------------
// 4. TARIFFS
// ----------------------------------------------------
router.get('/tariffs', async (req, res) => {
  try {
    const tariffs = await dbAll('SELECT * FROM tariffs');
    res.json({ success: true, tariffs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tariffs.' });
  }
});

// ----------------------------------------------------
// 5. AUDIT LOGS
// ----------------------------------------------------
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await dbAll('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json({ success: true, auditLogs: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
});

export default router;
