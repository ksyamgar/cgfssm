import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import {
  FileText,
  Building2,
  Truck,
  CheckCircle2,
  Navigation,
  QrCode,
  ShieldCheck,
  Factory,
  Recycle,
  Sparkles,
  ArrowRight,
  Phone,
  UserCheck,
  Key,
  Layers,
  MapPin,
  Clock,
  Check,
  Droplets,
  AlertTriangle
} from 'lucide-react';

export const ProcessPage = () => {
  const { t, lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Citizen Request & Verification Token",
      hindiTitle: "नागरिक अनुरोध एवं डिजिटल टोकन",
      role: "Citizen / CSC VLE",
      roleBadge: "CITIZEN_INITIATED",
      icon: FileText,
      color: "teal",
      summary: "Households trigger desludging via web, mobile, or CSC center. An automated distance check and dynamic tariff are generated along with a unique 6-digit Household Verification Code.",
      details: [
        "Applicant selects Gram Panchayat, habitation, tank size, and approach lane width (<3.5m or >3.5m).",
        "System checks distance to nearest cluster FSTP and calculates locked government tariff.",
        "Generates SMS confirmation and cryptographic Handshake Code (OTP/QR) to secure right-household verification."
      ],
      qrInfo: "🔑 Citizen receives 6-digit Handshake Code to verify tanker arrival."
    },
    {
      step: 2,
      title: "FSTP & Fleet Dispatch Allocation",
      hindiTitle: "FSTP एवं वाहन/चालक आवंटन",
      role: "GP / FSTP Dispatcher",
      roleBadge: "DISPATCH_AUTHORITY",
      icon: Building2,
      color: "purple",
      summary: "The territorial operator assigns the optimal vacuum tanker (Rural or Urban unit) and assigns an available pilot from the vehicle's certified multi-driver roster.",
      details: [
        "System flags vehicle jurisdiction (🌾 Rural Gram Panchayat or 🏙️ Urban ULB Unit).",
        "Vehicle is assigned to the nearest treatment facility (Cluster FSTP or Urban STP).",
        "Trip request is routed to the designated pilot's digital terminal with trip manifest."
      ],
      qrInfo: "📋 Digital Trip Manifest generated with geofence destination."
    },
    {
      step: 3,
      title: "Driver Acceptance & Vehicle Ignition",
      hindiTitle: "चालक द्वारा स्वीकृति एवं वाहन प्रस्थान",
      role: "Certified Driver / Pilot",
      roleBadge: "DRIVER_OPERATION",
      icon: Truck,
      color: "sky",
      summary: "The assigned driver reviews trip details, confirms availability, and accepts the assignment. Live TraqIndia GPS telemetry tracks transit to the household.",
      details: [
        "Vehicle is staged and unlocked upon driver acceptance.",
        "Live GPS coordinates broadcast to citizen tracking portal (real-time ETA).",
        "Turn-by-turn navigation guides the pilot to the pinned household coordinates."
      ],
      qrInfo: "🛰️ Live GPS Telemetry stream active with TraqIndia hardware tracking."
    },
    {
      step: 4,
      title: "Right-House Handshake & Safe Suction",
      hindiTitle: "घरेलू कोड सत्यापन एवं सुरक्षित सफाई",
      role: "Driver & Swachhata Mitra",
      roleBadge: "ZERO_MANUAL_SCAVENGING",
      icon: ShieldCheck,
      color: "emerald",
      summary: "Before opening the tank, the driver enters the citizen's verification code to guarantee the right house. Workers complete a 5-point PPE safety check and execute mechanized suction.",
      details: [
        "Driver inputs or scans Citizen Verification Code — prevents servicing incorrect houses.",
        "Mandatory PPE verification (masks, boots, heavy gloves, goggles).",
        "100% mechanized vacuum suction into sealed tank; decanted volume logged."
      ],
      qrInfo: "✅ Dual Handshake confirmed: Right House + Right Tanker verified."
    },
    {
      step: 5,
      title: "Cluster FSTP Arrival & QR Decanting",
      hindiTitle: "FSTP संयंत्र आगमन एवं QR निस्तारण",
      role: "Treatment Plant Operator",
      roleBadge: "SCIENTIFIC_TREATMENT",
      icon: Factory,
      color: "violet",
      summary: "The vehicle arrives at the geofenced FSTP facility. The plant operator scans the driver's trip disposal QR code, checks sludge quality, and verifies decanted litres.",
      details: [
        "Plant geofence automatically validates vehicle entry (≤300m perimeter).",
        "FSTP Operator scans Driver Trip QR code to authorize decanting valve.",
        "Quality log recorded (pH, sludge volume, visual standard check)."
      ],
      qrInfo: "📱 Operator scans Driver Disposal QR: Authorizes safe intake valve."
    },
    {
      step: 6,
      title: "Circular Resource Recovery & Audit Close",
      hindiTitle: "जैविक खाद निर्माण एवं पूर्ण ऑडिट",
      role: "Auditor & Beneficiary",
      roleBadge: "CIRCULAR_ECONOMY",
      icon: Recycle,
      color: "amber",
      summary: "Treated septage is converted into solar-dried pathogen-free bio-solids (Sona Khad) and treated water. The citizen receives digital receipt and provides service rating.",
      details: [
        "Sludge undergoes drying beds and co-composting into rich organic fertilizer.",
        "Payment is settled digitally (UPI or Cash on Completion).",
        "Complete chain of custody sealed permanently in tamper-evident audit logs."
      ],
      qrInfo: "🏅 End-to-End Cryptographic Chain Sealed with 100% traceability."
    }
  ];

  const currentStepData = steps.find(s => s.step === activeStep) || steps[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs font-bold font-mono">
            <Sparkles size={14} />
            <span>END-TO-END FSSM VALUE CHAIN PROTOCOL</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            How the Entire Process Works
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            From household booking to scientific cluster plant treatment, every stage is validated with <strong>QR verification, multi-driver dispatch, live TraqIndia GPS, and dual-handshake security</strong> to ensure zero illegal dumping.
          </p>
        </div>

        {/* Step Progression Visual Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {steps.map((st) => {
            const isSelected = activeStep === st.step;
            const StepIcon = st.icon;

            return (
              <button
                key={st.step}
                onClick={() => setActiveStep(st.step)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-500 shadow-clean-md scale-[1.02]'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                  }`}>
                    STAGE 0{st.step}
                  </span>
                  <StepIcon size={16} />
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2">
                  {lang === 'hi' ? st.hindiTitle : st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Active Stage Showcase Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-clean-lg space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-transparent shrink-0">
                {React.createElement(currentStepData.icon, { size: 30 })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                    STAGE 0{currentStepData.step} OF 06
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {currentStepData.roleBadge}
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mt-0.5">
                  {lang === 'hi' ? currentStepData.hindiTitle : currentStepData.title}
                </h2>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 text-teal-900 dark:text-teal-200 text-xs font-mono font-semibold">
              Actor: <span className="font-bold underline">{currentStepData.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Description & Verification Rules */}
            <div className="lg:col-span-2 space-y-5">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {currentStepData.summary}
              </p>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Mandatory Execution Protocols:
                </h4>
                <div className="space-y-2">
                  {currentStepData.details.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code / Security Highlight Strip */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/40 text-purple-900 dark:text-purple-200 text-xs flex items-center gap-3">
                <QrCode size={22} className="shrink-0 text-purple-600 dark:text-purple-400" />
                <div className="font-mono font-medium">
                  <strong>Verification Guard: </strong>
                  <span>{currentStepData.qrInfo}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Visual Mockup Box */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-2">
                  Live System Handshake Preview
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
                    <span className="text-slate-500">Service Token:</span>
                    <strong className="text-slate-900 dark:text-white">#CG-D02-B07-GP11</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
                    <span className="text-slate-500">Vehicle Scope:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">🌾 Rural Sludge Unit</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
                    <span className="text-slate-500">Dual Handshake:</span>
                    <strong className="text-teal-600">6-Digit Code Verified</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">FSTP Destination:</span>
                    <strong className="text-purple-600 dark:text-purple-300">Arang Cluster FSTP</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-white disabled:opacity-40 font-semibold"
                >
                  Previous Stage
                </button>
                <button
                  disabled={activeStep === 6}
                  onClick={() => setActiveStep(prev => Math.min(6, prev + 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold disabled:opacity-40 flex items-center gap-1 shadow-sm"
                >
                  <span>Next Stage</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Value Chain Diagram & Quick Actions */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Ready to Book or Manage Desludging Services?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Access the self-service citizen booking portal or login as an authorized official.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Book Desludging Service</span>
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-white/10"
            >
              <span>Operator & Officer Login</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
