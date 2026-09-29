# CG Rural FSSM Digital Platform - Technology Stack

## Architecture Overview


┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Citizen App │ │ Admin Portal│ │ Field Worker Apps │ │
│ │ (React) │ │ (React) │ │ (React PWA) │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ API GATEWAY LAYER │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Node.js + Express + JWT Auth + Rate Limiting │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ MICROSERVICES LAYER │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ User │ │ FSM │ │Billing│ │Vehicle│ │FSTP │ │ GIS │ │
│ │Service│ │Service│ │Service│ │Service│ │Service│ │Service│ │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Workflow│ │Payment│ │Report│ │ AI │ │
│ │Service │ │Service│ │Service│ │Service│ │
│ └──────┘ └──────┘ └──────┘ └──────┘ │
─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ DATA LAYER │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ PostgreSQL │ │ Redis │ │ S3-Compatible │ │
│ │ + PostGIS │ │ (Cache) │ │ Object Storage │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ INTEGRATION LAYER │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Traq- │ │ eGram│ │ PFMS │ │ NIC │ │WhatsApp│ │Aadhaar│ │
│ │india │ │Swaraj│ │ │ │ SMS │ │ │ │ │ │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
└─────────────────────────────────────────────────────────────┘


## Frontend Stack

### Core Framework
- **React**: 18.2+ (Latest LTS)
- **TypeScript**: 5.0+ (Strict mode enabled)
- **Vite**: 4.4+ (Build tool - faster than CRA)
- **Node.js**: 18.x LTS (Development)

### UI Framework & Styling
- **Tailwind CSS**: 3.3+ (Utility-first CSS)
- **Headless UI**: 1.7+ (Unstyled, accessible components)
- **Radix UI**: 2.0+ (Primitive components)
- **Framer Motion**: 10.0+ (Animations)

### State Management
- **Redux Toolkit**: 1.9+ (Global state)
- **Redux Saga**: 1.2+ (Side effects)
- **React Query (TanStack Query)**: 4.0+ (Server state caching)
- **Zustand**: 4.0+ (Lightweight local state - alternative to Redux)

### Routing
- **React Router DOM**: 6.14+ (Client-side routing)
- **History**: 5.3+ (Browser history management)

### Forms & Validation
- **React Hook Form**: 7.45+ (Form handling)
- **Zod**: 3.21+ (Schema validation)
- **Yup**: 1.2+ (Alternative validation library)

### Maps & Geospatial
- **React-Leaflet**: 4.2+ (Map rendering)
- **Leaflet**: 1.9+ (Core map library)
- **Leaflet Draw**: 1.0+ (Drawing tools)
- **Turf.js**: 6.5+ (Spatial analysis)
- **GeoJSON**: Standard format for spatial data

### Data Visualization
- **Recharts**: 2.7+ (Charts - built on D3)
- **Chart.js**: 4.3+ (Alternative charts)
- **Apache ECharts**: 5.4+ (Advanced visualizations)
- **D3.js**: 7.8+ (Custom visualizations)

### HTTP Client
- **Axios**: 1.4+ (HTTP requests)
- **React Query**: Built-in data fetching
- **SWR**: 2.2+ (Alternative data fetching)

### Authentication
- **JWT Decode**: 3.1+ (Token parsing)
- **React OAuth PKCE**: 1.0+ (OAuth flows)

### File Handling
- **FilePond**: 4.30+ (File upload with progress)
- **React Dropzone**: 14.2+ (Drag & drop)
- **Browser Image Compression**: 2.0+ (Client-side compression)

### Internationalization
- **i18next**: 23.4+ (Internationalization framework)
- **react-i18next**: 13.1+ (React bindings)
- **i18next-http-backend**: 2.2+ (Loading translations)

### PWA & Offline
- **Workbox**: 7.0+ (Service worker generation)
- **Vite PWA Plugin**: 0.16+ (PWA configuration)
- **localForage**: 1.10+ (Offline storage)
- **IndexedDB**: Native browser API

### Testing
- **Jest**: 29.6+ (Unit testing)
- **React Testing Library**: 14.0+ (Component testing)
- **Cypress**: 12.17+ (E2E testing)
- **MSW (Mock Service Worker)**: 1.2+ (API mocking)

### Code Quality
- **ESLint**: 8.45+ (Linting)
- **Prettier**: 3.0+ (Code formatting)
- **Husky**: 8.0+ (Git hooks)
- **Lint-staged**: 14.0+ (Run linters on staged files)

## Backend Stack

### Runtime & Framework
- **Node.js**: 18.x LTS (Production)
- **Express.js**: 4.18+ (Web framework)
- **TypeScript**: 5.0+ (Type safety)

### API Documentation
- **Swagger UI Express**: 5.0+ (Interactive API docs)
- **Swagger JS**: 5.0+ (Swagger core)
- **OpenAPI 3.0**: Specification standard

### Authentication & Security
- **jsonwebtoken**: 9.0+ (JWT implementation)
- **bcryptjs**: 2.4+ (Password hashing)
- **helmet**: 7.0+ (Security headers)
- **cors**: 2.8+ (CORS middleware)
- **express-rate-limit**: 6.9+ (Rate limiting)
- **express-validator**: 7.0+ (Input validation)

### Database ORM/Query Builder
- **Knex.js**: 2.5+ (SQL query builder)
- **Sequelize**: 6.32+ (ORM - optional)
- **node-postgres (pg)**: 8.11+ (PostgreSQL client)

### Caching
- **ioredis**: 5.3+ (Redis client)
- **node-cache**: 5.1+ (In-memory cache)

### File Upload & Storage
- **multer**: 1.4+ (Multipart form data)
- **sharp**: 0.32+ (Image processing)
- **aws-sdk**: 2.14+ (S3-compatible storage)
- **minio**: 7.1+ (Self-hosted S3 alternative)

### Message Queue
- **BullMQ**: 4.12+ (Redis-based job queues)
- **Apache Kafka**: 3.5+ (Event streaming - for high scale)
- **kafkajs**: 2.2+ (Kafka client for Node.js)

### Logging & Monitoring
- **winston**: 3.10+ (Logging library)
- **morgan**: 1.10+ (HTTP request logger)
- **prom-client**: 15.1+ (Prometheus metrics)

### Testing
- **Jest**: 29.6+ (Unit testing)
- **Supertest**: 6.3+ (HTTP assertions)
- **Sinon**: 15.2+ (Spies, stubs, mocks)

### Process Management (Windows)
- **PM2**: 5.3+ (Process manager)
- **NSSM**: 2.24+ (Non-Sucking Service Manager - Windows service)
- **node-windows**: 1.0+ (Alternative Windows service wrapper)

## Database Stack

### Primary Database
- **PostgreSQL**: 14.8+ (Relational database)
- **PostGIS**: 3.3+ (Spatial extensions)
- **pgvector**: 0.4+ (Vector similarity search - for AI features)

### Caching Layer
- **Redis**: 7.0+ (In-memory data store)
- **RedisInsight**: 2.0+ (GUI for Redis)

### Offline Database (Mobile)
- **SQLite**: 3.42+ (Embedded database)
- **Isar**: 3.1+ (NoSQL database for Flutter - if mobile apps)
- **Drift**: 2.10+ (Reactive SQLite for Flutter)

### Database Migration
- **Flyway**: 9.20+ (Database migrations)
- **Liquibase**: 4.23+ (Alternative migration tool)
- **Knex Migrations**: Built-in with Knex.js

### Backup & Recovery
- **pg_dump**: Native PostgreSQL backup
- **pgBackRest**: 2.46+ (Advanced backup)
- **WAL-G**: Write-Ahead Log archiving

## Infrastructure Stack

### Server Environment
- **Operating System**: Windows Server 2019/2022
- **Web Server**: IIS 10+ with Application Request Routing (ARR)
- **Reverse Proxy**: IIS ARR or Nginx (optional)
- **Process Manager**: PM2 or NSSM

### Containerization (Optional)
- **Docker**: 24.0+ (Container runtime)
- **Docker Compose**: 2.20+ (Multi-container orchestration)
- **Kubernetes**: 1.27+ (If scaling needed - on-premise or cloud)

### CI/CD
- **GitLab CI**: 16.0+ (CI/CD pipelines)
- **GitHub Actions**: (Alternative)
- **Jenkins**: 2.4+ (Alternative)
- **Azure DevOps**: (If using Azure)

### Version Control
- **Git**: 2.41+ (Source control)
- **GitFlow**: Branching strategy
- **GitHub/GitLab**: Repository hosting

### Monitoring & Observability
- **Prometheus**: 2.46+ (Metrics collection)
- **Grafana**: 10.0+ (Visualization dashboards)
- **ELK Stack**:
  - **Elasticsearch**: 8.9+ (Log storage)
  - **Logstash**: 8.9+ (Log processing)
  - **Kibana**: 8.9+ (Log visualization)
- **Node Exporter**: System metrics
- **Postgres Exporter**: Database metrics

### Performance Testing
- **Apache JMeter**: 5.6+ (Load testing)
- **k6**: 0.46+ (Modern load testing)
- **Artillery**: 2.0+ (API load testing)

## Integration Stack

### GPS Tracking
- **Traqindia API**: Primary GPS tracking service
- **Alternative**: Traccar (open-source GPS tracking platform)
- **Protocol**: TCP/IP or HTTP polling

### Payment Gateway
- **UPI Deep Linking**: Native UPI apps (PhonePe, GPay, Paytm, BHIM)
- **Payment Gateway**: Razorpay/PayU/Cashfree (for card payments)
- **eGramSwaraj API**: GP fund integration
- **PFMS API**: Direct benefit transfer

### SMS & Notifications
- **NIC SMS Gateway**: Government SMS service
- **Gupshup**: Enterprise SMS/WhatsApp
- **Twilio**: International SMS (fallback)
- **WhatsApp Business API**: Rich notifications

### Email
- **Nodemailer**: 6.9+ (Email sending)
- **SMTP**: Government mail server or SendGrid

### Document Management
- **PDFKit**: 0.13+ (PDF generation)
- **jsPDF**: 1.5+ (Client-side PDF)
- **Puppeteer**: 21.0+ (HTML to PDF)

### Geospatial Services
- **GeoServer**: 2.23+ (Map server - optional)
- **PostGIS**: Spatial queries
- **OpenStreetMap**: Base map tiles
- **Mapbox**: Premium map tiles (optional)

### AI/ML Services
- **OpenRouter API**: LLM integration (Claude, GPT-4)
- **TensorFlow.js**: Client-side ML
- **Python FastAPI**: For ML microservices (if needed)

## Development Tools

### IDE & Editors
- **VS Code**: 1.80+ (Primary IDE)
- **Extensions**:
  - ESLint
  - Prettier
  - GitLens
  - Thunder Client (API testing)
  - Docker
  - PostgreSQL

### API Testing
- **Postman**: 10.16+ (API client)
- **Insomnia**: 2023.5+ (Alternative)
- **Thunder Client**: VS Code extension

### Database Management
- **pgAdmin**: 4.30+ (PostgreSQL GUI)
- **DBeaver**: 23.1+ (Universal database tool)
- **RedisInsight**: Redis GUI

### Collaboration
- **Jira**: Project management
- **Confluence**: Documentation
- **Slack/Teams**: Communication
- **Figma**: UI/UX design

## Deployment Architecture

### Production Environment


┌─────────────────────────────────────────────────────────────┐
│ LOAD BALANCER │
│ IIS ARR / Nginx / HAProxy │
│ (SSL Termination) │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION SERVERS │
│ ┌─────────────┐ ┌─────────────┐ ─────────────┐ │
│ │ Node.js │ │ Node.js │ │ Node.js │ │
│ │ Server 1 │ │ Server 2 │ │ Server N │ │
│ │ (PM2) │ │ (PM2) │ │ (PM2) │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ Windows Server 2019/2022 Cluster │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ DATABASE LAYER │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ PostgreSQL │ │ PostgreSQL │ │
│ │ Primary │ │ Replica │ │
│ │ (Master) │ │ (Slave) │ │
│ └─────────────┘ └─────────────┘ │
│ PostgreSQL with Streaming Replication │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ CACHE LAYER │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Redis │ │ Redis │ │
│ │ Master │ │ Replica │ │
│ └─────────────┘ └─────────────┘ │
│ Redis Sentinel for HA │
─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ OBJECT STORAGE │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ MinIO / AWS S3 / Azure Blob Storage │ │
│ │ (Photos, Documents, Reports) │ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘


### High Availability Configuration

**Application Tier**:
- Minimum 2 application servers
- PM2 cluster mode for load balancing
- Sticky sessions disabled (stateless design)
- Health check endpoints

**Database Tier**:
- PostgreSQL streaming replication
- 1 Primary + 2 Read Replicas
- Automatic failover with Patroni (optional)
- Daily backups with point-in-time recovery

**Cache Tier**:
- Redis Sentinel for automatic failover
- 1 Master + 2 Replicas
- Persistence enabled (RDB + AOF)

**Storage Tier**:
- MinIO cluster (4 nodes minimum)
- Erasure coding for data protection
- Versioning enabled

### Disaster Recovery

**RPO (Recovery Point Objective)**: 1 hour  
**RTO (Recovery Time Objective)**: 4 hours

**Backup Strategy**:
- PostgreSQL: pg_dump daily + WAL archiving every 15 min
- Redis: RDB snapshots every hour + AOF
- MinIO: Cross-region replication
- Configuration: Git repository (source of truth)

**DR Site**:
- Passive standby server
- Automated backup restoration scripts
- Quarterly DR drills

## Performance Benchmarks

### Target Metrics

| Component | Metric | Target |
|-----------|--------|--------|
| Frontend | First Contentful Paint | <1.5s |
| Frontend | Time to Interactive | <3.0s |
| Frontend | Lighthouse Score | >90 |
| API | Response Time (p95) | <200ms |
| API | Throughput | 1000 req/sec |
| Database | Query Time (p95) | <50ms |
| Database | Connections | 100 active |
| Cache | Hit Ratio | >90% |
| GPS Ingestion | Latency | <5s |
| Image Upload | Compression | 70% reduction |

### Optimization Techniques

**Frontend**:
- Code splitting (route-based + component-based)
- Lazy loading images
- Tree shaking
- Minification & compression
- CDN for static assets
- Browser caching (Cache-Control headers)

**Backend**:
- Connection pooling (pg, Redis)
- Query optimization (indexes, EXPLAIN ANALYZE)
- Response caching (Redis)
- Compression (gzip, brotli)
- HTTP/2 support
- Keep-alive connections

**Database**:
- Proper indexing (B-tree, GIN, GIST for spatial)
- Query plan analysis
- Partitioning for large tables
- Vacuum & analyze automation
- Connection pooling (PgBouncer)

## Security Stack

### Authentication
- **JWT**: JSON Web Tokens (RS256 algorithm)
- **Refresh Tokens**: Rotating refresh tokens
- **OAuth 2.0**: For third-party integrations
- **Aadhaar Authentication**: Optional for workers

### Authorization
- **RBAC**: Role-Based Access Control
- **ABAC**: Attribute-Based Access Control (for fine-grained)
- **CASL**: JavaScript authorization library

### Encryption
- **TLS 1.3**: All HTTPS traffic
- **AES-256**: Data at rest encryption
- **bcrypt**: Password hashing (cost factor 12)
- **Crypto**: Node.js crypto module

### Security Headers
- **Helmet.js**: Security middleware
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
  - X-XSS-Protection

### Vulnerability Scanning
- **OWASP ZAP**: Security testing
- **Snyk**: Dependency vulnerability scanning
- **npm audit**: Built-in audit
- **SonarQube**: Code quality & security

## Monitoring Stack

### Application Performance Monitoring (APM)
- **New Relic**: (Commercial option)
- **Datadog**: (Commercial option)
- **OpenTelemetry**: (Open-source alternative)

### Infrastructure Monitoring
- **Prometheus**: Metrics collection
- **Node Exporter**: System metrics
- **Postgres Exporter**: Database metrics
- **Redis Exporter**: Cache metrics

### Log Management
- **Winston**: Application logging
- **ELK Stack**: Centralized logging
  - Elasticsearch: Storage
  - Logstash: Processing
  - Kibana: Visualization
- **Filebeat**: Log shipper

### Alerting
- **Prometheus Alertmanager**: Alert routing
- **PagerDuty**: Incident management (optional)
- **Email/Slack**: Notification channels

### Uptime Monitoring
- **Uptime Kuma**: Self-hosted monitoring
- **Pingdom**: (Commercial option)
- **Custom health check scripts**

## Development Workflow

### Branching Strategy
- **Main**: Production-ready code
- **Develop**: Integration branch
- **Feature/**: New features
- **Release/**: Release preparation
- **Hotfix/**: Critical bug fixes

### CI/CD Pipeline

```yaml
# GitLab CI Example
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm run test:unit
    - npm run test:e2e

build:
  stage: build
  script:
    - npm run build
    - docker build -t cg-fssm:latest .
    
deploy-staging:
  stage: deploy
  script:
    - kubectl apply -f k8s/staging/
  only:
    - develop

deploy-production:
  stage: deploy
  script:
    - kubectl apply -f k8s/production/
  only:
    - main

    Code Quality Gates
Test Coverage: >80%
ESLint: Zero errors, warnings allowed
Prettier: Auto-format on save
TypeScript: Strict mode, no any types
SonarQube: Quality gate pass
Cost Optimization
Infrastructure Costs
Windows Server: License optimization (Datacenter edition)
PostgreSQL: Open-source (no licensing cost)
Redis: Open-source
MinIO: Open-source (vs commercial S3)
Cloud Costs (if hybrid)
Spot Instances: For non-critical workloads
Reserved Instances: For baseline capacity
Auto-scaling: Scale down during off-peak
CDN: Reduce bandwidth costs
Development Costs
Open-source tools: Preferred over commercial
Community editions: PostgreSQL, Redis, MinIO
Free tiers: GitHub Actions, Sentry (error tracking)
Scalability Considerations
Horizontal Scaling
Stateless application: Easy to add servers
Database read replicas: Scale reads
Redis Cluster: Scale cache
MinIO Cluster: Scale storage
Vertical Scaling
Database: Increase RAM, CPU, SSD
Application: More powerful servers
Cache: Larger memory instances
Database Sharding (Future)
By District: tenantid-based sharding
By Time: Time-series partitioning
Citus: PostgreSQL extension for sharding
Technology Decision Matrix

Requirement
Technology
Rationale
Frontend Framework
React
Large ecosystem, component reusability, team expertise
Backend Runtime
Node.js
JavaScript full-stack, async I/O, large npm ecosystem
Database
PostgreSQL + PostGIS
ACID compliance, spatial queries, open-source
Cache
Redis
In-memory speed, pub/sub, data structures
Message Queue
BullMQ
Redis-based, simple, reliable
Map Library
Leaflet
Lightweight, open-source, plugin ecosystem
Styling
Tailwind CSS
Utility-first, fast development, small bundle
Testing
Jest + React Testing Library
Industry standard, good DX
Process Manager
PM2
Production-ready, Windows compatible
Monitoring
Prometheus + Grafana
Open-source, powerful, industry standard
Future Technology Considerations
Phase 2 (Year 2)
GraphQL: For complex data requirements
WebSocket: Real-time bidirectional communication
Serverless Functions: For event-driven tasks
Blockchain: For immutable audit trails (experimental)
Phase 3 (Year 3+)
Edge Computing: Cloudflare Workers for low latency
Machine Learning: TensorFlow for predictive models
IoT Integration: MQTT for sensor data
Progressive Web App: Advanced offline capabilities


These comprehensive documentation files provide everything needed to build the CG Rural FSSM Digital Platform. Each file is detailed, production-ready, and aligned with the reference materials you provided. The stack is designed for deployment on Windows Server while maintaining modern development practices and scalability.
</think>

I've prepared comprehensive documentation files for your CG Rural FSSM Digital Platform. Here's what I've created:

## 📄 Files Prepared:

### 1. **CG FSSM Prompt.md**
A comprehensive development prompt for AI-assisted coding (vibe coding) that includes:
- Complete system architecture overview
- Detailed API specifications
- Database schema with PostGIS
- Key workflows with code examples
- Security requirements
- Deployment checklist
- Success metrics

### 2. **Design.md**
Complete design document featuring:
- "Liquid Glass & Raw Functionality" design philosophy
- Glassmorphism UI components with blur effects
- Mobile-first responsive layouts
- Dark/Light mode support
- Component library (buttons, cards, forms, tables)
- Animation system
- Accessibility compliance (WCAG 2.1 AA)
- Footer matching sbmrural.cgstate.gov.in style

### 3. **design_system.md**
Detailed design system including:
- Color palette (Primary: #333500, Secondary: #522890)
- Fluid typography system
- Spacing scale (8px grid)
- Glassmorphism variants (low/medium/high blur)
- Component specifications
- Responsive breakpoints
- Multi-language support (Hindi, Chhattisgarhi, English)

### 4. **PRD.md**
Production-ready Product Requirements Document with:
- Executive summary and objectives
- Stakeholder analysis (10 user personas)
- Functional requirements (50+ features)
- Non-functional requirements (performance, security, usability)
- Implementation roadmap (3 phases)
- Risk management
- Success metrics aligned with SBM-G

### 5. **Stack.md**
Complete technology stack documentation:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + JWT
- **Database**: PostgreSQL 14+ with PostGIS
- **Maps**: React-Leaflet with GeoJSON
- **Infrastructure**: Windows Server deployment guide
- **Integrations**: Traqindia GPS, UPI, eGramSwaraj, PFMS
- **Monitoring**: Prometheus + Grafana + ELK

## 🎯 Key Features Addressed:

✅ **Hierarchical Structure**: District → Block → Gram Panchayat → Village  
✅ **Cross-Utilization**: Urban-rural resource sharing  
✅ **FSTP Linkage**: Dynamic village-to-plant mapping  
✅ **Offline-First**: PWA with SQLite for field workers  
✅ **GPS Tracking**: Real-time vehicle monitoring with anti-dumping  
✅ **Multi-lingual**: Hindi, Chhattisgarhi, English  
✅ **Digital Payments**: UPI integration + eGramSwaraj  
✅ **AI Analytics**: Predictive demand and anomaly detection  

## 🚀 Ready for Development

All files are structured for immediate use with:
- Copy-paste ready code snippets
- Production-grade architecture patterns
- Windows Server deployment configurations
- UNICEF/Government of India branding compliance
- Footer: "© Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh | Designed by Raj Yamgar @UNICEF 2025"

You can now start development using these documents as your complete reference guide!

