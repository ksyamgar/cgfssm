# 🚀 CG RURAL FSSM PLATFORM — MASTER BUILD PROMPT (v1.0)
> Paste this entire file into your AI app builder (Lovable / Bolt / v0 / Replit Agent / Cursor).
> Build order is in §14. Do not skip §2 (stack) or §6 (RBAC).

## 1) ONE-LINE BRIEF
Build a production-grade, role-based web platform — "CG Rural FSSM Platform" — that digitizes the
complete Faecal Sludge & Septage Management (FSSM) chain for rural Chhattisgarh:
Citizen desludging request → GP approval → vehicle dispatch → LIVE GPS tracking → verified
Before/After cleaning evidence → safe disposal at FSTP/STP (QR manifest) → UPI/cash payment →
feedback & closure → multi-level dashboards (Village → GP → Block → District → State).
Built for: Dept. of Panchayat & Rural Development, Govt. of Chhattisgarh. Supported by: UNICEF.
Reference portal style: https://sbmrural.cgstate.gov.in/cgpwmu/

## 2) STACK (NON-NEGOTIABLE)
- Frontend: React 18 + Vite (npm), Tailwind CSS, React Router v6, react-i18next (en/hi/hne),
  Recharts, react-leaflet + leaflet, lucide-react, workbox PWA, axios, Dexie (IndexedDB).
- Backend: Node.js 20 + Express, JWT (access + refresh), bcrypt, multer (uploads), node-cron
  (GPS polling), socket.io (live map), winston (logs), express-rate-limit, helmet.
- Database: Microsoft SQL Server (Windows Server deployment). Use Prisma ORM (mssql provider)
  so schema stays portable. Multi-tenant via geo-scope columns (district_id/block_id/gp_id).
- Exports: jspdf + html2canvas (PDF), exceljs (Excel).
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (telemetry), Noto Sans Devanagari.

## 3) DESIGN LANGUAGE — "LIQUID GLASS & RAW FUNCTIONALITY"
- Glassmorphism panels: translucent rgba surfaces, backdrop-blur 10–40px, radius 16–24px,
  soft drop shadows; layered over soft mesh gradients / map imagery.
- Raw data aesthetics: monospace telemetry tags like [STATUS: EN_ROUTE], [LAT: 21.25, LON: 81.63],
  [FLOW: OPTIMIZED]. Visible audit timelines.
- Dark mode = default for all dashboards; Light mode = default for public pages. Persist toggle.
- Capsule (pill) touch-friendly buttons. Animations: STATE CHANGES ONLY — no decorative motion.
- Brand colors: Deep Navy #033550 (primary bg), Ink #0B2233 (elevated bg), Teal #14B8A6 (brand),
  Cyan #38BDF8 (accent/interactive), Amber #F59E0B (warning), Red #EF4444 (critical),
  Green #22C55E (success), Text #E6F1F5 / #94A3B8 (dark) and #0B2540 / #475569 (light).
- Fluid type: H1 clamp(2.25rem,5vw,4rem), H2 clamp(1.75rem,3.5vw,2.75rem), H3 clamp(1.25rem,2vw,1.75rem),
  body 16–18px, mono labels 12–13px. Full tokens in design_system.md.

## 4) INFORMATION ARCHITECTURE (ROUTES)
PUBLIC:
  /                  Landing (hero = animated FSSM chain of Chhattisgarh)
  /about             About Us + IEC + partner logos + cross-utilization model
  /dashboard         Public State Dashboard (read-only aggregate KPIs, district choropleth)
  /login, /register  Auth (citizen OTP; staff credentials)
  /book              Citizen booking wizard (after OTP)
APP (sidebar shell, role-gated):
  /app                    Role dashboard (content varies by role)
  /app/requests           FSM request list + detail + workflow actions
  /app/trips              Trip management & manifests
  /app/map                LIVE GPS map (all vehicles / single vehicle trace)
  /app/fleet              Vehicles CRUD + compliance docs (PUC, insurance, fitness)
  /app/people             Drivers, Sanitation Workers, Officers (approval workflow)
  /app/fstp               FSTP/STP registry, capacity, intake logs
  /app/vendors            Vendor (PSSO) empanelment + performance score
  /app/masters            Geo hierarchy, tariffs, SLA rules (Block+ only)
  /app/reports            Master reports + PDF/Excel export
  /app/ai                 AI insights (OpenRouter) — anomaly, demand, fleet advice
  /app/cms                Public site content editor (Super Admin)
  /app/settings           App settings (theme, language, SLA timers, SMS, integrations)
  /app/profile            Profile settings (password, language, notifications)
  /app/database           Database manager — BACKUP / SEED / AUDIT (Super Admin ONLY)
  /app/audit              Audit log viewer (Super Admin, Auditor)

## 5) PUBLIC PAGES — SPEC
### 5.1 LANDING / HERO (must be "cool")
- Full-viewport hero. Background: light cartographic render of Chhattisgarh with faint village
  nodes and animated green GPS route lines converging to FSTP hexes (SVG/Canvas, slow loop).
- Center glass card: H1 "CG Rural FSSM Platform", sub "The Digital Operating System for Rural
  Sanitation Infrastructure." + supporting line "Digitally transforming rural sanitation through
  intelligent monitoring, operational visibility, and connected infrastructure."
- CTAs: [Book Desludging Service] (teal capsule) [View State Dashboard] (ghost capsule).
- ANIMATED FSSM CHAIN (scroll-triggered): Household → Septic Tank → Desludging Vehicle → FSTP →
  Resource Recovery — truck icon travels along an SVG pipe path; each node lights up.
- LIVE IMPACT TICKER (count-up): Requests Completed • ML Treated • Villages Covered • Active Vehicles.
- KPI stat cards (glass) with sparklines; "Legacy vs Digital Shift" comparison band
  (manual calls → app routing; blind dispatch → algorithmic; illegal dumping → GPS geo-fence;
  rigid blocks → cross-border GIS linkage; paper records → unified dashboards).
- Cross-utilization band: URBAN STPs/vacuum trucks ⇄ RURAL FSTPs/tractor units ("Plug-in Area" model).
- Stakeholder strip: Citizens | Drivers & Workers | FSTP Operators | Vendors | Governance.
- Top bar: SBM logo | CG Govt emblem | UNICEF logo + [Login] [Register].
### 5.2 ABOUT US
- Mission (SBM-G ODF+ / ODF++), the rural FSSM problem, how the chain works, RBAC roles table,
  health hazards of unsafe disposal (IEC), cross-utilization explainer, partner logos, contact.
### 5.3 PUBLIC STATE DASHBOARD
- Aggregated KPIs (from KPI catalog), district choropleth (GeoJSON), FSTP capacity gauges,
  monthly septage trend chart. Read-only; no PII.
### 5.4 AUTH
- Citizen: phone + OTP (SMS). Staff: email/username + password (+ optional 2FA).
- Registration: citizen self-service; Vendors/FSTP Operators/Drivers/Workers register →
  account is PENDING until District Coordinator / Block Coordinator approves.
- Roles are assigned by admins, never self-selected (except Citizen).

## 6) AUTH & RBAC (11 roles)
| Role                 | Scope            | Key capabilities | Data visibility |
|----------------------|------------------|------------------|-----------------|
| Super Admin          | State            | Everything, CMS, DB manager, settings | All |
| State Officer        | State            | View-only AI dashboards, reports, fund utilization | All (read) |
| District Coordinator | District         | Approve vendors/FSTP, monitor blocks, disputes | Own district |
| Block Coordinator    | Block            | Approve requests, manual vehicle allocation, SLA escalation | Own block |
| GP Operator          | Gram Panchayat   | Verify & approve requests, assign vendor, cash reconcile, tariffs | Own GP |
| FSTP Operator        | Facility         | QR manifest intake, log volume, capacity status, by-product log | Own plant |
| Vendor Admin (PSSO)  | Own fleet        | Manage vehicles/drivers, view revenue, track GPS, SLA | Own vendor |
| Driver               | Vehicle          | Route, acknowledge trips, navigate, arrival trigger | Daily manifest |
| Sanitation Worker    | Task             | PPE checklist, Before/After geo-tagged photos, volume log | Assigned tasks |
| Citizen              | Self             | Book, pay (UPI), track, rate | Own history |
| Auditor              | Cross-domain     | Read-only ledgers + audit logs | Global read |
Middleware chain: verifyJWT → loadUser → requireRole([...]) → geoScope filter → handler.
PII (name, phone, address) MASKED in reports for Block-level and below except own records.

## 7) DOMAIN — REQUEST LIFECYCLE (FINITE STATE MACHINE)
| # | Status              | Actor              | Next                        | Gate / Evidence |
|---|---------------------|--------------------|-----------------------------|-----------------|
| 1 | PENDING_APPROVAL    | Citizen/CSC        | ACKNOWLEDGED / REJECTED     | Unique request no. |
| 2 | ACKNOWLEDGED        | System/GP          | INSPECTED                   | SMS to citizen |
| 3 | INSPECTED           | GP/Block           | PENDING_ASSIGNMENT / REJECTED | Feasibility, road width |
| 4 | PENDING_ASSIGNMENT  | GP Operator        | PENDING_PAYMENT / ASSIGNED  | Vendor/vehicle match |
| 5 | PENDING_PAYMENT     | Citizen            | ASSIGNED                    | UPI intent / cash receipt |
| 6 | ASSIGNED            | System/GP          | VEHICLE_ASSIGNED            | Capacity + proximity match |
| 7 | VEHICLE_ASSIGNED    | Vendor             | TRIP_SCHEDULED              | Driver linked |
| 8 | TRIP_SCHEDULED      | Driver             | EN_ROUTE                    | Route cluster plan |
| 9 | EN_ROUTE            | GPS                | ARRIVED                     | Proximity ≤ 150 m (manual override allowed) |
|10 | ARRIVED             | Worker             | CLEANING_STARTED            | PPE checklist + geotagged BEFORE photo |
|11 | CLEANING_STARTED    | Worker             | CLEANING_COMPLETED          | Volume (L) + AFTER photo |
|12 | CLEANING_COMPLETED  | Driver             | TRANSPORTING                | Digital manifest issued |
|13 | TRANSPORTING        | GPS                | AT_FSTP                     | Geo-fence polygon enter |
|14 | AT_FSTP             | FSTP Operator      | DISPOSED                    | QR manifest scan + volume verify |
|15 | DISPOSED            | FSTP/System        | PAYMENT_COMPLETED           | Settlement record |
|16 | PAYMENT_COMPLETED   | System             | PENDING_FEEDBACK            | eGramSwaraj voucher (future) |
|17 | PENDING_FEEDBACK    | Citizen            | CLOSED                      | Rating (auto-close after window) |
|18 | CLOSED              | —                  | —                           | Audit sealed |
Side states: REJECTED (reason codes), REQUIRES_REASSIGNMENT (breakdown → back to GP queue, SLA
timer paused), ESCALATED (SLA breach → Block), CANCELLED. Every transition writes audit_logs.

## 8) POST-LOGIN MODULES (register & manage everything)
- Registration screens: FSTP/STP, Vehicles (type: vacuum truck / tractor-mounted / mini unit;
  capacity L; reg. no.; PUC/insurance/fitness dates + validity cron → auto-suspend), Drivers,
  Sanitation Workers, Officers, Vendors (KYC), By-product buyers (Phase 2).
- Dashboards per role: State (GIS heatmap, FSTP capacity, fund analytics), District (GP comparison,
  SLA heatmap, complaints), Block (queue, fleet availability), GP (pending requests, active map,
  attendance), Vendor (revenue, fleet utilization, driver list), FSTP (intake logs, capacity gauge,
  by-product registry), Driver (manifest + navigation), Worker (task cards + camera flow).
- Live Tracking: map with all vehicles; filters district/block/GP; vehicle trace replay; deviation
  & idle alerts; geo-fenced FSTP circles (green/amber/red status).
- Master Reports: tabular grid, advanced sort/filter, export PDF/Excel; deep-dive tables for FSTP
  logs, village↔FSTP linkages, vehicles, HR, financials.
- AI Dashboard (optional, OpenRouter API): predictive desludging demand (3-yr cycle), route/fleet
  reallocation suggestions, anomaly flags (stopped near river before FSTP).
- CMS: hero copy, IEC pages, notices — Super Admin only.
- Database Manager: seed geo hierarchy (LGD), backup/restore trigger, integrity checks, audit purge
  policy — Super Admin ONLY (enforce server-side).

## 9) GPS INTEGRATION — TRAQINDIA
- Host: https://app.traqindia.com/  Docs: https://documenter.getpostman.com/view/3184032/UVXgMHcy
- Token: read from env TRAQ_API_TOKEN = "8731177exxxxxxxxx" (placeholder — real token added later).
- Backend node-cron polls fleet positions every 30–60 s → upsert gps_logs → Socket.IO broadcast
  to /app/map subscribers. Frontend renders Leaflet markers (speed, heading, last-seen, status chip).
- Geo-fences: every FSTP/STP + DRE sites stored as polygons (geography type). Entering fence unlocks
  DISPOSED gate; leaving route radius > threshold fires ROUTE_DEVIATION alert (dashboard + notification
  + vendor penalty log). Store raw vendor response shape behind an adapter so API changes don't leak.

## 10) DATABASE — CORE TABLES (SQL Server, Prisma)
users, roles, user_roles, districts, blocks, gram_panchayats, villages, fstps, stps,
vehicles, vehicle_documents, drivers, sanitation_workers, vendors, fsm_requests, fsm_transitions,
trips, gps_logs, geo_fences, manifests, payments, tariffs, evidence_media, notifications,
cms_content, app_settings, audit_logs, ai_insights.
Rules: tenant columns (district_id, block_id, gp_id, village_id) on transactional tables;
tenantid-style semantic request numbers (e.g., CG-D02-B07-GP11-2026-000123); is_deleted soft-delete;
created_at/created_by/updated_at on all; spatial columns use geography; indexes on status,
(gp_id, status), (vehicle_id, created_at desc for gps_logs).

## 11) API SURFACE (REST /api/v1, JSON envelope {success, data, error{code,message}})
auth:     POST /auth/otp/request, /auth/otp/verify, /auth/login, /auth/refresh, /auth/logout, /auth/me
masters:  CRUD /districts /blocks /gps /villages /fstps /vehicles /drivers /workers /vendors /tariffs
fsm:      POST /fsm/requests, GET /fsm/requests?district&block&gp&status&from&to&page,
          GET /fsm/requests/:id, POST /fsm/requests/:id/transition {action, note},
          POST /fsm/trips/:id/manifest, POST /fsm/manifest/:id/sign
gps:      GET /gps/live, GET /gps/vehicles/:id/track?from&to, GET /gps/fences
payments: POST /payments/intent → returns UPI deep link upi://pay?pa=vendor@upi&pn=Name&am=Amount&cu=INR,
          POST /payments/receipt (cash, by GP/driver), GET /payments/ledger
reports:  GET /reports/summary?level=state|district|block|gp, GET /reports/export?format=pdf|excel
platform: GET/PUT /settings, /cms/*, GET /audit (filtered), POST /database/backup (Super Admin)
ws:       socket.io room gps:live; events: vehicle.update, alert.new, request.transition

## 12) NON-FUNCTIONAL RULES
- Mobile-first (320px up); citizen/driver/worker views optimized for low-end Android + 2G/3G.
- PWA + Offline-first: driver/worker actions and photos queue in IndexedDB (Dexie) and sync on
  reconnect; conflict resolution Last-Write-Wins for statuses, server reconcile for money.
- Client-side image compression before upload; evidence photos only via in-app camera; verify EXIF
  GPS vs request GPS (±200 m); server-side timestamp.
- i18n: hi (default), en, hne (Chhattisgarhi) — react-i18next, Devanagari font loaded.
- Security: helmet, CORS whitelist, rate limits (auth 5/min), bcrypt(12), JWT 15 min + refresh 7 d,
  RBAC enforced at API layer (never trust client), full audit trail, PII masking by role.
- Accessibility: GIGW-aligned, WCAG AA contrast, keyboard nav, focus rings, aria labels, alt text.

## 13) BRANDING & FOOTER (MANDATORY — sbmrural.cgstate.gov.in/cgpwmu style)
- Header logos: Swachh Bharat Mission (Gandagi Mukt Bharat) | Govt. of Chhattisgarh emblem | UNICEF.
- Footer columns:
  • Quick Links: Home, About Us, State Dashboard, Book Service, Login / Register
  • Government: Dept. of Panchayat & Rural Development, Govt. of Chhattisgarh, SBM-Gramin, LGD
  • Support: Contact Us, Help, Website Policies, Accessibility Statement, Disclaimer, Sitemap
- Info strip: "CG FSSM Cell, Department of Panchayat & Rural Development, Government of Chhattisgarh"
  + "Last Updated: <dynamic>" + visitor counter placeholder.
- Copyright line (exact): "© Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh |
  Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved."

## 14) BUILD ORDER (suggested milestones)
M1 Scaffold (Vite+Express+Prisma+SQL), theme tokens, app shell, dark/light toggle.
M2 Public pages: hero landing (animated chain + ticker), About, public dashboard, footer.
M3 Auth (OTP + password), RBAC middleware, role dashboards skeleton.
M4 Geo masters + admin CRUD (district→village, seed LGD sample data).
M5 FSM requests + full state machine + audit log + notifications.
M6 Fleet / People / FSTP / Vendor registration + document validity cron.
M7 GPS: TraqIndia adapter, cron poll, socket live map, geo-fences, deviation alerts.
M8 Payments (UPI intent + cash receipt), manifest signing, closure flow.
M9 Dashboards + 23-KPI engine + master reports + PDF/Excel export.
M10 PWA offline queue + image pipeline + i18n + AI dashboard (optional) + polish.

## 15) ACCEPTANCE CHECKLIST
[ ] Hero animates the full FSSM chain and shows live ticker
[ ] All 11 roles can login and see ONLY their permitted modules/data
[ ] A request can traverse PENDING_APPROVAL → CLOSED with correct evidence gates
[ ] BEFORE photo blocked unless device GPS ≈ request GPS; CLEANING block without PPE checklist
[ ] Live map shows vehicles from TraqIndia with ≤60 s latency; trace replay works
[ ] DISPOSED only when inside FSTP geo-fence and manifest signed by FSTP operator
[ ] UPI deep link pays correct vendor with exact amount; cash receipts reconcilable
[ ] State/District/Block/GP dashboards compute the KPI catalog correctly
[ ] PDF/Excel export of any filtered report grid
[ ] Offline: worker completes task with no network → syncs when online
[ ] Language switch hi/en/hne works across public + app
[ ] Super-Admin-only pages (Database, CMS) return 403 for everyone else
[ ] Footer + logos match §13 exactly
[ ] Fully responsive 320 px → 1920 px; dark/light modes complete
[ ] All transitions present in audit_logs with actor + timestamp
```

---