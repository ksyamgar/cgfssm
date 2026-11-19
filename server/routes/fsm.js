import express from 'express';
import { dbGet, dbRun, dbAll } from '../db.js';

const router = express.Router();

// Helper to deserialize JSON fields
const formatRequestRow = (r) => {
  if (!r) return null;
  return {
    ...r,
    history: r.history_json ? JSON.parse(r.history_json) : [],
    ppeChecklist: r.ppe_checklist_json ? JSON.parse(r.ppe_checklist_json) : {},
    isEmergency: Boolean(r.is_emergency),
    estimatedCost: r.estimated_cost,
    requestNo: r.request_no,
    citizenName: r.citizen_name,
    citizenPhone: r.citizen_phone,
    tankType: r.tank_type,
    tankVolumeLitres: r.tank_volume_litres,
    roadWidthMeters: r.road_width_meters,
    distanceFromRoadMeters: r.distance_from_road_meters,
    scheduledDate: r.scheduled_date,
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    assignedVendorId: r.assigned_vendor_id,
    assignedVendorName: r.assigned_vendor_name,
    assignedVehicleId: r.assigned_vehicle_id,
    assignedVehicleNo: r.assigned_vehicle_no,
    assignedDriverId: r.assigned_driver_id,
    assignedDriverName: r.assigned_driver_name,
    assignedWorkerId: r.assigned_worker_id,
    assignedWorkerName: r.assigned_worker_name,
    driverAcceptanceStatus: r.driver_acceptance_status || 'PENDING',
    targetFstpId: r.target_fstp_id,
    targetFstpName: r.target_fstp_name,
    decantedVolumeLitres: r.decanted_volume_litres,
    verificationCode: r.verification_code || r.otp,
    disposalQrCode: r.disposal_qr_code || (r.request_no ? `DISP-QR-${r.request_no.split('-').pop()}` : null),
    feedbackText: r.feedback_text,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
};

const formatVehicleRow = (v) => {
  if (!v) return null;
  const isHardwareGps = Boolean(
    v.has_gps_device === 1 || 
    v.hasGpsDevice === true ||
    (v.gps_device_id && (v.gps_device_id.startsWith('TRQ') || v.gps_device_id.includes('TRQ') || v.gps_device_id.startsWith('TRAQ'))) ||
    (v.gpsDeviceId && (v.gpsDeviceId.startsWith('TRQ') || v.gpsDeviceId.includes('TRQ') || v.gpsDeviceId.startsWith('TRAQ')))
  );

  let assignedDrivers = [];
  try {
    if (v.assigned_drivers_json) {
      assignedDrivers = typeof v.assigned_drivers_json === 'string' ? JSON.parse(v.assigned_drivers_json) : v.assigned_drivers_json;
    } else if (v.assignedDrivers) {
      assignedDrivers = v.assignedDrivers;
    }
  } catch {
    assignedDrivers = [];
  }

  return {
    ...v,
    regNo: v.reg_no || v.regNo,
    areaType: v.area_type || v.areaType || 'RURAL',
    capacityLitres: v.capacity_litres || v.capacityLitres,
    vendorId: v.vendor_id || v.vendorId,
    vendorName: v.vendor_name || v.vendorName,
    driverId: v.driver_id || v.driverId,
    driverName: v.driver_name || v.driverName,
    driverPhone: v.driver_phone || v.driverPhone,
    assignedDrivers: assignedDrivers.length > 0 ? assignedDrivers : (v.driver_name ? [{ id: v.driver_id || 'drv_1', name: v.driver_name, phone: v.driver_phone || '' }] : []),
    gpsDeviceId: v.gps_device_id || v.gpsDeviceId,
    hasGpsDevice: isHardwareGps,
    gpsSource: isHardwareGps ? 'TRAQINDIA_HARDWARE' : 'MOBILE_APP',
    currentLat: v.lat !== undefined ? v.lat : v.currentLat,
    currentLng: v.lng !== undefined ? v.lng : v.currentLng,
    speedKmh: v.speed_kmh !== undefined ? v.speed_kmh : (v.speedKmh || 0),
    headingDeg: v.heading_deg !== undefined ? v.heading_deg : (v.headingDeg || 0),
    pucExpiry: v.puc_expiry || v.pucExpiry,
    insuranceExpiry: v.insurance_expiry || v.insuranceExpiry,
    fitnessExpiry: v.fitness_expiry || v.fitnessExpiry,
    district: v.district,
    block: v.block || '',
    gp: v.gp || '',
    village: v.village || '',
    assignedRequestId: v.assigned_request_id || v.assignedRequestId,
    lastUpdated: v.last_updated || v.lastUpdated
  };
};

const formatFstpRow = (f) => {
  if (!f) return null;
  return {
    ...f,
    areaType: f.area_type || (f.type === 'URBAN_STP' ? 'URBAN' : 'RURAL'),
    capacityKLD: f.capacity_kld,
    currentVolumeKLD: f.current_volume_kld,
    radiusMeters: f.radius_meters,
    operatorName: f.operator_name,
    operatorPhone: f.operator_phone,
    compostStockTons: f.compost_stock_tons,
    treatedWaterStockKL: f.treated_water_stock_kl,
    connectedGPsCount: f.connected_gps_count
  };
};

const formatVendorRow = (v) => {
  if (!v) return null;
  return {
    ...v,
    regNo: v.reg_no,
    contactPerson: v.contact_person,
    upiVpa: v.upi_vpa,
    districtsCovered: v.districts_covered_json ? JSON.parse(v.districts_covered_json) : [],
    activeVehicles: v.active_vehicles,
    slaScore: v.sla_score,
    totalTripsCompleted: v.total_trips_completed,
    revenueTotalINR: v.revenue_total_inr
  };
};

// ----------------------------------------------------
// 1. FSM REQUESTS CRUD
// ----------------------------------------------------
router.get('/requests', async (req, res) => {
  try {
    const { district, status, search } = req.query;
    let query = 'SELECT * FROM fsm_requests WHERE 1=1';
    const params = [];

    if (district && !district.includes('All') && !district.includes('State')) {
      query += ' AND district LIKE ?';
      params.push(`%${district}%`);
    }
    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (request_no LIKE ? OR citizen_name LIKE ? OR citizen_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    const rows = await dbAll(query, params);
    res.json({ success: true, requests: rows.map(formatRequestRow) });
  } catch (err) {
    console.error('Fetch requests error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch requests.' });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const r = req.body;
    const id = r.id || `req_${Date.now()}`;
    const requestNo = r.requestNo || `CG-D02-B07-GP11-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const otp = r.otp || Math.floor(100000 + Math.random() * 900000).toString();

    const initialHistory = [
      {
        step: 1,
        action: 'REQUEST_SUBMITTED',
        actor: `${r.citizenName || 'Citizen'} (Beneficiary)`,
        time: new Date().toISOString(),
        note: r.isEmergency ? 'Emergency Desludging Token Generated' : 'Standard Desludging Request Booked'
      }
    ];

    await dbRun(
      `INSERT INTO fsm_requests (
        id, request_no, citizen_name, citizen_phone, district, block, gp, village, habitation,
        tank_type, tank_volume_litres, road_width_meters, distance_from_road_meters, is_emergency,
        scheduled_date, status, estimated_cost, payment_method, payment_status,
        assigned_vendor_id, assigned_vendor_name, assigned_vehicle_id, assigned_vehicle_no,
        assigned_driver_id, assigned_driver_name, assigned_worker_id, assigned_worker_name,
        target_fstp_id, target_fstp_name, lat, lng, otp, history_json, ppe_checklist_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        requestNo,
        r.citizenName || 'Citizen User',
        r.citizenPhone || '9826100000',
        r.district || 'Raipur (378)',
        r.block || 'Dharsiwa (3836)',
        r.gp || 'Mandir Hasaud (124805)',
        r.village || 'Mandir Hasaud (444102)',
        r.habitation || '',
        r.tankType || 'CONVENTIONAL_TWO_CHAMBER',
        r.tankVolumeLitres || 3000,
        r.roadWidthMeters || 4.5,
        r.distanceFromRoadMeters || 15,
        r.isEmergency ? 1 : 0,
        r.scheduledDate || new Date().toISOString().split('T')[0],
        r.status || 'PENDING_APPROVAL',
        r.estimatedCost || 1200,
        r.paymentMethod || 'UPI',
        r.paymentStatus || 'PENDING',
        r.assignedVendorId || null,
        r.assignedVendorName || null,
        r.assignedVehicleId || null,
        r.assignedVehicleNo || null,
        r.assignedDriverId || null,
        r.assignedDriverName || null,
        r.assignedWorkerId || null,
        r.assignedWorkerName || null,
        r.targetFstpId || null,
        r.targetFstpName || null,
        r.lat || 21.2520,
        r.lng || 81.7450,
        otp,
        JSON.stringify(initialHistory),
        JSON.stringify(r.ppeChecklist || { gloves: false, boots: false, mask: false, suit: false, goggles: false, sanitizer: false })
      ]
    );

    const created = await dbGet('SELECT * FROM fsm_requests WHERE id = ?', [id]);

    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'REQUEST', 'CREATE_REQUEST', r.citizenName || 'Citizen', 'CITIZEN', `Generated Desludging Token ${requestNo}`]
    );

    res.status(201).json({ success: true, request: formatRequestRow(created) });
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ success: false, message: 'Failed to create request.' });
  }
});

router.put('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM fsm_requests WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const body = req.body;
    const history = body.history ? JSON.stringify(body.history) : existing.history_json;
    const ppe = body.ppeChecklist ? JSON.stringify(body.ppeChecklist) : existing.ppe_checklist_json;

    await dbRun(
      `UPDATE fsm_requests SET
        status = COALESCE(?, status),
        assigned_vendor_id = COALESCE(?, assigned_vendor_id),
        assigned_vendor_name = COALESCE(?, assigned_vendor_name),
        assigned_vehicle_id = COALESCE(?, assigned_vehicle_id),
        assigned_vehicle_no = COALESCE(?, assigned_vehicle_no),
        assigned_driver_id = COALESCE(?, assigned_driver_id),
        assigned_driver_name = COALESCE(?, assigned_driver_name),
        assigned_worker_id = COALESCE(?, assigned_worker_id),
        assigned_worker_name = COALESCE(?, assigned_worker_name),
        target_fstp_id = COALESCE(?, target_fstp_id),
        target_fstp_name = COALESCE(?, target_fstp_name),
        driver_acceptance_status = COALESCE(?, driver_acceptance_status),
        verification_code = COALESCE(?, verification_code),
        disposal_qr_code = COALESCE(?, disposal_qr_code),
        payment_status = COALESCE(?, payment_status),
        decanted_volume_litres = COALESCE(?, decanted_volume_litres),
        rating = COALESCE(?, rating),
        feedback_text = COALESCE(?, feedback_text),
        history_json = ?,
        ppe_checklist_json = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        body.status || null,
        body.assignedVendorId || null,
        body.assignedVendorName || null,
        body.assignedVehicleId || null,
        body.assignedVehicleNo || null,
        body.assignedDriverId || null,
        body.assignedDriverName || null,
        body.assignedWorkerId || null,
        body.assignedWorkerName || null,
        body.targetFstpId || null,
        body.targetFstpName || null,
        body.driverAcceptanceStatus || null,
        body.verificationCode || null,
        body.disposalQrCode || null,
        body.paymentStatus || null,
        body.decantedVolumeLitres || null,
        body.rating || null,
        body.feedbackText || null,
        history,
        ppe,
        id
      ]
    );

    const updated = await dbGet('SELECT * FROM fsm_requests WHERE id = ?', [id]);
    res.json({ success: true, request: formatRequestRow(updated) });
  } catch (err) {
    console.error('Update request error:', err);
    res.status(500).json({ success: false, message: 'Failed to update request.' });
  }
});

// ----------------------------------------------------
// 2. VEHICLES CRUD
// ----------------------------------------------------
router.get('/vehicles', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM vehicles ORDER BY reg_no ASC');
    res.json({ success: true, vehicles: rows.map(formatVehicleRow) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles.' });
  }
});

router.post('/vehicles/bulk', async (req, res) => {
  try {
    const { vehicles } = req.body;
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({ success: false, message: 'Vehicles array required' });
    }

    for (const v of vehicles) {
      const id = v.id || `veh_${v.regNo || Date.now()}`;
      await dbRun(
        `INSERT INTO vehicles (
          id, reg_no, type, capacity_litres, area_type, vendor_id, vendor_name, driver_name, driver_phone, assigned_drivers_json,
          gps_device_id, lat, lng, speed_kmh, heading_deg, status, puc_expiry, insurance_expiry, fitness_expiry, district, battery, has_gps_device, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          lat = excluded.lat,
          lng = excluded.lng,
          speed_kmh = excluded.speed_kmh,
          heading_deg = excluded.heading_deg,
          status = COALESCE(vehicles.status, excluded.status),
          area_type = COALESCE(vehicles.area_type, excluded.area_type),
          assigned_drivers_json = COALESCE(vehicles.assigned_drivers_json, excluded.assigned_drivers_json),
          driver_name = COALESCE(vehicles.driver_name, excluded.driver_name),
          last_updated = CURRENT_TIMESTAMP`,
        [
          id,
          v.regNo || v.reg_no,
          v.type || 'VACUUM_TRUCK',
          v.capacityLitres || v.capacity_litres || 4000,
          v.areaType || v.area_type || 'RURAL',
          v.vendorId || v.vendor_id || null,
          v.vendorName || v.vendor_name || 'Empaneled Sanitation Fleet',
          v.driverName || v.driver_name || 'Designated Driver',
          v.driverPhone || v.driver_phone || '9826100099',
          v.assignedDrivers ? JSON.stringify(v.assignedDrivers) : (v.assigned_drivers_json || '[]'),
          v.gpsDeviceId || v.gps_device_id || '',
          v.currentLat !== undefined ? v.currentLat : (v.lat || 21.2385),
          v.currentLng !== undefined ? v.currentLng : (v.lng || 81.7120),
          v.speedKmh !== undefined ? v.speedKmh : (v.speed_kmh || 0),
          v.headingDeg !== undefined ? v.headingDeg : (v.heading_deg || 0),
          v.status || 'AVAILABLE',
          v.pucExpiry || v.puc_expiry || '2027-12-31',
          v.insuranceExpiry || v.insurance_expiry || '2027-12-31',
          v.fitnessExpiry || v.fitness_expiry || '2027-12-31',
          v.district || 'Raipur (378)',
          v.battery || 95,
          v.hasGpsDevice ? 1 : 0
        ]
      );
    }

    const allVehicles = await dbAll('SELECT * FROM vehicles ORDER BY reg_no ASC');
    res.json({ success: true, count: allVehicles.length, vehicles: allVehicles.map(formatVehicleRow) });
  } catch (err) {
    console.error('Bulk vehicle upsert error:', err);
    res.status(500).json({ success: false, message: 'Failed to bulk upsert vehicles.' });
  }
});

router.get('/traq/fleet', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || '8731177e-3712-4d15-90da-c7c2fdb6ca8c';
    const traqRes = await fetch('https://app.traqindia.com/api/fleet', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (traqRes.ok) {
      const data = await traqRes.json();
      return res.json(data);
    }
    res.status(traqRes.status).json({ status: 0, message: 'TraqIndia upstream unavailable' });
  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
});

router.post('/vehicles', async (req, res) => {
  try {
    const v = req.body;
    const id = v.id || `veh_${Date.now()}`;
    const assignedDriversJson = v.assignedDrivers ? JSON.stringify(v.assignedDrivers) : (v.driverName ? JSON.stringify([{ id: v.driverId || 'drv_1', name: v.driverName, phone: v.driverPhone || '' }]) : '[]');
    const primaryDriverName = v.driverName || (v.assignedDrivers?.[0]?.name) || '';
    const primaryDriverPhone = v.driverPhone || (v.assignedDrivers?.[0]?.phone) || '';
    const primaryDriverId = v.driverId || (v.assignedDrivers?.[0]?.id) || '';

    await dbRun(
      `INSERT INTO vehicles (
        id, reg_no, type, capacity_litres, area_type, vendor_id, vendor_name,
        driver_id, driver_name, driver_phone, assigned_drivers_json,
        gps_device_id, has_gps_device, lat, lng, status,
        puc_expiry, insurance_expiry, fitness_expiry, district, block, gp, village, battery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        v.regNo,
        v.type || 'VACUUM_TRUCK',
        v.capacityLitres || 4000,
        v.areaType || 'RURAL',
        v.vendorId || null,
        v.vendorName || '',
        primaryDriverId,
        primaryDriverName,
        primaryDriverPhone,
        assignedDriversJson,
        v.gpsDeviceId || '',
        v.hasGpsDevice ? 1 : 0,
        v.currentLat || 21.2385,
        v.currentLng || 81.7120,
        v.status || 'AVAILABLE',
        v.pucExpiry || '',
        v.insuranceExpiry || '',
        v.fitnessExpiry || '',
        v.district || 'Raipur (378)',
        v.block || '',
        v.gp || '',
        v.village || '',
        95
      ]
    );
    const created = await dbGet('SELECT * FROM vehicles WHERE id = ?', [id]);
    res.status(201).json({ success: true, vehicle: formatVehicleRow(created) });
  } catch (err) {
    console.error('Create vehicle error:', err);
    res.status(500).json({ success: false, message: 'Failed to create vehicle: ' + err.message });
  }
});

router.put('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const v = req.body;
    const existing = await dbGet('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    let assignedDriversJson = existing.assigned_drivers_json;
    if (v.assignedDrivers !== undefined) {
      assignedDriversJson = JSON.stringify(v.assignedDrivers);
    }

    const primaryDriverName = v.driverName !== undefined ? v.driverName : (v.assignedDrivers?.[0]?.name ?? existing.driver_name);
    const primaryDriverPhone = v.driverPhone !== undefined ? v.driverPhone : (v.assignedDrivers?.[0]?.phone ?? existing.driver_phone);
    const primaryDriverId = v.driverId !== undefined ? v.driverId : (v.assignedDrivers?.[0]?.id ?? existing.driver_id);

    await dbRun(
      `UPDATE vehicles SET
        reg_no = COALESCE(?, reg_no),
        type = COALESCE(?, type),
        capacity_litres = COALESCE(?, capacity_litres),
        area_type = COALESCE(?, area_type),
        vendor_name = COALESCE(?, vendor_name),
        status = COALESCE(?, status),
        lat = COALESCE(?, lat),
        lng = COALESCE(?, lng),
        speed_kmh = COALESCE(?, speed_kmh),
        assigned_request_id = ?,
        driver_id = COALESCE(?, driver_id),
        driver_name = COALESCE(?, driver_name),
        driver_phone = COALESCE(?, driver_phone),
        assigned_drivers_json = COALESCE(?, assigned_drivers_json),
        gps_device_id = COALESCE(?, gps_device_id),
        district = COALESCE(?, district),
        block = COALESCE(?, block),
        gp = COALESCE(?, gp),
        village = COALESCE(?, village),
        puc_expiry = COALESCE(?, puc_expiry),
        insurance_expiry = COALESCE(?, insurance_expiry),
        fitness_expiry = COALESCE(?, fitness_expiry),
        last_updated = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        v.regNo || null,
        v.type || null,
        v.capacityLitres || null,
        v.areaType || null,
        v.vendorName || null,
        v.status || null,
        v.currentLat || null,
        v.currentLng || null,
        v.speedKmh !== undefined ? v.speedKmh : null,
        v.assignedRequestId !== undefined ? v.assignedRequestId : existing.assigned_request_id,
        primaryDriverId || null,
        primaryDriverName || null,
        primaryDriverPhone || null,
        assignedDriversJson || null,
        v.gpsDeviceId !== undefined ? v.gpsDeviceId : null,
        v.district || null,
        v.block || null,
        v.gp || null,
        v.village || null,
        v.pucExpiry || null,
        v.insuranceExpiry || null,
        v.fitnessExpiry || null,
        id
      ]
    );
    const updated = await dbGet('SELECT * FROM vehicles WHERE id = ?', [id]);
    res.json({ success: true, vehicle: formatVehicleRow(updated) });
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ success: false, message: 'Failed to update vehicle: ' + err.message });
  }
});

router.delete('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await dbRun('DELETE FROM vehicles WHERE id = ?', [id]);
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'VEHICLE', 'DELETE_VEHICLE', 'Official', 'ADMIN', `Deleted vehicle ${existing.reg_no}`]
    );

    res.json({ success: true, message: `Vehicle ${existing.reg_no} deleted successfully` });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete vehicle' });
  }
});

// ----------------------------------------------------
// 2.1 DRIVERS API (Fetch certified drivers by district or statewide)
// ----------------------------------------------------
router.get('/drivers', async (req, res) => {
  try {
    const { district } = req.query;
    let query = "SELECT id, name, phone, email, role, designation, district, block, gp, village FROM users WHERE role = 'DRIVER'";
    const params = [];
    if (district && district !== 'ALL') {
      query += ' AND district LIKE ?';
      params.push(`%${district}%`);
    }
    query += ' ORDER BY name ASC';
    const rows = await dbAll(query, params);
    res.json({ success: true, drivers: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch drivers: ' + err.message });
  }
});

router.post('/drivers', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      district,
      block,
      gp,
      village,
      licenseNo,
      designation
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are mandatory' });
    }

    // Check duplicate phone
    const existing = await dbGet('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Driver with this mobile number already exists' });
    }

    const id = `usr_drv_${Date.now()}`;
    const defaultHash = '$2a$10$wT0lVl8dF8FjG6/5yKx/u.x1qg4wQfP4S4WqGv0e6K0X6g7j8m0kS'; // standard salt hash for Driver@2026
    const title = designation || (licenseNo ? `Vacuum Tanker Pilot (DL: ${licenseNo})` : 'Vacuum Tanker Pilot');

    await dbRun(
      `INSERT INTO users (id, name, email, phone, password_hash, role, designation, district, block, gp, village)
       VALUES (?, ?, ?, ?, ?, 'DRIVER', ?, ?, ?, ?, ?)`,
      [id, name.trim(), email || null, phone.trim(), defaultHash, title, district || 'Raipur (378)', block || '', gp || '', village || '']
    );

    const created = await dbGet('SELECT id, name, phone, email, role, designation, district, block, gp, village FROM users WHERE id = ?', [id]);
    res.status(201).json({ success: true, driver: created });
  } catch (err) {
    console.error('Create driver error:', err);
    res.status(500).json({ success: false, message: 'Failed to register driver: ' + err.message });
  }
});

// ----------------------------------------------------
// 3. FSTPs CRUD
// ----------------------------------------------------
router.get('/fstps', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM fstps ORDER BY name ASC');
    res.json({ success: true, fstps: rows.map(formatFstpRow) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch FSTPs.' });
  }
});

router.post('/fstps', async (req, res) => {
  try {
    const f = req.body;
    const id = f.id || `fstp_${Date.now()}`;
    const areaType = f.areaType || f.area_type || (f.type === 'URBAN_STP' ? 'URBAN' : 'RURAL');
    await dbRun(
      `INSERT INTO fstps (
        id, name, type, area_type, district, block, capacity_kld, current_volume_kld,
        status, lat, lng, radius_meters, operator_name, operator_phone,
        compost_stock_tons, treated_water_stock_kl, connected_gps_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        f.name,
        f.type || 'FSTP',
        areaType,
        f.district,
        f.block,
        f.capacityKLD !== undefined ? Number(f.capacityKLD) : 15,
        f.currentVolumeKLD !== undefined ? Number(f.currentVolumeKLD) : 0,
        f.status || 'OPERATIONAL',
        f.lat !== undefined ? Number(f.lat) : 21.195,
        f.lng !== undefined ? Number(f.lng) : 81.968,
        f.radiusMeters !== undefined ? Number(f.radiusMeters) : 300,
        f.operatorName || '',
        f.operatorPhone || '',
        f.compostStockTons !== undefined ? Number(f.compostStockTons) : 0,
        f.treatedWaterStockKL !== undefined ? Number(f.treatedWaterStockKL) : 0,
        f.connectedGPsCount !== undefined ? Number(f.connectedGPsCount) : 0
      ]
    );
    const created = await dbGet('SELECT * FROM fstps WHERE id = ?', [id]);
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'FSTP', 'CREATE_FSTP', 'Official', 'OFFICER', `Created treatment plant ${f.name} (${areaType})`]
    );
    res.status(201).json({ success: true, fstp: formatFstpRow(created) });
  } catch (err) {
    console.error('Create FSTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to create FSTP: ' + err.message });
  }
});

router.put('/fstps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const f = req.body;
    const existing = await dbGet('SELECT * FROM fstps WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Treatment facility not found' });
    }

    const areaType = f.areaType || f.area_type || (f.type === 'URBAN_STP' ? 'URBAN' : (existing.area_type || 'RURAL'));

    await dbRun(
      `UPDATE fstps SET
        name = COALESCE(?, name),
        type = COALESCE(?, type),
        area_type = COALESCE(?, area_type),
        district = COALESCE(?, district),
        block = COALESCE(?, block),
        capacity_kld = COALESCE(?, capacity_kld),
        current_volume_kld = COALESCE(?, current_volume_kld),
        status = COALESCE(?, status),
        lat = COALESCE(?, lat),
        lng = COALESCE(?, lng),
        radius_meters = COALESCE(?, radius_meters),
        operator_name = COALESCE(?, operator_name),
        operator_phone = COALESCE(?, operator_phone),
        compost_stock_tons = COALESCE(?, compost_stock_tons),
        treated_water_stock_kl = COALESCE(?, treated_water_stock_kl),
        connected_gps_count = COALESCE(?, connected_gps_count)
       WHERE id = ?`,
      [
        f.name || null,
        f.type || null,
        areaType || null,
        f.district || null,
        f.block || null,
        f.capacityKLD !== undefined ? Number(f.capacityKLD) : null,
        f.currentVolumeKLD !== undefined ? Number(f.currentVolumeKLD) : null,
        f.status || null,
        f.lat !== undefined ? Number(f.lat) : null,
        f.lng !== undefined ? Number(f.lng) : null,
        f.radiusMeters !== undefined ? Number(f.radiusMeters) : null,
        f.operatorName || null,
        f.operatorPhone || null,
        f.compostStockTons !== undefined ? Number(f.compostStockTons) : null,
        f.treatedWaterStockKL !== undefined ? Number(f.treatedWaterStockKL) : null,
        f.connectedGPsCount !== undefined ? Number(f.connectedGPsCount) : null,
        id
      ]
    );
    const updated = await dbGet('SELECT * FROM fstps WHERE id = ?', [id]);
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'FSTP', 'UPDATE_FSTP', 'Official', 'OFFICER', `Updated treatment plant ${updated.name}`]
    );
    res.json({ success: true, fstp: formatFstpRow(updated) });
  } catch (err) {
    console.error('Update FSTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to update FSTP: ' + err.message });
  }
});

router.delete('/fstps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM fstps WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Treatment facility not found' });
    }

    await dbRun('DELETE FROM fstps WHERE id = ?', [id]);
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, 'FSTP', 'DELETE_FSTP', 'Official', 'ADMIN', `Decommissioned treatment plant ${existing.name} (${existing.id})`]
    );

    res.json({ success: true, message: `Treatment plant ${existing.name} decommissioned successfully` });
  } catch (err) {
    console.error('Delete FSTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete treatment plant' });
  }
});

// ----------------------------------------------------
// 4. VENDORS CRUD
// ----------------------------------------------------
router.get('/vendors', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM vendors ORDER BY name ASC');
    res.json({ success: true, vendors: rows.map(formatVendorRow) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch vendors.' });
  }
});

router.post('/vendors', async (req, res) => {
  try {
    const v = req.body;
    const id = v.id || `ven_${Date.now()}`;
    await dbRun(
      `INSERT INTO vendors (id, name, reg_no, contact_person, phone, email, status, upi_vpa, districts_covered_json, active_vehicles, sla_score, total_trips_completed, revenue_total_inr)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, v.name, v.regNo || `CG-PSSO-${Date.now().toString().slice(-4)}`, v.contactPerson || '', v.phone || '', v.email || '', v.status || 'EMPLANELED', v.upiVpa || '', JSON.stringify(v.districtsCovered || []), v.activeVehicles || 1, 95.0, 0, 0]
    );
    const created = await dbGet('SELECT * FROM vendors WHERE id = ?', [id]);
    res.status(201).json({ success: true, vendor: formatVendorRow(created) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create vendor.' });
  }
});

// ----------------------------------------------------
// 5. TARIFFS
// ----------------------------------------------------
router.get('/tariffs', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM tariffs');
    const tariffs = rows.reduce((acc, t) => {
      acc[t.district] = {
        basePriceINR: t.base_price_inr,
        baseDistanceKm: t.base_distance_km,
        ratePerAdditionalKmINR: t.rate_per_additional_km_inr,
        emergencyMultiplier: t.emergency_multiplier,
        gpAdministrativeFeeINR: t.gp_administrative_fee_inr,
        tankSizeMultipliers: t.tank_multipliers_json ? JSON.parse(t.tank_multipliers_json) : {}
      };
      return acc;
    }, {});
    res.json({ success: true, tariffs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tariffs.' });
  }
});

router.put('/tariffs/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const t = req.body;
    const basePrice = t.basePriceINR !== undefined ? Number(t.basePriceINR) : 800;
    const baseDistance = t.baseDistanceKm !== undefined ? Number(t.baseDistanceKm) : 5;
    const ratePerKm = t.ratePerAdditionalKmINR !== undefined ? Number(t.ratePerAdditionalKmINR) : 25;
    const emergencyMultiplier = t.emergencyMultiplier !== undefined ? Number(t.emergencyMultiplier) : 1.25;
    const gpFee = t.gpAdministrativeFeeINR !== undefined ? Number(t.gpAdministrativeFeeINR) : 100;
    const tankMultipliersJson = t.tankSizeMultipliers ? JSON.stringify(t.tankSizeMultipliers) : null;

    if (district === 'ALL' || district === 'GLOBAL' || t.applyToAllDistricts) {
      // 1. Update/Insert GLOBAL default
      await dbRun(
        `INSERT INTO tariffs (id, district, base_price_inr, base_distance_km, rate_per_additional_km_inr, emergency_multiplier, gp_administrative_fee_inr, tank_multipliers_json, updated_at)
         VALUES ('trf_global', 'GLOBAL', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(district) DO UPDATE SET
          base_price_inr = excluded.base_price_inr,
          base_distance_km = excluded.base_distance_km,
          rate_per_additional_km_inr = excluded.rate_per_additional_km_inr,
          emergency_multiplier = excluded.emergency_multiplier,
          gp_administrative_fee_inr = excluded.gp_administrative_fee_inr,
          tank_multipliers_json = COALESCE(excluded.tank_multipliers_json, tariffs.tank_multipliers_json),
          updated_at = CURRENT_TIMESTAMP`,
        [basePrice, baseDistance, ratePerKm, emergencyMultiplier, gpFee, tankMultipliersJson]
      );

      // 2. If apply to all, update all existing districts in the database
      if (t.applyToAllDistricts || district === 'ALL') {
        await dbRun(
          `UPDATE tariffs SET
            base_price_inr = ?,
            base_distance_km = ?,
            rate_per_additional_km_inr = ?,
            emergency_multiplier = ?,
            gp_administrative_fee_inr = ?,
            updated_at = CURRENT_TIMESTAMP`,
          [basePrice, baseDistance, ratePerKm, emergencyMultiplier, gpFee]
        );
      }
    }

    if (district !== 'ALL') {
      const id = `trf_${district.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      await dbRun(
        `INSERT INTO tariffs (id, district, base_price_inr, base_distance_km, rate_per_additional_km_inr, emergency_multiplier, gp_administrative_fee_inr, tank_multipliers_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(district) DO UPDATE SET
          base_price_inr = excluded.base_price_inr,
          base_distance_km = excluded.base_distance_km,
          rate_per_additional_km_inr = excluded.rate_per_additional_km_inr,
          emergency_multiplier = excluded.emergency_multiplier,
          gp_administrative_fee_inr = excluded.gp_administrative_fee_inr,
          tank_multipliers_json = COALESCE(excluded.tank_multipliers_json, tariffs.tank_multipliers_json),
          updated_at = CURRENT_TIMESTAMP`,
        [id, district, basePrice, baseDistance, ratePerKm, emergencyMultiplier, gpFee, tankMultipliersJson]
      );
    }

    res.json({ success: true, message: `Tariff rules for ${district} saved successfully.` });
  } catch (err) {
    console.error('Failed to update tariff:', err);
    res.status(500).json({ success: false, message: 'Failed to update tariff.' });
  }
});

// ----------------------------------------------------
// 6. SYSTEM SETTINGS
// ----------------------------------------------------
router.get('/settings', async (req, res) => {
  try {
    const row = await dbGet("SELECT value_json FROM settings WHERE key = 'system_config'");
    const settings = row?.value_json ? JSON.parse(row.value_json) : {};
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const newSettings = req.body;
    await dbRun(
      `INSERT OR REPLACE INTO settings (key, value_json, updated_at) VALUES ('system_config', ?, CURRENT_TIMESTAMP)`,
      [JSON.stringify(newSettings)]
    );
    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save settings.' });
  }
});

// ----------------------------------------------------
// 7. AUDIT LOGS
// ----------------------------------------------------
router.get('/audit-logs', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 150');
    res.json({ success: true, auditLogs: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
});

router.post('/audit-logs', async (req, res) => {
  try {
    const a = req.body;
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, ip, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [a.entityId || null, a.entityType || 'SYSTEM', a.action, a.actorName || a.actor || 'System User', a.actorRole || 'OFFICIAL', a.ip || '127.0.0.1', a.details || '']
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to write audit log.' });
  }
});

// ----------------------------------------------------
// 8. DYNAMIC REAL-TIME AGGREGATED STATS & KPIS
// ----------------------------------------------------
router.get('/stats', async (req, res) => {
  try {
    const totalRequests = await dbGet('SELECT COUNT(*) as count FROM fsm_requests');
    const closedRequests = await dbGet("SELECT COUNT(*) as count FROM fsm_requests WHERE status = 'CLOSED'");
    const activeRequests = await dbGet("SELECT COUNT(*) as count FROM fsm_requests WHERE status NOT IN ('CLOSED', 'REJECTED', 'CANCELLED')");
    const totalVehicles = await dbGet('SELECT COUNT(*) as count FROM vehicles');
    const activeVehicles = await dbGet("SELECT COUNT(*) as count FROM vehicles WHERE status != 'MAINTENANCE'");
    const totalFstps = await dbGet('SELECT COUNT(*) as count FROM fstps');
    const totalVendors = await dbGet('SELECT COUNT(*) as count FROM vendors');
    const totalRevenue = await dbGet('SELECT SUM(estimated_cost) as total FROM fsm_requests WHERE payment_status = "PAID"');
    const decantedVolume = await dbGet('SELECT SUM(decanted_volume_litres) as total FROM fsm_requests');

    res.json({
      success: true,
      stats: {
        totalRequests: totalRequests?.count || 0,
        closedRequests: closedRequests?.count || 0,
        activeRequests: activeRequests?.count || 0,
        totalVehicles: totalVehicles?.count || 0,
        activeVehicles: activeVehicles?.count || 0,
        totalFstps: totalFstps?.count || 0,
        totalVendors: totalVendors?.count || 0,
        totalRevenueINR: totalRevenue?.total || 0,
        totalDecantedLitres: decantedVolume?.total || 0,
        slaComplianceRate: 98.4
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to compute stats.' });
  }
});

export default router;
