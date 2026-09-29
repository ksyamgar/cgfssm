
## 4. PRD.md

```markdown
# Product Requirements Document (PRD)
## CG Rural FSSM Digital Platform

**Version**: 2.0  
**Date**: May 21, 2026  
**Prepared By**: Raj Yamgar, UNICEF Chhattisgarh  
**Status**: Approved for Development

---

## 1. Executive Summary

### 1.1 Product Vision
The CG Rural FSSM Digital Platform is an end-to-end service delivery, operational monitoring, and geospatial tracking system designed specifically for rural Chhattisgarh's unique sanitation challenges. Unlike urban-focused platforms like UPYOG, this system addresses the complexities of decentralized rural governance, dispersed settlements, and cross-utilization of urban-rural resources.

### 1.2 Problem Statement
Rural Chhattisgarh faces critical sanitation challenges:
- **Geographic Dispersion**: ~20,000 villages across 27 districts with poor road infrastructure
- **Informal Operations**: Unregulated private desludging operators with no tracking
- **Illegal Dumping**: Faecal sludge dumped in water bodies and open fields
- **Resource Inefficiency**: Dead mileage, underutilized FSTPs, capacity mismatches
- **Lack of Transparency**: Cash-based transactions, no audit trails
- **Data Gaps**: No real-time monitoring for evidence-based policymaking

### 1.3 Solution Overview
A comprehensive digital platform that:
- Connects rural households to FSTPs through intelligent routing
- Enables cross-utilization of urban and rural resources
- Provides end-to-end tracking from request to safe disposal
- Ensures transparent digital payments and subsidy management
- Delivers AI-powered analytics for proactive governance

---

## 2. Objectives & Success Metrics

### 2.1 Primary Objectives

**O1: Digitize FSSM Value Chain**
- **KR1**: 100% of desludging requests logged digitally
- **KR2**: 95% of transactions with complete audit trail
- **KR3**: Zero manual paper records by Month 12

**O2: Optimize Logistics**
- **KR1**: Reduce dead mileage by 40% through route optimization
- **KR2**: Achieve 75% vehicle capacity utilization
- **KR3**: Average response time <24 hours for urgent requests

**O3: Eliminate Illegal Dumping**
- **KR1**: 100% GPS-tracked vehicles
- **KR2**: <1% route deviation incidents
- **KR3**: 100% disposal verification at FSTPs

**O4: Enhance Transparency**
- **KR1**: 70% digital payments (UPI) adoption
- **KR2**: Zero cash leakage incidents
- **KR3**: Real-time vendor payment settlement (<48 hours)

**O5: Data-Driven Governance**
- **KR1**: 100% Gram Panchayats with active dashboards
- **KR2**: Monthly AI-powered demand forecasting
- **KR3**: SBM-G reporting automated

### 2.2 Success Metrics

| Metric | Baseline | Target (Y1) | Target (Y2) |
|--------|----------|-------------|-------------|
| Villages Covered | 0% | 60% | 90% |
| Active Vehicles | 0 | 200 | 400 |
| Requests/Month | 0 | 5,000 | 12,000 |
| Avg. Completion Time | N/A | 48 hrs | 24 hrs |
| Customer Satisfaction | N/A | 3.5/5 | 4.2/5 |
| FSTP Utilization | 30% | 65% | 80% |
| Digital Payments | 0% | 50% | 75% |
| Illegal Dumping Incidents | Unknown | <2% | <0.5% |

---

## 3. Stakeholder Analysis

### 3.1 Primary Stakeholders

**Citizens (End Users)**
- **Profile**: Rural households with septic tanks/pits
- **Pain Points**: 
  - No reliable service providers
  - Opaque pricing
  - Unsafe disposal practices
  - No complaint redressal
- **Needs**:
  - Easy booking (low-literacy interface)
  - Transparent pricing
  - Live tracking
  - Verified safe disposal
- **Success Criteria**: Service completed within 48 hrs, CSAT >4.0

**Gram Panchayat Operators**
- **Profile**: GP-level administrative staff
- **Pain Points**:
  - Manual record-keeping
  - No visibility into operations
  - Subsidy processing delays
  - Vendor management challenges
- **Needs**:
  - Request approval workflow
  - Vendor assignment tools
  - Cash reconciliation
  - GPDP integration
- **Success Criteria**: 100% requests processed within SLA

**Private Vendors (Fleet Owners)**
- **Profile**: Registered desludging service providers
- **Pain Points**:
  - Irregular work allocation
  - Payment delays
  - Dead mileage costs
  - No performance tracking
- **Needs**:
  - Fair assignment system
  - Real-time revenue tracking
  - Route optimization
  - Quick payment settlement
- ** **Success Criteria**: 30% income increase, payment within 48 hrs

**FSTP Operators**
- **Profile**: Treatment plant operational staff
- **Pain Points**:
  - Unpredictable inflow
  - Manual manifest recording
  - Capacity planning challenges
  - No treatment tracking
- **Needs**:
  - Digital manifest verification
  - Capacity monitoring
  - Treatment lifecycle logging
  - Resource recovery tracking
- **Success Criteria**: 85% capacity utilization, zero overflow

**Block/District Officers**
- **Profile**: Government administrative officers
- **Pain Points**:
  - No real-time monitoring
  - Manual report compilation
  - SLA compliance tracking
  - Fund utilization monitoring
- **Needs**:
  - Multi-tier dashboards
  - Automated reporting
  - Anomaly detection
  - SBM-G compliance tracking
- **Success Criteria**: 100% data-driven decision making

**State Administrators**
- **Profile**: State Water & Sanitation Mission (SWSM)
- **Pain Points**:
  - State-wide visibility gaps
  - Policy impact assessment
  - Fund allocation optimization
  - Inter-district coordination
- **Needs**:
  - Executive dashboards
  - Predictive analytics
  - Fund utilization reports
  - Cross-district resource sharing
- **Success Criteria**: ODF+ certification for 80% villages

### 3.2 Secondary Stakeholders

- **Swachhagrahis**: Community mobilizers for demand generation
- **Sanitation Workers**: Field execution with safety compliance
- **Drivers**: Vehicle operation and GPS tracking
- **By-Product Buyers**: Farmers purchasing compost/treated water
- **UNICEF**: Technical support and monitoring
- **Government of Chhattisgarh**: Policy and funding support

---

## 4. Functional Requirements

### 4.1 User Management & Authentication

**FR-UM-001: Multi-Role Registration**
- System shall support registration for 10 distinct user roles
- Each role shall have predefined permissions (RBAC)
- Approval workflow for Vendor and FSTP Operator roles
- Aadhaar-based verification optional for workers

**FR-UM-002: Authentication**
- OTP-based login for citizens (mobile number)
- Username/password for administrative roles
- JWT tokens with 15-minute expiry
- Refresh token mechanism
- Session timeout after 30 minutes of inactivity

**FR-UM-003: Password Management**
- Minimum 8 characters, 1 uppercase, 1 number, 1 special character
- Password history (last 5 passwords cannot be reused)
- Password expiry every 90 days for admin roles
- Self-service password reset via OTP

### 4.2 Citizen Service Module

**FR-CS-001: Service Request Creation**
- Mobile-first responsive interface
- Auto-detect location via GPS with manual fallback
- Cascading dropdowns: District → Block → GP → Village
- Visual tank size estimator (Small: 1000L, Medium: 2000L, Large: 3000L+)
- Tank type selection (Septic Tank, Single Pit, Twin Pit, Soak Pit)
- Accessibility inputs (road width, overhead obstacles)
- Preferred service date/time selection
- Emergency booking option (premium pricing)

**FR-CS-002: Dynamic Pricing**
- Algorithm: `Base Rate + (Distance × Per Km Rate) × Tank Multiplier`
- GP-specific base rates configurable
- Distance calculated to linked FSTP (not political boundaries)
- Real-time price preview before submission
- Subsidy eligibility check (BPL/AAY card holders)
- Price breakdown display

**FR-CS-003: Payment Processing**
- UPI deep linking (PhonePe, GPay, Paytm, BHIM)
- Dynamic QR code generation with vendor VPA
- Cash payment option (receipt generated)
- Payment status tracking
- Auto-receipt generation
- Integration with eGramSwaraj for subsidy portion

**FR-CS-004: Live Tracking**
- Real-time vehicle location on map
- ETA calculation and updates
- Driver name and contact number display
- SMS notifications at key milestones:
  - Request confirmed
  - Vehicle assigned
  - Vehicle dispatched
  - Vehicle arrived
  - Service completed
  - Payment received

**FR-CS-005: Service History**
- List view of all past requests
- Filter by status, date range
- Download receipts
- Re-book same service (one-click)
- Rating and feedback submission (post-completion)

### 4.3 GP Operator Module

**FR-GP-001: Request Management**
- Dashboard showing pending/approved/rejected requests
- Request details view (location, tank size, accessibility)
- Approval/rejection with reason
- Manual vehicle assignment override
- Bulk approval for scheduled programs

**FR-GP-002: Vendor Management**
- List of empaneled vendors in GP jurisdiction
- Vendor performance ratings
- Availability status tracking
- Direct communication (call/SMS)

**FR-GP-003: Subsidy Processing**
- BPL household identification
- Subsidy amount calculation (as per GP policy)
- Voucher generation
- eGramSwaraj sync
- Payment reconciliation

**FR-GP-004: Cash Reconciliation**
- Log cash payments received by drivers
- Generate digital receipts
- Daily collection report
- Bank deposit tracking

### 4.4 Driver & Worker Module

**FR-DW-001: Daily Manifest**
- View assigned trips for the day
- Optimized route sequence
- Customer details (name, address, contact, tank size)
- Navigation integration (Google Maps/MapMyIndia)
- Trip status updates (En Route, Arrived, Started, Completed)

**FR-DW-002: Evidence Capture**
- Mandatory PPE checklist before starting
- Before photo capture (geo-fenced, timestamped)
- After photo capture (geo-fenced, timestamped)
- Volume measurement input (liters)
- Digital signature from beneficiary
- Offline capability with auto-sync

**FR-DW-003: GPS Tracking**
- Background location tracking (every 30 seconds)
- Route deviation alerts
- Idle time monitoring
- Speed limit warnings
- FSTP geo-fence entry detection

**FR-DW-004: Disposal Verification**
- QR code scan at FSTP entry
- Manifest handover confirmation
- FSTP operator digital signature
- Trip closure

### 4.5 Vendor Management Module

**FR-VM-001: Fleet Registration**
- Vehicle details (registration number, capacity, type)
- Upload documents (RC, Insurance, Fitness, PUC)
- GPS device ID mapping
- Driver assignment
- Document expiry alerts

**FR-VM-002: Operations Dashboard**
- Active trips view
- Vehicle-wise revenue tracking
- Driver performance metrics
- Fuel consumption tracking
- Maintenance schedule alerts
- Utilization reports

**FR-VM-003: Financial Management**
- Daily/weekly/monthly revenue reports
- Pending payment status
- Payment history
- Download invoices
- Tax compliance (GST)

### 4.6 FSTP Operations Module

**FR-FO-001: Intake Management**
- QR code scanning for vehicle identification
- Manifest verification
- Actual volume received logging
- Quality check (optional)
- Digital signature

**FR-FO-002: Capacity Monitoring**
- Real-time capacity utilization %
- Daily inflow tracking
- Treatment status (Functional/Under Maintenance/Full)
- Alert when capacity >85%
- Overflow prevention protocols

**FR-FO-003: Treatment Lifecycle**
- Treatment technology tracking (ABR, PGF, SDB, etc.)
- Retention time logging
- Effluent quality parameters
- Sludge drying bed status
- Resource recovery logging (compost quantity, treated water)

**FR-FO-004: Resource Recovery**
- Compost inventory management
- Treated water availability
- Sales to registered buyers
- Revenue tracking
- Distribution logs

### 4.7 Administrative Dashboards

**FR-AD-001: Block Dashboard**
- All GPs under block
- Pending requests count
- Active vehicles
- SLA compliance %
- FSTP capacity utilization
- Complaint tracking

**FR-AD-002: District Dashboard**
- All blocks under district
- Comparative analytics (block-wise)
- Vendor empanelment status
- Fund utilization
- SLA breach alerts
- Heatmap of service density

**FR-AD-003: State Dashboard**
- All districts
- State-wide KPIs
- AI-powered insights
- Fund allocation vs utilization
- SBM-G progress tracking
- Policy compliance monitoring
- Exportable reports (PDF, Excel)

### 4.8 GIS & Routing Module

**FR-GIS-001: Village-to-FSTP Mapping**
- Dynamic linkage based on road distance (not political boundaries)
- Multiple FSTP options per village
- Capacity-based routing
- Real-time FSTP availability

**FR-GIS-002: Route Optimization**
- Cluster-based request batching
- Multi-stop route planning
- Fuel optimization algorithm
- Vehicle capacity matching
- Time window constraints

**FR-GIS-003: Geo-fencing**
- FSTP boundary definition
- Authorized route corridors
- Illegal dumping detection
- Automatic alerts on deviation

**FR-GIS-004: Spatial Analytics**
- Service density heatmaps
- Unserved area identification
- Optimal FSTP location suggestions
- Coverage gap analysis

### 4.9 AI & Analytics Module

**FR-AI-001: Predictive Demand**
- Historical desludging pattern analysis
- Seasonal trend detection
- Village-level demand forecasting
- Tank age-based prediction
- Overflow risk alerts

**FR-AI-002: Anomaly Detection**
- Unusual route patterns
- Suspicious stop detection
- Volume discrepancy alerts
- Fake photo detection (metadata analysis)
- Vendor performance anomalies

**FR-AI-003: Optimization Recommendations**
- Vehicle redistribution suggestions
- FSTP capacity expansion needs
- Pricing optimization
- Staff allocation recommendations

**FR-AI-004: Natural Language Insights**
- Plain-text summaries of complex data
- Automated report generation
- Voice-based queries (future)

### 4.10 Reporting Module

**FR-REP-001: Operational Reports**
- Daily Collection Report
- Trip Closure Report
- Vehicle Performance Report
- Driver Attendance Report
- FSTP Utilization Report

**FR-REP-002: Financial Reports**
- Revenue Collection Report
- Outstanding Payments Report
- Subsidy Disbursement Report
- Vendor Payment Report
- Fund Utilization Report

**FR-REP-003: Compliance Reports**
- SLA Compliance Report
- Illegal Dumping Incidents Report
- Safety Compliance Report (PPE)
- Environmental Impact Report
- SBM-G ODF+ Progress Report

**FR-REP-004: Analytics Reports**
- Customer Satisfaction Report
- Service Density Analysis
- Trend Analysis (monthly/quarterly)
- Comparative Performance (GP/Block/District)

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-PER-001: Response Time**
- Page load time <3 seconds on 3G networks
- API response time <200ms (95th percentile)
- GPS ingestion latency <5 seconds
- Offline sync completion <30 seconds after reconnection

**NFR-PER-002: Scalability**
- Support 10,000+ concurrent users
- Handle 1,000+ GPS updates per minute
- Process 5,000+ service requests per day
- Database size growth: 100GB/year

**NFR-PER-003: Availability**
- System uptime: 99.5% (business hours: 6 AM - 10 PM)
- Scheduled maintenance window: 2 AM - 4 AM (Sunday)
- Disaster Recovery RTO: 4 hours, RPO: 1 hour

### 5.2 Security

**NFR-SEC-001: Authentication & Authorization**
- JWT tokens with RSA-256 encryption
- Role-Based Access Control (RBAC) at API level
- Multi-factor authentication for admin roles
- Session management with automatic logout

**NFR-SEC-002: Data Protection**
- All data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- PII masking in logs and reports
- Secure file upload (virus scanning)
- SQL injection prevention (parameterized queries)

**NFR-SEC-003: Audit & Compliance**
- Immutable audit logs for all state transitions
- User action tracking (who, what, when, where)
- Data retention: 7 years (as per government norms)
- GDPR compliance for data privacy
- Data localization (all data stored in India)

### 5.3 Usability

**NFR-USA-001: Accessibility**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode
- Font size adjustment

**NFR-USA-002: Localization**
- Multi-language support (Hindi, Chhattisgarhi, English)
- Right-to-left (RTL) ready
- Date/time format: DD/MM/YYYY (Indian)
- Currency: INR (₹)
- Number format: 1,23,456.78 (Indian numbering)

**NFR-USA-003: Mobile Optimization**
- Responsive design (mobile, tablet, desktop)
- Touch-friendly interface (min 44x44px targets)
- Low-bandwidth optimization
- Progressive Web App (PWA) for field workers
- Offline-first architecture

### 5.4 Reliability

**NFR-REL-001: Data Integrity**
- Database transactions with ACID compliance
- Referential integrity constraints
- Soft deletion (is_deleted flag)
- Data validation at multiple layers

**NFR-REL-002: Error Handling**
- Graceful error messages (user-friendly)
- Automatic retry for failed API calls (max 3 attempts)
- Circuit breaker pattern for external services
- Comprehensive logging (error, warning, info)

**NFR-REL-003: Backup & Recovery**
- Automated daily backups (PostgreSQL dumps)
- Incremental backups every 6 hours
- Off-site backup storage
- Quarterly disaster recovery drills

### 5.5 Maintainability

**NFR-MNT-001: Code Quality**
- Modular architecture (microservices)
- Code coverage: >80% unit tests
- Static code analysis (SonarQube)
- Documentation: API docs (Swagger), architecture docs

**NFR-MNT-002: Deployment**
- CI/CD pipeline (GitLab CI/Jenkins)
- Blue-green deployment strategy
- Zero-downtime deployments
- Rollback capability

**NFR-MNT-003: Monitoring**
- Application Performance Monitoring (APM)
- Infrastructure monitoring (CPU, memory, disk)
- Real-time alerting (email, SMS, Slack)
- Log aggregation (ELK stack)

---

## 6. Technical Architecture

### 6.1 System Architecture

**Architecture Style**: Microservices  
**Deployment**: Windows Server (on-premise/hybrid)  
**Database**: PostgreSQL 14+ with PostGIS  
**Caching**: Redis  
**Message Queue**: Apache Kafka  
**API Gateway**: Node.js/Express  

### 6.2 Technology Stack

**Frontend**:
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React-Leaflet (maps)
- Redux Toolkit (state management)
- Recharts (visualizations)

**Backend**:
- Node.js 18+ LTS
- Express.js framework
- JWT authentication
- Swagger/OpenAPI documentation
- Multer (file uploads)
- BullMQ (job queues)

**Database**:
- PostgreSQL 14+ (primary)
- PostGIS extension (spatial)
- Redis (caching/sessions)
- SQLite (offline mobile apps)

**Infrastructure**:
- Windows Server 2019/2022
- IIS with ARR (reverse proxy)
- PM2 (process manager)
- Docker (containerization - optional)

### 6.3 Integration Points

**External APIs**:
- GPS Tracking: Traqindia API
- Payment: UPI deep linking, Payment Gateway
- SMS: NIC SMS Gateway/Gupshup/Twilio
- WhatsApp: WhatsApp Business API
- eGramSwaraj: REST API integration
- PFMS: API for fund transfers
- Aadhaar: Authentication API (optional)

**Internal Services**:
- User Service (egov-user)
- Master Data Service (egov-mdms)
- Workflow Service (egov-workflow-v2)
- FSM Service (egov-fsm)
- Billing Service (egov-billing)
- Collection Service (egov-collection)
- Persister Service (egov-persister)

### 6.4 Data Model

**Core Entities**:
- User (citizen, worker, driver, vendor, officer)
- Application (service request)
- Trip (desludging operation)
- Vehicle (fleet assets)
- FSTP (treatment plants)
- Payment (transactions)
- GPSLog (telemetry data)
- Document (photos, manifests)

**Multi-tenancy**:
- tenantid column in every table
- Hierarchy: cg.district.block.gp
- Row-level security based on tenant

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Months 1-3)

**Objectives**:
- Core platform deployment
- Basic citizen and GP modules
- Pilot in 1 district (Raipur)

**Deliverables**:
- User authentication & RBAC
- Citizen request module
- GP approval workflow
- Basic vehicle tracking
- Payment integration (UPI)
- Mobile app (PWA)

**Success Criteria**:
- 100 test users onboarded
- 500 service requests processed
- System uptime >95%

### Phase 2: Expansion (Months 4-6)

**Objectives**:
- Advanced features rollout
- Multi-district expansion
- AI analytics integration

**Deliverables**:
- GIS routing optimization
- FSTP operations module
- Vendor marketplace
- State dashboard
- AI-powered forecasting
- eGramSwaraj integration

**Success Criteria**:
- 5 districts live
- 5,000 monthly requests
- 50+ vendors onboarded

### Phase 3: Scale (Months 7-12)

**Objectives**:
- State-wide rollout
- Advanced monitoring
- IoT integration

**Deliverables**:
- All 27 districts live
- Advanced anomaly detection
- IoT sensor integration (tank level)
- Predictive maintenance
- Resource recovery marketplace

**Success Criteria**:
- 80% villages covered
- 12,000 monthly requests
- CSAT >4.0
- <1% illegal dumping

---

## 8. Risk Management

### 8.1 Technical Risks

**R1: Low Internet Connectivity in Rural Areas**
- **Mitigation**: Offline-first architecture, SMS fallback, PWA with service workers
- **Probability**: High | **Impact**: High

**R2: GPS Tracking Failures**
- **Mitigation**: Manual check-in options, cell tower triangulation, driver self-reporting
- **Probability**: Medium | **Impact**: Medium

**R3: Database Performance Degradation**
- **Mitigation**: Indexing strategy, query optimization, read replicas, caching
- **Probability**: Medium | **Impact**: High

### 8.2 Operational Risks

**R4: Low Digital Literacy Among Citizens**
- **Mitigation**: CSC support, voice-based interface, video tutorials, community training
- **Probability**: High | **Impact**: Medium

**R5: Vendor Resistance to Digital Platform**
- **Mitigation**: Incentive programs, faster payments, training, phased onboarding
- **Probability**: Medium | **Impact**: High

**R6: Illegal Dumping Continues Despite Tracking**
- **Mitigation**: Strict penalties, community reporting, anonymous tips, GPS tamper detection
- **Probability**: Medium | **Impact**: High

### 8.3 Organizational Risks

**R7: Government Staff Turnover**
- **Mitigation**: Comprehensive documentation, training programs, knowledge transfer protocols
- **Probability**: Medium | **Impact**: Medium

**R8: Budget Constraints**
- **Mitigation**: Phased rollout, open-source technologies, cloud cost optimization
- **Probability**: Medium | **Impact**: High

---

## 9. Assumptions & Dependencies

### 9.1 Assumptions

1. **Infrastructure**: Reliable electricity and mobile network coverage in target areas
2. **Adoption**: 60% of rural households have smartphones or access to CSCs
3. **FSTP Capacity**: Existing FSTPs have 30-40% spare capacity for expansion
4. **Vendor Availability**: Minimum 5-10 registered vendors per block
5. **Government Support**: Continued political will and funding from GoCG

### 9.2 Dependencies

1. **eGramSwaraj API**: For subsidy processing and GP fund management
2. **PFMS Integration**: For direct benefit transfers to vendors
3. **NIC SMS Gateway**: For citizen notifications
4. **Traqindia GPS API**: For vehicle tracking
5. **State GIS Data**: Accurate village boundaries and road networks
6. **Aadhaar API**: Optional for worker verification

---

## 10. Approval & Sign-off

**Prepared By**:  
Raj Yamgar  
Technical Consultant, UNICEF Chhattisgarh  
Date: May 21, 2026

**Reviewed By**:  
[Name]  
State Mission Director, SBM-G Chhattisgarh  
Date: ___________

**Approved By**:  
[Name]  
Secretary, Department of Rural Development  
Government of Chhattisgarh  
Date: ___________

---

## Appendix A: Glossary

- **FSSM**: Faecal Sludge and Septage Management
- **FSTP**: Faecal Sludge Treatment Plant
- **STP**: Sewage Treatment Plant
- **GP**: Gram Panchayat
- **SBM-G**: Swachh Bharat Mission-Grameen
- **ODF+**: Open Defecation Free Plus
- **PPE**: Personal Protective Equipment
- **UPI**: Unified Payments Interface
- **PFMS**: Public Financial Management System
- **CSC**: Common Service Centre
- **SLA**: Service Level Agreement
- **CSAT**: Customer Satisfaction Score
- **PWA**: Progressive Web App
- **RBAC**: Role-Based Access Control
- **GIS**: Geographic Information System
- **GPS**: Global Positioning System

## Appendix B: References

1. National Policy on Faecal Sludge and Septage Management, MoHUA 2017
2. Swachh Bharat Mission (Urban) 2.0 Operational Guidelines
3. UPYOG Architecture Documentation, NIUA
4. eGramSwaraj Portal Guidelines, Ministry of Panchayati Raj
5. GIGW 3.0 Guidelines, MeitY
6. Chhattisgarh State FSSM Policy Draft
7. UNICEF FSSM Toolkit for Rural Areas

---

**Document Control**  
Version: 2.0  
Last Updated: May 21, 2026  
Next Review: August 21, 2026  
Classification: Public