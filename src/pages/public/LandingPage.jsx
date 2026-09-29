import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useFsm } from '../../context/FsmContext';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Factory,
  Recycle,
  CheckCircle2,
  Navigation,
  MapPin,
  TrendingUp,
  Activity,
  Users,
  AlertOctagon,
  Layers,
  ChevronRight,
  Droplets,
  Search,
  PlayCircle,
  PauseCircle,
  Smartphone,
  Check,
  Compass,
  FileText,
  PhoneCall,
  Clock,
  MessageSquare,
  Award,
  CheckCircle,
  AlertTriangle,
  Building,
  Radar,
  Lock,
  Star,
  ExternalLink
} from 'lucide-react';

export const LandingPage = () => {
  const { t } = useLanguage();
  const { requests, vehicles, fstps } = useFsm();

  // ----------------------------------------------------
  // 1. INTERACTIVE 5-STAGE FSSM CHAIN SIMULATOR DATA
  // ----------------------------------------------------
  const stagesData = {
    1: {
      stepLabel: "Stage 01 Protocol",
      title: "Household Pit Request & Digital Token",
      hindiTitle: "घरेलू सेप्टिक टैंक अनुरोध एवं डिजिटल टोकन",
      desc: "Citizen triggers desludging service request via mobile app or CSC VLE center. System computes standard containment capacity, distance to nearest operational plant, and generates cryptographic token.",
      highlight: "Instant OTP generated for Citizen Handshake",
      checklist: [
        "Automated Gram Panchayat territorial jurisdiction check",
        "Standardized tariff lock: Zero unregulated surge pricing",
        "Automated dispatch to nearest registered vacuum unit"
      ],
      log1: "[TOKEN_GEN: #CG-D02-B07-GP11-2026]",
      log2: "[LAT_LON: 21.1892° N, 81.5284° E]",
      log3: "[STATUS: ASSIGNED_PATAN_FLEET_UNIT_04]",
      dashOffset: 720,
      tankerLeft: "8%",
      speed: "0 km/h (At Base)",
      volume: "0L (Staged at Household)",
      tankerCallout: "Token #CG-D02 Verified",
      geoCoords: "21.1892° N, 81.5284° E",
      odometer: "0.0 km / 16.4 km",
      statusBadge: "TOKEN GENERATED",
      battery: "98% Telemetry Battery"
    },
    2: {
      stepLabel: "Stage 02 Protocol",
      title: "Dispatch & Worker Safety PPE Verification",
      hindiTitle: "सुरक्षित प्रेषण एवं स्वच्छता मित्र पीपीई सत्यापन",
      desc: "Sanitation workers undergo mandatory pre-service PPE verification. Mobile app requires biometric EXIF-matched photos of gloves, gumboots, respirator masks, and eye protection before vehicle ignition activates.",
      highlight: "Direct Prohibition of Hazardous Manual Scavenging Compliance",
      checklist: [
        "In-app AI photo validation of complete 5-point PPE kit",
        "Gas detector sensor check (Zero H2S / CH4 alert verified)",
        "Driver alcohol breath-sensor interlock status: PASSED"
      ],
      log1: "[PPE_AUDIT: COMPLIANT_ALL_WORKERS]",
      log2: "[EQUIPMENT: 100MM_HEAVY_VACUUM_HOSE]",
      log3: "[SAFETY_OFFICER_SIGN_OFF: SWACHHAGRAHI_SELUD]",
      dashOffset: 540,
      tankerLeft: "28%",
      speed: "24 km/h",
      volume: "0L (Pre-Suction Sealed)",
      tankerCallout: "PPE Verified • 5-Point Kit",
      geoCoords: "21.1840° N, 81.5310° E",
      odometer: "1.2 km / 16.4 km",
      statusBadge: "SAFETY CERTIFIED",
      battery: "96% Telemetry Battery"
    },
    3: {
      stepLabel: "Stage 03 Protocol",
      title: "Geo-Fenced GPS Transit & Anti-Dumping Corridor",
      hindiTitle: "लाइव जीपीएस पारगमन एवं भू-बाधित निगरानी",
      desc: "AIS-140 GPS transponder enforces an unalterable designated travel corridor. Tank valves are digitally locked until the unit enters the registered decanting bay geofence, preventing roadside disposal.",
      highlight: "Real-time breach alerts sent to District Collectorate",
      checklist: [
        "Automated 300m buffer zone avoidance around Kharun river",
        "Speed telemetry capped at 40 km/h for slurry transport safety",
        "Tamper-evident electromagnetic valve lock verified closed"
      ],
      log1: "[AIS140_PING: SPEED_32KMH_LATENCY_1.2S]",
      log2: "[CORRIDOR_INTEGRITY: 100%_INSIDE_BOUNDS]",
      log3: "[VALVE_TELEMETRY: CLOSED_AND_SEALED]",
      dashOffset: 360,
      tankerLeft: "50%",
      speed: "32 km/h",
      volume: "Loaded: 3,000L (Anti-Spill Locked)",
      tankerCallout: "Corridor Active • Anti-Spill",
      geoCoords: "21.1620° N, 81.5540° E",
      odometer: "8.6 km / 16.4 km",
      statusBadge: "GEO-LOCKED TRANSIT",
      battery: "94% Telemetry Battery"
    },
    4: {
      stepLabel: "Stage 04 Protocol",
      title: "FSTP Decanting Reception & QR Handshake",
      hindiTitle: "एफएसटीपी प्रवेश द्वार एवं डिजिटल क्यूआर मिलान",
      desc: "Upon arrival at Patan FSTP or Bhilai Co-treatment plant, driver scans the reception bay cryptographic QR code. Automated gates record truck tare-weight, inlet BOD volume, and release electromagnetic locks.",
      highlight: "Cryptographic decant certificate minted on state ledger",
      checklist: [
        "Optical weighbridge: 3,120 Litres net intake logged",
        "Preliminary COD/BOD strip test: 18,500 mg/L influent baseline",
        "Automated tipping fee voucher issued to Village Panchayat"
      ],
      log1: "[QR_DECRYPT: RECEPTION_BAY_02_PATAN]",
      log2: "[VALVE_REL: UNLOCKED_BY_STP_GATEKEEPER]",
      log3: "[VOLUME_INFLUX: 3.12_KL_TRANSFERRED]",
      dashOffset: 180,
      tankerLeft: "70%",
      speed: "0 km/h (Decanting)",
      volume: "3,000L → 0L (Decanting Bay 02)",
      tankerCallout: "QR Decant Manifest Minted",
      geoCoords: "21.1410° N, 81.5890° E",
      odometer: "16.4 km (Arrived Plant)",
      statusBadge: "DECANTING RECEPTION",
      battery: "91% Telemetry Battery"
    },
    5: {
      stepLabel: "Stage 05 Protocol",
      title: "Sludge Stabilization, Bio-Char & Circular Reuse",
      hindiTitle: "गाद शुद्धिकरण, जैविक खाद एवं जल पुनर्चक्रण",
      desc: "Faecal solids undergo anaerobic digestion and thermal drying bed solar dehydration, converting dangerous bio-hazards into nutrient-rich organic soil conditioner for local paddy and horticulture farming.",
      highlight: "Helminth egg neutralization: 100% Pathogen Free",
      checklist: [
        "Biological Oxygen Demand (BOD) reduction > 98.5%",
        "FSSAI/SBM-G enriched compost quality standards certified",
        "Effluent water recirculated for campus tree plantation"
      ],
      log1: "[COMPOST_BATCH: CG-PATAN-B041-NUTRI]",
      log2: "[EFFLUENT_TEST: BOD_7.2MG_L_DISCHARGE_SAFE]",
      log3: "[CIRCULAR_DEST: DISTRIBUTED_TO_KRISHI_KENDRA]",
      dashOffset: 0,
      tankerLeft: "90%",
      speed: "Batch Complete",
      volume: "Treated: 100% Bio-Compost",
      tankerCallout: "Compost & Recycled Water",
      geoCoords: "21.1415° N, 81.5895° E",
      odometer: "Completed & Audited",
      statusBadge: "CIRCULAR ECONOMY",
      battery: "100% Solar Powered"
    }
  };

  const [currentStage, setCurrentStage] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play interval for simulator (auto-animates continuously every 2.8s)
  useEffect(() => {
    let interval = null;
    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentStage((prev) => (prev >= 5 ? 1 : prev + 1));
      }, 2800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay]);

  // Current stage info
  const stage = stagesData[currentStage];

  // ----------------------------------------------------
  // 2. TOKEN TRACKING CONSOLE STATE
  // ----------------------------------------------------
  const [searchToken, setSearchToken] = useState('CG-D02-B07-GP11-2026-000412');
  const [verifiedTokenData, setVerifiedTokenData] = useState({
    token: 'CG-D02-B07-GP11-2026-000412',
    status: 'EN ROUTE',
    applicant: 'Rameshwar Sahu',
    gp: 'Jamgaon (R)',
    block: 'Patan Block',
    eta: '18 Mins',
    dist: '4.2 km away',
    speed: '32 km/h',
    driver: 'Mohan Lal Verma',
    truck: 'CG-07-TR-9941',
    plant: 'Patan Cluster FSTP (Bay 02)',
    capacity: '3,000 Litres (Vacuum PTO)'
  });
  const [tokenAlert, setTokenAlert] = useState('');

  const handleVerifyToken = () => {
    if (!searchToken.trim()) return;
    setTokenAlert(`Manifest Token "${searchToken}" verified. Tanker CG-07-TR-9941 is en-route with AIS-140 GPS lock.`);
    setTimeout(() => setTokenAlert(''), 5000);
  };

  // ----------------------------------------------------
  // 3. DYNAMIC TARIFF CALCULATOR STATE & LOGIC
  // ----------------------------------------------------
  const [calcDistrict, setCalcDistrict] = useState('durg');
  const [calcBlock, setCalcBlock] = useState('patan');
  const [calcGp, setCalcGp] = useState('jamgaon-r');
  const [calcTankSize, setCalcTankSize] = useState('single');
  const [calcAccess, setCalcAccess] = useState('wide');
  const [calcCategory, setCalcCategory] = useState('bpl');

  const gpDistances = {
    'jamgaon-r': 8.4,
    'selud': 13.2,
    'batang': 17.5,
    'kurud': 6.0
  };

  const calculateTariff = () => {
    const baseFee = 1200;
    let capacitySurcharge = 0;
    if (calcTankSize === 'medium') capacitySurcharge = 200;
    if (calcTankSize === 'commercial') capacitySurcharge = 500;

    let accessSurcharge = calcAccess === 'narrow' ? 150 : 0;
    const distanceKm = gpDistances[calcGp] || 8.4;
    const distanceSurcharge = distanceKm > 15 ? 150 : 0;

    let subsidy = 0;
    if (calcCategory === 'bpl') subsidy = 400;
    if (calcCategory === 'panchayat-building') subsidy = 600;

    const netTotal = Math.max(0, baseFee + capacitySurcharge + accessSurcharge + distanceSurcharge - subsidy);

    return {
      baseFee,
      capacitySurcharge,
      accessSurcharge,
      distanceKm,
      distanceSurcharge,
      subsidy,
      netTotal
    };
  };

  const bill = calculateTariff();

  // ----------------------------------------------------
  // 4. GIS MAP RADAR FILTER STATE
  // ----------------------------------------------------
  const [mapFilter, setMapFilter] = useState('all');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF] dark:bg-cg-navy text-slate-900 dark:text-slate-100 transition-colors w-full max-w-full">
      <Header />

      <main className="w-full max-w-full flex-1">
        {/* SECTION 1: HERO & INTERACTIVE 5-STAGE FSSM CHAIN SIMULATOR */}
        <section className="relative w-full max-w-full bg-[#FAF8FF] dark:bg-cg-navy pt-2 pb-6 sm:pt-3 sm:pb-8 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-slate-200/80 dark:border-white/10">
          {/* Subtle civic background glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[340px] bg-gradient-to-b from-teal-500/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none rounded-full dark:opacity-40"></div>

          <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4 relative z-10">
            {/* Hero Top: High-Impact Editorial & CTAs */}
            <div className="flex flex-col items-center text-center gap-3 max-w-4xl mx-auto">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider shadow-sm">
                  <Sparkles size={13} className="text-teal-600 dark:text-teal-400" />
                  <span>AERONAUTICAL-GRADE TELEMETRY</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">SBM-G MISSION PLATFORM</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px]">
                    v2.4 Live
                  </span>
                </div>
              </div>

              {/* Grand Main Headline */}
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                The Digital Operating System for{' '}
                <span className="text-teal-600 dark:text-teal-400 relative inline-block">
                  Rural Sanitation
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-teal-500/80 dark:text-teal-400"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 6 Q 25 12, 50 6 T 100 6 T 150 6 T 200 6"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Descriptive Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-sans">
                Real-time desludging fleet dispatch, tamper-proof anti-dumping telemetry & automated GP-to-FSTP accounting under Swachh Bharat Mission (Grameen).
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-0.5">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-clean-sm hover:shadow-teal-600/30 transition-all hover:scale-105"
                >
                  <Droplets size={16} />
                  <span>Book Desludging Service</span>
                </Link>

                <Link
                  to="/live-map"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-white/20 shadow-sm transition-all hover:border-slate-400"
                >
                  <Navigation size={16} className="text-sky-600 dark:text-sky-400" />
                  <span>View State Telemetry Map</span>
                </Link>
              </div>
            </div>

            {/* Frameless Full-Width Centerpiece Video (Cropped Top Heading & Bottom Caption) */}
            <div className="w-full max-w-5xl mx-auto relative -mt-1 sm:-mt-2 flex flex-col gap-3">
              {/* Soft Ambient Radiance Behind Video */}
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/15 via-sky-500/10 to-emerald-400/15 blur-3xl rounded-3xl -z-10 pointer-events-none opacity-80 dark:opacity-40"></div>

              {/* Video Viewport (Zero horizontal clip, top title & bottom caption cropped, transparent background) */}
              <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto block pointer-events-none"
                  style={{ marginTop: '-9.5%', marginBottom: '-12%' }}
                >
                  <source src="/logo/FSSM.webm" type="video/webm; codecs=vp9" />
                  <source src="/logo/FSSM.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Space-Utilizing Telemetry Chain Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {[
                  { id: 1, name: '01. Containment', desc: 'Citizen Token' },
                  { id: 2, name: '02. Emptying', desc: 'AI Safety PPE' },
                  { id: 3, name: '03. Transport', desc: 'AIS-140 Corridor' },
                  { id: 4, name: '04. Treatment', desc: 'FSTP Decanting' },
                  { id: 5, name: '05. Reuse', desc: '100% Bio-Compost' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentStage(s.id);
                      setAutoPlay(false);
                    }}
                    className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-center transition-all ${currentStage === s.id
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 shadow-sm font-bold'
                      : 'bg-white/70 dark:bg-white/5 border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:border-teal-300'
                      }`}
                  >
                    <span className="font-mono text-[11px] font-bold">{s.name}</span>
                    <span className="text-[10px] opacity-75">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIVE 5-STAGE FSSM SERVICE CHAIN SIMULATOR */}
            <div className="w-full bg-white dark:bg-[#072238] rounded-2xl shadow-clean-md border border-slate-200/80 dark:border-white/10 p-6 lg:p-8 flex flex-col gap-6">
              {/* Header of Component */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">End-to-End FSSM Digital Custody Chain</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step verification pipeline enforcing zero open-dumping across rural districts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-semibold transition-colors"
                  >
                    {autoPlay ? <PauseCircle size={18} className="text-teal-600 dark:text-teal-400" /> : <PlayCircle size={18} className="text-teal-600 dark:text-teal-400" />}
                    <span>{autoPlay ? 'Pause Walkthrough' : 'Play Automated Walkthrough'}</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">AIS-140 • EXIF Verified</span>
                </div>
              </div>

              {/* 1. INFOGRAPHIC-RICH ANIMATED VEHICLE MOVEMENT & TELEMETRY CANVAS (ABOVE STEP BOXES) */}
              <div className="relative w-full bg-slate-100/80 dark:bg-[#051826] rounded-2xl p-5 sm:p-6 overflow-hidden flex flex-col justify-between border border-slate-200/80 dark:border-white/10 shadow-sm transition-all">
                {/* Infographic Top Telemetry Strip */}
                <div className="flex items-center justify-between z-10 flex-wrap gap-3 pb-3 border-b border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="flex items-center gap-2 bg-white dark:bg-[#0B2032] px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200/70 dark:border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">UNIT #CG-07-TR-9941</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">{stage.speed}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-mono text-[10px] font-bold border border-teal-200/80 dark:border-teal-500/30">
                      {stage.statusBadge}
                    </span>
                  </div>

                  {/* Real-time Telemetry Stats */}
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300 flex-wrap">
                    <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#0B2032] px-3 py-1 rounded-full border border-slate-200/60 dark:border-white/10 shadow-sm">
                      <Compass size={13} className="text-sky-600 dark:text-sky-400" />
                      <span>{stage.geoCoords}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white dark:bg-[#0B2032] px-3 py-1 rounded-full border border-slate-200/60 dark:border-white/10 shadow-sm">
                      <Droplets size={13} className="text-teal-600 dark:text-teal-400" />
                      <span className="font-bold text-teal-700 dark:text-teal-300">{stage.volume}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 bg-white dark:bg-[#0B2032] px-3 py-1 rounded-full border border-slate-200/60 dark:border-white/10 shadow-sm text-slate-500 dark:text-slate-400">
                      <Navigation size={13} className="text-emerald-500" />
                      <span>{stage.odometer}</span>
                    </div>
                  </div>
                </div>

                {/* Infographic Landmark Badges Over Nodes */}
                <div className="grid grid-cols-5 text-center pt-5 pb-1 z-10">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-sm border transition-all ${currentStage === 1
                      ? 'bg-teal-600 text-white border-teal-500 scale-105 shadow-teal-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}>
                      <Droplets size={10} />
                      <span className="hidden sm:inline">1,500L Pit</span>
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-sm border transition-all ${currentStage === 2
                      ? 'bg-teal-600 text-white border-teal-500 scale-105 shadow-teal-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}>
                      <ShieldCheck size={10} />
                      <span className="hidden sm:inline">PPE Audit</span>
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-sm border transition-all ${currentStage === 3
                      ? 'bg-teal-600 text-white border-teal-500 scale-105 shadow-teal-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}>
                      <Navigation size={10} />
                      <span className="hidden sm:inline">300m Buffer</span>
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-sm border transition-all ${currentStage === 4
                      ? 'bg-teal-600 text-white border-teal-500 scale-105 shadow-teal-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}>
                      <Factory size={10} />
                      <span className="hidden sm:inline">Decant Bay 02</span>
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-sm border transition-all ${currentStage === 5
                      ? 'bg-teal-600 text-white border-teal-500 scale-105 shadow-teal-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}>
                      <Recycle size={10} />
                      <span className="hidden sm:inline">Bio-Char Reuse</span>
                    </span>
                  </div>
                </div>

                {/* Isometric Pathway SVG with animated Tanker */}
                <div className="relative w-full h-28 my-auto flex items-center justify-center">
                  <svg className="w-full h-28" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 120">
                    {/* Route Track Background */}
                    <path
                      d="M 50 60 Q 250 15, 500 60 T 950 60"
                      fill="none"
                      stroke="#CBD5E1"
                      strokeLinecap="round"
                      strokeWidth="14"
                      className="dark:stroke-slate-800"
                    />

                    {/* Active Highlight Track with smooth dash transition */}
                    <path
                      className="transition-all duration-700 ease-out"
                      d="M 50 60 Q 250 15, 500 60 T 950 60"
                      fill="none"
                      stroke="#0D9488"
                      strokeDasharray="900"
                      strokeDashoffset={stage.dashOffset}
                      strokeLinecap="round"
                      strokeWidth="14"
                    />

                    {/* Checkpoint Nodes (1 to 5) */}
                    {/* Node 1 */}
                    <circle cx="50" cy="60" fill={currentStage >= 1 ? '#0D9488' : '#94A3B8'} r="15" className="transition-colors duration-500" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="bold" textAnchor="middle" x="50" y="65">1</text>

                    {/* Node 2 */}
                    <circle cx="275" cy="40" fill={currentStage >= 2 ? '#0D9488' : '#94A3B8'} r="13" className="transition-colors duration-500" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" x="275" y="44">2</text>

                    {/* Node 3 */}
                    <circle cx="500" cy="60" fill={currentStage >= 3 ? '#0D9488' : '#94A3B8'} r="13" className="transition-colors duration-500" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" x="500" y="64">3</text>

                    {/* Node 4 */}
                    <circle cx="725" cy="78" fill={currentStage >= 4 ? '#0D9488' : '#94A3B8'} r="13" className="transition-colors duration-500" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" x="725" y="82">4</text>

                    {/* Node 5 */}
                    <circle cx="950" cy="60" fill={currentStage >= 5 ? '#0D9488' : '#94A3B8'} r="15" className="transition-colors duration-500" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="12" textAnchor="middle" x="950" y="65">5</text>
                  </svg>

                  {/* Animated Tanker Sprite with Floating Info Tooltip */}
                  <div
                    className="absolute transition-all duration-700 ease-out top-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
                    style={{ left: stage.tankerLeft }}
                  >
                    {/* Live Infographic Bubble */}
                    <div className="px-3 py-1 rounded-lg bg-slate-900/95 dark:bg-black/95 text-white font-mono text-[10px] whitespace-nowrap shadow-clean-lg border border-teal-500/40 mb-1 flex items-center gap-1.5 backdrop-blur">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                      <span className="font-bold text-teal-300">{stage.tankerCallout}</span>
                    </div>

                    {/* Tanker Icon Button Graphic with Glowing Ripple */}
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xl ring-4 ring-teal-400/50">
                        <Truck size={22} />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Waypoint Landmarks Description */}
                <div className="grid grid-cols-5 text-center font-mono text-[11px] text-slate-600 dark:text-slate-400 z-10 font-semibold pt-2 border-t border-slate-200/50 dark:border-white/5">
                  <div>Household Containment</div>
                  <div>Safety Pre-Audit</div>
                  <div>Corridor Geofence</div>
                  <div>Cluster FSTP Reception</div>
                  <div>Bio-Char & Nutri-Compost</div>
                </div>
              </div>

              {/* 2. STEPPER NAVIGATION (5 TABS PLACED DIRECTLY BELOW VEHICLE MOVEMENT) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {[
                  { id: 1, label: '01. REQUEST', title: 'Pit Booking & Token', icon: Smartphone },
                  { id: 2, label: '02. DISPATCH', title: 'Worker PPE Audit', icon: ShieldCheck },
                  { id: 3, label: '03. TRANSIT', title: 'Geo-Fence Buffer', icon: Navigation },
                  { id: 4, label: '04. INTAKE', title: 'Cryptographic Decant', icon: Factory },
                  { id: 5, label: '05. RECOVERY', title: 'Bio-Char Circularity', icon: Recycle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentStage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setAutoPlay(false);
                        setCurrentStage(tab.id);
                      }}
                      className={`text-left p-3.5 rounded-xl flex flex-col gap-1 transition-all border ${isActive
                        ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 dark:border-teal-400 shadow-clean scale-[1.02]'
                        : 'bg-slate-50 dark:bg-[#061A28] border-slate-200/70 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          {tab.label}
                        </span>
                        <Icon size={16} className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'} />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {tab.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Dynamic Inspection Panel for Current Stage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-[#061A28] p-5 rounded-xl border border-slate-200/60 dark:border-white/10">
                {/* Column 1: Operational Directive */}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider">
                    {stage.stepLabel}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    {stage.title}
                  </h3>
                  <div className="text-xs font-hindi text-teal-700 dark:text-teal-300 font-medium">
                    {stage.hindiTitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {stage.desc}
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck size={16} />
                    <span>{stage.highlight}</span>
                  </div>
                </div>

                {/* Column 2: Digital Guardrails & Compliance Requirements */}
                <div className="space-y-2 bg-white dark:bg-[#0B2032] p-4 rounded-xl border border-slate-200/60 dark:border-white/10">
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-semibold uppercase">
                    Verification Safeguards
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200 font-sans">
                    {stage.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={15} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Live Telemetry Event Snippet */}
                <div className="flex flex-col justify-between bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs shadow-inner">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sky-400 text-[10px] pb-1 border-b border-slate-800">
                      <span>AUDIT_EVENT_STREAM</span>
                      <span className="text-emerald-400">LIVE_200_OK</span>
                    </div>
                    <p className="text-teal-300 text-[11px]">{stage.log1}</p>
                    <p className="text-slate-300 text-[11px]">{stage.log2}</p>
                    <p className="text-emerald-400 text-[11px]">{stage.log3}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80">
                    <span>SBMG-CG Core Cloud Node #02</span>
                    <span>16:45:00 IST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: REAL-TIME CITIZEN TRACKING CONSOLE & MANIFEST AUDIT */}
        <section className="w-full max-w-full overflow-hidden bg-slate-100/70 dark:bg-[#041421] py-14 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80 dark:border-white/10" id="tracking-console">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider">
                  <MapPin size={16} />
                  <span>Citizen Real-Time Manifest Verifier</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Live Desludging Trip Status
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  Enter your 16-digit booking token or vehicle registration number to trace desludging vehicles, driver credentials, and decanting timestamps.
                </p>
              </div>

              {/* Token Search Input Bar */}
              <div className="w-full md:w-96 flex items-center bg-white dark:bg-[#0A2540] rounded-full p-1.5 shadow-clean border border-slate-200/80 dark:border-white/15">
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="e.g. CG-D02-B07-..."
                  className="w-full px-4 py-1.5 bg-transparent font-mono text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyToken}
                  className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Search size={14} />
                  <span>Verify</span>
                </button>
              </div>
            </div>

            {tokenAlert && (
              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle size={16} className="text-teal-600 dark:text-teal-400" />
                <span>{tokenAlert}</span>
              </div>
            )}

            {/* Main Tracking Card */}
            <div className="w-full bg-white dark:bg-[#072238] rounded-2xl shadow-clean-md border border-slate-200/80 dark:border-white/10 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Progress Flow (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                {/* Token Header Details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">
                        #{verifiedTokenData.token}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                        {verifiedTokenData.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Applicant: <strong>{verifiedTokenData.applicant}</strong> • Gram Panchayat: <strong>{verifiedTokenData.gp}, {verifiedTokenData.block}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block">Estimated Arrival</span>
                    <span className="font-display font-extrabold text-xl text-teal-600 dark:text-teal-400">
                      {verifiedTokenData.eta} <span className="text-xs font-normal text-slate-600 dark:text-slate-300">({verifiedTokenData.dist})</span>
                    </span>
                  </div>
                </div>

                {/* Trip Stepper Progress Bar */}
                <div className="w-full py-4">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-3/5 bg-teal-600 rounded-full"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-white mt-2">Booked</span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">14 May • 08:24</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-white mt-2">Assigned</span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">14 May • 08:48</span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-teal-600 text-white ring-4 ring-teal-400/40 flex items-center justify-center text-xs shadow-md animate-pulse">
                        <Truck size={18} />
                      </div>
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-2">En Route</span>
                      <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400">In Motion • 32 km/h</span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs">
                        <Droplets size={16} />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">Suction/De-sludge</span>
                      <span className="font-mono text-[10px] text-slate-400">Est. 09:40</span>
                    </div>

                    {/* Step 5 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs">
                        <Factory size={16} />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">Patan FSTP Influx</span>
                      <span className="font-mono text-[10px] text-slate-400">Est. 10:15</span>
                    </div>
                  </div>
                </div>

                {/* Trip Safety Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061A28] flex items-center gap-3 border border-slate-200/60 dark:border-white/10">
                    <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-900 dark:text-white">PPE Verified</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Mask, Gloves, Boots Uploaded</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061A28] flex items-center gap-3 border border-slate-200/60 dark:border-white/10">
                    <Lock size={20} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-900 dark:text-white">Geo-Lock Sealed</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Corridor Anti-Spill Active</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061A28] flex items-center gap-3 border border-slate-200/60 dark:border-white/10">
                    <Award size={20} className="text-sky-600 dark:text-sky-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-900 dark:text-white">Govt Cap Tariff</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Notified Rate • Zero Cash Tip</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Assigned Driver & Vehicle Snapshot (4 cols) */}
              <div className="lg:col-span-4 bg-slate-50 dark:bg-[#061A28] rounded-2xl p-5 flex flex-col justify-between gap-4 border border-slate-200/60 dark:border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Designated Operator
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      AIS-140 OK
                    </span>
                  </div>

                  {/* Driver profile */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-800 dark:text-teal-200 font-display font-bold shadow-sm">
                      ML
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{verifiedTokenData.driver}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Licensed SBM-G Sanitation Lead</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        <Star size={13} fill="currentColor" />
                        <span>4.92 • 412 Safe Runs</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-2 pt-2 text-xs border-t border-slate-200/60 dark:border-white/10">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Tanker Reg #:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{verifiedTokenData.truck}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Tank Capacity:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{verifiedTokenData.capacity}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Designated Reception:</span>
                      <span className="font-semibold text-teal-700 dark:text-teal-300">{verifiedTokenData.plant}</span>
                    </div>
                  </div>
                </div>

                {/* Citizen Action Call CTA */}
                <div className="pt-2">
                  <a
                    href="tel:18002337266"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-[#0B2032] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-semibold text-xs transition-colors border border-slate-200/80 dark:border-white/10 shadow-sm"
                  >
                    <PhoneCall size={14} className="text-sky-600 dark:text-sky-400" />
                    <span>Contact Gram Sahayak Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: DYNAMIC GRAM PANCHAYAT TARIFF CALCULATOR */}
        <section className="w-full max-w-full overflow-hidden bg-[#FAF8FF] dark:bg-cg-navy py-14 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80 dark:border-white/10" id="tariff-estimator">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider">
                  <FileText size={16} />
                  <span>Statutory Notification No. CG-SBMG-2024-T09</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Village Tariff & Subsidy Estimator
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  Check the government-mandated desludging rates for your Gram Panchayat. Transparent, capped, and backed by SBM-G rural subsidies.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle size={16} />
                <span>Zero Unofficial Operator Tips Permitted</span>
              </div>
            </div>

            {/* Calculator Form + Live Receipt Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Controls (7 Cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-[#072238] rounded-2xl shadow-clean-md border border-slate-200/80 dark:border-white/10 p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold" htmlFor="calc-district">
                      District
                    </label>
                    <select
                      id="calc-district"
                      value={calcDistrict}
                      onChange={(e) => setCalcDistrict(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#061A28] border border-slate-200 dark:border-white/15 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="durg">Durg (387 Panchayats)</option>
                      <option value="raipur">Raipur (410 Panchayats)</option>
                      <option value="bilaspur">Bilaspur (492 Panchayats)</option>
                      <option value="rajnandgaon">Rajnandgaon (398 Panchayats)</option>
                      <option value="bastar">Bastar (382 Panchayats)</option>
                    </select>
                  </div>

                  {/* Block */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold" htmlFor="calc-block">
                      Development Block
                    </label>
                    <select
                      id="calc-block"
                      value={calcBlock}
                      onChange={(e) => setCalcBlock(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#061A28] border border-slate-200 dark:border-white/15 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="patan">Patan Block</option>
                      <option value="dhamdha">Dhamdha Block</option>
                      <option value="bhilai-3">Bhilai-3 Gramin</option>
                    </select>
                  </div>
                </div>

                {/* Gram Panchayat Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold" htmlFor="calc-gp">
                    Gram Panchayat
                  </label>
                  <select
                    id="calc-gp"
                    value={calcGp}
                    onChange={(e) => setCalcGp(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#061A28] border border-slate-200 dark:border-white/15 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    <option value="jamgaon-r">Jamgaon (R) • 8.4 km to Patan FSTP</option>
                    <option value="selud">Selud • 13.2 km to Patan FSTP</option>
                    <option value="batang">Batang • 17.5 km to Patan FSTP</option>
                    <option value="kurud">Kurud (Rural) • 6.0 km to Bhilai Plug-in</option>
                  </select>
                </div>

                {/* Containment Tank Size Radio Cards */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Containment Tank Type & Capacity
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { val: 'single', title: 'Single Pit Tank', cap: '≤ 1,500 Litres', note: 'Standard Rural Base' },
                      { val: 'medium', title: 'Standard Septic', cap: '1,500L – 3,000L', note: '+₹200 Volume Surcharge' },
                      { val: 'commercial', title: 'Twin Pit / Commercial', cap: '> 3,000 Litres', note: '+₹500 Commercial Slab' },
                    ].map((item) => (
                      <label
                        key={item.val}
                        onClick={() => setCalcTankSize(item.val)}
                        className={`relative flex flex-col p-3.5 rounded-xl cursor-pointer transition-all border ${calcTankSize === item.val
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 dark:border-teal-400 shadow-sm'
                          : 'bg-slate-50 dark:bg-[#061A28] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                      >
                        <span className="font-display font-bold text-xs text-slate-900 dark:text-white">{item.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.cap}</span>
                        <span className={`font-mono text-[10px] font-semibold mt-2 ${calcTankSize === item.val ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}>
                          {item.note}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Access Pathway / Road Width Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold" htmlFor="calc-access">
                      Village Approach Road
                    </label>
                    <select
                      id="calc-access"
                      value={calcAccess}
                      onChange={(e) => setCalcAccess(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#061A28] border border-slate-200 dark:border-white/15 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="wide">Standard Road (&gt; 3.0 Metres wide)</option>
                      <option value="narrow">Narrow Alley (&lt; 3.0m • Mini Tractor Req.)</option>
                    </select>
                  </div>

                  {/* Socio-Economic / Subsidy Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold" htmlFor="calc-category">
                      Household Category
                    </label>
                    <select
                      id="calc-category"
                      value={calcCategory}
                      onChange={(e) => setCalcCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#061A28] border border-slate-200 dark:border-white/15 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="bpl">BPL / Antyodaya (SBM-G ₹400 Subsidy)</option>
                      <option value="general">General Resident (Standard Cap)</option>
                      <option value="panchayat-building">Institutional / GP Building (₹600 Subsidy)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Cost Breakdown Receipt (5 Cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-[#072238] rounded-2xl shadow-clean-md border border-slate-200/80 dark:border-white/10 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-teal-600 dark:text-teal-400" />
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Government Tariffs</h3>
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded">
                      Fixed Cap
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-3">
                    Itemized billing scheduled under Department of Panchayat Notification No. 881/SBM-G/2024.
                  </p>

                  {/* Line Items */}
                  <div className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400">Base Evacuation Fee (Vacuum Unit)</span>
                      <span className="font-mono font-semibold">₹{bill.baseFee.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400">Capacity Tier Surcharge</span>
                      <span className="font-mono font-semibold">₹{bill.capacitySurcharge.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400">Transit & Distance ({bill.distanceKm} km to Decant Bay)</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {bill.distanceSurcharge > 0 ? `+₹${bill.distanceSurcharge.toFixed(2)}` : 'FREE (≤ 15 km)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400">Narrow Alley Mini-Unit Add-on</span>
                      <span className="font-mono font-semibold">₹{bill.accessSurcharge.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-emerald-700 dark:text-emerald-300 font-semibold">
                      <span className="flex items-center gap-1">
                        <Award size={14} />
                        <span>SBM-G Rural Subsidy</span>
                      </span>
                      <span className="font-mono font-bold">-₹{bill.subsidy.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="mt-6 pt-4 bg-slate-50 dark:bg-[#061A28] p-4 rounded-xl flex items-center justify-between border border-slate-200/60 dark:border-white/10">
                    <div>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Net Payable to Operator
                      </span>
                      <span className="font-display font-extrabold text-2xl sm:text-3xl text-teal-600 dark:text-teal-400">
                        ₹{bill.netTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                        Zero Cash Overage
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <Link
                    to="/book"
                    className="w-full py-3 px-4 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-clean-md flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <CheckCircle size={18} />
                    <span>Proceed with Official Booking</span>
                  </Link>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Gazette Notification No. CG-SBMG-2024-T09 downloaded.');
                    }}
                    className="w-full py-2 px-4 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    <span>Download Notified Tariff Gazette Schedule (PDF)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE FLEET LOCATOR & CLUSTER MAP PREVIEW (GIS RADAR) */}
        <section className="w-full bg-slate-100/70 dark:bg-[#041421] py-14 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80 dark:border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  <Radar size={16} />
                  <span>AIS-140 Automated Fleet Monitoring</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Decanting Cluster Proximity & GIS Radar
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  Live telemetry of active suction tankers, registered co-treatment reception nodes, and the statutory 300-metre river zero-discharge buffers.
                </p>
              </div>

              {/* Filter Toggle Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Active Units (342)' },
                  { id: 'fstp', label: 'FSTP Reception Nodes (38)' },
                  { id: 'buffer', label: 'River Buffer Corridors' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMapFilter(f.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${mapFilter === f.id
                      ? 'bg-teal-600 text-white shadow-teal-500/25'
                      : 'bg-white dark:bg-[#0B2032] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map + Reception Facility Sidecar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* GIS Map Preview Container (8 cols) */}
              <div className="lg:col-span-8 relative bg-white dark:bg-[#072238] rounded-2xl shadow-clean-md border border-slate-200/80 dark:border-white/10 overflow-hidden min-h-[420px] flex flex-col">
                {/* Simulated Interactive Map Visual Area */}
                <div className="relative w-full flex-1 bg-slate-200/60 dark:bg-[#061A28] overflow-hidden">
                  {/* Map Top Overlay Telemetry Chips */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white font-mono text-[10px] backdrop-blur shadow-sm">
                      REGION: DURG-PATAN CLUSTER
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold shadow-sm">
                      3 ACTIVE VEHICLES IN 10 KM
                    </span>
                  </div>

                  {/* Stylized River Corridor & Buffer */}
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 800 500">
                      {/* River Path */}
                      <path d="M 120 -20 C 200 180, 240 280, 480 320 C 650 350, 720 480, 790 520" stroke="#0284C7" strokeLinecap="round" strokeWidth="28" />
                      {/* 300m Zero Discharge Buffer Zone */}
                      <path d="M 120 -20 C 200 180, 240 280, 480 320 C 650 350, 720 480, 790 520" stroke="#DC2626" strokeLinecap="round" strokeOpacity="0.2" strokeWidth="80" />
                      {/* Village Settlement Clusters */}
                      <circle cx="210" cy="120" fill="#E2E8F0" r="18" stroke="#94A3B8" strokeWidth="2" className="dark:fill-slate-800 dark:stroke-slate-700" />
                      <text fill="#475569" fontFamily="Inter" fontSize="10" textAnchor="middle" x="210" y="150" className="dark:fill-slate-300">Jamgaon (R)</text>

                      <circle cx="340" cy="220" fill="#E2E8F0" r="16" stroke="#94A3B8" strokeWidth="2" className="dark:fill-slate-800 dark:stroke-slate-700" />
                      <text fill="#475569" fontFamily="Inter" fontSize="10" textAnchor="middle" x="340" y="250" className="dark:fill-slate-300">Selud GP</text>

                      <circle cx="620" cy="290" fill="#E2E8F0" r="22" stroke="#94A3B8" strokeWidth="2" className="dark:fill-slate-800 dark:stroke-slate-700" />
                      <text fill="#475569" fontFamily="Inter" fontSize="10" textAnchor="middle" x="620" y="325" className="dark:fill-slate-300">Patan Nagar</text>
                    </svg>
                  </div>

                  {/* Vehicle 1: Active Moving Unit */}
                  <div className="absolute top-[28%] left-[32%] z-20 flex flex-col items-center cursor-pointer group">
                    <div className="px-2.5 py-0.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[10px] font-bold rounded shadow-clean group-hover:scale-105 transition-transform border border-slate-200 dark:border-white/10">
                      CG-07-TR-9941 (32 km/h)
                    </div>
                    <div className="relative w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg mt-1 ring-2 ring-teal-400/40">
                      <Truck size={16} />
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                    </div>
                  </div>

                  {/* Vehicle 2: Suction in progress */}
                  <div className="absolute top-[55%] left-[22%] z-20 flex flex-col items-center cursor-pointer group">
                    <div className="px-2.5 py-0.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[10px] font-bold rounded shadow-clean border border-slate-200 dark:border-white/10">
                      CG-07-E-4192 (Suctioning)
                    </div>
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md mt-1">
                      <Droplets size={14} />
                    </div>
                  </div>

                  {/* FSTP Node Marker */}
                  <div className="absolute top-[62%] left-[74%] z-20 flex flex-col items-center cursor-pointer">
                    <div className="px-3 py-1 bg-teal-700 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1.5">
                      <Factory size={13} />
                      <span>Patan Cluster FSTP</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-400/30 mt-1">
                      <Building size={18} />
                    </div>
                  </div>

                  {/* Buffer Warning Floating Alert */}
                  <div className="absolute bottom-4 right-4 z-20 bg-white/95 dark:bg-[#0B2032]/95 backdrop-blur rounded-xl p-3 shadow-clean-md flex items-center gap-2.5 max-w-xs text-xs border border-rose-200 dark:border-rose-500/30">
                    <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
                    <span className="text-[11px] leading-tight text-slate-800 dark:text-slate-200">
                      <strong>Kharun River 300m Buffer:</strong> Zero-Discharge geofence active. Any dump event triggers instant FIR alert.
                    </span>
                  </div>
                </div>

                {/* Bottom Control Bar */}
                <div className="p-3 bg-slate-50 dark:bg-[#0B2032] flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono border-t border-slate-200/60 dark:border-white/10 flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span> Active In-Transit</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span> At Household</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> FSTP Decant Point</span>
                  </div>
                  <span>AIS-140 GPS ACCURACY: ±3.8M</span>
                </div>
              </div>

              {/* Right: 3 Nearest FSTP / Co-treatment Nodes (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Reception Facilities</h3>
                  <Link to="/fstps" className="font-mono text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline">
                    Live Intake
                  </Link>
                </div>

                {/* Card 1: Patan FSTP */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#072238] shadow-clean border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold tracking-wide">
                        Rural Standalone FSTP
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Patan Cluster FSTP</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">25 KLD Capacity • Thermal Drying Beds</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      72% LOAD
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Intake Today: 18,000 L</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Decant Bays Free: 2</span>
                  </div>
                </div>

                {/* Card 2: Abhanpur Solar FSTP */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#072238] shadow-clean border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-sky-700 dark:text-sky-400 uppercase font-bold tracking-wide">
                        Solar Pyrolysis Model
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Abhanpur Cluster FSTP</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">15 KLD Capacity • Bio-char unit</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                      88% PEAK
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Intake Today: 13,200 L</span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">Decant Bays Free: 1</span>
                  </div>
                </div>

                {/* Card 3: Bhilai Municipal STP Plug-in */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#072238] shadow-clean border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-teal-700 dark:text-teal-400 uppercase font-bold tracking-wide">
                        Urban-Rural Plug-in Co-Treatment
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Bhilai Municipal STP (Rural Bay)</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">80 KLD Reserved Intake • SBR Technology</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono text-[10px] font-bold">
                      45% OPTIMAL
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Intake Today: 36,000 L</span>
                    <span className="text-sky-700 dark:text-sky-300 font-semibold">Decant Bays Free: 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: LIVE STATE-WIDE GOVERNANCE KPIS (SBM-G / NUDM METRICS) */}
        <section className="w-full bg-[#FAF8FF] dark:bg-cg-navy py-14 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80 dark:border-white/10" id="state-kpis">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider">
                  <TrendingUp size={16} />
                  <span>Real-Time State Telemetry Dashboard</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Chhattisgarh Rural FSSM Scorecard
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                  Live verifiable data streamed from 33 districts. Audited according to National Urban-Rural Digital Mission and Swachh Bharat Grameen guidelines.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-[#072238] px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LAST FLUSH: <strong className="text-slate-900 dark:text-white">30 SECONDS AGO</strong></span>
              </div>
            </div>

            {/* 4 KPI Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPI 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-xs uppercase tracking-wider">Pits Evacuated</span>
                  <CheckCircle size={20} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">14,820</span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <TrendingUp size={14} />
                    <span>+18.4% this quarter</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-xs uppercase tracking-wider">Sludge Decanted</span>
                  <Droplets size={20} className="text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                    42,650 <span className="text-base font-normal text-slate-500 dark:text-slate-400">KL</span>
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Recycle size={14} />
                    <span>BOD reduced by 98.6%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-xs uppercase tracking-wider">Monitored Fleet</span>
                  <Truck size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                    342 <span className="text-base font-normal text-slate-500 dark:text-slate-400">Units</span>
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    <Navigation size={14} />
                    <span>100% AIS-140 GPS Active</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-xs uppercase tracking-wider">Zero-Dump Compliance</span>
                  <ShieldCheck size={20} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-3xl text-teal-600 dark:text-teal-400">99.42%</span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle size={14} />
                    <span>0 Illegal Dumps in 72h</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '99.4%' }}></div>
                </div>
              </div>
            </div>

            {/* District Performance Ranking Summary Table */}
            <div className="w-full bg-white dark:bg-[#072238] rounded-2xl shadow-clean-md border border-slate-200/80 dark:border-white/10 p-6 lg:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Top District Compliance League</h3>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">SBM-G Star Rating Criteria</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#061A28] text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-lg">District</th>
                      <th className="py-3 px-4">Panchayats Enrolled</th>
                      <th className="py-3 px-4">Active Fleet</th>
                      <th className="py-3 px-4">Safe Decant Rate</th>
                      <th className="py-3 px-4">Citizen Rating</th>
                      <th className="py-3 px-4 rounded-r-lg">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {[
                      { rank: 1, dist: 'Durg', gps: '387 / 387 (100%)', fleet: '42 Units', rate: '99.8%', score: '4.92 / 5.0', badge: 'ODF++ AUDITED', color: 'emerald' },
                      { rank: 2, dist: 'Raipur', gps: '410 / 410 (100%)', fleet: '56 Units', rate: '99.4%', score: '4.88 / 5.0', badge: 'ODF++ AUDITED', color: 'emerald' },
                      { rank: 3, dist: 'Bilaspur', gps: '492 / 492 (100%)', fleet: '38 Units', rate: '98.9%', score: '4.81 / 5.0', badge: 'VERIFIED', color: 'teal' },
                      { rank: 4, dist: 'Rajnandgaon', gps: '398 / 398 (100%)', fleet: '29 Units', rate: '98.7%', score: '4.76 / 5.0', badge: 'VERIFIED', color: 'teal' },
                      { rank: 5, dist: 'Bastar', gps: '382 / 382 (100%)', fleet: '24 Units', rate: '98.2%', score: '4.74 / 5.0', badge: 'VERIFIED', color: 'teal' },
                    ].map((row) => (
                      <tr key={row.rank} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 flex items-center justify-center font-mono text-[10px]">
                            {row.rank}
                          </span>
                          <span>{row.dist}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{row.gps}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{row.fleet}</td>
                        <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{row.rate}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{row.score}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${row.badge === 'ODF++ AUDITED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                            }`}>
                            {row.badge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: URBAN-RURAL "PLUG-IN" CO-TREATMENT ARCHITECTURE */}
        <section className="w-full bg-slate-100/70 dark:bg-[#041421] py-14 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80 dark:border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider">
                <Building size={16} />
                <span>Inter-Municipal Convergence Framework</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                The Urban-Rural Plug-in Architecture
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Rather than constructing redundant mini-treatment plants in peri-urban villages, Gram Panchayats within 20 km of Urban Local Bodies (ULBs) plug directly into under-utilized municipal STPs saving public capital.
              </p>
            </div>

            {/* Architectural 3-Column Diagram Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Truck size={24} />
                  </div>
                  <span className="font-mono text-xs text-teal-700 dark:text-teal-400 font-bold">
                    STAGE 01 • GRAM PANCHAYAT
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Peri-Urban Village Cluster</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    GP fleets pool demand from 6-8 neighbouring hamlets. Suction units are dispatched with synchronized schedules to minimize fuel expenditure per cubic meter of evacuated sludge.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#061A28] rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                  • Haul radius capped at 20 km<br />
                  • Zero plant land acquisition needed
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <FileText size={24} />
                  </div>
                  <span className="font-mono text-xs text-sky-700 dark:text-sky-400 font-bold">
                    STAGE 02 • INSTITUTIONAL
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">ULB-Panchayat Service Compact</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    Standardized Memorandums of Understanding (MoUs) establish predetermined decanting tipping fees (₹150/tanker) directly settled through digital treasury accounts without cash handling.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#061A28] rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                  • Digital manifests via QR handshake<br />
                  • ₹14.8 Cr capital outlay eliminated
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#072238] shadow-clean-md border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Droplets size={24} />
                  </div>
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    STAGE 03 • RECEPTION STP
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Decant Bay & Co-Digestion</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    Sludge enters dedicated grit chambers and equalization bays, balancing organic loading into the municipal activated sludge process while producing bio-gas and enriched compost.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#061A28] rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                  • Treated effluent BOD &lt; 10 mg/L<br />
                  • Co-compost redistributed to farmers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: CITIZEN HELPLINE & FIELD SUPPORT DESK */}
        <section className="w-full bg-[#FAF8FF] dark:bg-cg-navy py-14 px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 text-white p-8 lg:p-12 shadow-clean-lg flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3.5 py-1 rounded-full text-xs font-mono font-semibold backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>State Swachhata Command & Control Center</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Need Assistance with Tank Emptying in Your Village?
              </h2>
              <p className="text-sm sm:text-base text-teal-50/90 leading-relaxed">
                Toll-free telephone bookings, WhatsApp bot assistance in Hindi and Chhattisgarhi, and on-ground help via your local Swachhagrahi / Panchayat Secretary.
              </p>
            </div>

            {/* Action Box */}
            <div className="bg-white dark:bg-[#072238] text-slate-900 dark:text-white p-6 rounded-2xl shadow-xl flex flex-col gap-4 w-full lg:w-96 shrink-0 border border-slate-200/60 dark:border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    State Toll-Free Helpline
                  </span>
                  <a href="tel:18002337266" className="font-display font-extrabold text-lg text-teal-600 dark:text-teal-400 hover:underline">
                    1800-233-7266
                  </a>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 border-t border-slate-100 dark:border-white/10">
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Operating Hours: 08:00 AM - 08:00 PM (Mon-Sat)</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-sky-600 dark:text-sky-400" />
                  <span>WhatsApp Assistant: +91 94252 00000</span>
                </p>
              </div>

              <Link
                to="/book"
                className="w-full py-2.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs text-center shadow-md transition-all hover:scale-[1.02]"
              >
                Book Desludging Online Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
