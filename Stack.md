
```markdown
# STACK & DEPLOYMENT — CG Rural FSSM Platform (v1.0)
Target: Windows Server (on-prem/state data centre) · SQL database · React npm frontend · Node backend.

## 1. STACK SUMMARY
| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React 18 + Vite 5 (npm) | Fast builds, ecosystem, PWA support |
| UI | Tailwind CSS 3 + custom glass tokens | Design-system speed; dark/light theming |
| Routing/State | React Router v6 · Zustand (server data via TanStack Query) | Lightweight |
| Maps | Leaflet + react-leaflet (+ leaflet-markercluster) | Rural-friendly, light, offline tiles |
| Charts | Recharts | Matches dashboard KPI patterns |
| i18n | react-i18next | hi/en/hne |
| Offline | Workbox PWA + Dexie (IndexedDB op-log) | Field resilience |
| Backend | Node.js 20 LTS + Express 4 | Team skill, Windows-friendly |
| Auth | JWT (access 15 m + refresh 7 d, rotation), bcrypt, SMS OTP | Standard |
| Realtime | Socket.IO | Live GPS push |
| ORM/DB | Prisma ORM → Microsoft SQL Server 2019+ | Native Windows fit; geography type; SSMS tooling |
| Jobs | node-cron | GPS poll, doc-validity, SLA escalation |
| Files | Local disk D:\fssm\uploads + Express static (behind auth) | No cloud dependency |
| Exports | jspdf + html2canvas · exceljs | PDF/Excel reports |
| Logs | winston (file rotation) | Windows service friendly |
| Process | NSSM (Node as Windows Service) or PM2-windows | Auto-restart |
| Web/Proxy | IIS (ARR + URL Rewrite) reverse proxy 443→3000 | TLS + static |
| Alternative DB | PostgreSQL 15 (+PostGIS) if preferred | Prisma schema portable |

## 2. FRONTEND PACKAGES (npm)
react, react-dom, react-router-dom, @tanstack/react-query, zustand, axios, tailwindcss,
postcss, autoprefixer, react-leaflet leaflet leaflet.markercluster, recharts, i18next
react-i18next i18next-http-backend, dexie dexie-react-hooks, workbox-precaching workbox-routing
workbox-strategies (via vite-plugin-pwa), jspdf html2canvas, exceljs, lucide-react,
react-hot-toast, date-fns. Dev: vite, @vitejs/plugin-react, eslint + prettier, vitest +
@testing-library/react, vite-plugin-pwa.

## 3. BACKEND PACKAGES (npm)
express, cors, helmet, express-rate-limit, jsonwebtoken, bcryptjs, zod (validation), multer,
prisma @prisma/client (mssql provider) — or mssql (tedious) if raw SQL preferred, socket.io,
node-cron, winston winston-daily-rotate-file, dotenv, axios (TraqIndia + OpenRouter clients),
exceljs, uuid. Dev: nodemon, jest + supertest, prisma CLI.

## 4. DATABASE (SQL Server) — key decisions
- Types: NVARCHAR for text (Devanagari-safe), DECIMAL(12,2) money, DATETIME2, GEOGRAPHY
  (POINT for vehicles/properties, POLYGON for FSTP/STP/DRE fences), UNIQUEIDENTIFIER ids.
- Indexes: fsm_requests(status), (gp_id,status), (created_at); gps_logs(vehicle_id, ts DESC)
  + monthly partition or purge job (>180 d archived); users(phone) unique, users(email) unique.
- Multi-tenancy: district_id/block_id/gp_id/village_id columns + tenantid on transactional tables;
  row-level scoping enforced in repository layer per JWT claims.
- Soft delete is_deleted flag everywhere (audit retention). Semantic request numbers:
  CG-D{02}-B{07}-GP{11}-2026-000123.
- Migrations: `prisma migrate deploy` in release runbook; seed scripts for roles, settings,
  LGD sample hierarchy, tariff template, demo data toggle.
- Spatial note: SQL Server geography covers point-in-polygon & distance (STIntersects,
  STDistance) sufficient for geo-fence gates and proximity; PostGIS only if Postgres chosen.

## 5. GPS INTEGRATION (TraqIndia)
- ENV: TRAQ_BASE_URL=https://app.traqindia.com · TRAQ_API_TOKEN=8731177exxxxxxxxx (placeholder)
- Docs: https://documenter.getpostman.com/view/3184032/UVXgMHcy
- Adapter service normalizes vendor payloads → {vehicleRef, lat, lng, speedKmh, heading, ts}.
- node-cron poll 30–60 s per active vehicle group → upsert gps_logs → socket.io emit gps:live.
- Failures: exponential backoff, last-known cache, "last seen Xm ago" UI badge, health endpoint.
- Vehicle↔device mapping stored on vehicle record (deviceId) + per-vehicle token override field.

## 6. ENVIRONMENT VARIABLES (.env sample)
    NODE_ENV=production
    PORT=3000
    DATABASE_URL="sqlserver://localhost;database=CG_FSSM;user=fssm_app;password=***;encrypt=true;trustServerCertificate=true"
    JWT_SECRET=<64-char random>
    JWT_REFRESH_SECRET=<64-char random>
    CORS_ORIGIN=https://fssm.cgstate.gov.in
    TRAQ_BASE_URL=https://app.traqindia.com
    TRAQ_API_TOKEN=8731177exxxxxxxxx
    SMS_PROVIDER=cdac|twilio
    SMS_API_KEY=***
    OPENROUTER_API_KEY=***            # optional (AI dashboard)
    UPLOAD_DIR=D:/fssm/uploads
    MAX_UPLOAD_MB=8
    GPS_POLL_SECONDS=45
    SOCKET_PATH=/ws

## 7. REPOSITORY STRUCTURE (monorepo, npm workspaces)
    root/
    ├─ apps/
    │  ├─ frontend/        # React+Vite (public + app shell + PWA)
    │  │   ├─ src/{components,services,hooks,pages,store,utils,api,assets,i18n}
    │  └─ backend/         # Express API
    │      ├─ src/{routes,controllers,services,middleware,models(prisma),jobs,sockets,utils}
    │      └─ prisma/{schema.prisma,migrations,seed.ts}
    ├─ packages/
    │  ├─ shared/          # zod schemas, enums (STATUSES, ROLES), constants
    │  └─ gis/             # geo utils: fences, haversine, catchment logic, GeoJSON loaders
    ├─ geo/                # CG district/block/GP/village GeoJSON + LGD seeds
    └─ deploy/             # IIS web.config, NSSM install scripts, backup jobs, runbooks

## 8. WINDOWS SERVER DEPLOYMENT RUNBOOK
1) Prereqs: Windows Server 2019+, IIS + URL Rewrite + ARR, Node 20 LTS (nvm-windows), SQL Server
   2019+ & SSMS, NSSM, TLS cert (state CA / cert-based), D:\fssm\{app,uploads,logs,backups}.
2) DB: create DB `CG_FSSM` + login `fssm_app` (db_datareader/writer + exec on procs); run
   `npx prisma migrate deploy`; `npx prisma db seed`.
3) Build: `npm ci && npm run build` (frontend → apps/frontend/dist).
4) Backend as service: NSSM install CG-FSSM-API "C:\Program Files\nodejs\node.exe"
   "D:\fssm\app\apps\backend\src\server.js"; AppDirectory=D:\fssm\app\apps\backend;
   set NODE_ENV=production + env vars; startup=auto.
5) IIS: Site "cgfssm" → bindings 443 (https) → URL Rewrite reverse proxy to http://127.0.0.1:3000
   (API + websockets allowed) OR serve frontend dist from wwwroot and proxy /api + /ws only.
6) Firewall: allow 443 in; keep 3000/1433 local-only. TLS: require, HSTS header via web.config.
7) Backups: SQL maintenance plan — daily full 02:00, hourly differential, log shipping to
   D:\backups + offsite copy job; uploads folder nightly robocopy mirror.
8) Monitoring: winston logs → D:\fssm\logs (rotate); Windows Task Scheduler health check script
   (GET /health every 5 min, restart service on fail); optional Grafana/Prometheus later.
9) Updates: git pull → npm ci → prisma migrate deploy → build → restart NSSM service (zero-downtime
   not required; maintenance banner + drain sockets).
10) Rollback: keep previous build folder + `prisma migrate resolve --rolled-back` procedure.

## 9. QA / DX
Tests: vitest (frontend), jest+supertest (API), Playwright e2e (happy-path booking→closure),
GPS simulator script for local development (fake telemetry into socket). Lint/format gates.
Postman collection mirroring §11 API surface; seed users for each of the 11 roles.

## 10. VERSIONING
SemVer; API under /api/v1; DB migrations forward-only; feature flags in app_settings for
phased rollout (AI dashboard, by-product marketplace, PFMS stubs).
```

---

## ✅ How the pack fits together

| File | Use it for |
|---|---|
| `CG FSSM prompt.md` | Paste into Lovable/Bolt/v0 to generate the app end-to-end |
| `PRD.md` | What & why — scope, roles, user stories, 23 KPIs, phases |
| `Design.md` | Architecture, routing, state machine, RBAC matrix, data model |
| `design_system.md` | Exact tokens + component specs for consistent UI generation |
| `Stack.md` | npm packages, env vars, SQL Server schema rules, Windows Server/IIS deployment |

**Suggested next steps:** (1) confirm the real TraqIndia token + response sample, (2) choose SQL Server vs PostgreSQL finally, (3) drop in CG district GeoJSON for the choropleth — then feed `CG FSSM prompt.md` into your vibe-coder tool and build in the M1→M10 order. Want me to also generate the Prisma `schema.prisma` or the seed data script next?