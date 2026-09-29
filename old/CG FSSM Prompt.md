# CG Rural FSSM Digital Platform - Development Prompt

## Project Overview
Build a comprehensive Faecal Sludge and Septage Management (FSSM) digital platform for rural Chhattisgarh that connects villages to treatment facilities through intelligent resource management and cross-utilization of urban-rural infrastructure.

## Core Requirements

### Administrative Hierarchy
- **State Level**: Chhattisgarh (27 districts)
- **District Level**: District Coordinators
- **Block Level**: Block Coordinators (most have FSTPs)
- **Gram Panchayat Level**: GP Operators
- **Village Level**: End citizens, sanitation workers

### Key Features

#### 1. Cross-Utilization Engine
- Urban resources (vacuum trucks, skilled operators, O&M support) deployed to rural areas
- Rural sludge transported to urban STPs with available capacity
- Dynamic resource allocation based on proximity and capacity
- GIS-based optimal routing between villages and treatment plants

#### 2. Service Delivery Workflow
Citizen Request → GP Approval → Vehicle Assignment →
Desludging → GPS Tracking → FSTP Disposal → Payment → Feedback

#### 3. Stakeholder Modules

**Citizens (Village Level)**
- Mobile-first, low-literacy interface
- Multi-lingual: Hindi, Chhattisgarhi, English
- Request desludging service with visual tank size estimator
- Live GPS tracking of assigned vehicle
- Digital payment (UPI/Cash)
- Service rating and feedback

**Sanitation Workers**
- Offline-first mobile app
- Before/After geo-tagged photo capture
- PPE compliance checklist
- Volume measurement logging
- Digital signature collection

**Drivers**
- Route optimization and navigation
- Daily trip manifests
- GPS tracking integration
- Vehicle capacity management
- FSTP disposal verification

**Private Vendors**
- Fleet management dashboard
- Vehicle registration and tracking
- Driver assignment
- Revenue tracking
- Performance analytics

**FSTP Operators**
- Digital manifest verification (QR scanning)
- Sludge volume logging
- Plant capacity monitoring
- Treatment lifecycle tracking
- Resource recovery management

**GP/Block/District Officers**
- Multi-tier monitoring dashboards
- SLA compliance tracking
- Vendor approval workflows
- Subsidy management for BPL households
- Analytics and reporting

**State Administrators**
- State-wide dashboard
- AI-powered predictive analytics
- Fund utilization tracking
- Policy compliance monitoring
- SBM-Grameen reporting

### Technical Specifications

#### Frontend
- **Framework**: React 18+ with Vite
- **UI Library**: Tailwind CSS with Glassmorphism design
- **Maps**: React-Leaflet with GeoJSON
- **State Management**: Redux Toolkit or Zustand
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts/Chart.js
- **PWA**: Service workers for offline capability

#### Backend
- **Runtime**: Node.js with Express
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI
- **File Upload**: Multer with S3-compatible storage
- **Real-time**: Socket.io for live tracking
- **Task Queue**: Bull/BullMQ for background jobs

#### Database
- **Primary**: PostgreSQL 14+ with PostGIS extension
- **Caching**: Redis for sessions and frequent queries
- **Offline Sync**: SQLite for mobile apps (Isar/Drift ORM)

#### Integrations
- **GPS Tracking**: Traqindia API or similar
- **Payment**: UPI deep linking, Payment gateway
- **SMS/WhatsApp**: NIC SMS Gateway/Gupshup
- **eGramSwaraj**: API integration for GP fund management
- **PFMS**: Public Financial Management System

#### Infrastructure
- **Server**: Windows Server 2019/2022
- **Process Manager**: PM2 or NSSM (Node.js as Windows Service)
- **Web Server**: IIS with ARR or Nginx
- **SSL**: Let's Encrypt or commercial certificate
- **Backup**: Automated PostgreSQL dumps

### Design System

#### Color Palette
```css
Primary: #333500 (Dark Olive)
Secondary: #522890 (Deep Purple)
Accent: #777A07 (Golden Olive)
Success: #138800 (Green)
Alert: #400000 (Dark Red)
Info: #234880 (Blue)
Typography
Headers: Fluid clamps (H1: 48-64px, H2: 36-48px)
Body: 16-18px with 1.6 line height
Data: Monospace for numerical values
Font Family: Inter/System fonts
UI Components
Glassmorphism panels with blur effects (10-40px)
High contrast buttons (touch-friendly, min 44px)
Dark/Light mode support
Mobile-first responsive design
Low-bandwidth optimized images
Key Workflows
1. Desludging Request Flow
javascript

// Citizen submits request
POST /api/fsm/v1/_create
{
  tenantId: "cg.district.block.gp",
  location: { lat, long, villageCode },
  tankDetails: { capacity, type, accessibility },
  preferredDate: "YYYY-MM-DD"
}

// System calculates dynamic pricing
pricing = baseRate + (distanceToFSTP * perKmRate) * tankMultiplier

// Auto-assign nearest available vehicle
vehicle = findNearestVehicle({
  capacity: tankCapacity,
  location: citizenLocation,
  accessibility: roadWidth
})

// Trigger notifications
sendSMS(citizen.mobile, "Booking confirmed. Vehicle: " + vehicle.number)

2. GPS Tracking & Anti-Dumping
javascript

// Track vehicle every 30 seconds
POST /api/vehicle/telemetry/v1/_ingest
{
  vehicleId: "CG-01-ABC-1234",
  lat: 21.2719,
  long: 81.6337,
  timestamp: "2026-05-21T10:30:00Z",
  speed: 35
}

// Geo-fence validation
if (!isWithinGeoFence(currentLocation, authorizedRoute)) {
  triggerAlert("Route deviation detected", districtOfficer)
  logViolation(vehicleId, "Potential illegal dumping")
}

// FSTP disposal verification
POST /api/fsm/trip/v1/_dispose
{
  tripId: "TRIP-2026-001",
  fstpId: "FSTP-BLOCK-001",
  volumeDecanted: 3000,
  qrCode: "scanned_manifest_qr",
  digitalSignature: "operator_signature"
}

3. Payment & Settlement
javascript

// Direct UPI payment to vendor
generateUPIQR({
  vpa: vendor.upiId,
  name: vendor.name,
  amount: calculatedAmount,
  txnRef: "FSM-" + Date.now()
})

// eGramSwaraj integration for subsidies
if (citizen.category === "BPL") {
  createSubsidyVoucher({
    gpCode: gp.code,
    amount: subsidyAmount,
    vendorId: vendor.id,
    serviceId: application.id
  })
  syncToEgramSwaraj(voucher)
}

Database Schema Highlights
sql

-- Multi-tenant design with tenantid in every table
CREATE TABLE eg_fsm_application (
  id VARCHAR(64) PRIMARY KEY,
  tenantid VARCHAR(64) NOT NULL, -- cg.district.block.gp
  applicationno VARCHAR(64) UNIQUE,
  accountid VARCHAR(64) REFERENCES eg_user(id),
  applicationstatus VARCHAR(64),
  address JSONB, -- Contains village, gp, block, district hierarchy
  tankcapacity NUMERIC,
  tanktype VARCHAR(50),
  createdtime BIGINT,
  lastmodifiedtime BIGINT
);

CREATE TABLE eg_fsm_trip (
  id VARCHAR(64) PRIMARY KEY,
  applicationno VARCHAR(64) REFERENCES eg_fsm_application(applicationno),
  vehicle_id VARCHAR(64) REFERENCES eg_vehicle(id),
  driver_id VARCHAR(64) REFERENCES eg_user(id),
  volumecollected NUMERIC,
  disposalstatus VARCHAR(50),
  fstp_id VARCHAR(64) REFERENCES eg_fstp(id)
);

CREATE TABLE eg_vehicle (
  id VARCHAR(64) PRIMARY KEY,
  tenantid VARCHAR(64) NOT NULL,
  vehicleno VARCHAR(20) UNIQUE,
  capacity NUMERIC,
  vehicletype VARCHAR(50), -- Vacuum truck, Tractor-mounted, Mini unit
  gpsdeviceid VARCHAR(100),
  fitnessvalidity DATE,
  insurancevalidity DATE,
  isactive BOOLEAN DEFAULT true
);

-- PostGIS for spatial queries
CREATE INDEX idx_village_geom ON eg_village USING GIST(geom);
CREATE INDEX idx_fstp_geom ON eg_fstp USING GIST(geom);


API Endpoints Structure

Authentication
POST /user/oauth/token
POST /user/password/update

FSM Service
POST /fsm/v1/_create
POST /fsm/v1/_search
POST /fsm/v1/_update
GET  /fsm/v1/{applicationNo}

Workflow
POST /fsm/workflow/v1/_update
POST /fsm/workflow/v1/_search

Vehicle & Tracking
POST /vehicle/telemetry/v1/_ingest
GET  /vehicle/v1/_search
POST /vehicle/v1/_assign

Payment
POST /collection/v1/_pay
GET  /billing/v1/_search
POST /billing/v1/_generate

FSTP Operations
POST /fstp/v1/_intake
GET  /fstp/v1/_search
POST /fstp/v1/_updatecapacity

Analytics & Reports
GET  /analytics/v1/dashboard
GET  /reports/v1/daily-collection
GET  /reports/v1/sla-compliance
GET  /reports/v1/fstp-utilization

Master Data
GET  /mdms/v1/_search
POST /mdms/v1/_create


Security Requirements
Authentication: JWT tokens with 15-min expiry, refresh tokens
Authorization: Role-Based Access Control (RBAC) at API level
Data Privacy: PII masking in logs, encrypted sensitive fields
Audit Trail: Immutable logs for all state transitions
Rate Limiting: 100 req/min per IP for public APIs
CORS: Whitelist approved domains only
Input Validation: Zod schemas for all requests
File Upload: Virus scanning, size limits (5MB for images)
Performance Targets
Page Load: <3s on 3G networks
API Response: <200ms for 95th percentile
Offline Sync: <30s after reconnection
Concurrent Users: Support 10,000+ active users
GPS Ingestion: Handle 1000+ vehicle updates/minute
Compliance & Standards
Follow NUDM UPYOG architecture patterns
Adhere to GIGW (Government of India Web Guidelines)
SBM-Grameen Phase II (ODF-Plus) reporting formats
Data localization: All data stored in India
WCAG 2.1 AA accessibility standards
Deployment Checklist
Windows Server hardening
PostgreSQL with PostGIS installation
Redis server configuration
Node.js LTS installation
PM2/NSSM service setup
SSL certificate configuration
Automated backup scripts
Monitoring (Prometheus + Grafana)
Log aggregation (ELK stack)
Disaster recovery plan
Development Phases
Phase 1 (Months 1-3): Core Platform
User authentication & RBAC
Citizen request module
Basic GP dashboard
Vehicle registration
Payment integration
Phase 2 (Months 4-6): Advanced Features
GIS routing & optimization
GPS tracking integration
FSTP operations module
AI analytics dashboard
eGramSwaraj integration
Phase 3 (Months 7-12): Scale & Optimize
State-wide rollout
Advanced reporting
IoT sensor integration
Predictive maintenance
Mobile app optimization
Success Metrics
Service Coverage: 80% of villages with active FSSM services
Illegal Dumping: <1% route deviation incidents
Response Time: 95% requests completed within 48 hours
Customer Satisfaction: CSAT score >4.0/5.0
FSTP Utilization: 60-85% capacity utilization
Digital Payments: >70% transactions via UPI
Worker Safety: 100% PPE compliance verification

Footer Reference

© Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh | 
Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved.
Supported by: Government of Chhattisgarh & UNICEF


## 2. Design.md

```markdown
# CG Rural FSSM Digital Platform - Design Document

## Visual Design Philosophy

### "Liquid Glass & Raw Functionality"
Combining premium glassmorphism aesthetics with raw data visualization for government operations.

## Layout Architecture

### 1. Public Portal (Citizen-Facing)

#### Hero Section
- **Full-screen interactive map** of Chhattisgarh showing:
  - Animated vehicle routes (real-time)
  - FSTP locations with capacity indicators
  - Service density heatmaps
- **Scroll-triggered animations** explaining FSSM chain:
Household → Septic Tank → Desludging → Transport → FSTP → Resource Recovery

- **Live metrics ticker**:
  - Villages Covered: 2,847
  - Active Vehicles: 156
  - Sludge Treated: 450 ML
  - Requests Completed: 14,230

#### Navigation
┌─────────────────────────────────────────────────┐
│ LOGO Home About Book Service Track Login │
└─────────────────────────────────────────────────┘

#### Service Booking Wizard (5 Steps)

Step 1: Location Capture
Auto-GPS with manual fallback
Cascading dropdowns: District → Block → GP → Village
Interactive map pin placement
Step 2: Schedule & Access
Calendar slot selection
Road width input (visual guide)
Accessibility notes (narrow lane, overhead wires)
Step 3: Tank Details
Visual tank size estimator (Small/Medium/Large)
Tank type selection (Septic/Single Pit/Twin Pit)
Construction year & last desludged date
Upload existing photo (optional)
Step 4: Price Preview
Dynamic pricing breakdown:
Base Rate: ₹2,000
Distance Charge: ₹280
Tank Multiplier: ₹250
───────────────────────
Total: ₹2,530
Payment mode selection (UPI/Cash)
Subsidy eligibility check
Step 5: Confirmation
Application number generation
SMS confirmation
Vendor assignment notification


### 2. Administrative Dashboards

#### State Dashboard (Glassmorphism Design)
┌─────────────────────────────────────────────────────────┐
│ [Glass Panel - Low Blur 10px / 70% Opacity] │
│ KPI Cards Row: │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │14,230│ │450ML │ │ 84 │ │ 72% │ │₹12.4M│ │
│ │Req. │ │Sludge│ │Vehi- │ │ FSTP │ │Revenue│ │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
└─────────────────────────────────────────────────────────┘
┌──────────────────────────┐ ┌──────────────────────────┐
│ [Medium Blur 25px] │ │ [Medium Blur 25px] │
│ Interactive Map │ │ AI Analytics Panel │
│ - Live vehicles │ │ - Demand forecasting │
│ - FSTP status │ │ - Anomaly detection │
│ - Heatmap overlay │ │ - Route optimization │
└──────────────────────────┘ └──────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ [High Blur 40px / 50% Opacity] │
│ Detailed Reports Table │
│ Export: PDF | Excel | Live Charts │
└─────────────────────────────────────────────────────────┘


#### District/Block Dashboard
- **Filter Bar**: Date range, GP multi-select, FSTP dropdown
- **SLA Compliance Heatmap**: Color-coded by performance
- **Vehicle Utilization Chart**: Pie chart showing active/idle/maintenance
- **Pending Requests Queue**: Sortable table with priority flags

#### GP Operator Dashboard
- **Today's Requests**: Card view with status badges
- **Active Vehicles**: Mini map with live positions
- **Quick Actions**: 
  - Approve Request
  - Assign Vehicle (manual override)
  - Process Subsidy
  - Reconcile Cash Payment

### 3. Mobile Interfaces

#### Citizen App (Mobile-First)
─────────────────────┐
│ CG Rural FSSM │
│ ────────────── │
│ │
│ 📍 Book Service │
│ 🚚 Track Vehicle │
│ 📋 My History │
│ 💳 Payments │
│ Feedback │
│ │
│ [Large touch │
│ friendly buttons] │
│ │
─────────────────────┘


#### Driver App

┌─────────────────────┐
│ Today's Route │
│ ─────────────── │
│ ✅ Household 1 │
│ ⏳ Household 2 │
│ ⏳ Household 3 │
│ │
│ [Navigation] │
│ [Call Customer] │
│ [Upload Photo] │
│ │
└─────────────────────┘

#### Sanitation Worker App
┌─────────────────────┐
│ Job #FSM-2026-045 │
│ ───────────────── │
│ ☑ PPE Checklist │
│ │
│ [📸 Before Photo] │
│ GPS: Locked ✓ │
│ │
│ Volume: [____] L │
│ │
│ [📸 After Photo] │
│ │
│ [✓ Complete Job] │
│ │
└─────────────────────┘


## Component Library

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #333500 0%, #522890 100%);
  color: #ffffff;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(51, 53, 0, 0.3);
  transition: all 0.3s ease;
}

/* Glass Button */
.btn-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 10px 24px;
  border-radius: 8px;
}

/* Touch Target Minimum */
.min-touch-target {
  min-width: 44px;
  min-height: 44px;
}

###Cards
/* Glass Card */
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* KPI Card */
.card-kpi {
  background: linear-gradient(135deg, 
    rgba(51, 53, 0, 0.8) 0%, 
    rgba(82, 40, 144, 0.8) 100%);
  backdrop-filter: blur(40px);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

Form Elements
/* Input Field */
.input-field {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(51, 53, 0, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #522890;
  box-shadow: 0 0 0 3px rgba(82, 40, 144, 0.1);
}

/* Low-literacy optimized */
.input-large {
  font-size: 18px;
  min-height: 56px;
}
Data Visualization
Charts
3D Pie Charts: FSTP capacity utilization
Line Charts: Monthly trend analysis
Bar Charts: District-wise comparison
Heatmaps: Service density, SLA compliance
Sankey Diagrams: Sludge volume flow
Map Styling
// Leaflet map configuration
const mapConfig = {
  center: [21.2719, 81.6337], // Chhattisgarh center
  zoom: 7,
  layers: {
    villages: {
      color: '#138800',
      radius: 5
    },
    fstps: {
      color: '#522890',
      radius: 8,
      pulse: true // Animated pulse for active plants
    },
    vehicles: {
      icon: 'truck-icon.svg',
      rotation: true, // Rotate based on heading
      trail: true     // Show last 5 positions
    }
  }
};

Status Indicators

/* Status Badges */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: rgba(19, 136, 0, 0.2);
  color: #138800;
  border: 1px solid #138800;
}

.badge-warning {
  background: rgba(235, 202, 96, 0.2);
  color: #777A07;
  border: 1px solid #777A07;
}

.badge-danger {
  background: rgba(64, 0, 0, 0.2);
  color: #400000;
  border: 1px solid #400000;
}

Responsive Breakpoints
/* Fluid typography without hard breakpoints */
:root {
  --text-base: clamp(16px, 1vw + 12px, 18px);
  --h1: clamp(48px, 4vw + 32px, 64px);
  --h2: clamp(36px, 3vw + 24px, 48px);
  --h3: clamp(24px, 2vw + 16px, 26px);
  --h4: clamp(18px, 1.5vw + 12px, 24px);
}

/* Container queries for components */
@container (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@container (min-width: 641px) and (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 1025px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
Animation System
Principles
Functional transitions only - No decorative motion
State changes - Smooth interpolation between states
Spatial layouts - Responsive without jarring shifts
Performance - GPU-accelerated transforms
Key Animations
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse for live indicators */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Slide in from right */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Usage */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

Dark/Light Mode
Color Tokens
:root {
  /* Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333500;
  --text-secondary: #522890;
  --border: rgba(0, 0, 0, 0.1);
}

.dark {
  /* Dark Mode */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #ABABAB;
  --border: rgba(255, 255, 255, 0.1);
}

Accessibility
WCAG 2.1 AA Compliance
Color Contrast: Minimum 4.5:1 for normal text
Focus Indicators: Visible 3px outline on all interactive elements
Screen Reader: ARIA labels for all icons and buttons
Keyboard Navigation: Tab order logical, skip-to-content link
Language Support: lang attribute, RTL ready
Low-Literacy Optimizations
Icon-first design (visual cues before text)
Large touch targets (minimum 44x44px)
Simple language (Grade 6 reading level)
Voice input support
Video tutorials embedded
Image Optimization
Compression Strategy
// Client-side compression before upload
const compressImage = async (file, maxWidth = 1920) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = await createImageBitmap(file);
  
  const scale = maxWidth / img.width;
  canvas.width = maxWidth;
  canvas.height = img.height * scale;
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return await new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.7); // 70% quality
  });
};

Footer Design
html
<footer class="bg-primary text-white py-8">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <img src="/logo-unicef.png" alt="UNICEF" class="h-12 mb-4">
        <p class="text-sm opacity-80">
          For every child
        </p>
      </div>
      <div>
        <h4 class="font-bold mb-4">Quick Links</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/about">About Us</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold mb-4">Resources</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/guidelines">Guidelines</a></li>
          <li><a href="/reports">Reports</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold mb-4">Connect</h4>
        <div class="flex space-x-4">
          <a href="#" class="text-2xl">📱</a>
          <a href="#" class="text-2xl">📧</a>
          <a href="#" class="text-2xl">🌐</a>
        </div>
      </div>
    </div>
    <div class="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-60">
      <p>© Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh | </p>
      <p>Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved.</p>
      <p>Supported by: Government of Chhattisgarh & UNICEF</p>
    </div>
  </div>
</footer>

Performance Optimizations
Code Splitting
javascript
// Route-based code splitting
const CitizenApp = lazy(() => import('./modules/citizen/App'));
const AdminDashboard = lazy(() => import('./modules/admin/Dashboard'));
const DriverApp = lazy(() => import('./modules/driver/App'));

// Component-level splitting
const MapComponent = lazy(() => import('./components/Map'));
const Charts = lazy(() => import('./components/Charts'));

Lazy Loading Images
jsx
<img 
  loading="lazy"
  src="placeholder.jpg"
  data-src="actual-image.jpg"
  alt="Descriptive text"
  className="blur-up"
/>

Service Worker Strategy
// Offline-first caching
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);


## 3. design_system.md

```markdown
# CG Rural FSSM Design System

## Foundation

### Brand Identity

**Mission**: Digitally transforming rural sanitation through intelligent monitoring, operational visibility, and connected infrastructure.

**Vision**: Every rural household in Chhattisgarh with access to safe, tracked, and verified faecal sludge management services.

### Color System

#### Primary Palette

css
/* Government Green - Trust & Growth /
--primary-900: #333500 / Dark Olive - Primary backgrounds /
--primary-800: #404400
--primary-700: #4d5200
--primary-600: #5a6100
--primary-500: #677000 / Main brand color /
--primary-400: #777A07 / Accent highlights */
--primary-300: #8a8f0a
--primary-200: #9ea40d
--primary-100: #b1b910
/* Deep Purple - Innovation & Technology /
--secondary-900: #522890 / Primary purple */
--secondary-800: #5f329e
--secondary-700: #6c3dab
--secondary-600: #7a47b9
--secondary-500: #8752c6
--secondary-400: #955dd4
--secondary-300: #a36be1
--secondary-200: #b17aee
--secondary-100: #c08bfb
/* Semantic Colors /
--success-500: #138800 / Success states, completion */
--success-400: #17a300
--success-300: #1bbf00
--warning-500: #EBCA60 /* Warnings, pending states */
--warning-400: #eed37a
--warning-300: #f1dc94
--danger-500: #400000 /* Errors, alerts, violations */
--danger-400: #550000
--danger-300: #6a0000
--info-500: #234880 /* Information, neutral actions */
--info-400: #2d5a9f
--info-300: #376dbf
/* Neutrals */
--gray-900: #1a1a1a
--gray-800: #2d2d2d
--gray-700: #404040
--gray-600: #595959
--gray-500: #737373
--gray-400: #8c8c8c
--gray-300: #a6a6a6
--gray-200: #cccccc
--gray-100: #e6e6e6
--gray-50: #f5f5f5
--white: #ffffff


#### Accessibility Contrast Ratios
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18px+): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio
- **Focus indicators**: Minimum 3:1 contrast ratio

### Typography

#### Font Families
```css
/* Primary Font - System fonts for performance */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Open Sans', 'Helvetica Neue', sans-serif;

/* Monospace for data */
--font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 
             'Roboto Mono', 'Consolas', monospace;

/* Hindi/Chhattisgarhi support */
--font-devanagari: 'Noto Sans Devanagari', 
                   'Kokila', 'Mangal', sans-serif;

                   Type Scale (Fluid)
                   :root {
  /* Display sizes */
  --text-display-xl: clamp(64px, 6vw + 32px, 96px);
  --text-display-lg: clamp(48px, 4vw + 32px, 64px);
  
  /* Headings */
  --text-h1: clamp(48px, 4vw + 32px, 64px);    /* Page titles */
  --text-h2: clamp(36px, 3vw + 24px, 48px);    /* Section titles */
  --text-h3: clamp(24px, 2vw + 16px, 26px);    /* Subsections */
  --text-h4: clamp(18px, 1.5vw + 12px, 24px);  /* Card titles */
  
  /* Body */
  --text-body-lg: clamp(18px, 0.5vw + 16px, 20px);
  --text-body: clamp(16px, 0.25vw + 15px, 18px);
  --text-body-sm: clamp(14px, 0.1vw + 13.5px, 16px);
  
  /* UI Elements */
  --text-label: 12px;
  --text-caption: 11px;
  --text-button: 14px;
  
  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;
  
  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}

Font Weights
css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

Spacing System
Base Scale (8px grid)
css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
  --space-40: 160px;
  --space-48: 192px;
  --space-64: 256px;
}

Border Radius
css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}

Shadows
css
:root {
  /* Elevation shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
               0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Colored shadows */
  --shadow-primary: 0 4px 15px rgba(51, 53, 0, 0.3);
  --shadow-secondary: 0 4px 15px rgba(82, 40, 144, 0.3);
  
  /* Glassmorphism shadows */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);
}

Glassmorphism System
Blur Levels
css
/* Low blur - Subtle effect */
.glass-low {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Medium blur - Standard panels */
.glass-medium {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* High blur - Prominent cards */
.glass-high {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Dark mode variants */
.dark .glass-low {
  background: rgba(26, 26, 26, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .glass-medium {
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

Components
Buttons
Primary Button
jsx
<button className="btn-primary">
  Book Service
</button>

/* Styles */
.btn-primary {
  background: linear-gradient(135deg, 
    var(--primary-600) 0%, 
    var(--secondary-600) 100%);
  color: var(--white);
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-button);
  box-shadow: var(--shadow-primary);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  min-width: 44px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
Secondary Button
jsx

<button className="btn-secondary">
  View Details
</button>

.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-600);
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary-50);
}

Glass Button
jsx
<button className="btn-glass">
  Track Vehicle
</button>

.btn-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
}

Cards
KPI Card
jsx
<div className="card-kpi">
  <div className="kpi-value">14,230</div>
  <div className="kpi-label">Requests Completed</div>
</div>

.card-kpi {
  background: linear-gradient(135deg, 
    rgba(51, 53, 0, 0.9) 0%, 
    rgba(82, 40, 144, 0.9) 100%);
  backdrop-filter: blur(40px);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  text-align: center;
  color: var(--white);
  box-shadow: var(--shadow-glass);
}

.kpi-value {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  margin-bottom: var(--space-2);
}

.kpi-label {
  font-size: var(--text-body-sm);
  opacity: 0.9;
}

Service Card
jsx
<div className="card-service">
  <div className="card-header">
    <h4>Request #FSM-2026-0045</h4>
    <span className="badge badge-success">Completed</span>
  </div>
  <div className="card-body">
    <p>Village: Ramapur</p>
    <p>Tank Size: 3000L</p>
    <p>Date: 21 May 2026</p>
  </div>
</div>

.card-service {
  background: var(--glass-medium);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

Forms
Input Field
jsx
<input 
  type="text" 
  className="input-field"
  placeholder="Enter location"
/>

.input-field {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(51, 53, 0, 0.2);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-body);
  width: 100%;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--secondary-500);
  box-shadow: 0 0 0 3px rgba(82, 40, 144, 0.1);
}

.input-field::placeholder {
  color: var(--gray-500);
}

Select Dropdown
jsx
<select className="select-field">
  <option value="">Select District</option>
  <option value="raipur">Raipur</option>
  <option value="bilaspur">Bilaspur</option>
</select>

.select-field {
  appearance: none;
  background-image: url("data:image/svg+xml,...");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: var(--space-10);
}

Status Badges
jsx
<span className="badge badge-success">Completed</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Rejected</span>
<span className="badge badge-info">In Progress</span>

.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-label);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: rgba(19, 136, 0, 0.15);
  color: var(--success-500);
  border: 1px solid var(--success-500);
}

.badge-warning {
  background: rgba(235, 202, 96, 0.15);
  color: var(--primary-400);
  border: 1px solid var(--primary-400);
}

.badge-danger {
  background: rgba(64, 0, 0, 0.15);
  color: var(--danger-400);
  border: 1px solid var(--danger-400);
}

.badge-info {
  background: rgba(35, 72, 128, 0.15);
  color: var(--info-500);
  border: 1px solid var(--info-500);
}

Navigation
Top Navigation Bar
jsx
<nav className="navbar">
  <div className="navbar-brand">
    <img src="/logo.png" alt="CG FSSM" />
    <span>CG Rural FSSM</span>
  </div>
  <ul className="navbar-menu">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/book">Book Service</a></li>
    <li><a href="/track">Track</a></li>
    <li><a href="/login">Login</a></li>
  </ul>
</nav>

.navbar {
  background: var(--glass-medium);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid var(--border);
  padding: var(--space-4) var(--space-8);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-menu {
  display: flex;
  gap: var(--space-6);
  list-style: none;
}

.navbar-menu a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.navbar-menu a:hover {
  background: rgba(51, 53, 0, 0.1);
}

Data Display
Table
jsx
<table className="data-table">
  <thead>
    <tr>
      <th>Application No</th>
      <th>Village</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>FSM-2026-0045</td>
      <td>Ramapur</td>
      <td><Badge success>Completed</Badge></td>
      <td>21 May 2026</td>
    </tr>
  </tbody>
</table>

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--glass-low);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.data-table th {
  background: rgba(51, 53, 0, 0.1);
  padding: var(--space-4);
  text-align: left;
  font-weight: var(--font-semibold);
  border-bottom: 2px solid var(--border);
}

.data-table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.data-table tr:hover {
  background: rgba(51, 53, 0, 0.05);
}

Icons
Icon System
Library: Lucide React or Heroicons
Size: 20px default, scalable
Stroke width: 2px
Color: Inherit from text color
jsx
import { Truck, MapPin, Calendar, Phone } from 'lucide-react';

<Truck size={24} className="text-primary" />
<MapPin size={20} />

Animations
Transitions
css'
.transition-fast {
  transition: all 0.15s ease;
}

.transition-base {
  transition: all 0.3s ease;
}

.transition-slow {
  transition: all 0.5s ease;
}

Keyframe Animations
css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

Responsive Design
Breakpoints
css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */

/* Tablet */
@media (min-width: 640px) {
  /* sm: */
}

/* Small Desktop */
@media (min-width: 768px) {
  /* md: */
}

/* Desktop */
@media (min-width: 1024px) {
  /* lg: */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* xl: */
}

/* Extra Large */
@media (min-width: 1536px) {
  /* 2xl: */
}

Container Queries
css
/* Component-level responsiveness */
@container (min-width: 400px) {
  .card-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 700px) {
  .card-layout {
    grid-template-columns: repeat(4, 1fr);
  }
}

Accessibility
Focus Management
css
.focus-visible {
  outline: 3px solid var(--secondary-500);
  outline-offset: 2px;
}

.focus-none {
  outline: none;
}

Screen Reader Only
css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

Reduced Motion
css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

Dark Mode
Implementation
jsx
// Toggle function
const toggleDarkMode = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  }
};

// Check system preference
if (localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}

Localization
Multi-language Support
jsx

// i18n configuration
const resources = {
  en: {
    translation: {
      "bookService": "Book Service",
      "trackVehicle": "Track Vehicle"
    }
  },
  hi: {
    translation: {
      "bookService": "सेवा बुक करें",
      "trackVehicle": "वाहन ट्रैक करें"
    }
  },
  cg: {
    translation: {
      "bookService": "सेवा बुक करय",
      "trackVehicle": "गाड़ी ट्रैक करय"
    }
  }
};


Performance
Image Optimization
jsx

// Lazy loading with blur placeholder
<Image 
  src="/hero.jpg"
  alt="CG Rural FSSM"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  quality={75}
/>


Code Splitting
jsx

// Dynamic imports
const Dashboard = dynamic(() => import('./Dashboard'), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});



