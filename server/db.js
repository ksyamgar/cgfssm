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
        district TEXT NOT NULL,
        block TEXT NOT NULL,
        gp TEXT NOT NULL,
        village TEXT NOT NULL,
        status TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        citizen_phone TEXT NOT NULL,
        property_type TEXT DEFAULT 'RESIDENTIAL',
        containment_type TEXT DEFAULT 'SEPTIC_TANK',
        distance_km REAL DEFAULT 5.0,
        estimated_fee REAL DEFAULT 1200.0,
        assigned_vehicle_id TEXT,
        assigned_driver_id TEXT,
        otp TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_driver_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        registration_no TEXT UNIQUE NOT NULL,
        driver_name TEXT,
        driver_phone TEXT,
        capacity_litres INTEGER DEFAULT 4000,
        district TEXT NOT NULL,
        lat REAL,
        lng REAL,
        speed REAL DEFAULT 0,
        status TEXT DEFAULT 'AVAILABLE',
        battery INTEGER DEFAULT 95,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fstps (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'FSTP',
        district TEXT NOT NULL,
        block TEXT NOT NULL,
        capacity_kld REAL DEFAULT 15.0,
        current_load_kld REAL DEFAULT 6.5,
        lat REAL,
        lng REAL,
        status TEXT DEFAULT 'OPERATIONAL'
      );

      CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT NOT NULL,
        email TEXT,
        district TEXT NOT NULL,
        fleet_count INTEGER DEFAULT 1,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tariffs (
        id TEXT PRIMARY KEY,
        district TEXT UNIQUE NOT NULL,
        base_fee_up_to_5km REAL DEFAULT 1200.0,
        per_km_extra REAL DEFAULT 35.0,
        commercial_multiplier REAL DEFAULT 1.5,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_id TEXT,
        entity_type TEXT,
        action TEXT NOT NULL,
        actor_id TEXT,
        actor_name TEXT,
        actor_role TEXT,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        trip_no TEXT UNIQUE NOT NULL,
        request_id TEXT NOT NULL,
        vehicle_id TEXT NOT NULL,
        driver_id TEXT,
        status TEXT NOT NULL,
        departure_time DATETIME,
        arrival_time DATETIME,
        discharge_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES fsm_requests(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ SQLite Tables & Relations initialized successfully');
  } catch (err) {
    console.error('❌ Error creating SQLite tables:', err);
  }
};
