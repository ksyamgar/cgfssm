export const FSM_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  INSPECTED: 'INSPECTED',
  PENDING_ASSIGNMENT: 'PENDING_ASSIGNMENT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  ASSIGNED: 'ASSIGNED',
  VEHICLE_ASSIGNED: 'VEHICLE_ASSIGNED',
  TRIP_SCHEDULED: 'TRIP_SCHEDULED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  CLEANING_STARTED: 'CLEANING_STARTED',
  CLEANING_COMPLETED: 'CLEANING_COMPLETED',
  TRANSPORTING: 'TRANSPORTING',
  AT_FSTP: 'AT_FSTP',
  DISPOSED: 'DISPOSED',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  PENDING_FEEDBACK: 'PENDING_FEEDBACK',
  CLOSED: 'CLOSED',
  // Side states
  REJECTED: 'REJECTED',
  REQUIRES_REASSIGNMENT: 'REQUIRES_REASSIGNMENT',
  ESCALATED: 'ESCALATED',
  CANCELLED: 'CANCELLED'
};

export const STATUS_META = {
  [FSM_STATUS.PENDING_APPROVAL]: {
    label: 'Pending Approval',
    hindiLabel: 'स्वीकृति लंबित',
    color: 'amber',
    bg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
    actorRole: 'GP_OPERATOR',
    step: 1
  },
  [FSM_STATUS.ACKNOWLEDGED]: {
    label: 'Acknowledged',
    hindiLabel: 'स्वीकृत (एसएमएस प्रेषित)',
    color: 'sky',
    bg: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
    actorRole: 'GP_OPERATOR',
    step: 2
  },
  [FSM_STATUS.INSPECTED]: {
    label: 'Site Inspected',
    hindiLabel: 'साइट सत्यापन पूर्ण',
    color: 'indigo',
    bg: 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
    actorRole: 'GP_OPERATOR',
    step: 3
  },
  [FSM_STATUS.PENDING_ASSIGNMENT]: {
    label: 'Pending Assignment',
    hindiLabel: 'वेंडर आवंटन लंबित',
    color: 'blue',
    bg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30',
    actorRole: 'GP_OPERATOR',
    step: 4
  },
  [FSM_STATUS.PENDING_PAYMENT]: {
    label: 'Pending Payment',
    hindiLabel: 'भुगतान प्रतीक्षारत',
    color: 'amber',
    bg: 'bg-yellow-50 text-amber-900 border-amber-300 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30',
    actorRole: 'CITIZEN',
    step: 5
  },
  [FSM_STATUS.ASSIGNED]: {
    label: 'Vendor Assigned',
    hindiLabel: 'वेंडर को आवंटित',
    color: 'cyan',
    bg: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30',
    actorRole: 'VENDOR_ADMIN',
    step: 6
  },
  [FSM_STATUS.VEHICLE_ASSIGNED]: {
    label: 'Vehicle & Driver Assigned',
    hindiLabel: 'वाहन एवं चालक नियुक्त',
    color: 'teal',
    bg: 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30',
    actorRole: 'VENDOR_ADMIN',
    step: 7
  },
  [FSM_STATUS.TRIP_SCHEDULED]: {
    label: 'Trip Scheduled',
    hindiLabel: 'यात्रा निर्धारित',
    color: 'emerald',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    actorRole: 'DRIVER',
    step: 8
  },
  [FSM_STATUS.EN_ROUTE]: {
    label: 'Vehicle En Route',
    hindiLabel: 'वाहन मार्ग में (GPS सक्रिय)',
    color: 'teal',
    bg: 'bg-teal-100 text-teal-900 border-teal-400 dark:bg-teal-500/20 dark:text-teal-200 dark:border-teal-400 font-bold animate-pulse',
    actorRole: 'DRIVER',
    step: 9
  },
  [FSM_STATUS.ARRIVED]: {
    label: 'Vehicle Arrived',
    hindiLabel: 'साइट पर पहुँचा (≤150m)',
    color: 'purple',
    bg: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
    actorRole: 'SANITATION_WORKER',
    step: 10
  },
  [FSM_STATUS.CLEANING_STARTED]: {
    label: 'Cleaning Started (PPE Verified)',
    hindiLabel: 'सफाई प्रारंभ (PPE सत्यापित)',
    color: 'orange',
    bg: 'bg-orange-50 text-orange-900 border-orange-300 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
    actorRole: 'SANITATION_WORKER',
    step: 11
  },
  [FSM_STATUS.CLEANING_COMPLETED]: {
    label: 'Cleaning Completed',
    hindiLabel: 'सफाई पूर्ण (फोटो व मात्रा दर्ज)',
    color: 'emerald',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    actorRole: 'DRIVER',
    step: 12
  },
  [FSM_STATUS.TRANSPORTING]: {
    label: 'Transporting to FSTP',
    hindiLabel: 'FSTP की ओर रवाना',
    color: 'cyan',
    bg: 'bg-sky-100 text-sky-900 border-sky-400 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-400 font-bold animate-pulse',
    actorRole: 'DRIVER',
    step: 13
  },
  [FSM_STATUS.AT_FSTP]: {
    label: 'At FSTP (Geo-fence Enter)',
    hindiLabel: 'FSTP संयंत्र में प्रवेश',
    color: 'violet',
    bg: 'bg-purple-50 text-purple-900 border-purple-300 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
    actorRole: 'FSTP_OPERATOR',
    step: 14
  },
  [FSM_STATUS.DISPOSED]: {
    label: 'Safely Disposed & Verified',
    hindiLabel: 'सुरक्षित निस्तारण पूर्ण',
    color: 'emerald',
    bg: 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/40 font-bold',
    actorRole: 'FSTP_OPERATOR',
    step: 15
  },
  [FSM_STATUS.PAYMENT_COMPLETED]: {
    label: 'Payment Settled',
    hindiLabel: 'भुगतान जमा व समाधान',
    color: 'green',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30',
    actorRole: 'GP_OPERATOR',
    step: 16
  },
  [FSM_STATUS.PENDING_FEEDBACK]: {
    label: 'Pending Feedback',
    hindiLabel: 'प्रतिक्रिया प्रतीक्षारत',
    color: 'pink',
    bg: 'bg-pink-50 text-pink-800 border-pink-300 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30',
    actorRole: 'CITIZEN',
    step: 17
  },
  [FSM_STATUS.CLOSED]: {
    label: 'Request Closed & Sealed',
    hindiLabel: 'सत्यापित एवं समाप्त',
    color: 'emerald',
    bg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-emerald-600/20 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold',
    actorRole: 'SUPER_ADMIN',
    step: 18
  },
  [FSM_STATUS.REJECTED]: {
    label: 'Rejected',
    hindiLabel: 'अस्वीकृत',
    color: 'red',
    bg: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40 font-semibold',
    step: 0
  },
  [FSM_STATUS.REQUIRES_REASSIGNMENT]: {
    label: 'Breakdown / Reassign Queue',
    hindiLabel: 'वाहन खराबी / पुनरावंटन',
    color: 'amber',
    bg: 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-600/25 dark:text-amber-200 dark:border-amber-500/50 font-semibold',
    step: 0
  },
  [FSM_STATUS.ESCALATED]: {
    label: 'SLA Escalated to Block',
    hindiLabel: 'SLA उल्लंघन - विकासखंड को प्रेषित',
    color: 'rose',
    bg: 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500/40 font-semibold',
    step: 0
  },
  [FSM_STATUS.CANCELLED]: {
    label: 'Cancelled',
    hindiLabel: 'रद्द किया गया',
    color: 'slate',
    bg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/40',
    step: 0
  }
};

export const REJECTION_REASONS = [
  { code: 'NO_ROAD_ACCESS', label: 'Narrow lane / No road access for desludging tractor/truck' },
  { code: 'TANK_NOT_ACCESSIBLE', label: 'Septic tank covered by permanent slab / not accessible' },
  { code: 'DUPLICATE_BOOKING', label: 'Duplicate request by family member or neighbour' },
  { code: 'OUT_OF_SERVICE_AREA', label: 'Household outside safe cluster service perimeter (>25km)' },
  { code: 'NON_STANDARD_WASTE', label: 'Contains industrial chemical waste / non-faecal sludge' }
];

export const PPE_ITEMS = [
  { id: 'gloves', label: 'Heavy Duty Nitrile/Rubber Gloves', required: true },
  { id: 'boots', label: 'Anti-skid Safety Gumboots', required: true },
  { id: 'mask', label: 'Full Face Mask / Respirator', required: true },
  { id: 'suit', label: 'Protective Biohazard Coverall Suit', required: true },
  { id: 'goggles', label: 'Eye Safety Goggles', required: true },
  { id: 'sanitizer', label: 'Disinfectant Spray & First Aid Kit', required: true }
];
