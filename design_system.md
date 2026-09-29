
```markdown
# DESIGN SYSTEM — CG Rural FSSM Platform
Language: "Liquid Glass & Raw Functionality" — glassmorphism + raw data aesthetics.
Dark = dashboards · Light = public site. One token set, two themes.

## 1. BRAND
- Name: CG Rural FSSM Platform · Tagline: "The Digital Operating System for Rural Sanitation Infrastructure."
- Marks: App logo (teal/navy CG map + vacuum truck), SBM-G logo, Govt. of Chhattisgarh emblem, UNICEF.
- Personality: trustworthy government infrastructure × modern mission-control telemetry.

## 2. COLOR TOKENS
### Dark (dashboards, default)
| Token             | Hex     | Use |
|-------------------|---------|-----|
| bg/primary        | #033550 | page background |
| bg/elevated       | #0B2233 | cards, sidebar |
| bg/glass          | rgba(255,255,255,0.06) | glass panels |
| border/glass      | rgba(255,255,255,0.14) | hairlines |
| text/primary      | #E6F1F5 | headings, key data |
| text/secondary    | #94A3B8 | body, labels |
| brand/teal        | #14B8A6 | brand, primary actions, routes |
| accent/cyan       | #38BDF8 | links, interactive, charts |
| success/green     | #22C55E | completed, healthy FSTP, GPS online |
| warning/amber     | #F59E0B | SLA at-risk, capacity amber |
| critical/red      | #EF4444 | SLA breach, deviation, rejected |
| info/violet       | #8B5CF6 | governance/analytics accents |
### Light (public site, default)
| Token             | Hex     | Use |
|-------------------|---------|-----|
| bg/primary        | #F4F7F9 | page |
| bg/elevated       | #FFFFFF | cards |
| bg/glass          | rgba(255,255,255,0.65) | glass over imagery |
| border/glass      | rgba(11,37,64,0.12) | hairlines |
| text/primary      | #0B2540 | headings |
| text/secondary    | #475569 | body |
| brand/teal        | #0E9488 | primary actions (AA on white) |
| accent/cyan       | #0369A1 | links |
| success/warning/critical | #15803D / #B45309 / #B91C1C | semantic (light-adjusted) |
Rules: teal = action & flow; cyan = information; red/amber/green reserved for state semantics
(FSTP status, SLA, GPS health) — never decorative.

## 3. TYPOGRAPHY
| Role   | Font          | Size (fluid)                     | Weight | Case |
|--------|---------------|----------------------------------|--------|------|
| H1     | Space Grotesk | clamp(2.25rem, 5vw, 4rem)        | 700    | Sentence |
| H2     | Space Grotesk | clamp(1.75rem, 3.5vw, 2.75rem)   | 700    | Sentence |
| H3     | Space Grotesk | clamp(1.25rem, 2vw, 1.75rem)     | 600    | Sentence |
| H4     | Inter         | clamp(1.125rem, 1.5vw, 1.5rem)   | 600    | Sentence |
| Body   | Inter         | 1rem (mobile 1rem, desktop 1.0625rem) | 400 | — |
| Caption| Inter         | 0.8125rem                        | 500    | — |
| Data   | JetBrains Mono| 0.75–0.8125rem                   | 500    | UPPERCASE tags |
Data typography examples: [STATUS: EN_ROUTE] · [LAT: 21.25, LON: 81.63] · [FLOW: OPTIMIZED]
· [VIEW: DASHBOARD_V1] · [TENANT: CG-D02-B07-GP11]. Hindi/Chhattisgarhi: Noto Sans Devanagari fallback.
Line-height 1.5 body / 1.1 headings; max measure 72ch.

## 4. SPACING · RADIUS · ELEVATION · BLUR
- Space scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 (px). Section rhythm 64–96.
- Radius: sm 8 · md 12 · lg 16 · xl 24 · pill 999 (capsules).
- Glass levels: L1 blur 10px/70% opacity (low cards) · L2 blur 25px/50% (panels) ·
  L3 blur 40px/50% (hero overlays, modals). Border 1px glass; shadow: 0 8px 32px rgba(2,20,35,0.35).
- Mesh gradient backgrounds: teal→cyan→navy radial blobs at 6–10% opacity behind glass.

## 5. ICONOGRAPHY
lucide-react, 1.5px stroke, 20px UI / 24px features. Domain icons: Droplets, Truck, MapPin,
Factory, Recycle, ShieldCheck, Radio (GPS), FileCheck (manifest), IndianRupee, Languages.
Status glyphs: ● online · ◐ partial · ○ offline.

## 6. MOTION RULES
- STATE CHANGES ONLY. Allowed: status chip change (color crossfade 200 ms), stepper advance,
  marker position update (interpolated 1 s), toast in/out (150/200 ms), skeleton shimmer.
- Prohibited: decorative parallax on data pages, bounce loops, rotating loaders > 1 instance.
- Hero chain animation is the single showcase motion (scroll-triggered, respects
  prefers-reduced-motion).

## 7. COMPONENTS (specs)
- **Button (capsule)**: heights 40/48; variants primary (teal fill, white text), secondary
  (glass + teal border), ghost (text), danger (red), disabled (40% opacity, no cursor).
  Focus: 2px cyan ring offset 2px. Touch target ≥ 44 px.
- **Glass card**: radius lg(16) or xl(24), glass bg + border + shadow L1/L2; header row =
  icon chip + title + mono tag [MODULE: REQUESTS].
- **KPI stat card**: label (caption) · value (Space Grotesk 2rem) · delta chip (▲/▼ + %)
  · sparkline (Recharts, 60×24) · mono source tag [KPI: 5.5.2.6].
- **Status chip** (map status enum): NEW slate · APPROVED cyan · EN_ROUTE teal pulse ·
  ARRIVED amber · COMPLETED green · REJECTED red · ESCALATED violet. Chip = dot + uppercase mono.
- **Data tag**: monospace, bracketed, uppercase, secondary text color, 0.75rem.
- **Sidebar**: 260px expanded / 72px collapsed; item = icon + label; active = teal left bar 3px
  + glass fill; group headers = mono tags [OPERATIONS] [MASTERS] [SYSTEM].
- **Topbar**: 64px glass; geo-scope selector (cascading District▸Block▸GP▸Village), search (⌘K),
  bell w/ badge, theme, language, avatar menu.
- **Table**: sticky header, zebra rgba rows, row height 52, status chip column, row actions menu;
  mobile → stacked cards. Column: filter chips row above.
- **Form controls**: labels above, helper below; input = glass surface, radius md, focus teal
  ring; validation = red border + message; date/number use native controls; selects for enums
  with searchable mode (geo pickers).
- **Stepper (booking wizard)**: horizontal on desktop, vertical mobile; steps: Location →
  Schedule → Tank & Site → Price & Payment → Confirmation. Completed = teal check, current = ring.
- **Timeline (request audit)**: vertical line, dot per transition, mono timestamp, actor avatar +
  role chip, note, evidence thumbnails inline.
- **Modal / Drawer**: glass L3, esc + backdrop close, destructive = red confirm button.
- **Toast**: bottom-right stack, 4 s, variant colors, single-line + action link.
- **Tabs**: underline indicator animating width/position (state-change only).
- **Map overlay panel**: glass card over Leaflet; vehicle list w/ live speed (mono), filter
  checkboxes, legend (FSTP status circles, route lines).
- **Gauge (FSTP capacity)**: semicircle, green <70% · amber 70–90% · red >90%, mono % center.
- **Skeleton**: glass shimmer, matches final layout.
- **Empty state**: line illustration + caption + primary action.
- **Notification item**: icon chip, title, mono time, read state; grouped by day.

## 8. PATTERNS
- Telemetry header (dashboards): H2 + [VIEW: ...] tag + last-updated mono + refresh.
- Geo filter bar: persistent above lists/maps/reports; selection persists per user.
- Evidence gallery: BEFORE/AFTER/PPE grouped, EXIF chip [GPS ✓ VERIFIED] or [GPS ✗ MISMATCH].
- SLA chip: countdown (mono) turning amber at 75%, red at breach, with ESCALATED state.
- PII masking: names "R*** K***", phone "+91 ••••• 1234" per role rules.

## 9. DARK/LIGHT GUIDANCE
Public pages default light; app default dark; user toggle persists (localStorage + profile).
All tokens theme-swapped; glass alpha adjusted per theme; charts use theme series colors
(teal, cyan, violet, amber, green); never hardcode hex in components.

## 10. DO / DON'T
DO: keep numbers mono; put provenance tags on every metric; use status color only for state;
keep forms ≤ 7 fields per step; show last-seen age on GPS.
DON'T: gradient text on data, more than 2 glass layers stacked, decorative motion in app shell,
red for non-critical accents, sans-serif for coordinates/IDs.

## 11. ACCESSIBILITY CHECKLIST
Contrast AA (test teal-on-white = #0E9488), focus-visible everywhere, keyboard: sidebar/tab/table/
modal navigable, aria-live on status + toast, map has text alternative list, images have alt,
reduced-motion honored, font-size scales to 200% without breakage.
```

---
