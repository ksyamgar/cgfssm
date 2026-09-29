
```markdown
# PRODUCT REQUIREMENTS DOCUMENT (PRD)
Project: CG Rural FSSM Digital Platform (Chhattisgarh Faecal Sludge & Septage Management)
Target Geography: Rural Chhattisgarh — Districts ▸ Blocks ▸ Gram Panchayats ▸ Villages
Supported By: Government of Chhattisgarh & UNICEF · Prepared by: Raj Yamgar, UNICEF Chhattisgarh
Version: 3.0 · Status: Approved for build · Companion docs: Design.md, design_system.md, Stack.md

## 1. EXECUTIVE SUMMARY
An end-to-end service delivery, operational monitoring, and geospatial tracking platform for rural
FSSM. While UPYOG serves structured ULBs, this platform is architected for the decentralized rural
ecosystem: dispersed settlements, narrow lanes, tractor-mounted desludging units, FSTPs at block
level, and cross-utilization of urban STPs/vacuum trucks for rural service ("Plug-in Area" model).
It connects citizen requests → GP approval → fleet dispatch with LIVE GPS → evidence-verified
cleaning → geo-fenced safe disposal at FSTP/STP → direct digital payments → multi-level dashboards
that help achieve and sustain SBM-G ODF+ / ODF++ status.

## 2. PROBLEM STATEMENT
1. Fragmented, informal desludging; opaque pricing; no accountability.
2. Illegal dumping of faecal sludge into water bodies/open land (health + environmental risk).
3. No traceability from household tank to treatment plant; paper records lost.
4. Rigid administrative boundaries vs. real logistics — villages closest to an FSTP in another
   block cannot be served efficiently.
5. No data for planning: FSTP capacity, fleet distribution, demand forecasting, fund utilization.

## 3. VISION & GOALS
**Vision:** Digitize the entire rural sanitation value chain for Chhattisgarh — a transparent,
verifiable, and financially sustainable FSSM operating system.
**Goals:** (1) Digitize & formalize the FSSM value chain into a verifiable ledger. (2) Optimize
logistics — cluster routing, capacity matching, live GPS, dead-mileage elimination. (3) Eradicate
illegal dumping via geo-fencing + evidence chains + route analytics. (4) Data-driven governance —
real-time KPIs for State/District/Block/GP; shift from reactive complaints to proactive scheduling.
**Success metrics (12 months):** ≥70% of reported desludging via platform in pilot district;
SLA compliance ≥90%; illegal-dumping incidents ↓80%; CSAT ≥4/5; 100% trips with closed manifest.

## 4. SCOPE
IN: Citizen booking (app/CSC-assisted), dynamic pricing, workflow engine, fleet/people/FSTP/vendor
management, live GPS + geo-fences, evidence media, payments (UPI + cash receipts), dashboards,
23-KPI reporting, exports, CMS, offline-first PWA field views, i18n (hi/en/hne), audit.
OUT (Phase 2+): treatment plant engineering, sewer network ops, IoT tank sensors, eGramSwaraj/PFMS
voucher API (interface stubs only), by-product marketplace (buyers registry placeholder).

## 5. USERS & ROLES
| Role | Purpose | Key jobs |
|---|---|---|
| Citizen | Service beneficiary | Book, pay, track live, rate |
| Sanitation Worker | Field evidence | PPE checklist, before/after photos, volume log |
| Driver | Execution | Manifest, navigation, arrival, disposal trip |
| Vendor Admin (PSSO) | Private fleet | Fleet & staff mgmt, revenue, SLA, GPS |
| FSTP Operator | Plant | QR intake, volume verify, capacity, by-products |
| GP Operator | Local admin | Approve, assign, cash reconcile, tariffs, GPDP data |
| Block Coordinator | Oversight | SLA escalation, manual allocation, verification |
| District Coordinator | District | Vendor/FSTP empanelment, disputes, KPIs |
| State Officer | Mission (SWSM) | Read-only state analytics, fund utilization |
| Super Admin | Platform | CMS, settings, DB manager, masters, audit |
| Auditor | Compliance | Read-only ledgers + audit logs |
| By-Product Buyer (P2) | Marketplace | Buy compost/treated water |

## 6. CORE USER JOURNEYS
**Citizen:** OTP login → select GP/village (GPS snap) → tank estimator → dynamic quote → submit →
track vehicle live → service + UPI/cash → rate → 3-year reminder enrollment.
**GP Operator:** Review request (Swachhagrahi appraisal) → verify → approve → assign vendor/vehicle
→ reconcile cash → feed GPDP dashboards.
**Driver:** Receive clustered route → navigate offline-first → arrive (GPS trigger) → after
cleaning transport to linked FSTP → operator scans QR → manifest signed → ticket closes.
**Worker:** Task card → PPE checklist → geotagged BEFORE photo → extract & log volume → AFTER photo
→ trip log. (Photos restricted to in-app camera; EXIF verified.)
**FSTP Operator:** Scan driver QR manifest → verify/log decanted volume → plant capacity updates →
by-product log (compost/treated water).
**Vendor:** Register (pending District approval) → onboard vehicles/drivers → monitor assignments,
fleet GPS, SLA score, settlements.
**District/State:** Dashboards: SLA heatmaps, FSTP utilization, fund analytics, anomaly flags
(vehicle near river before FSTP), export PDF/Excel.

## 7. USER STORIES (representative; full backlog in Jira)
| ID | Persona | Story | Acceptance |
|---|---|---|---|
| US-01 | Citizen | Switch language | hi/en/hne immediate; Devanagari renders |
| US-02 | Citizen | Drop location pin | Auto-fills correct District▸Block▸GP▸Village (LGD codes) |
| US-03 | Citizen | Tank size estimator | Matches standard volumes; suggests vehicle type |
| US-04 | Citizen | Submit request | Dynamic price = (base + dist×per-km)×tank multiplier; GP tariff respected |
| US-05 | Citizen | Pay via UPI | Deep link opens any UPI app w/ exact amount & vendor VPA; receipt issued |
| US-06 | Citizen | Track vehicle | Live marker + ETA + status events; SMS fallback alerts |
| US-07 | GP Op | Approve/assign | SLA 24 h; auto-escalate to Block on breach |
| US-08 | Worker | Photo evidence | BEFORE blocked unless device GPS ≈ request GPS (±200 m); no gallery upload |
| US-09 | Driver | Navigate offline | Cached tiles + manifest work offline; ops queue & sync |
| US-10 | FSTP Op | Sign manifest | Only within geo-fence; volume recorded; request can close |
| US-11 | Vendor | Fleet compliance | Missing PUC/insurance/fitness → vehicle auto-suspended from assignment pool |
| US-12 | District | Empanel vendor | Approval workflow; vendor inactive until approved |
| US-13 | State | KPI dashboard | 23-KPI catalog computed; drill state→district→block→GP |
| US-14 | Auditor | Ledger review | Immutable audit log; filters; export |
| US-15 | Super Admin | Manage DB | Seed LGD, backup, integrity checks; 403 for all other roles |

## 8. FUNCTIONAL REQUIREMENTS (by module)
**FR-A Auth & RBAC:** OTP (citizen), credentials (staff), JWT+refresh, role assignment by admins,
pending-approval registration for vendors/FSTP/workers/drivers, PII masking, audit on login.
**FR-B Citizen Module:** wizard (location→schedule→tank/site→price→confirm), tank estimator,
emergency vs scheduled, recurring reminders (3-yr), tracking page, rating.
**FR-C Workflow Engine:** full state machine (§9), role-gated transitions, SLA timers + escalation,
reassignment flow (breakdown flag → GP queue, high priority), rejection reason codes.
**FR-D GPS:** TraqIndia ingestion (30–60 s), live map, single-vehicle trace replay, geo-fence
polygons (FSTP/STP/DRE), deviation + idle alerts, offline last-known.
**FR-E Fleet & People:** vehicles w/ docs validity cron (auto-suspend), QR code per vehicle,
drivers/workers registry (optional Aadhaar linkage), attendance, incident reporting.
**FR-F FSTP/STP:** registry (capacity, tech, operator, approval), daily volumetric capacity,
intake logs, load balancing suggestion (redirect when >90%), by-product registry.
**FR-G Payments:** dynamic pricing engine (GP tariff matrix), UPI intent + QR, cash receipts by
GP/driver, ledger, subsidy split (BPL) stub for PFMS, reconciliation report.
**FR-H Dashboards & Reports:** role dashboards, 23-KPI engine, master report grid + filters +
PDF/Excel export, SBM-G aligned report structures.
**FR-I Platform:** CMS (hero/about/IEC/notices), app settings (theme, language, SLA, integrations),
profile settings, master data mgmt (geo hierarchy, tariffs, service rules), DB manager (Super Admin),
audit log viewer, notifications center.
**FR-J Offline/PWA:** op-log queue (transitions, photos, signatures), background sync, conflict
rules (LWW states, server reconcile money), client-side image compression.

## 9. STATUS TAXONOMY + SLA (canonical)
PENDING_APPROVAL(24 h) → ACKNOWLEDGED → INSPECTED(48 h) → PENDING_ASSIGNMENT → PENDING_PAYMENT →
ASSIGNED → VEHICLE_ASSIGNED → TRIP_SCHEDULED → EN_ROUTE → ARRIVED → CLEANING_STARTED →
CLEANING_COMPLETED → TRANSPORTING → AT_FSTP → DISPOSED → PAYMENT_COMPLETED → PENDING_FEEDBACK(72 h
auto-close) → CLOSED · REJECTED(reason) · REQUIRES_REASSIGNMENT · ESCALATED · CANCELLED
Evidence gates: CLEANING_STARTED ⇐ PPE+BEFORE geo-verified photo; CLEANING_COMPLETED ⇐ volume+AFTER;
DISPOSED ⇐ geo-fence + signed manifest; closure only after payment reconciliation.

## 10. KPI CATALOG (23, per NUDM/UPYOG FSM standard)
1 % properties with pits/tanks recorded · 2 Total requests · 3 Open requests · 4 Closed requests ·
5 Completion rate % · 6 Total collection (KL) · 7 Total sludge disposed (KL) · 8 Average FSM cost ·
9 SLA compliance % · 10 Average citizen rating · 11 Collection by usage type · 12 FSTP capacity
utilisation % · 13 Monthly septage collected (KL) · 14 No. of cesspool vehicles · 15 Average volume
desludged (KL/trip) · 16 No. of FSTPs/STPs · 17 No. of registered PSSOs (vendors) · 18 No. of private
vehicles · 19 Collection efficiency % · 20 CSAT % · 21 Scheduled coverage % · 22 Customer refusal
rate % · 23 Vehicle downtime (h). Each KPI: definition + formula + drillable geo levels + export.

## 11. INTEGRATIONS
| System | Use | Notes |
|---|---|---|
| TraqIndia GPS (https://app.traqindia.com/, docs: documenter.getpostman.com/view/3184032/UVXgMHcy) | Live vehicle telemetry | Token env TRAQ_API_TOKEN ("8731177exxxxxxxxx" placeholder); backend polling adapter |
| UPI deep links | Direct citizen→vendor payment | upi://pay?pa=vendor@upi&pn=Name&am=Amount&cu=INR + QR |
| SMS/WhatsApp | OTP, status, ETA, reminders | Provider TBD (CDAC/Twilio/Gupshup) |
| OpenRouter LLM (optional) | Predictive demand, fleet advice, anomaly narratives | Anonymized aggregates only |
| LGD/Census GIS | Geo hierarchy + boundaries | GeoJSON seeds; editable catchments |
| eGramSwaraj/PFMS (Phase 2) | Voucher → DBT to vendors | Interface stubs |

## 12. NON-FUNCTIONAL REQUIREMENTS
Performance: LCP<2.5 s; API p95<500 ms; GPS latency ≤60 s. Availability: 99.5% (district hours).
Capacity: 33 districts, ~150 blocks, ~11k GPs, ~20k villages (LGD-seeded, configurable); 5k
concurrent app users; 2k vehicles @ 1 ping/min. Security: OWASP ASVS L2, RBAC server-enforced,
PII masking, immutable audit, encrypted secrets, TLS everywhere. i18n: hi default, en, hne; GIGW +
WCAG 2.1 AA. Data: daily backups, 7-year retention of audit/payment records, soft-delete only.
Browser: Chrome/Edge ≥110, Android WebView ≥ Chrome 90.

## 13. RELEASE PLAN
Phase 1 (M1–3): core platform + citizen portal + offline field views + pilot district
(strong GP leadership, operating FSTPs). Phase 2 (M4–6): GIS routing engine, vendor marketplace,
state analytics, capacity building (training modules). Phase 3 (M7–12): statewide scale-out,
legacy data migration, IoT sensor exploration, eGramSwaraj/PFMS live integration.

## 14. RISKS & MITIGATIONS
Rural connectivity → offline-first + SMS fallback. Low digital literacy → icon-driven UI, CSC
assisted mode, Chhattisgarhi. Vendor resistance → transparent settlements, faster payouts.
GPS vendor API limits → adapter + caching + backoff. Data quality → mandatory evidence gates,
validation, audits. Adoptions → training, IEC, SLA-backed support desk.

## 15. OPEN QUESTIONS
Final SMS provider & DLT registration · real TraqIndia token & response schema confirmation ·
subsidy policy % per GP · LGD boundary file version · by-product marketplace scope.

## 16. REFERENCES
MoHUA National FSSM Policy 2017 · SBM-G 2.0 ODF+ guidelines · NUDM/NIUA "Desludging Service (FSM)
Knowledge Standard" (Feb 2026 draft) · UPYOG FSM module (DIGIT) · TraqIndia API docs ·
sbmrural.cgstate.gov.in/cgpwmu (branding reference) · GIGW guidelines.
```

---
