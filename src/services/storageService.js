// Centralized Storage Service with complete Chhattisgarh FSSM mock data
import { FSM_STATUS } from '../constants/fsm';

const STORAGE_KEYS = {
  REQUESTS: 'cg_fssm_requests_v1',
  VEHICLES: 'cg_fssm_vehicles_v1',
  FSTPS: 'cg_fssm_fstps_v1',
  VENDORS: 'cg_fssm_vendors_v1',
  PEOPLE: 'cg_fssm_people_v1',
  TRIPS: 'cg_fssm_trips_v1',
  AUDIT_LOGS: 'cg_fssm_audit_logs_v1',
  TARIFFS: 'cg_fssm_tariffs_v1',
  CMS: 'cg_fssm_cms_v1',
  SETTINGS: 'cg_fssm_settings_v1',
  GEO_FENCES: 'cg_fssm_geo_fences_v1'
};

const INITIAL_FSTPS = [
  {
    id: 'fstp_01',
    name: 'Arang Cluster Rural FSTP',
    type: 'FSTP',
    district: 'Raipur (378)',
    block: 'Arang (3835)',
    capacityKLD: 20,
    currentVolumeKLD: 14.5,
    status: 'OPERATIONAL', // OPERATIONAL, MAINTENANCE, CRITICAL
    lat: 21.1950,
    lng: 81.9680,
    radiusMeters: 300,
    operatorName: 'Dileep Kumar Soni',
    operatorPhone: '9826100006',
    compostStockTons: 42.5,
    treatedWaterStockKL: 180,
    connectedGPsCount: 18
  },
  {
    id: 'fstp_02',
    name: 'Patan Block Sanitation FSTP',
    type: 'FSTP',
    district: 'Durg (377)',
    block: 'Patan (3830)',
    capacityKLD: 15,
    currentVolumeKLD: 11.2,
    status: 'OPERATIONAL',
    lat: 21.0350,
    lng: 81.5320,
    radiusMeters: 300,
    operatorName: 'Sunil Verma',
    operatorPhone: '9826100021',
    compostStockTons: 28.0,
    treatedWaterStockKL: 120,
    connectedGPsCount: 14
  },
  {
    id: 'fstp_03',
    name: 'Bilha Regional FSTP',
    type: 'FSTP',
    district: 'Bilaspur (375)',
    block: 'Bilha (3810)',
    capacityKLD: 25,
    currentVolumeKLD: 22.8,
    status: 'OPERATIONAL',
    lat: 22.0120,
    lng: 82.1650,
    radiusMeters: 350,
    operatorName: 'Rameshwar Kashyap',
    operatorPhone: '9826100022',
    compostStockTons: 58.4,
    treatedWaterStockKL: 240,
    connectedGPsCount: 22
  },
  {
    id: 'stp_01',
    name: 'Raipur Urban STP - Nimora (Plug-in Facility)',
    type: 'URBAN_STP',
    district: 'Raipur (378)',
    block: 'Dharsiwa (3836)',
    capacityKLD: 120,
    currentVolumeKLD: 85.0,
    status: 'OPERATIONAL',
    lat: 21.1820,
    lng: 81.6750,
    radiusMeters: 500,
    operatorName: 'Sanjay Deshmukh (Municipal Corp)',
    operatorPhone: '9826100023',
    compostStockTons: 110.0,
    treatedWaterStockKL: 900,
    connectedGPsCount: 30
  }
];

const INITIAL_VEHICLES = [
  {
    id: 'veh_01',
    regNo: 'CG-04-ME-4821',
    type: 'VACUUM_TRUCK', // VACUUM_TRUCK, TRACTOR_MOUNTED, MINI_UNIT
    capacityLitres: 4000,
    vendorId: 'ven_01',
    vendorName: 'Shree Mahamaya Sanitation Services',
    driverId: 'usr_driver',
    driverName: 'Ramesh Patel',
    driverPhone: '9826100008',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-8801',
    traqDeviceId: 1001,
    currentLat: 21.2385,
    currentLng: 81.7120,
    speedKmh: 28,
    headingDeg: 85,
    status: 'EN_ROUTE', // AVAILABLE, EN_ROUTE, AT_SITE, TRANSPORTING, AT_FSTP, MAINTENANCE, SUSPENDED
    pucExpiry: '2027-04-15',
    insuranceExpiry: '2027-06-30',
    fitnessExpiry: '2027-08-20',
    district: 'Raipur (378)',
    assignedRequestId: 'REQ-CG-2026-00104'
  },
  {
    id: 'veh_02',
    regNo: 'CG-04-TA-1904',
    type: 'TRACTOR_MOUNTED',
    capacityLitres: 3000,
    vendorId: 'ven_01',
    vendorName: 'Shree Mahamaya Sanitation Services',
    driverId: 'drv_02',
    driverName: 'Brijesh Yadav',
    driverPhone: '9826100031',
    hasGpsDevice: false,
    gpsSource: 'MOBILE_APP',
    gpsDeviceId: 'MOB-CG-7702',
    currentLat: 21.2110,
    currentLng: 81.8950,
    speedKmh: 0,
    headingDeg: 140,
    status: 'AT_SITE',
    pucExpiry: '2027-03-10',
    insuranceExpiry: '2027-05-15',
    fitnessExpiry: '2027-07-12',
    district: 'Raipur (378)',
    assignedRequestId: 'REQ-CG-2026-00102'
  },
  {
    id: 'veh_03',
    regNo: 'CG-07-EA-7712',
    type: 'VACUUM_TRUCK',
    capacityLitres: 5000,
    vendorId: 'ven_02',
    vendorName: 'Chhattisgarh Swachhta Nidhi PSSO',
    driverId: 'drv_03',
    driverName: 'Mohan Lal Sahu',
    driverPhone: '9826100032',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-8803',
    traqDeviceId: 1351,
    currentLat: 21.0520,
    currentLng: 81.5120,
    speedKmh: 35,
    headingDeg: 210,
    status: 'TRANSPORTING',
    pucExpiry: '2027-01-20',
    insuranceExpiry: '2027-04-10',
    fitnessExpiry: '2027-05-25',
    district: 'Durg (377)',
    assignedRequestId: 'REQ-CG-2026-00101'
  },
  {
    id: 'veh_04',
    regNo: 'CG-04-MK-9120',
    type: 'MINI_UNIT',
    capacityLitres: 1500,
    vendorId: 'ven_01',
    vendorName: 'Shree Mahamaya Sanitation Services',
    driverId: 'drv_04',
    driverName: 'Anand Kumar',
    driverPhone: '9826100033',
    hasGpsDevice: false,
    gpsSource: 'MOBILE_APP',
    gpsDeviceId: 'MOB-CG-7704',
    currentLat: 21.2580,
    currentLng: 81.6420,
    speedKmh: 0,
    headingDeg: 0,
    status: 'AVAILABLE',
    pucExpiry: '2027-09-10',
    insuranceExpiry: '2027-11-20',
    fitnessExpiry: '2027-10-15',
    district: 'Raipur (378)'
  },
  {
    id: 'veh_05',
    regNo: 'CG-10-GA-3150',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_03',
    vendorName: 'Bilas Clean Tech Cooperative',
    driverId: 'drv_05',
    driverName: 'Kishore Dewangan',
    driverPhone: '9826100034',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-8805',
    traqDeviceId: 24039,
    currentLat: 22.0250,
    currentLng: 82.1550,
    speedKmh: 12,
    headingDeg: 45,
    status: 'EN_ROUTE',
    pucExpiry: '2027-02-18',
    insuranceExpiry: '2027-03-30',
    fitnessExpiry: '2027-06-15',
    district: 'Bilaspur (375)',
    assignedRequestId: 'REQ-CG-2026-00105'
  },
  {
    id: 'veh_traq_85',
    regNo: 'V9-RUDA-BALOD',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_02',
    vendorName: 'Balod Swachhata Federation',
    driverId: 'drv_traq_85',
    driverName: 'Mahesh Sinha',
    driverPhone: '9826100185',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-85',
    traqDeviceId: 85,
    currentLat: 20.7303,
    currentLng: 81.2052,
    speedKmh: 0,
    headingDeg: 90,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Balod (646)'
  },
  {
    id: 'veh_traq_261903',
    regNo: 'V1-PATHARIYA-DURG',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_02',
    vendorName: 'Chhattisgarh Swachhta Nidhi PSSO',
    driverId: 'drv_traq_261903',
    driverName: 'Prakash Verma',
    driverPhone: '9826100201',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-261903',
    traqDeviceId: 261903,
    currentLat: 21.1904,
    currentLng: 81.2849,
    speedKmh: 18,
    headingDeg: 120,
    status: 'TRANSPORTING',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Durg (377)'
  },
  {
    id: 'veh_traq_261914',
    regNo: 'V2-PATORA-DURG',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_02',
    vendorName: 'Chhattisgarh Swachhta Nidhi PSSO',
    driverId: 'drv_traq_261914',
    driverName: 'Dinesh Yadav',
    driverPhone: '9826100202',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-261914',
    traqDeviceId: 261914,
    currentLat: 21.1620,
    currentLng: 81.3050,
    speedKmh: 0,
    headingDeg: 0,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Durg (377)'
  },
  {
    id: 'veh_traq_266303',
    regNo: 'IPUR',
    type: 'VACUUM_TRUCK',
    capacityLitres: 5000,
    vendorId: 'ven_01',
    vendorName: 'Shree Mahamaya Sanitation Services',
    driverId: 'drv_traq_266303',
    driverName: 'Satish Baghel',
    driverPhone: '9826100203',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-266303',
    traqDeviceId: 266303,
    currentLat: 21.2514,
    currentLng: 81.6296,
    speedKmh: 22,
    headingDeg: 180,
    status: 'EN_ROUTE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Raipur (378)'
  },
  {
    id: 'veh_traq_266708',
    regNo: 'V6-PARSADAWED-BILASPUR',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_03',
    vendorName: 'Bilas Clean Tech Cooperative',
    driverId: 'drv_traq_266708',
    driverName: 'Suresh Kurrey',
    driverPhone: '9826100204',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-266708',
    traqDeviceId: 266708,
    currentLat: 22.0797,
    currentLng: 82.1409,
    speedKmh: 0,
    headingDeg: 45,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Bilaspur (375)'
  },
  {
    id: 'veh_traq_266709',
    regNo: 'V8-JHAJPAURI KALA- MUNGELI',
    type: 'VACUUM_TRUCK',
    capacityLitres: 3000,
    vendorId: 'ven_03',
    vendorName: 'Mungeli Sanitation Services',
    driverId: 'drv_traq_266709',
    driverName: 'Bhupendra Rajput',
    driverPhone: '9826100205',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-266709',
    traqDeviceId: 266709,
    currentLat: 22.0644,
    currentLng: 81.6888,
    speedKmh: 15,
    headingDeg: 270,
    status: 'TRANSPORTING',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Mungeli (654)'
  },
  {
    id: 'veh_traq_266710',
    regNo: 'V4-SARANPURKALA-KAWARDHA',
    type: 'VACUUM_TRUCK',
    capacityLitres: 3500,
    vendorId: 'ven_02',
    vendorName: 'Kawardha Rural Sanitation Agency',
    driverId: 'drv_traq_266710',
    driverName: 'Santosh Sahu',
    driverPhone: '9826100206',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-266710',
    traqDeviceId: 266710,
    currentLat: 22.0125,
    currentLng: 81.2483,
    speedKmh: 0,
    headingDeg: 0,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Kawardha (Kabirdham) (380)'
  },
  {
    id: 'veh_traq_266856',
    regNo: 'V5-LAGRA-JANJGIR_CHAMPA',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_03',
    vendorName: 'Janjgir Swachhata Mission',
    driverId: 'drv_traq_266856',
    driverName: 'Devendra Kashyap',
    driverPhone: '9826100207',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-266856',
    traqDeviceId: 266856,
    currentLat: 22.0064,
    currentLng: 82.5714,
    speedKmh: 0,
    headingDeg: 90,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Janjgir - Champa (379)'
  },
  {
    id: 'veh_traq_267599',
    regNo: 'V10-BIRKONI-MAHASAMUND',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_01',
    vendorName: 'Mahasamund Cleanliness Union',
    driverId: 'drv_traq_267599',
    driverName: 'Khemraj Chandrakar',
    driverPhone: '9826100208',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-267599',
    traqDeviceId: 267599,
    currentLat: 21.1084,
    currentLng: 82.0965,
    speedKmh: 25,
    headingDeg: 60,
    status: 'EN_ROUTE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Mahasamund (382)'
  },
  {
    id: 'veh_traq_273438',
    regNo: 'V3-GAMAHARIYA-JASHPUR',
    type: 'VACUUM_TRUCK',
    capacityLitres: 3000,
    vendorId: 'ven_02',
    vendorName: 'Jashpur Tribal Sanitation Services',
    driverId: 'drv_traq_273438',
    driverName: 'Anil Tirkey',
    driverPhone: '9826100209',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-273438',
    traqDeviceId: 273438,
    currentLat: 22.8841,
    currentLng: 84.1444,
    speedKmh: 0,
    headingDeg: 0,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Jashpur (376)'
  },
  {
    id: 'veh_traq_277166',
    regNo: 'V11-KOTRI-SARANGARH',
    type: 'VACUUM_TRUCK',
    capacityLitres: 4000,
    vendorId: 'ven_03',
    vendorName: 'Sarangarh-Bilaigarh Sanitation Cluster',
    driverId: 'drv_traq_277166',
    driverName: 'Rupesh Patel',
    driverPhone: '9826100210',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-277166',
    traqDeviceId: 277166,
    currentLat: 21.5900,
    currentLng: 83.0800,
    speedKmh: 0,
    headingDeg: 0,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Sarangarh-Bilaigarh (742)'
  },
  {
    id: 'veh_traq_289599',
    regNo: 'YATRI ERICKSHAW-PATORA',
    type: 'MINI_UNIT',
    capacityLitres: 1000,
    vendorId: 'ven_02',
    vendorName: 'Chhattisgarh Swachhta Nidhi PSSO',
    driverId: 'drv_traq_289599',
    driverName: 'Gopal Nishad',
    driverPhone: '9826100211',
    hasGpsDevice: true,
    gpsSource: 'TRAQINDIA_HARDWARE',
    gpsDeviceId: 'TRQ-CG-289599',
    traqDeviceId: 289599,
    currentLat: 21.1640,
    currentLng: 81.3075,
    speedKmh: 0,
    headingDeg: 0,
    status: 'AVAILABLE',
    pucExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    fitnessExpiry: '2027-12-31',
    district: 'Durg (377)'
  }
];

const INITIAL_VENDORS = [
  {
    id: 'ven_01',
    name: 'Shree Mahamaya Sanitation Services',
    regNo: 'CG-PSSO-2024-001',
    contactPerson: 'Mr. Shiv Kumar Sahu',
    phone: '9826100007',
    email: 'contact@mahamayaclean.in',
    status: 'EMPLANELED', // EMPLANELED, PENDING_APPROVAL, SUSPENDED
    upiVpa: 'mahamaya.fssm@sbi',
    districtsCovered: ['Raipur (378)', 'Durg (377)'],
    activeVehicles: 3,
    slaScore: 94.8,
    totalTripsCompleted: 482,
    revenueTotalINR: 723000
  },
  {
    id: 'ven_02',
    name: 'Chhattisgarh Swachhta Nidhi PSSO',
    regNo: 'CG-PSSO-2024-002',
    contactPerson: 'Mrs. Aarti Sen',
    phone: '9826100041',
    email: 'info@cgswachhta.org',
    status: 'EMPLANELED',
    upiVpa: 'swachhtanidhi@hdfcbank',
    districtsCovered: ['Durg (377)', 'Balod (646)'],
    activeVehicles: 2,
    slaScore: 91.2,
    totalTripsCompleted: 310,
    revenueTotalINR: 465000
  },
  {
    id: 'ven_03',
    name: 'Bilas Clean Tech Cooperative',
    regNo: 'CG-PSSO-2024-003',
    contactPerson: 'Dhananjay Singh',
    phone: '9826100042',
    email: 'support@bilasclean.coop',
    status: 'EMPLANELED',
    upiVpa: 'bilasclean@icici',
    districtsCovered: ['Bilaspur (375)'],
    activeVehicles: 2,
    slaScore: 96.0,
    totalTripsCompleted: 220,
    revenueTotalINR: 330000
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'req_01',
    requestNo: 'CG-D02-B07-GP11-2026-000101',
    citizenName: 'Devendra Chandrakar',
    citizenPhone: '9826188201',
    district: 'Raipur (378)',
    block: 'Dharsiwa (3836)',
    gp: 'Mandir Hasaud (124805)',
    village: 'Mandir Hasaud (444102)',
    habitation: 'Ward 04, Near Ram Mandir',
    tankType: 'CONVENTIONAL_TWO_CHAMBER',
    tankVolumeLitres: 3500,
    roadWidthMeters: 4.5,
    distanceFromRoadMeters: 15,
    isEmergency: false,
    scheduledDate: '2026-09-26',
    status: FSM_STATUS.EN_ROUTE,
    estimatedCost: 1500,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    assignedVendorId: 'ven_01',
    assignedVendorName: 'Shree Mahamaya Sanitation Services',
    assignedVehicleId: 'veh_01',
    assignedVehicleNo: 'CG-04-ME-4821',
    assignedDriverId: 'usr_driver',
    assignedDriverName: 'Ramesh Patel',
    assignedWorkerId: 'usr_worker',
    assignedWorkerName: 'Santosh Markam',
    targetFstpId: 'fstp_01',
    targetFstpName: 'Arang Cluster Rural FSTP',
    lat: 21.2520,
    lng: 81.7450,
    createdAt: '2026-09-25T08:30:00.000Z',
    updatedAt: '2026-09-25T10:15:00.000Z',
    history: [
      { step: 1, action: 'REQUEST_SUBMITTED', actor: 'Devendra Chandrakar (Citizen)', time: '2026-09-25T08:30:00.000Z', note: 'Booked via Portal' },
      { step: 2, action: 'GP_ACKNOWLEDGED', actor: 'Smt. Gayatri Devi (GP Operator)', time: '2026-09-25T09:00:00.000Z', note: 'SMS sent to applicant' },
      { step: 3, action: 'SITE_INSPECTED', actor: 'Santosh Markam (Worker)', time: '2026-09-25T09:30:00.000Z', note: 'Road width 4.5m, accessible' },
      { step: 4, action: 'VENDOR_ASSIGNED', actor: 'Smt. Gayatri Devi (GP Operator)', time: '2026-09-25T09:45:00.000Z', note: 'Assigned to Shree Mahamaya' },
      { step: 5, action: 'PAYMENT_RECEIVED', actor: 'Devendra Chandrakar (Citizen)', time: '2026-09-25T10:00:00.000Z', note: 'UPI Ref #UPI98421095' },
      { step: 6, action: 'VEHICLE_DISPATCHED', actor: 'Shree Mahamaya (Vendor)', time: '2026-09-25T10:15:00.000Z', note: 'Vehicle CG-04-ME-4821 assigned with driver Ramesh Patel' }
    ],
    ppeChecklist: {
      gloves: true,
      boots: true,
      mask: true,
      suit: true,
      goggles: true,
      sanitizer: true
    },
    beforePhotoUrl: null,
    afterPhotoUrl: null,
    decantedVolumeLitres: null
  },
  {
    id: 'req_02',
    requestNo: 'CG-D02-B07-GP11-2026-000102',
    citizenName: 'Ramprasad Sahu',
    citizenPhone: '9826177112',
    district: 'Raipur (378)',
    block: 'Arang (3835)',
    gp: 'Gullu (124755)',
    village: 'Gullu (444010)',
    habitation: 'Panchayat Bhavan Road',
    tankType: 'CIRCULAR_PIT',
    tankVolumeLitres: 2500,
    roadWidthMeters: 3.2,
    distanceFromRoadMeters: 20,
    isEmergency: true,
    scheduledDate: '2026-09-25',
    status: FSM_STATUS.ARRIVED,
    estimatedCost: 1200,
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    assignedVendorId: 'ven_01',
    assignedVendorName: 'Shree Mahamaya Sanitation Services',
    assignedVehicleId: 'veh_02',
    assignedVehicleNo: 'CG-04-TA-1904',
    assignedDriverId: 'drv_02',
    assignedDriverName: 'Brijesh Yadav',
    assignedWorkerId: 'usr_worker',
    assignedWorkerName: 'Santosh Markam',
    targetFstpId: 'fstp_01',
    targetFstpName: 'Arang Cluster Rural FSTP',
    lat: 21.2110,
    lng: 81.8950,
    createdAt: '2026-09-25T07:15:00.000Z',
    updatedAt: '2026-09-25T09:40:00.000Z',
    history: [
      { step: 1, action: 'EMERGENCY_REQUEST', actor: 'Ramprasad Sahu', time: '2026-09-25T07:15:00.000Z', note: 'Overflow emergency' },
      { step: 2, action: 'AUTO_APPROVED', actor: 'GP Operator', time: '2026-09-25T07:30:00.000Z', note: 'Emergency dispatch protocol' },
      { step: 3, action: 'VEHICLE_DISPATCHED', actor: 'Vendor Admin', time: '2026-09-25T08:00:00.000Z', note: 'Tractor unit deployed' },
      { step: 4, action: 'GPS_ARRIVED', actor: 'Driver (Brijesh)', time: '2026-09-25T09:40:00.000Z', note: 'Arrived at site (proximity 65m)' }
    ],
    ppeChecklist: {
      gloves: true,
      boots: true,
      mask: true,
      suit: true,
      goggles: true,
      sanitizer: true
    }
  },
  {
    id: 'req_03',
    requestNo: 'CG-D01-B03-GP04-2026-000103',
    citizenName: 'Laxman Sinha',
    citizenPhone: '9826166304',
    district: 'Durg (377)',
    block: 'Patan (3830)',
    gp: 'Jamgaon R (124600)',
    village: 'Jamgaon R (443800)',
    habitation: 'School Para',
    tankType: 'CONTAINMENT_BOX',
    tankVolumeLitres: 4000,
    roadWidthMeters: 5.0,
    distanceFromRoadMeters: 10,
    isEmergency: false,
    scheduledDate: '2026-09-25',
    status: FSM_STATUS.PENDING_APPROVAL,
    estimatedCost: 1650,
    paymentMethod: 'UPI',
    paymentStatus: 'UNPAID',
    lat: 21.0420,
    lng: 81.5210,
    createdAt: '2026-09-25T10:00:00.000Z',
    updatedAt: '2026-09-25T10:00:00.000Z',
    history: [
      { step: 1, action: 'REQUEST_SUBMITTED', actor: 'Laxman Sinha', time: '2026-09-25T10:00:00.000Z', note: 'Awaiting GP approval' }
    ]
  },
  {
    id: 'req_04',
    requestNo: 'CG-D03-B01-GP02-2026-000098',
    citizenName: 'Gajendra Netam',
    citizenPhone: '9826155405',
    district: 'Bilaspur (375)',
    block: 'Bilha (3810)',
    gp: 'Bodhri (124400)',
    village: 'Bodhri (443500)',
    habitation: 'Station Basti',
    tankType: 'CONVENTIONAL_TWO_CHAMBER',
    tankVolumeLitres: 3000,
    roadWidthMeters: 6.0,
    distanceFromRoadMeters: 12,
    isEmergency: false,
    scheduledDate: '2026-09-24',
    status: FSM_STATUS.CLOSED,
    estimatedCost: 1400,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    assignedVendorId: 'ven_03',
    assignedVendorName: 'Bilas Clean Tech Cooperative',
    assignedVehicleNo: 'CG-10-GA-3150',
    targetFstpId: 'fstp_03',
    targetFstpName: 'Bilha Regional FSTP',
    decantedVolumeLitres: 3000,
    rating: 5,
    feedbackText: 'Very clean service, no spillage in our lane. Glad this is digitized!',
    createdAt: '2026-09-24T09:00:00.000Z',
    updatedAt: '2026-09-24T16:30:00.000Z',
    history: [
      { step: 1, action: 'REQUEST_SUBMITTED', actor: 'Gajendra Netam', time: '2026-09-24T09:00:00.000Z' },
      { step: 2, action: 'APPROVED', actor: 'GP Operator', time: '2026-09-24T09:30:00.000Z' },
      { step: 3, action: 'CLEANING_COMPLETED', actor: 'Worker', time: '2026-09-24T13:00:00.000Z' },
      { step: 4, action: 'DISPOSED_AT_FSTP', actor: 'FSTP Operator', time: '2026-09-24T14:45:00.000Z', note: 'QR Manifest #MNF-9902 signed' },
      { step: 5, action: 'CLOSED_WITH_RATING', actor: 'Citizen', time: '2026-09-24T16:30:00.000Z', note: 'Rating 5/5' }
    ]
  }
];

const INITIAL_TARIFFS = {
  basePriceINR: 800,
  baseDistanceKm: 5,
  ratePerAdditionalKmINR: 25,
  tankSizeMultipliers: {
    '1500': 1.0,
    '2500': 1.2,
    '3500': 1.4,
    '5000': 1.8,
    '8000': 2.4
  },
  emergencyMultiplier: 1.25,
  gpAdministrativeFeeINR: 100
};

const INITIAL_SETTINGS = {
  traqIndiaToken: '8731177e-3712-4d15-90da-c7c2fdb6ca8c',
  traqPollingIntervalSeconds: 30,
  slaApprovalHours: 24,
  slaCompletionHours: 48,
  geoFenceThresholdMeters: 300,
  routeDeviationThresholdKm: 2.5,
  smsGatewayEnabled: true,
  offlineSyncIntervalMs: 60000,
  autoSuspendMissingDocs: true
};

export const getStorageData = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    const parsed = JSON.parse(raw);

    // If reading vehicles, ensure hasGpsDevice and gpsSource are populated
    if (key === STORAGE_KEYS.VEHICLES && Array.isArray(parsed)) {
      return parsed.map((v) => {
        const isHw = Boolean(
          v.hasGpsDevice === true ||
          v.has_gps_device === 1 ||
          (v.gpsDeviceId && (v.gpsDeviceId.startsWith('TRQ') || v.gpsDeviceId.includes('TRQ'))) ||
          (v.gps_device_id && (v.gps_device_id.startsWith('TRQ') || v.gps_device_id.includes('TRQ'))) ||
          v.traqDeviceId
        );
        return {
          ...v,
          hasGpsDevice: isHw,
          gpsSource: isHw ? 'TRAQINDIA_HARDWARE' : (v.gpsSource || 'MOBILE_APP')
        };
      });
    }

    return parsed;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
};

export const setStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

// Seed initial data if not present
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    setStorageData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
    setStorageData(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FSTPS)) {
    setStorageData(STORAGE_KEYS.FSTPS, INITIAL_FSTPS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
    setStorageData(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TARIFFS)) {
    setStorageData(STORAGE_KEYS.TARIFFS, INITIAL_TARIFFS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStorageData(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setStorageData(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'aud_01',
        action: 'SYSTEM_BOOT',
        actor: 'System Admin',
        actorRole: 'SUPER_ADMIN',
        ip: '10.20.0.1',
        timestamp: new Date().toISOString(),
        details: 'CG Rural FSSM Platform v1.0 initialized successfully.'
      }
    ]);
  }
};

export { STORAGE_KEYS };
