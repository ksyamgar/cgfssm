export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  STATE_OFFICER: 'STATE_OFFICER',
  DISTRICT_COORDINATOR: 'DISTRICT_COORDINATOR',
  BLOCK_COORDINATOR: 'BLOCK_COORDINATOR',
  GP_OPERATOR: 'GP_OPERATOR',
  FSTP_OPERATOR: 'FSTP_OPERATOR',
  VENDOR_ADMIN: 'VENDOR_ADMIN',
  DRIVER: 'DRIVER',
  SANITATION_WORKER: 'SANITATION_WORKER',
  CITIZEN: 'CITIZEN',
  AUDITOR: 'AUDITOR'
};

export const ROLE_CONFIG = {
  [ROLES.SUPER_ADMIN]: {
    id: ROLES.SUPER_ADMIN,
    name: 'Super Admin',
    hindiName: 'सुपर एडमिन',
    scope: 'State (Global)',
    color: 'emerald',
    badge: 'STATE_ROOT',
    description: 'Full system administration, database management, CMS, and masters.',
    defaultPath: '/app',
    permissions: ['all']
  },
  [ROLES.STATE_OFFICER]: {
    id: ROLES.STATE_OFFICER,
    name: 'State Officer (SWSM / P&RD)',
    hindiName: 'राज्य नोडल अधिकारी',
    scope: 'State (All 33 Districts)',
    color: 'teal',
    badge: 'STATE_GOV',
    description: 'High-level analytics, fund utilization, and statewide KPI monitoring.',
    defaultPath: '/app',
    permissions: ['read_state', 'view_reports', 'view_ai', 'view_map']
  },
  [ROLES.DISTRICT_COORDINATOR]: {
    id: ROLES.DISTRICT_COORDINATOR,
    name: 'District Coordinator',
    hindiName: 'जिला समन्वयक',
    scope: 'District (e.g. Raipur / Durg / Bilaspur)',
    color: 'cyan',
    badge: 'DISTRICT_ADMIN',
    description: 'Vendor empanelment, inter-block coordination, dispute resolution.',
    defaultPath: '/app',
    permissions: ['manage_district', 'approve_vendors', 'view_reports', 'manage_fstp']
  },
  [ROLES.BLOCK_COORDINATOR]: {
    id: ROLES.BLOCK_COORDINATOR,
    name: 'Block Coordinator',
    hindiName: 'विकासखंड समन्वयक',
    scope: 'Block (e.g. Dharsiwa / Patan / Kota)',
    color: 'sky',
    badge: 'BLOCK_ADMIN',
    description: 'SLA breach escalation, manual fleet allocation, GP monitoring.',
    defaultPath: '/app',
    permissions: ['manage_block', 'escalate_sla', 'reassign_trips']
  },
  [ROLES.GP_OPERATOR]: {
    id: ROLES.GP_OPERATOR,
    name: 'GP Operator / Sarpanch',
    hindiName: 'ग्राम पंचायत ऑपरेटर / सचिव',
    scope: 'Gram Panchayat (e.g. Seoni / Mandir Hasaud)',
    color: 'blue',
    badge: 'GP_ADMIN',
    description: 'Request verification, vendor dispatch approval, cash fee reconciliation.',
    defaultPath: '/app',
    permissions: ['manage_gp', 'approve_requests', 'reconcile_cash', 'assign_vendor']
  },
  [ROLES.FSTP_OPERATOR]: {
    id: ROLES.FSTP_OPERATOR,
    name: 'FSTP / STP Operator',
    hindiName: 'एफएसटीपी ऑपरेटर',
    scope: 'Facility Site (e.g. Arang FSTP / Patan FSTP)',
    color: 'violet',
    badge: 'PLANT_OPS',
    description: 'QR manifest intake, decanted volume log, treatment & by-product inventory.',
    defaultPath: '/app',
    permissions: ['manage_fstp_intake', 'sign_manifest', 'log_byproducts']
  },
  [ROLES.VENDOR_ADMIN]: {
    id: ROLES.VENDOR_ADMIN,
    name: 'Vendor Admin (PSSO)',
    hindiName: 'वेंडर प्रशासक (निजी/समूह)',
    scope: 'Private Fleet Operator',
    color: 'amber',
    badge: 'PSSO_VENDOR',
    description: 'Fleet & crew allocation, vehicle compliance, revenue and SLA ledger.',
    defaultPath: '/app',
    permissions: ['manage_fleet', 'assign_drivers', 'view_revenue']
  },
  [ROLES.DRIVER]: {
    id: ROLES.DRIVER,
    name: 'Desludging Driver',
    hindiName: 'वाहन चालक (ड्राइवर)',
    scope: 'Assigned Vehicle',
    color: 'orange',
    badge: 'FLEET_CREW',
    description: 'Trip navigation, arrival trigger, safe transit to FSTP, QR manifest display.',
    defaultPath: '/app/trips',
    permissions: ['execute_trips', 'view_manifest', 'trigger_arrival']
  },
  [ROLES.SANITATION_WORKER]: {
    id: ROLES.SANITATION_WORKER,
    name: 'Sanitation Worker (Swachhagrahi)',
    hindiName: 'स्वच्छता कर्मी / स्वच्छाग्रही',
    scope: 'Assigned Task Card',
    color: 'green',
    badge: 'FIELD_EXEC',
    description: 'PPE mandatory checklist, geotagged Before/After photos, volume extraction log.',
    defaultPath: '/app/requests',
    permissions: ['field_evidence', 'ppe_check', 'upload_photos']
  },
  [ROLES.CITIZEN]: {
    id: ROLES.CITIZEN,
    name: 'Citizen / Beneficiary',
    hindiName: 'नागरिक / ग्रामीण उपभोक्ता',
    scope: 'Household Profile',
    color: 'teal',
    badge: 'CITIZEN_USER',
    description: 'Book desludging service, instant quote, live tracking, UPI payment, rating.',
    defaultPath: '/book',
    permissions: ['book_service', 'pay_online', 'track_vehicle', 'rate_service']
  },
  [ROLES.AUDITOR]: {
    id: ROLES.AUDITOR,
    name: 'Compliance Auditor',
    hindiName: 'लेखा परीक्षक (ऑडिटर)',
    scope: 'Cross-Domain (Audit View)',
    color: 'slate',
    badge: 'COMPLIANCE',
    description: 'Read-only financial ledgers, GPS logs, disposal manifest verification.',
    defaultPath: '/app/audit',
    permissions: ['read_audit', 'export_ledgers']
  }
};

export const MOCK_USERS = [
  {
    id: 'usr_superadmin',
    name: 'Rajesh Sharma',
    role: ROLES.SUPER_ADMIN,
    phone: '9826100001',
    email: 'admin.fssm@cg.gov.in',
    designation: 'State IT Director & System Admin',
    district: 'All (State)',
    block: 'All',
    gp: 'All'
  },
  {
    id: 'usr_state_officer',
    name: 'Dr. Alok Verma, IAS',
    role: ROLES.STATE_OFFICER,
    phone: '9826100002',
    email: 'state.director@cgrural.gov.in',
    designation: 'Mission Director, SBM-G Chhattisgarh',
    district: 'Statewide',
    block: 'All',
    gp: 'All'
  },
  {
    id: 'usr_dist_coord',
    name: 'Priyanka Baghel',
    role: ROLES.DISTRICT_COORDINATOR,
    phone: '9826100003',
    email: 'dist.raipur@cgrural.gov.in',
    designation: 'District Swachh Bharat Coordinator',
    district: 'Raipur (378)',
    districtId: 378,
    block: 'All Blocks',
    gp: 'All'
  },
  {
    id: 'usr_block_coord',
    name: 'Mahendra Netam',
    role: ROLES.BLOCK_COORDINATOR,
    phone: '9826100004',
    email: 'block.dharsiwa@cgrural.gov.in',
    designation: 'Block Coordinator (SBM-G)',
    district: 'Raipur (378)',
    districtId: 378,
    block: 'Dharsiwa (3836)',
    blockId: 3836,
    gp: 'All GPs'
  },
  {
    id: 'usr_gp_op',
    name: 'Smt. Gayatri Devi Sahu',
    role: ROLES.GP_OPERATOR,
    phone: '9826100005',
    email: 'gp.mandirhasaud@cgrural.gov.in',
    designation: 'Sarpanch & GP Incharge',
    district: 'Raipur (378)',
    block: 'Dharsiwa (3836)',
    gp: 'Mandir Hasaud (124805)',
    gpId: 124805
  },
  {
    id: 'usr_fstp_op',
    name: 'Dileep Kumar Soni',
    role: ROLES.FSTP_OPERATOR,
    phone: '9826100006',
    email: 'fstp.arang@cgrural.gov.in',
    designation: 'FSTP Plant Lead & Chemist',
    plantName: 'Arang Rural FSTP (20 KLD)',
    district: 'Raipur (378)',
    block: 'Arang (3835)'
  },
  {
    id: 'usr_vendor_admin',
    name: 'Shree Mahamaya Sanitation Services',
    role: ROLES.VENDOR_ADMIN,
    phone: '9826100007',
    email: 'contact@mahamayaclean.in',
    designation: 'Empaneled PSSO Agency Lead',
    district: 'Raipur & Durg',
    fleetCount: 6
  },
  {
    id: 'usr_driver',
    name: 'Ramesh Patel',
    role: ROLES.DRIVER,
    phone: '9826100008',
    email: 'ramesh.driver@cgrural.in',
    designation: 'Heavy Vehicle Vacuum Truck Driver',
    vehicleNo: 'CG-04-ME-4821',
    district: 'Raipur (378)'
  },
  {
    id: 'usr_worker',
    name: 'Santosh Markam',
    role: ROLES.SANITATION_WORKER,
    phone: '9826100009',
    email: 'santosh.worker@cgrural.in',
    designation: 'Certified Swachhata Mitra / Desludging Operator',
    district: 'Raipur (378)'
  },
  {
    id: 'usr_citizen',
    name: 'Bhupendra Chandrakar',
    role: ROLES.CITIZEN,
    phone: '9826198765',
    email: 'bhupendra.farmer@gmail.com',
    designation: 'Resident / Farmer',
    district: 'Raipur (378)',
    block: 'Dharsiwa (3836)',
    gp: 'Mandir Hasaud (124805)',
    village: 'Mandir Hasaud (444102)'
  },
  {
    id: 'usr_auditor',
    name: 'Vinay Agrawal, CA',
    role: ROLES.AUDITOR,
    phone: '9826100010',
    email: 'audit.fssm@cggov.in',
    designation: 'Independent Third-Party Quality & Financial Auditor',
    district: 'Statewide'
  }
];
