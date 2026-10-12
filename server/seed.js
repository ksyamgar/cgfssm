import bcrypt from 'bcryptjs';
import { dbGet, dbRun, dbAll, dbExec } from './db.js';

export const seedDatabase = async (force = false) => {
  try {
    const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
    const vehicleCount = await dbGet('SELECT COUNT(*) as count FROM vehicles');

    // Ensure all 17 fleet vehicles exist in SQLite
    if (!vehicleCount || vehicleCount.count < 17) {
      console.log('🛰️ Seeding/Updating all 17 TraqIndia & baseline fleet vehicles in SQLite...');
      await seedAllVehicles();
    }

    if (!force && userCount && userCount.count >= 6) {
      console.log('ℹ️ SQLite database already seeded with comprehensive data.');
      return;
    }

    console.log('🌱 Seeding SQLite database with full dynamic datasets...');

    // Clear existing tables if force seeding
    if (force) {
      await dbExec(`
        DELETE FROM users;
        DELETE FROM fsm_requests;
        DELETE FROM vehicles;
        DELETE FROM fstps;
        DELETE FROM vendors;
        DELETE FROM tariffs;
        DELETE FROM settings;
        DELETE FROM audit_logs;
      `);
    }

    // Default password hashes
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin@2026', salt);
    const officerHash = await bcrypt.hash('Officer@2026', salt);
    const citizenHash = await bcrypt.hash('Citizen@2026', salt);
    const driverHash = await bcrypt.hash('Driver@2026', salt);

    // 1. SEED ALL USERS & ROLES
    const users = [
      {
        id: 'usr_superadmin',
        name: 'Rajesh Sharma',
        role: 'SUPER_ADMIN',
        phone: '9826100001',
        email: 'admin.fssm@cg.gov.in',
        password_hash: adminHash,
        designation: 'State IT Director & System Admin',
        district: 'All (State)',
        block: 'All',
        gp: 'All'
      },
      {
        id: 'usr_state',
        name: 'Dr. Alok Shukla, IAS',
        role: 'STATE_OFFICER',
        phone: '9826100002',
        email: 'state.officer@cg.gov.in',
        password_hash: officerHash,
        designation: 'Mission Director SBM-G, Chhattisgarh',
        district: 'All (State)',
        block: 'All',
        gp: 'All'
      },
      {
        id: 'usr_dist_raipur',
        name: 'Dr. Gaurav Singh, IAS',
        role: 'DISTRICT_COORDINATOR',
        phone: '9826100003',
        email: 'collector.raipur@cg.gov.in',
        password_hash: officerHash,
        designation: 'District Magistrate & Collector, Raipur',
        district: 'Raipur (378)',
        block: 'All Blocks',
        gp: 'All GPs'
      },
      {
        id: 'usr_dist_durg',
        name: 'Richa Sharma, IAS',
        role: 'DISTRICT_COORDINATOR',
        phone: '9826100013',
        email: 'collector.durg@cg.gov.in',
        password_hash: officerHash,
        designation: 'District Magistrate & Collector, Durg',
        district: 'Durg (377)',
        block: 'All Blocks',
        gp: 'All GPs'
      },
      {
        id: 'usr_block_dharsiwa',
        name: 'Mahendra Netam',
        role: 'BLOCK_COORDINATOR',
        phone: '9826100004',
        email: 'sbm.dharsiwa@cg.gov.in',
        password_hash: officerHash,
        designation: 'Block SBM Coordinator, Dharsiwa Janpad',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        gp: 'All GPs in Block'
      },
      {
        id: 'usr_gp_mandir',
        name: 'Smt. Gayatri Devi',
        role: 'GP_OPERATOR',
        phone: '9826100005',
        email: 'sarpanch.mandirhasaud@cg.gov.in',
        password_hash: officerHash,
        designation: 'Sarpanch / VLE, Gram Panchayat Mandir Hasaud',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        gp: 'Mandir Hasaud (124805)'
      },
      {
        id: 'usr_fstp_arang',
        name: 'Dileep Kumar Soni',
        role: 'FSTP_OPERATOR',
        phone: '9826100006',
        email: 'fstp.arang@cg.gov.in',
        password_hash: officerHash,
        designation: 'Lead Plant Engineer, Arang Cluster FSTP',
        district: 'Raipur (378)',
        block: 'Arang (3835)',
        gp: 'Arang Rural HQ'
      },
      {
        id: 'usr_vendor_mahamaya',
        name: 'Shiv Kumar Sahu',
        role: 'VENDOR_ADMIN',
        phone: '9826100007',
        email: 'shiv@mahamayaclean.in',
        password_hash: officerHash,
        designation: 'Managing Partner, Shree Mahamaya Sanitation',
        district: 'Raipur (378)',
        block: 'All Blocks',
        gp: 'Cluster Base'
      },
      {
        id: 'usr_driver',
        name: 'Ramesh Patel',
        role: 'DRIVER',
        phone: '9826100008',
        email: 'driver.ramesh@cg.gov.in',
        password_hash: driverHash,
        designation: 'Vacuum Tanker Pilot (Vehicle CG-04-ME-4821)',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        gp: 'Mandir Hasaud (124805)',
        vehicle_no: 'CG-04-ME-4821'
      },
      {
        id: 'usr_worker',
        name: 'Santosh Markam',
        role: 'SANITATION_WORKER',
        phone: '9826100009',
        email: 'worker.santosh@cg.gov.in',
        password_hash: driverHash,
        designation: 'Certified Swachhata Mitra & Desludging Technician',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        gp: 'Mandir Hasaud (124805)'
      },
      {
        id: 'usr_citizen',
        name: 'Devendra Chandrakar',
        role: 'CITIZEN',
        phone: '9826100010',
        email: 'citizen.devendra@gmail.com',
        password_hash: citizenHash,
        designation: 'Citizen Beneficiary',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        gp: 'Mandir Hasaud (124805)'
      },
      {
        id: 'usr_auditor',
        name: 'Priyanka Meshram, CA',
        role: 'AUDITOR',
        phone: '9826100011',
        email: 'audit.meshram@cg.gov.in',
        password_hash: officerHash,
        designation: 'Senior State Financial & Environmental Auditor',
        district: 'All (State)',
        block: 'All',
        gp: 'All'
      }
    ];

    for (const u of users) {
      await dbRun(
        `INSERT OR REPLACE INTO users (id, name, email, phone, password_hash, role, designation, district, block, gp, vehicle_no)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.designation, u.district, u.block, u.gp, u.vehicle_no || null]
      );
    }

    // 2. SEED FSTP PLANTS
    const fstps = [
      {
        id: 'fstp_01',
        name: 'Arang Cluster Rural FSTP',
        type: 'FSTP',
        district: 'Raipur (378)',
        block: 'Arang (3835)',
        capacity_kld: 20.0,
        current_volume_kld: 14.5,
        status: 'OPERATIONAL',
        lat: 21.1950,
        lng: 81.9680,
        radius_meters: 300,
        operator_name: 'Dileep Kumar Soni',
        operator_phone: '9826100006',
        compost_stock_tons: 42.5,
        treated_water_stock_kl: 180,
        connected_gps_count: 18
      },
      {
        id: 'fstp_02',
        name: 'Patan Block Sanitation FSTP',
        type: 'FSTP',
        district: 'Durg (377)',
        block: 'Patan (3830)',
        capacity_kld: 15.0,
        current_volume_kld: 11.2,
        status: 'OPERATIONAL',
        lat: 21.0350,
        lng: 81.5320,
        radius_meters: 300,
        operator_name: 'Sunil Verma',
        operator_phone: '9826100021',
        compost_stock_tons: 28.0,
        treated_water_stock_kl: 120,
        connected_gps_count: 14
      },
      {
        id: 'fstp_03',
        name: 'Bilha Regional FSTP',
        type: 'FSTP',
        district: 'Bilaspur (375)',
        block: 'Bilha (3810)',
        capacity_kld: 25.0,
        current_volume_kld: 22.8,
        status: 'OPERATIONAL',
        lat: 22.0120,
        lng: 82.1650,
        radius_meters: 350,
        operator_name: 'Rameshwar Kashyap',
        operator_phone: '9826100022',
        compost_stock_tons: 58.4,
        treated_water_stock_kl: 240,
        connected_gps_count: 22
      },
      {
        id: 'stp_01',
        name: 'Raipur Urban STP - Nimora (Plug-in Facility)',
        type: 'URBAN_STP',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        capacity_kld: 120.0,
        current_volume_kld: 85.0,
        status: 'OPERATIONAL',
        lat: 21.1820,
        lng: 81.6750,
        radius_meters: 500,
        operator_name: 'Sanjay Deshmukh (Municipal Corp)',
        operator_phone: '9826100023',
        compost_stock_tons: 110.0,
        treated_water_stock_kl: 900,
        connected_gps_count: 30
      }
    ];

    for (const f of fstps) {
      await dbRun(
        `INSERT OR REPLACE INTO fstps (id, name, type, district, block, capacity_kld, current_volume_kld, status, lat, lng, radius_meters, operator_name, operator_phone, compost_stock_tons, treated_water_stock_kl, connected_gps_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [f.id, f.name, f.type, f.district, f.block, f.capacity_kld, f.current_volume_kld, f.status, f.lat, f.lng, f.radius_meters, f.operator_name, f.operator_phone, f.compost_stock_tons, f.treated_water_stock_kl, f.connected_gps_count]
      );
    }

    // 3. SEED VENDORS
    const vendors = [
      {
        id: 'ven_01',
        name: 'Shree Mahamaya Sanitation Services',
        reg_no: 'CG-PSSO-2024-001',
        contact_person: 'Mr. Shiv Kumar Sahu',
        phone: '9826100007',
        email: 'contact@mahamayaclean.in',
        status: 'EMPLANELED',
        upi_vpa: 'mahamaya.fssm@sbi',
        districts_covered_json: JSON.stringify(['Raipur (378)', 'Durg (377)']),
        active_vehicles: 3,
        sla_score: 94.8,
        total_trips_completed: 482,
        revenue_total_inr: 723000
      },
      {
        id: 'ven_02',
        name: 'Chhattisgarh Swachhta Nidhi PSSO',
        reg_no: 'CG-PSSO-2024-002',
        contact_person: 'Mrs. Aarti Sen',
        phone: '9826100041',
        email: 'info@cgswachhta.org',
        status: 'EMPLANELED',
        upi_vpa: 'swachhtanidhi@hdfcbank',
        districts_covered_json: JSON.stringify(['Durg (377)', 'Balod (646)']),
        active_vehicles: 2,
        sla_score: 91.2,
        total_trips_completed: 310,
        revenue_total_inr: 465000
      },
      {
        id: 'ven_03',
        name: 'Bilas Clean Tech Cooperative',
        reg_no: 'CG-PSSO-2024-003',
        contact_person: 'Dhananjay Singh',
        phone: '9826100042',
        email: 'support@bilasclean.coop',
        status: 'EMPLANELED',
        upi_vpa: 'bilasclean@icici',
        districts_covered_json: JSON.stringify(['Bilaspur (375)']),
        active_vehicles: 2,
        sla_score: 96.0,
        total_trips_completed: 220,
        revenue_total_inr: 330000
      }
    ];

    for (const v of vendors) {
      await dbRun(
        `INSERT OR REPLACE INTO vendors (id, name, reg_no, contact_person, phone, email, status, upi_vpa, districts_covered_json, active_vehicles, sla_score, total_trips_completed, revenue_total_inr)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.id, v.name, v.reg_no, v.contact_person, v.phone, v.email, v.status, v.upi_vpa, v.districts_covered_json, v.active_vehicles, v.sla_score, v.total_trips_completed, v.revenue_total_inr]
      );
    }

    // 4. SEED VEHICLES WITH GPS TELEMETRY
    await seedAllVehicles();

    // 5. SEED REQUESTS WITH DETAILED LIFE-CYCLE
    const requests = [
      {
        id: 'req_01',
        request_no: 'CG-D02-B07-GP11-2026-000101',
        citizen_name: 'Devendra Chandrakar',
        citizen_phone: '9826188201',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        gp: 'Mandir Hasaud (124805)',
        village: 'Mandir Hasaud (444102)',
        habitation: 'Ward 04, Near Ram Mandir',
        tank_type: 'CONVENTIONAL_TWO_CHAMBER',
        tank_volume_litres: 3500,
        road_width_meters: 4.5,
        distance_from_road_meters: 15,
        is_emergency: 0,
        scheduled_date: '2026-09-26',
        status: 'EN_ROUTE',
        estimated_cost: 1500,
        payment_method: 'UPI',
        payment_status: 'PAID',
        assigned_vendor_id: 'ven_01',
        assigned_vendor_name: 'Shree Mahamaya Sanitation Services',
        assigned_vehicle_id: 'veh_01',
        assigned_vehicle_no: 'CG-04-ME-4821',
        assigned_driver_id: 'usr_driver',
        assigned_driver_name: 'Ramesh Patel',
        assigned_worker_id: 'usr_worker',
        assigned_worker_name: 'Santosh Markam',
        target_fstp_id: 'fstp_01',
        target_fstp_name: 'Arang Cluster Rural FSTP',
        lat: 21.2520,
        lng: 81.7450,
        otp: '482910',
        history_json: JSON.stringify([
          { step: 1, action: 'REQUEST_SUBMITTED', actor: 'Devendra Chandrakar (Citizen)', time: '2026-09-25T08:30:00.000Z', note: 'Booked via Portal' },
          { step: 2, action: 'GP_ACKNOWLEDGED', actor: 'Smt. Gayatri Devi (GP Operator)', time: '2026-09-25T09:00:00.000Z', note: 'SMS sent to applicant' },
          { step: 3, action: 'SITE_INSPECTED', actor: 'Santosh Markam (Worker)', time: '2026-09-25T09:30:00.000Z', note: 'Road width 4.5m, accessible' },
          { step: 4, action: 'VENDOR_ASSIGNED', actor: 'Smt. Gayatri Devi (GP Operator)', time: '2026-09-25T09:45:00.000Z', note: 'Assigned to Shree Mahamaya' },
          { step: 5, action: 'PAYMENT_RECEIVED', actor: 'Devendra Chandrakar (Citizen)', time: '2026-09-25T10:00:00.000Z', note: 'UPI Ref #UPI98421095' },
          { step: 6, action: 'VEHICLE_DISPATCHED', actor: 'Shree Mahamaya (Vendor)', time: '2026-09-25T10:15:00.000Z', note: 'Vehicle CG-04-ME-4821 assigned with driver Ramesh Patel' }
        ]),
        ppe_checklist_json: JSON.stringify({ gloves: true, boots: true, mask: true, suit: true, goggles: true, sanitizer: true })
      },
      {
        id: 'req_02',
        request_no: 'CG-D02-B07-GP11-2026-000102',
        citizen_name: 'Ramprasad Sahu',
        citizen_phone: '9826177112',
        district: 'Raipur (378)',
        block: 'Arang (3835)',
        gp: 'Gullu (124755)',
        village: 'Gullu (444010)',
        habitation: 'Panchayat Bhavan Road',
        tank_type: 'CIRCULAR_PIT',
        tank_volume_litres: 2500,
        road_width_meters: 3.2,
        distance_from_road_meters: 20,
        is_emergency: 1,
        scheduled_date: '2026-09-25',
        status: 'ARRIVED',
        estimated_cost: 1200,
        payment_method: 'CASH',
        payment_status: 'PENDING',
        assigned_vendor_id: 'ven_01',
        assigned_vendor_name: 'Shree Mahamaya Sanitation Services',
        assigned_vehicle_id: 'veh_02',
        assigned_vehicle_no: 'CG-04-TA-1904',
        assigned_driver_id: 'drv_02',
        assigned_driver_name: 'Brijesh Yadav',
        assigned_worker_id: 'usr_worker',
        assigned_worker_name: 'Santosh Markam',
        target_fstp_id: 'fstp_01',
        target_fstp_name: 'Arang Cluster Rural FSTP',
        lat: 21.2110,
        lng: 81.8950,
        otp: '182049',
        history_json: JSON.stringify([
          { step: 1, action: 'EMERGENCY_REQUEST', actor: 'Ramprasad Sahu', time: '2026-09-25T07:15:00.000Z', note: 'Overflow emergency' },
          { step: 2, action: 'AUTO_APPROVED', actor: 'GP Operator', time: '2026-09-25T07:30:00.000Z', note: 'Emergency dispatch protocol' },
          { step: 3, action: 'VEHICLE_DISPATCHED', actor: 'Vendor Admin', time: '2026-09-25T08:00:00.000Z', note: 'Tractor unit deployed' },
          { step: 4, action: 'GPS_ARRIVED', actor: 'Driver (Brijesh)', time: '2026-09-25T09:40:00.000Z', note: 'Arrived at site (proximity 65m)' }
        ]),
        ppe_checklist_json: JSON.stringify({ gloves: true, boots: true, mask: true, suit: true, goggles: true, sanitizer: true })
      },
      {
        id: 'req_03',
        request_no: 'CG-D01-B03-GP04-2026-000103',
        citizen_name: 'Laxman Sinha',
        citizen_phone: '9826166304',
        district: 'Durg (377)',
        block: 'Patan (3830)',
        gp: 'Jamgaon R (124600)',
        village: 'Jamgaon R (443800)',
        habitation: 'School Para',
        tank_type: 'CONTAINMENT_BOX',
        tank_volume_litres: 4000,
        road_width_meters: 5.0,
        distance_from_road_meters: 10,
        is_emergency: 0,
        scheduled_date: '2026-09-25',
        status: 'PENDING_APPROVAL',
        estimated_cost: 1650,
        payment_method: 'UPI',
        payment_status: 'UNPAID',
        lat: 21.0420,
        lng: 81.5210,
        otp: '938102',
        history_json: JSON.stringify([
          { step: 1, action: 'REQUEST_SUBMITTED', actor: 'Laxman Sinha', time: '2026-09-25T10:00:00.000Z', note: 'Awaiting GP approval' }
        ])
      },
      {
        id: 'req_04',
        request_no: 'CG-D03-B01-GP02-2026-000098',
        citizen_name: 'Gajendra Netam',
        citizen_phone: '9826155405',
        district: 'Bilaspur (375)',
        block: 'Bilha (3810)',
        gp: 'Bodhri (124400)',
        village: 'Bodhri (443500)',
        habitation: 'Station Basti',
        tank_type: 'CONVENTIONAL_TWO_CHAMBER',
        tank_volume_litres: 3000,
        road_width_meters: 6.0,
        distance_from_road_meters: 12,
        is_emergency: 0,
        scheduled_date: '2026-09-24',
        status: 'CLOSED',
        estimated_cost: 1400,
        payment_method: 'UPI',
        payment_status: 'PAID',
        assigned_vendor_id: 'ven_03',
        assigned_vendor_name: 'Bilas Clean Tech Cooperative',
        assigned_vehicle_no: 'CG-10-GA-3150',
        target_fstp_id: 'fstp_03',
        target_fstp_name: 'Bilha Regional FSTP',
        decanted_volume_litres: 3000,
        rating: 5,
        feedback_text: 'Very clean service, no spillage in our lane. Glad this is digitized!',
        history_json: JSON.stringify([
          { step: 1, action: 'REQUEST_SUBMITTED', actor: 'Gajendra Netam', time: '2026-09-24T09:00:00.000Z' },
          { step: 2, action: 'APPROVED', actor: 'GP Operator', time: '2026-09-24T09:30:00.000Z' },
          { step: 3, action: 'CLEANING_COMPLETED', actor: 'Worker', time: '2026-09-24T13:00:00.000Z' },
          { step: 4, action: 'DISPOSED_AT_FSTP', actor: 'FSTP Operator', time: '2026-09-24T14:45:00.000Z', note: 'QR Manifest #MNF-9902 signed' },
          { step: 5, action: 'CLOSED_WITH_RATING', actor: 'Citizen', time: '2026-09-24T16:30:00.000Z', note: 'Rating 5/5' }
        ])
      }
    ];

    for (const r of requests) {
      await dbRun(
        `INSERT OR REPLACE INTO fsm_requests (
          id, request_no, citizen_name, citizen_phone, district, block, gp, village, habitation,
          tank_type, tank_volume_litres, road_width_meters, distance_from_road_meters, is_emergency,
          scheduled_date, status, estimated_cost, payment_method, payment_status,
          assigned_vendor_id, assigned_vendor_name, assigned_vehicle_id, assigned_vehicle_no,
          assigned_driver_id, assigned_driver_name, assigned_worker_id, assigned_worker_name,
          target_fstp_id, target_fstp_name, lat, lng, otp, decanted_volume_litres, rating,
          feedback_text, history_json, ppe_checklist_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id, r.request_no, r.citizen_name, r.citizen_phone, r.district, r.block, r.gp, r.village, r.habitation || '',
          r.tank_type, r.tank_volume_litres, r.road_width_meters, r.distance_from_road_meters, r.is_emergency,
          r.scheduled_date, r.status, r.estimated_cost, r.payment_method, r.payment_status,
          r.assigned_vendor_id || null, r.assigned_vendor_name || null, r.assigned_vehicle_id || null, r.assigned_vehicle_no || null,
          r.assigned_driver_id || null, r.assigned_driver_name || null, r.assigned_worker_id || null, r.assigned_worker_name || null,
          r.target_fstp_id || null, r.target_fstp_name || null, r.lat || null, r.lng || null, r.otp || null,
          r.decanted_volume_litres || null, r.rating || null, r.feedback_text || null, r.history_json || null, r.ppe_checklist_json || null
        ]
      );
    }

    // 6. SEED TARIFFS FOR DISTRICTS
    const tariffs = [
      {
        id: 'trf_raipur',
        district: 'Raipur (378)',
        base_price_inr: 800,
        base_distance_km: 5,
        rate_per_additional_km_inr: 25,
        emergency_multiplier: 1.25,
        gp_administrative_fee_inr: 100,
        tank_multipliers_json: JSON.stringify({ '1500': 1.0, '2500': 1.2, '3500': 1.4, '5000': 1.8, '8000': 2.4 })
      },
      {
        id: 'trf_durg',
        district: 'Durg (377)',
        base_price_inr: 850,
        base_distance_km: 5,
        rate_per_additional_km_inr: 28,
        emergency_multiplier: 1.25,
        gp_administrative_fee_inr: 100,
        tank_multipliers_json: JSON.stringify({ '1500': 1.0, '2500': 1.2, '3500': 1.4, '5000': 1.8, '8000': 2.4 })
      },
      {
        id: 'trf_bilaspur',
        district: 'Bilaspur (375)',
        base_price_inr: 800,
        base_distance_km: 5,
        rate_per_additional_km_inr: 25,
        emergency_multiplier: 1.25,
        gp_administrative_fee_inr: 100,
        tank_multipliers_json: JSON.stringify({ '1500': 1.0, '2500': 1.2, '3500': 1.4, '5000': 1.8, '8000': 2.4 })
      }
    ];

    for (const t of tariffs) {
      await dbRun(
        `INSERT OR REPLACE INTO tariffs (id, district, base_price_inr, base_distance_km, rate_per_additional_km_inr, emergency_multiplier, gp_administrative_fee_inr, tank_multipliers_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.district, t.base_price_inr, t.base_distance_km, t.rate_per_additional_km_inr, t.emergency_multiplier, t.gp_administrative_fee_inr, t.tank_multipliers_json]
      );
    }

    // 7. SEED SYSTEM SETTINGS
    const settings = {
      traqIndiaToken: '8731177e-cg-fssm-demo-traq-live',
      traqPollingIntervalSeconds: 30,
      slaApprovalHours: 24,
      slaCompletionHours: 48,
      geoFenceThresholdMeters: 300,
      routeDeviationThresholdKm: 2.5,
      smsGatewayEnabled: true,
      offlineSyncIntervalMs: 60000,
      autoSuspendMissingDocs: true
    };

    await dbRun(
      `INSERT OR REPLACE INTO settings (key, value_json) VALUES ('system_config', ?)`,
      [JSON.stringify(settings)]
    );

    // 8. SEED INITIAL AUDIT LOGS
    const auditLogs = [
      {
        entity_id: 'sys_01',
        entity_type: 'SYSTEM',
        action: 'SYSTEM_BOOT',
        actor_name: 'Rajesh Sharma',
        actor_role: 'SUPER_ADMIN',
        ip: '10.20.0.1',
        details: 'CG Rural FSSM Platform v1.0 initialized with SQLite WAL mode.'
      },
      {
        entity_id: 'req_01',
        entity_type: 'REQUEST',
        action: 'VEHICLE_DISPATCH',
        actor_name: 'Shiv Kumar Sahu',
        actor_role: 'VENDOR_ADMIN',
        ip: '192.168.1.104',
        details: 'Dispatched vacuum unit CG-04-ME-4821 to Mandir Hasaud.'
      }
    ];

    for (const a of auditLogs) {
      await dbRun(
        `INSERT INTO audit_logs (entity_id, entity_type, action, actor_name, actor_role, ip, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [a.entity_id, a.entity_type, a.action, a.actor_name, a.actor_role, a.ip, a.details]
      );
    }

    console.log('✅ SQLite Comprehensive dataset seeded successfully.');
  } catch (err) {
    console.error('❌ Error seeding SQLite database:', err);
  }
};

export const ALL_FLEET_VEHICLES = [
  {
    id: 'veh_01',
    reg_no: 'CG-04-ME-4821',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_01',
    vendor_name: 'Shree Mahamaya Sanitation Services',
    driver_id: 'usr_driver',
    driver_name: 'Ramesh Patel',
    driver_phone: '9826100008',
    gps_device_id: 'TRQ-CG-8801',
    lat: 21.2385,
    lng: 81.7120,
    speed_kmh: 28,
    heading_deg: 85,
    status: 'EN_ROUTE',
    puc_expiry: '2027-04-15',
    insurance_expiry: '2027-06-30',
    fitness_expiry: '2027-08-20',
    district: 'Raipur (378)',
    assigned_request_id: 'REQ-CG-2026-00104',
    battery: 94,
    has_gps_device: 1
  },
  {
    id: 'veh_02',
    reg_no: 'CG-04-TA-1904',
    type: 'TRACTOR_MOUNTED',
    capacity_litres: 3000,
    vendor_id: 'ven_01',
    vendor_name: 'Shree Mahamaya Sanitation Services',
    driver_id: 'drv_02',
    driver_name: 'Brijesh Yadav',
    driver_phone: '9826100031',
    gps_device_id: 'TRQ-CG-8802',
    lat: 21.2110,
    lng: 81.8950,
    speed_kmh: 0,
    heading_deg: 140,
    status: 'AT_SITE',
    puc_expiry: '2027-03-10',
    insurance_expiry: '2027-05-15',
    fitness_expiry: '2027-07-12',
    district: 'Raipur (378)',
    assigned_request_id: 'REQ-CG-2026-00102',
    battery: 98,
    has_gps_device: 1
  },
  {
    id: 'veh_03',
    reg_no: 'CG-07-EA-7712',
    type: 'VACUUM_TRUCK',
    capacity_litres: 5000,
    vendor_id: 'ven_02',
    vendor_name: 'Chhattisgarh Swachhta Nidhi PSSO',
    driver_id: 'drv_03',
    driver_name: 'Mohan Lal Sahu',
    driver_phone: '9826100032',
    gps_device_id: 'TRQ-CG-8803',
    lat: 21.0520,
    lng: 81.5120,
    speed_kmh: 35,
    heading_deg: 210,
    status: 'TRANSPORTING',
    puc_expiry: '2027-01-20',
    insurance_expiry: '2027-04-10',
    fitness_expiry: '2027-05-25',
    district: 'Durg (377)',
    assigned_request_id: 'REQ-CG-2026-00101',
    battery: 91,
    has_gps_device: 1
  },
  {
    id: 'veh_04',
    reg_no: 'CG-04-MK-9120',
    type: 'MINI_UNIT',
    capacity_litres: 1500,
    vendor_id: 'ven_01',
    vendor_name: 'Shree Mahamaya Sanitation Services',
    driver_id: 'drv_04',
    driver_name: 'Anand Kumar',
    driver_phone: '9826100033',
    gps_device_id: 'TRQ-CG-8804',
    lat: 21.2580,
    lng: 81.6420,
    speed_kmh: 0,
    heading_deg: 0,
    status: 'AVAILABLE',
    puc_expiry: '2027-09-10',
    insurance_expiry: '2027-11-20',
    fitness_expiry: '2027-10-15',
    district: 'Raipur (378)',
    battery: 99,
    has_gps_device: 1
  },
  {
    id: 'veh_05',
    reg_no: 'CG-10-GA-3150',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_03',
    vendor_name: 'Bilas Clean Tech Cooperative',
    driver_id: 'drv_05',
    driver_name: 'Kishore Dewangan',
    driver_phone: '9826100034',
    gps_device_id: 'TRQ-CG-8805',
    lat: 22.0250,
    lng: 82.1550,
    speed_kmh: 12,
    heading_deg: 45,
    status: 'EN_ROUTE',
    puc_expiry: '2027-02-18',
    insurance_expiry: '2027-03-30',
    fitness_expiry: '2027-06-15',
    district: 'Bilaspur (375)',
    assigned_request_id: 'REQ-CG-2026-00105',
    battery: 89,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_85',
    reg_no: 'V9-RUDA-BALOD',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_02',
    vendor_name: 'Balod Swachhata Federation',
    driver_id: 'drv_traq_85',
    driver_name: 'Mahesh Sinha',
    driver_phone: '9826100185',
    gps_device_id: 'TRQ-CG-85',
    lat: 20.7303,
    lng: 81.2052,
    speed_kmh: 0,
    heading_deg: 90,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Balod (646)',
    battery: 96,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_261903',
    reg_no: 'V1-PATHARIYA-DURG',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_02',
    vendor_name: 'Chhattisgarh Swachhta Nidhi PSSO',
    driver_id: 'drv_traq_261903',
    driver_name: 'Prakash Verma',
    driver_phone: '9826100201',
    gps_device_id: 'TRQ-CG-261903',
    lat: 21.1904,
    lng: 81.2849,
    speed_kmh: 18,
    heading_deg: 120,
    status: 'TRANSPORTING',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Durg (377)',
    battery: 92,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_261914',
    reg_no: 'V2-PATORA-DURG',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_02',
    vendor_name: 'Chhattisgarh Swachhta Nidhi PSSO',
    driver_id: 'drv_traq_261914',
    driver_name: 'Dinesh Yadav',
    driver_phone: '9826100202',
    gps_device_id: 'TRQ-CG-261914',
    lat: 21.1620,
    lng: 81.3050,
    speed_kmh: 0,
    heading_deg: 0,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Durg (377)',
    battery: 97,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_266303',
    reg_no: 'IPUR',
    type: 'VACUUM_TRUCK',
    capacity_litres: 5000,
    vendor_id: 'ven_01',
    vendor_name: 'Shree Mahamaya Sanitation Services',
    driver_id: 'drv_traq_266303',
    driver_name: 'Satish Baghel',
    driver_phone: '9826100203',
    gps_device_id: 'TRQ-CG-266303',
    lat: 21.2514,
    lng: 81.6296,
    speed_kmh: 22,
    heading_deg: 180,
    status: 'EN_ROUTE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Raipur (378)',
    battery: 90,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_266708',
    reg_no: 'V6-PARSADAWED-BILASPUR',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_03',
    vendor_name: 'Bilas Clean Tech Cooperative',
    driver_id: 'drv_traq_266708',
    driver_name: 'Suresh Kurrey',
    driver_phone: '9826100204',
    gps_device_id: 'TRQ-CG-266708',
    lat: 22.0797,
    lng: 82.1409,
    speed_kmh: 0,
    heading_deg: 45,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Bilaspur (375)',
    battery: 94,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_266709',
    reg_no: 'V8-JHAJPAURI KALA- MUNGELI',
    type: 'VACUUM_TRUCK',
    capacity_litres: 3000,
    vendor_id: 'ven_03',
    vendor_name: 'Mungeli Sanitation Services',
    driver_id: 'drv_traq_266709',
    driver_name: 'Bhupendra Rajput',
    driver_phone: '9826100205',
    gps_device_id: 'TRQ-CG-266709',
    lat: 22.0644,
    lng: 81.6888,
    speed_kmh: 15,
    heading_deg: 270,
    status: 'TRANSPORTING',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Mungeli (654)',
    battery: 88,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_266710',
    reg_no: 'V4-SARANPURKALA-KAWARDHA',
    type: 'VACUUM_TRUCK',
    capacity_litres: 3500,
    vendor_id: 'ven_02',
    vendor_name: 'Kawardha Rural Sanitation Agency',
    driver_id: 'drv_traq_266710',
    driver_name: 'Santosh Sahu',
    driver_phone: '9826100206',
    gps_device_id: 'TRQ-CG-266710',
    lat: 22.0125,
    lng: 81.2483,
    speed_kmh: 0,
    heading_deg: 0,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Kawardha (Kabirdham) (380)',
    battery: 95,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_266856',
    reg_no: 'V5-LAGRA-JANJGIR_CHAMPA',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_03',
    vendor_name: 'Janjgir Swachhata Mission',
    driver_id: 'drv_traq_266856',
    driver_name: 'Devendra Kashyap',
    driver_phone: '9826100207',
    gps_device_id: 'TRQ-CG-266856',
    lat: 22.0064,
    lng: 82.5714,
    speed_kmh: 0,
    heading_deg: 90,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Janjgir - Champa (379)',
    battery: 93,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_267599',
    reg_no: 'V10-BIRKONI-MAHASAMUND',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_01',
    vendor_name: 'Mahasamund Cleanliness Union',
    driver_id: 'drv_traq_267599',
    driver_name: 'Khemraj Chandrakar',
    driver_phone: '9826100208',
    gps_device_id: 'TRQ-CG-267599',
    lat: 21.1084,
    lng: 82.0965,
    speed_kmh: 25,
    heading_deg: 60,
    status: 'EN_ROUTE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Mahasamund (382)',
    battery: 96,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_273438',
    reg_no: 'V3-GAMAHARIYA-JASHPUR',
    type: 'VACUUM_TRUCK',
    capacity_litres: 3000,
    vendor_id: 'ven_02',
    vendor_name: 'Jashpur Tribal Sanitation Services',
    driver_id: 'drv_traq_273438',
    driver_name: 'Anil Tirkey',
    driver_phone: '9826100209',
    gps_device_id: 'TRQ-CG-273438',
    lat: 22.8841,
    lng: 84.1444,
    speed_kmh: 0,
    heading_deg: 0,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Jashpur (376)',
    battery: 91,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_277166',
    reg_no: 'V11-KOTRI-SARANGARH',
    type: 'VACUUM_TRUCK',
    capacity_litres: 4000,
    vendor_id: 'ven_03',
    vendor_name: 'Sarangarh-Bilaigarh Sanitation Cluster',
    driver_id: 'drv_traq_277166',
    driver_name: 'Rupesh Patel',
    driver_phone: '9826100210',
    gps_device_id: 'TRQ-CG-277166',
    lat: 21.5900,
    lng: 83.0800,
    speed_kmh: 0,
    heading_deg: 0,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Sarangarh-Bilaigarh (742)',
    battery: 97,
    has_gps_device: 1
  },
  {
    id: 'veh_traq_289599',
    reg_no: 'YATRI ERICKSHAW-PATORA',
    type: 'MINI_UNIT',
    capacity_litres: 1000,
    vendor_id: 'ven_02',
    vendor_name: 'Chhattisgarh Swachhta Nidhi PSSO',
    driver_id: 'drv_traq_289599',
    driver_name: 'Gopal Nishad',
    driver_phone: '9826100211',
    gps_device_id: 'TRQ-CG-289599',
    lat: 21.1640,
    lng: 81.3075,
    speed_kmh: 0,
    heading_deg: 0,
    status: 'AVAILABLE',
    puc_expiry: '2027-12-31',
    insurance_expiry: '2027-12-31',
    fitness_expiry: '2027-12-31',
    district: 'Durg (377)',
    battery: 89,
    has_gps_device: 1
  }
];

export const seedAllVehicles = async () => {
  for (const v of ALL_FLEET_VEHICLES) {
    await dbRun(
      `INSERT OR REPLACE INTO vehicles (
        id, reg_no, type, capacity_litres, vendor_id, vendor_name, driver_id, driver_name, driver_phone,
        gps_device_id, lat, lng, speed_kmh, heading_deg, status, puc_expiry, insurance_expiry, fitness_expiry,
        district, assigned_request_id, battery, has_gps_device
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.id, v.reg_no, v.type, v.capacity_litres, v.vendor_id, v.vendor_name,
        v.driver_id, v.driver_name, v.driver_phone, v.gps_device_id,
        v.lat, v.lng, v.speed_kmh, v.heading_deg, v.status,
        v.puc_expiry, v.insurance_expiry, v.fitness_expiry,
        v.district, v.assigned_request_id || null, v.battery, v.has_gps_device || 1
      ]
    );
  }
};

