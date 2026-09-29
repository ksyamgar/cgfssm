import bcrypt from 'bcryptjs';
import { dbGet, dbRun, dbAll } from './db.js';

export const seedDatabase = async () => {
  try {
    const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
    if (userCount && userCount.count > 0) {
      console.log('ℹ️ SQLite database already seeded with users.');
      return;
    }

    console.log('🌱 Seeding SQLite database with default roles, vehicles, and plants...');

    // Generate hashed passwords
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Admin@2026', salt);
    const citizenPasswordHash = await bcrypt.hash('Citizen@2026', salt);
    const driverPasswordHash = await bcrypt.hash('Driver@2026', salt);

    // 1. SEED USERS
    const seedUsers = [
      {
        id: 'usr_super_admin',
        name: 'State Admin (Mission Director)',
        email: 'admin.fssm@cg.gov.in',
        phone: '9826198765',
        password_hash: defaultPasswordHash,
        role: 'SUPER_ADMIN',
        designation: 'Mission Director, SBM-G (P&RD Dept)',
        district: 'Statewide (All 33 Districts)',
        block: 'All 146 Blocks',
        gp: 'All 11,664 GPs'
      },
      {
        id: 'usr_district_collector',
        name: 'District Collector (Durg)',
        email: 'collector.durg@cg.gov.in',
        phone: '9826112345',
        password_hash: defaultPasswordHash,
        role: 'DISTRICT_COLLECTOR',
        designation: 'District Magistrate & Collector, Durg',
        district: 'Durg (380)',
        block: 'All Blocks',
        gp: 'All GPs'
      },
      {
        id: 'usr_block_coord',
        name: 'Block SBM Coordinator (Patan)',
        email: 'sbm.patan@cg.gov.in',
        phone: '9826123456',
        password_hash: defaultPasswordHash,
        role: 'BLOCK_COORDINATOR',
        designation: 'Block SBM Coordinator, Patan Janpad',
        district: 'Durg (380)',
        block: 'Patan (3852)',
        gp: 'Selud & Catchment GPs'
      },
      {
        id: 'usr_gp_sarpanch',
        name: 'Gram Panchayat Sarpanch (Selud)',
        email: 'sarpanch.selud@cg.gov.in',
        phone: '9826134567',
        password_hash: defaultPasswordHash,
        role: 'GP_SARPANCH_SECRETARY',
        designation: 'Sarpanch / Sachiv, Gram Panchayat Selud',
        district: 'Durg (380)',
        block: 'Patan (3852)',
        gp: 'Selud (125430)'
      },
      {
        id: 'usr_driver_01',
        name: 'Ramesh Kumar Sahu (Driver)',
        email: 'driver.ramesh@cg.gov.in',
        phone: '9826156789',
        password_hash: driverPasswordHash,
        role: 'DRIVER',
        designation: 'Lead Vacuum Tanker Pilot',
        district: 'Durg (380)',
        block: 'Patan (3852)',
        gp: 'Patan HQ',
        vehicle_no: 'CG-07-TR-9941'
      },
      {
        id: 'usr_citizen_01',
        name: 'Bhupendra Verma',
        email: 'bhupendra.citizen@cg.gov.in',
        phone: '9826178901',
        password_hash: citizenPasswordHash,
        role: 'CITIZEN',
        designation: 'Citizen Beneficiary',
        district: 'Durg (380)',
        block: 'Patan (3852)',
        gp: 'Selud (125430)'
      }
    ];

    for (const u of seedUsers) {
      await dbRun(
        `INSERT INTO users (id, name, email, phone, password_hash, role, designation, district, block, gp, vehicle_no)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.designation, u.district, u.block, u.gp, u.vehicle_no || null]
      );
    }

    // 2. SEED VEHICLES
    const seedVehicles = [
      {
        id: 'veh_01',
        registration_no: 'CG-07-TR-9941',
        driver_name: 'Ramesh Kumar Sahu',
        driver_phone: '9826156789',
        capacity_litres: 4000,
        district: 'Durg (380)',
        lat: 21.1892,
        lng: 81.5284,
        speed: 28,
        status: 'ON_ROUTE_TO_FSTP',
        battery: 96
      },
      {
        id: 'veh_02',
        registration_no: 'CG-04-TR-4412',
        driver_name: 'Dinesh Yadav',
        driver_phone: '9826156790',
        capacity_litres: 3500,
        district: 'Raipur (378)',
        lat: 21.2514,
        lng: 81.6296,
        speed: 0,
        status: 'AVAILABLE',
        battery: 98
      },
      {
        id: 'veh_03',
        registration_no: 'CG-10-TR-8821',
        driver_name: 'Mohan Lal Gond',
        driver_phone: '9826156791',
        capacity_litres: 5000,
        district: 'Bilaspur (375)',
        lat: 22.0797,
        lng: 82.1409,
        speed: 34,
        status: 'DECANTING_AT_FSTP',
        battery: 91
      }
    ];

    for (const v of seedVehicles) {
      await dbRun(
        `INSERT INTO vehicles (id, registration_no, driver_name, driver_phone, capacity_litres, district, lat, lng, speed, status, battery)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.id, v.registration_no, v.driver_name, v.driver_phone, v.capacity_litres, v.district, v.lat, v.lng, v.speed, v.status, v.battery]
      );
    }

    // 3. SEED FSTPs
    const seedFstps = [
      {
        id: 'fstp_01',
        name: 'Patan Cluster FSTP (Selud)',
        type: 'FSTP',
        district: 'Durg (380)',
        block: 'Patan (3852)',
        capacity_kld: 15.0,
        current_load_kld: 8.4,
        lat: 21.1925,
        lng: 81.5350,
        status: 'OPERATIONAL'
      },
      {
        id: 'fstp_02',
        name: 'Mandir Hasaud Co-Treatment Plant',
        type: 'STP_CO_TREATMENT',
        district: 'Raipur (378)',
        block: 'Dharsiwa (3836)',
        capacity_kld: 30.0,
        current_load_kld: 18.2,
        lat: 21.2480,
        lng: 81.6520,
        status: 'OPERATIONAL'
      }
    ];

    for (const f of seedFstps) {
      await dbRun(
        `INSERT INTO fstps (id, name, type, district, block, capacity_kld, current_load_kld, lat, lng, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [f.id, f.name, f.type, f.district, f.block, f.capacity_kld, f.current_load_kld, f.lat, f.lng, f.status]
      );
    }

    // 4. SEED TARIFFS
    await dbRun(
      `INSERT INTO tariffs (id, district, base_fee_up_to_5km, per_km_extra, commercial_multiplier)
       VALUES (?, ?, ?, ?, ?)`,
      ['trf_durg', 'Durg (380)', 1200.0, 35.0, 1.5]
    );

    // 5. SEED INITIAL REQUEST
    await dbRun(
      `INSERT INTO fsm_requests (id, request_no, district, block, gp, village, status, citizen_name, citizen_phone, property_type, containment_type, distance_km, estimated_fee, assigned_vehicle_id, otp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'req_init_01',
        'CG-D02-B07-GP11-2026-0012',
        'Durg (380)',
        'Patan (3852)',
        'Selud (125430)',
        'Selud Ward 04',
        'EN_ROUTE_TO_FSTP',
        'Bhupendra Verma',
        '9826178901',
        'RESIDENTIAL',
        'SEPTIC_TANK',
        8.2,
        1312.0,
        'veh_01',
        '482910'
      ]
    );

    console.log('✅ SQLite Database seeded successfully.');
  } catch (err) {
    console.error('❌ Error seeding SQLite database:', err);
  }
};
