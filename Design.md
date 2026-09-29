
```markdown
# DESIGN — CG Rural FSSM Digital Platform (v1.0)
Product: End-to-end desludging service delivery, monitoring & geospatial tracking platform
Owner: Dept. of Panchayat & Rural Development, Govt. of Chhattisgarh · Supported by UNICEF
Companion docs: PRD.md · design_system.md · Stack.md · CG FSSM prompt.md

## 1. DESIGN PRINCIPLES
1. Liquid Glass & Raw Functionality — premium glassmorphism surfaces carrying raw, honest
   operational data (monospace telemetry, audit trails, wireframe-style technical labels).
2. Mobile-first, low-bandwidth-first — citizen/driver/worker paths must work on low-end Android
   with intermittent 2G/3G.
3. Evidence over claims — no status transition without a verifiable digital artifact
   (GPS, photo, QR manifest, payment receipt).
4. Governance by default — every mutation is attributable, timestamped, exportable.
5. Boundaries are logical, not political — village→FSTP linkage uses travel feasibility
   ("Plug-in Areas"), not administrative lines.

## 2. SYSTEM ARCHITECTURE (4 LAYERS)
┌───────────────────────────────────────────────────────────────────────┐
│ PRESENTATION  React 18 SPA (Vite) — Public site · Role dashboards ·   │
│               Driver/Worker PWA views · Leaflet maps · Recharts       │
├───────────────────────────────────────────────────────────────────────┤
│ API GATEWAY   Node/Express — JWT auth, RBAC middleware, rate limits,  │
│               validation, structured errors, REST /api/v1 + Socket.IO │
├───────────────────────────────────────────────────────────────────────┤
│ SERVICE ENGINES (modules)                                             │
│  · FSM Workflow Engine (state machine + SLA timers + escalation)      │
│  · GIS Engine (geo hierarchy, village→FSTP linkage, geo-fences)       │
│  · GPS Ingestion (TraqIndia adapter + node-cron poll + gps_logs)      │
│  · Billing & Collection (UPI intent, cash receipts, ledger)           │
│  · CMS Engine · Notification (SMS/WhatsApp) · Reporting/Export        │
│  · AI Insights (OpenRouter, optional, read-only)                      │
├───────────────────────────────────────────────────────────────────────┤
│ DATA & DEPLOY  MS SQL Server (geography types, audit tables) ·        │
│  file storage D:\fssm\uploads · Windows Server + IIS reverse proxy ·  │
│  NSSM-managed Node service · PWA service worker (client cache)        │
└───────────────────────────────────────────────────────────────────────┘
External: TraqIndia GPS API · SMS gateway · UPI (deep links) · OpenRouter (optional) · LGD GeoJSON.

## 3. INFORMATION ARCHITECTURE / SITEMAP
Public (SEO + citizen entry):        Auth gate:            Role-gated app (sidebar):
/ Landing                            /login (OTP|pwd)      /app (role dashboard)
/about  About & IEC                  /register             /app/requests
/dashboard  Public state snapshot    /forgot-password      /app/trips
/pricing-tariffs (public tariff info)/verify-otp           /app/map  (LIVE GPS)
/help  Help & FAQ                                          /app/fleet /people /fstp /vendors
/contact                                                   /app/masters /reports /ai
                                                           /app/cms /settings /profile
                                                           /app/database (Super Admin) /app/audit

## 4. APP SHELL & NAVIGATION
- Public: sticky glass topbar (logos left, nav center, Login/Register right), footer per branding.
- App: collapsible glass sidebar (icons+labels; icon-only <1024px), topbar with global search,
  geo-scope selector (District ▸ Block ▸ GP ▸ Village), notification bell, theme toggle,
  language switcher, profile menu. Role-based menu rendering (server-enforced too).
- Breadcrumbs on all inner pages; persistent geo-filter bar on list/map/report pages.

## 5. PAGE-BY-PAGE SPEC (key screens)
### 5.1 Landing (hero)
Full-viewport; bg = Chhattisgarh map with animated green route arcs converging on FSTP hexes;
glass hero card (H1, sub, 2 CTAs); scroll-triggered FSSM chain animation (Household → Septic Tank →
Desludging Vehicle → FSTP → Resource Recovery) with truck traveling an SVG path; live impact ticker;
glass KPI cards w/ sparklines; Legacy-vs-Digital comparison; cross-utilization band; stakeholder strip.
### 5.2 About
Mission, problem framing (rural dispersion, informal operators, illegal dumping), chain explainer,
RBAC roles matrix, IEC/health section, cross-utilization diagram (urban⇄rural assets), partner logos.
### 5.3 Public State Dashboard
Read-only aggregates: KPI cards, district choropleth (Leaflet + GeoJSON), FSTP capacity gauges,
monthly septage trend. No PII. CTA to login for deeper data.
### 5.4 Role dashboards
- State: heatmap, top/bottom districts, FSTP utilization, fund analytics, anomalies feed.
- District: GP comparison table, SLA heatmap, complaint tracker, vendor performance.
- Block: request queue w/ SLA countdown, fleet availability, escalation list.
- GP: pending approvals, live mini-map, daily collection, worker attendance.
- Vendor: revenue, fleet utilization, driver roster, SLA score, GPS fleet view.
- FSTP: intake log (today), capacity gauge, by-product registry.
- Driver: today's manifest (clustered route), navigation CTA, status buttons.
- Worker: task cards → camera flow (PPE → BEFORE → volume → AFTER).
### 5.5 Requests module
List (filters: status, date, geo, vendor, type) + detail: request meta, containment info, timeline
(vertical audit trail), map mini-view, evidence gallery, actions panel (role-appropriate transitions),
SLA countdown chip. Bulk actions for Block+.
### 5.6 Live GPS map
Leaflet: vehicle markers (speed/heading/last-seen/status), geo-fenced FSTP circles (green/amber/red),
route polyline replay (date range), deviation & idle alerts feed, clustering, filter drawer.
### 5.7 Registrations (Fleet/People/FSTP/Vendor)
Tabbed forms w/ document uploads, validity date pickers, approval status banner
(PENDING → APPROVED by District/Block Coordinator), geo-linking (village catchment selector).
### 5.8 Reports
Grid builder: pick level + date range + geo scope → table → export PDF/Excel (jspdf/exceljs);
saved presets; PII masking applied per role.
### 5.9 Settings (App) / Profile / Database Manager
App settings: theme default, default language, SLA timers, notification toggles, integration keys
(readonly, Super Admin). Profile: password change, language, notification prefs, 2FA.
Database Manager (Super Admin): LGD seeding, backup trigger, integrity checks, audit purge policy.

## 6. REQUEST LIFECYCLE — STATE MACHINE DESIGN
Canonical enum (see PRD §10 for actors/evidence):
PENDING_APPROVAL → ACKNOWLEDGED → INSPECTED → PENDING_ASSIGNMENT → (PENDING_PAYMENT) →
ASSIGNED → VEHICLE_ASSIGNED → TRIP_SCHEDULED → EN_ROUTE → ARRIVED → CLEANING_STARTED →
CLEANING_COMPLETED → TRANSPORTING → AT_FSTP → DISPOSED → PAYMENT_COMPLETED →
PENDING_FEEDBACK → CLOSED
Side states: REJECTED · REQUIRES_REASSIGNMENT · ESCALATED · CANCELLED
Implementation: fsm_transitions table (from,to,actor_id,action,note,ts,ip) + single
transition(requestId, action) endpoint that validates role + preconditions + writes audit row +
emits socket event + queues notification. SLA: cron scans open states, escalates to Block at 24 h.

## 7. ROLE × MODULE PERMISSION MATRIX
| Module            | Super | State | District | Block | GP | FSTP | Vendor | Driver | Worker | Citizen | Auditor |
|-------------------|-------|-------|----------|-------|----|------|--------|--------|--------|---------|---------|
| View requests     | ✅    | ✅ RO | ✅       | ✅    | ✅ | ✅   | 🔶 own | 🔶 own | 🔶 own | 🔶 own  | ✅ RO   |
| Approve/assign    | ✅    | —     | ✅       | ✅    | ✅ | —    | —      | —      | —      | —       | —       |
| Live GPS          | ✅    | ✅ RO | ✅       | ✅    | ✅ | —    | 🔶 own | 🔶 own | —      | 🔶 own trip | — |
| Fleet/people CRUD | ✅    | —     | ✅       | 🔶    | 🔶 | —    | 🔶 own | —      | —      | —       | —       |
| FSTP intake/manifest | ✅ | —     | ✅       | —     | —  | ✅   | —      | 🔶 sign| —      | —       | ✅ RO   |
| Tariffs/SLA       | ✅    | ✅ RO | ✅       | 🔶    | 🔶 | —    | —      | —      | —      | —       | —       |
| CMS/DB/Settings   | ✅    | —     | —        | —     | —  | —    | —      | —      | —      | —       | —       |
✅ full · 🔶 scoped · RO read-only · — none

## 8. DATA MODEL (CORE ERD, logical)
users ─< user_roles >─ roles
districts ─< blocks ─< gram_panchayats ─< villages
villages ─> fstp_link (village ↔ FSTP catchment, many-to-many w/ priority)
fstps ─< geo_fences (polygon) ; stps
vendors ─< vehicles ─< vehicle_documents ; vehicles ─< drivers (assignment) ─ users
fsm_requests ─< fsm_transitions ; fsm_requests ─< trips ─< gps_logs ; trips ─ manifests
fsm_requests ─< evidence_media (BEFORE/AFTER/PPE, exif_lat, exif_lng, sha)
fsm_requests ─< payments (mode: UPI|CASH, vpa, txn_ref, receipt_no)
tariffs (gp_id, vehicle_type, base, per_km, tank_multiplier) · notifications · cms_content ·
app_settings · audit_logs (actor, action, entity, before/after JSON, ip, ua)
Conventions: UUID ids; geo-scope cols on transactional tables; is_deleted soft delete;
semantic request no: CG-D{dd}-B{bb}-GP{gg}-YYYY-######; geography columns for points/polygons.

## 9. INTEGRATIONS DESIGN
- TraqIndia GPS (adapter pattern): config via env (TRAQ_BASE_URL, TRAQ_API_TOKEN). node-cron 30–60 s
  poll → normalize {vehicleRef, lat, lng, speed, heading, ts} → gps_logs → socket broadcast.
  Circuit breaker + last-known caching on API failure.
- UPI: dynamic deep link per vendor (upi://pay?pa=vendor@upi&pn=Name&am=Amount&cu=INR) rendered as
  QR + tap-to-pay; cash path issues digital receipt by GP/driver; ledger reconciles both.
- SMS/WhatsApp: OTP, booking confirmation, dispatch, ETA, arrival, payment receipt, 3-year
  desludging reminder (recurring scheduler per household tank).
- GIS data: CG District/Block/GP/Village GeoJSON (LGD/Census) bundled as static assets + DB mirror;
  rendered via react-leaflet; village→FSTP catchments stored as relations, editable by admins.
- OpenRouter AI (optional): monthly anonymized aggregates → LLM with strict system prompt →
  insights table → dashboard cards. AI recommends; officers decide.

## 10. REALTIME & OFFLINE
- Socket.IO rooms: gps:live (map), org:{level}:{id} (dashboards), request:{id} (detail).
- PWA: workbox precache shell; Dexie store `oplog` (ops: transition, photo, signature) + `queue_meta`;
  background sync flushes oldest-first; LWW for statuses, server reconcile for financials;
  offline banner + pending-count badge; images compressed client-side before queueing.

## 11. SECURITY DESIGN
JWT access 15 min + refresh 7 d (rotation), bcrypt(12), account lockout, OTP rate limits,
helmet/CSP, CORS whitelist, request signing not required (internal), RBAC + row-level geo scoping
in repository layer, PII masking rules, immutable audit_logs (no UPDATE/DELETE grants),
uploads: type sniff + size cap + randomized names + EXIF verification + in-app camera only,
backups: daily full + hourly differential (SQL Server maintenance plan) to D:\backups (offsite copy).

## 12. UI STATES
Every data surface defines: Loading (glass skeletons), Empty (illustration + primary action),
Error (structured error code + retry + support link), Partial (stale GPS badge "last seen 4 m ago"),
Offline (banner + queued ops count). Toasts for transitions; modal confirmations for destructive
actions; 403 page for RBAC denials.

## 13. RESPONSIVE & PERFORMANCE
Breakpoints: 320 / 480 / 768 / 1024 / 1440 / 1920. Fluid clamp() typography. Tables → card lists
on mobile. Map: marker clustering >100 pts; viewport-bounded queries. Budgets: LCP < 2.5 s (4G),
bundle < 300 KB gzip initial, GPS poll ≤ 60 s, dashboard queries < 500 ms (indexed).

## 14. ACCESSIBILITY
WCAG 2.1 AA + GIGW: contrast ≥ 4.5:1, keyboard-complete flows, visible focus, aria-live for status
changes, alt text for evidence, language switching without page reload, Devanagari-capable fonts.
```

---