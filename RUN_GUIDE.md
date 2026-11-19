# 🚀 How to Run Frontend & Backend (CG Rural FSSM Platform)

This guide walks you through setting up and running both the **Backend API (Node.js/Express + SQLite)** and the **Frontend Web Application (React 18 + Vite + Tailwind CSS)**.

---

## 📋 System Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.x` or higher (Node v20+ recommended)
* **npm**: `v9.x` or higher (comes bundled with Node.js)
* **Git**: Installed and available in PATH

Check your installations:
```bash
node -v
npm -v
```

---

## ⚡ Option 1: Run Both Simultaneously (Recommended)

The project includes `concurrently`, allowing you to boot the backend and frontend in a single terminal with one command.

### Step 1: Install Dependencies
Open a terminal in the root directory:
```bash
cd "F:\UNICEF-AILSG\CG FSMS Rural\CGFSSMapp"
npm install
```

### Step 2: Start Development Servers
```bash
npm run dev
```

* **Backend Server**: Starts at `http://localhost:5000`
* **Frontend Web App**: Starts at `http://localhost:5173` (or the next available port Vite assigns)

---

## 🛠️ Option 2: Run in Separate Terminals

If you prefer dedicated terminal logs for debugging:

### Terminal 1: Backend API Server
```bash
cd "F:\UNICEF-AILSG\CG FSMS Rural\CGFSSMapp"

# Start the Express & SQLite backend
npm run server
```
> **What happens during backend startup:**
> 1. SQLite database initializes at `./server/data/cgfssm.sqlite` in WAL mode.
> 2. Seed data runs automatically on startup (creates state admins, district officers, drivers, FSTPs, tariffs).
> 3. Cron automation engine initializes for SLA tracking and reminders.
> 4. Health check endpoint ready at `http://localhost:5000/api/health`.

---

### Terminal 2: Frontend Client (Vite)
```bash
cd "F:\UNICEF-AILSG\CG FSMS Rural\CGFSSMapp"

# Start Vite React development server
npm run client
```
Access the web application in your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔐 Environment Configuration (`.env`)

The project contains a `.env` in the root folder with default settings:

```env
PORT=5000
JWT_SECRET=cg_rural_fssm_jwt_super_secret_key_2026
JWT_EXPIRES_IN=7d
DB_PATH=./server/data/cgfssm.sqlite
NODE_ENV=development
```

---

## 👥 Default Demo Credentials

You can test different role-based views using the pre-seeded accounts:

| Role | Username / Mobile / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `9826100001` or `admin.fssm@cg.gov.in` | `Admin@2026` | Entire State, Master Settings, Tariffs |
| **State Officer** | `9826100002` or `state.officer@cg.gov.in` | `Officer@2026` | State Monitoring, Analytics, KPIs |
| **District Coordinator** | `9826100003` or `collector.raipur@cg.gov.in` | `Officer@2026` | Raipur District Management |
| **Block Coordinator** | `9826100004` or `sbm.dharsiwa@cg.gov.in` | `Officer@2026` | Dharsiwa Block Verification & Queue |
| **GP Operator / VLE** | `9826100005` or `sarpanch.mandirhasaud@cg.gov.in` | `Officer@2026` | Mandir Hasaud Gram Panchayat |
| **FSTP Operator** | `9826100006` or `fstp.arang@cg.gov.in` | `Officer@2026` | Sludge Receipt, Testing, Co-composting |
| **Vendor Admin** | `9826100007` or `shiv@mahamayaclean.in` | `Officer@2026` | Fleet Dispatch, Vehicle Health |
| **Driver / Pilot** | `9826100008` or `driver.ramesh@cg.gov.in` | `Driver@2026` | Trip Logs, GPS Check-ins, Desludging |
| **Citizen** | `9826100010` or `citizen.devendra@gmail.com` | `Citizen@2026` | Booking Requests, Tracking, Rating |

---

## 🏗️ Production Build

To test or build the frontend for production:

```bash
# Build production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## ❓ Troubleshooting

1. **Port 5000 or 5173 is already in use:**
   - In Windows PowerShell, check running processes:
     ```powershell
     Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
     ```
   - Change `PORT=5001` in `.env` if needed.
2. **Database Locked / SQLite Reset:**
   - Delete `./server/data/cgfssm.sqlite` and restart `npm run server` to generate a fresh seeded database.
