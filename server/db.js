import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dataDir, 'cgfssm.sqlite');
const sqlite = sqlite3.verbose();

// Initialize embedded SQLite connection
export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`✅ Embedded SQLite Database connected at: ${dbPath}`);
  }
});

// Promisified helper methods for synchronous-like await execution
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const dbExec = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Initialize schema with WAL mode & Foreign Keys enabled
export const initDatabase = async () => {
  try {
    // 1. Enable WAL mode & Foreign Keys
    await dbRun('PRAGMA foreign_keys = ON;');
    await dbRun('PRAGMA journal_mode = WAL;');
    await dbRun('PRAGMA synchronous = NORMAL;');

    console.log('⚡ SQLite PRAGMA journal_mode=WAL & foreign_keys=ON initialized');

    // 2. Create Users table (with bcrypt password hash & role-based tenancy)
    await dbExec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        designation TEXT,
        district TEXT,
        block TEXT,
        gp TEXT,
        village TEXT,
        vehicle_no TEXT,
        company_name TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fsm_requests (
        id TEXT PRIMARY KEY,
        request_no TEXT UNIQUE NOT NULL,
        citizen_name TEXT NOT NULL,
        citizen_phone TEXT NOT NULL,
        district TEXT NOT NULL,
        block TEXT NOT NULL,
        gp TEXT NOT NULL,
        village TEXT NOT NULL,
        habitation TEXT,
        tank_type TEXT DEFAULT 'CONVENTIONAL_TWO_CHAMBER',
        tank_volume_litres INTEGER DEFAULT 3000,
        road_width_meters REAL DEFAULT 4.5,
        distance_from_road_meters REAL DEFAULT 15,
        is_emergency INTEGER DEFAULT 0,
        scheduled_date TEXT,
        status TEXT NOT NULL,
        estimated_cost REAL DEFAULT 1200.0,
        payment_method TEXT DEFAULT 'UPI',
        payment_status TEXT DEFAULT 'PENDING',
        assigned_vendor_id TEXT,
        assigned_vendor_name TEXT,
        assigned_vehicle_id TEXT,
        assigned_vehicle_no TEXT,
        assigned_driver_id TEXT,
        assigned_driver_name TEXT,
        assigned_worker_id TEXT,
        assigned_worker_name TEXT,
        target_fstp_id TEXT,
        target_fstp_name TEXT,
        lat REAL,
        lng REAL,
        otp TEXT,
        decanted_volume_litres INTEGER,
        rating INTEGER,
        feedback_text TEXT,
        history_json TEXT,
        ppe_checklist_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        reg_no TEXT UNIQUE NOT NULL,
        type TEXT DEFAULT 'VACUUM_TRUCK',
        capacity_litres INTEGER DEFAULT 4000,
        vendor_id TEXT,
        vendor_name TEXT,
        driver_id TEXT,
        driver_name TEXT,
        driver_phone TEXT,
        gps_device_id TEXT,
        lat REAL,
        lng REAL,
        speed_kmh REAL DEFAULT 0,
        heading_deg INTEGER DEFAULT 0,
        status TEXT DEFAULT 'AVAILABLE',
        puc_expiry TEXT,
        insurance_expiry TEXT,
        fitness_expiry TEXT,
        district TEXT NOT NULL,
        assigned_request_id TEXT,
        battery INTEGER DEFAULT 95,
        has_gps_device INTEGER DEFAULT 1,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fstps (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'FSTP',
        district TEXT NOT NULL,
        block TEXT NOT NULL,
        capacity_kld REAL DEFAULT 15.0,
        current_volume_kld REAL DEFAULT 6.5,
        status TEXT DEFAULT 'OPERATIONAL',
        lat REAL,
        lng REAL,
        radius_meters INTEGER DEFAULT 300,
        operator_name TEXT,
        operator_phone TEXT,
        compost_stock_tons REAL DEFAULT 0,
        treated_water_stock_kl REAL DEFAULT 0,
        connected_gps_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        reg_no TEXT UNIQUE NOT NULL,
        contact_person TEXT,
        phone TEXT NOT NULL,
        email TEXT,
        status TEXT DEFAULT 'EMPLANELED',
        upi_vpa TEXT,
        districts_covered_json TEXT,
        active_vehicles INTEGER DEFAULT 1,
        sla_score REAL DEFAULT 95.0,
        total_trips_completed INTEGER DEFAULT 0,
        revenue_total_inr REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tariffs (
        id TEXT PRIMARY KEY,
        district TEXT UNIQUE NOT NULL,
        base_price_inr REAL DEFAULT 800.0,
        base_distance_km REAL DEFAULT 5.0,
        rate_per_additional_km_inr REAL DEFAULT 25.0,
        emergency_multiplier REAL DEFAULT 1.25,
        gp_administrative_fee_inr REAL DEFAULT 100.0,
        tank_multipliers_json TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_id TEXT,
        entity_type TEXT,
        action TEXT NOT NULL,
        actor_name TEXT,
        actor_role TEXT,
        ip TEXT,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value_json TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cms_articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        author TEXT,
        date TEXT,
        summary TEXT,
        content TEXT,
        views INTEGER DEFAULT 0,
        status TEXT DEFAULT 'PUBLISHED'
      );
    `);

    // Ensure has_gps_device column exists if table was previously created
    try {
      const columns = await dbAll("PRAGMA table_info(vehicles)");
      const hasGpsCol = columns.some(c => c.name === 'has_gps_device');
      if (!hasGpsCol) {
        await dbExec("ALTER TABLE vehicles ADD COLUMN has_gps_device INTEGER DEFAULT 1");
      }
    } catch {
      // Column may already exist
    }

    console.log('✅ SQLite Tables & Relations initialized successfully');
  } catch (err) {
    console.error('❌ Error creating SQLite tables:', err);
  }
};
