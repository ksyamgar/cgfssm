import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useFsm } from '../../context/FsmContext';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Calendar,
  Layers,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Factory,
  ZoomIn,
  Eye,
  X,
  HelpCircle
} from 'lucide-react';
import { LocationPicker } from '../../components/maps/LocationPicker';
import { findNearestFstp } from '../../services/locationService';
import { notifySuccess, notifyWarning, notifyInteractive } from '../../services/toastService';

// Technical visual guides for complicated containment and accessibility questions
const TECHNICAL_GUIDES = {
  tankType: {
    title: 'Containment Tank Type Guide',
    subtitle: 'सेप्टिक टैंक के प्रकार की पहचान',
    imageSrc: '/guides/septic_tank_guide.jpg',
    description: 'A conventional septic tank usually has 1 or 2 rectangular concrete access covers with a central baffle dividing two underground chambers. A leach pit is typically circular with precast concrete rings or brick lining that allows liquids to seep into the ground.',
    hindiTip: 'टैंक के ढक्कन को देखें: यदि दो आयताकार स्लैब हैं और बीच में दीवार है, तो यह Conventional Septic Tank है। यदि गोल रिंग वाला कुआं जैसा गड्ढा है, तो यह Leach Pit है।'
  },
  tankVolume: {
    title: 'Estimated Tank Capacity Guide',
    subtitle: 'परिवार के आकार के अनुसार टैंक क्षमता',
    imageSrc: '/guides/tank_capacity_guide.jpg',
    description: 'Standard sizing benchmark: Small households (3-4 members) usually have 1,500 Litres. Average families (5-6 members) have 2,500 Litres. Joint families, schools, or community toilets typically require 3,500 to 5,000 Litres.',
    hindiTip: 'परिवार में सदस्यों की संख्या देखें: 3-4 सदस्य = 1,500 लीटर (छोटा टैंक), 5-6 सदस्य = 2,500 लीटर (मानक पारिवारिक टैंक), 7+ सदस्य = 3,500-5,000 लीटर।'
  },
  roadWidth: {
    title: 'Approach Road Width Guide',
    subtitle: 'पहुंच मार्ग की चौड़ाई व वाहन चयन',
    imageSrc: '/guides/road_width_guide.jpg',
    description: 'Measure the narrowest passage or gully leading from the main road to your house gate. Lanes narrower than 3.5 meters cannot accommodate a heavy 4000L truck and will automatically be assigned an agile tractor-mounted suction unit.',
    hindiTip: 'अपने घर तक आने वाली गली का सबसे संकरा हिस्सा मापें। यदि रास्ता 3.5 मीटर से संकरा है, तो ट्रैक्टर माउंटेड मशीन भेजी जाएगी ताकि वाहन फंस न जाए।'
  },
  distanceFromRoad: {
    title: 'Distance from Road to Tank Guide',
    subtitle: 'सड़क से सेप्टिक टैंक तक पाइप की लंबाई',
    imageSrc: '/guides/hose_distance_guide.jpg',
    description: 'Measure the walking distance from where the desludging tanker will safely park on the village street across your courtyard/gate to the tank manhole cover. Standard hose length carried on vehicle is 15 meters; longer distances require pipe joining.',
    hindiTip: 'सड़क के उस स्थान से जहां टैंकर खड़ा होगा, आंगन या घर के अंदर बने सेप्टिक टैंक के ढक्कन तक की दूरी मापें। 15 मीटर तक सामान्य पाइप पहुंचता है।'
  }
};

export const CitizenBookingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { createRequest, fstps } = useFsm();
  const { currentUser } = useAuth();

  const {
    districts,
    blocks,
    gramPanchayats,
    villages,
    selectedDistrict,
    selectedBlock,
    selectedGp,
    selectedVillage,
    handleDistrictChange,
    handleBlockChange,
    handleGpChange,
    handleVillageChange
  } = useGeoScope();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeGuideModal, setActiveGuideModal] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    citizenName: currentUser?.name || 'Bhupendra Chandrakar',
    citizenPhone: currentUser?.phone || '9826198765',
    district: selectedDistrict || 'Raipur (378)',
    block: selectedBlock || 'Dharsiwa (3836)',
    gp: selectedGp || 'Mandir Hasaud (124805)',
    village: selectedVillage || 'Mandir Hasaud (444102)',
    habitation: 'Near Primary School, Ward 02',
    latitude: 21.2385,
    longitude: 81.7120,
    isEmergency: false,
    scheduledDate: new Date().toISOString().split('T')[0],
    tankType: 'CONVENTIONAL_TWO_CHAMBER',
    tankVolumeLitres: 3000,
    roadWidthMeters: 4.0,
    distanceFromRoadMeters: 15,
    paymentMethod: 'UPI'
  });

  const [createdRequestResult, setCreatedRequestResult] = useState(null);

  // Compute nearest FSTP in real-time based on pinned GPS location
  const nearestFstp = findNearestFstp(formData.latitude, formData.longitude, fstps);

  // Dynamic price calculation
  const calculatePrice = () => {
    const base = 800;
    const estDistanceKm = nearestFstp?.distanceKm ? Math.max(1, Math.round(nearestFstp.distanceKm)) : 8;
    const ratePerKm = 25;
    const tankMultiplier =
      formData.tankVolumeLitres <= 1500
        ? 1.0
        : formData.tankVolumeLitres <= 3000
        ? 1.2
        : formData.tankVolumeLitres <= 5000
        ? 1.5
        : 2.0;
    const emergencyMult = formData.isEmergency ? 1.25 : 1.0;
    const gpFee = 100;

    const total = Math.round(((base + estDistanceKm * ratePerKm) * tankMultiplier + gpFee) * emergencyMult);
    return total;
  };

  const estimatedPrice = calculatePrice();
  const suggestedVehicle = formData.roadWidthMeters < 3.5 ? 'TRACTOR_MOUNTED_UNIT' : 'HEAVY_VACUUM_TRUCK';

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.citizenName || !formData.citizenPhone) {
        notifyWarning('Please provide applicant name and contact phone number.', 'Missing Information');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async () => {
    const payload = {
      ...formData,
      district: selectedDistrict || formData.district,
      block: selectedBlock || formData.block,
      gp: selectedGp || formData.gp,
      village: selectedVillage || formData.village,
      estimatedCost: estimatedPrice,
      latitude: formData.latitude,
      longitude: formData.longitude,
      targetFstpId: nearestFstp?.id || null,
      targetFstpName: nearestFstp?.name || null,
      distanceToFstpKm: nearestFstp?.distanceKm || null
    };

    const res = await createRequest(payload);
    setCreatedRequestResult(res);
    setCurrentStep(5);

    notifyInteractive({
      title: `🎉 Booking Request Placed! #${res.requestNo}`,
      message: `Assigned to nearest plant: ${nearestFstp?.name || 'Local Facility'} (${nearestFstp?.distanceKm || 8} km away). Estimated cost: ₹${estimatedPrice}.`,
      actionLabel: 'View in Ledger',
      onAction: () => navigate('/app/requests'),
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1 w-full">
        {/* Wizard Title */}
        <div className="text-center space-y-2">
          <DataTag color="teal">CITIZEN SERVICE PORTAL</DataTag>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            Book Desludging Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Quick 5-step verified booking for rural households & Gram Panchayats in Chhattisgarh
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-5 gap-1.5 p-1.5 rounded-2xl glass-panel shadow-clean">
          {[
            { step: 1, label: t('step_location'), icon: MapPin },
            { step: 2, label: t('step_schedule'), icon: Calendar },
            { step: 3, label: t('step_tank'), icon: Layers },
            { step: 4, label: t('step_pricing'), icon: IndianRupee },
            { step: 5, label: t('step_confirmation'), icon: CheckCircle2 }
          ].map((item) => {
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className={`py-2 px-1 text-center rounded-xl transition-all flex flex-col items-center gap-1 ${
                  isCurrent
                    ? 'bg-teal-600 text-white font-bold shadow-clean-md'
                    : isDone
                    ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10 font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon size={16} />
                <span className="text-[11px] truncate hidden sm:inline">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Location & Applicant */}
        {currentStep === 1 && (
          <GlassCard title="1. Select Village & Household Location" moduleTag="LGD HIERARCHY">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Applicant Name</label>
                  <input
                    type="text"
                    value={formData.citizenName}
                    onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Mobile Number (SMS OTP)</label>
                  <input
                    type="text"
                    value={formData.citizenPhone}
                    onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Cascading LGD Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">District (जिला)</label>
                  <select
                    value={selectedDistrict || formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Block (विकासखंड)</label>
                  <select
                    value={selectedBlock || formData.block}
                    onChange={(e) => handleBlockChange(e.target.value)}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  >
                    <option value="">Select Block</option>
                    {blocks.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Gram Panchayat (ग्राम पंचायत)</label>
                  <select
                    value={selectedGp || formData.gp}
                    onChange={(e) => handleGpChange(e.target.value)}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  >
                    <option value="">Select Gram Panchayat</option>
                    {gramPanchayats.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Village / Basti (ग्राम / पारा)</label>
                  <select
                    value={selectedVillage || formData.village}
                    onChange={(e) => {
                      handleVillageChange(e.target.value);
                      setFormData({ ...formData, village: e.target.value });
                    }}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  >
                    <option value="">Select Village</option>
                    {villages.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">House / Habitation / Landmark</label>
                <input
                  type="text"
                  value={formData.habitation}
                  onChange={(e) => setFormData({ ...formData, habitation: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  placeholder="e.g. Near Panchayat Bhavan / Ward 04"
                />
              </div>

              {/* Interactive GPS Location Pin Dropper on Map */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <LocationPicker
                  lat={formData.latitude}
                  lng={formData.longitude}
                  district={selectedDistrict || formData.district}
                  fstps={fstps}
                  onLocationChange={(newLat, newLng) =>
                    setFormData((prev) => ({ ...prev, latitude: newLat, longitude: newLng }))
                  }
                  label="Pin Exact Household GPS Location on Map"
                  height="260px"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-1.5"
                >
                  <span>Next: Schedule & Type</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Step 2: Schedule & Urgency */}
        {currentStep === 2 && (
          <GlassCard title="2. Desludging Urgency & Schedule" moduleTag="SERVICE PRIORITY">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Scheduled Card */}
                <div
                  onClick={() => setFormData({ ...formData, isEmergency: false })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    !formData.isEmergency
                      ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/30 shadow-clean-md'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Standard Desludging</span>
                    <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">SLA: 48h</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Periodic desludging as per 3-year recommended cycle. Standard GP tariff applies.
                  </p>
                </div>

                {/* Emergency Overflow Card */}
                <div
                  onClick={() => setFormData({ ...formData, isEmergency: true })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.isEmergency
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-red-950/30 shadow-clean-md'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle size={15} />
                      <span>Emergency Overflow</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">SLA: 6h Priority</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Septic tank actively overflowing or backflowing into toilets. Fast-track vehicle dispatch.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Preferred Service Date</label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-1.5"
                >
                  <span>Next: Tank & Road Access</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Step 3: Tank Details & Road Access */}
        {currentStep === 3 && (
          <GlassCard title="3. Containment Structure & Site Accessibility" moduleTag="TECHNICAL ESTIMATOR">
            <div className="space-y-5">
              {/* Educational Banner */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-500/20 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                <Sparkles size={16} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Visual Assistance Guide: </span>
                  <span>
                    Tap any photo below to zoom in and see visual examples for your septic tank type, family size capacity, approach road width, and suction hose distance.
                  </span>
                  <span className="block mt-0.5 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                    (तकनीकी सवालों को समझने के लिए नीचे दिए चित्रों पर टैप करें)
                  </span>
                </div>
              </div>

              {/* 4 Complicated Questions with Visual Aids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                
                {/* 1. Containment Tank Type */}
                <div className="bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <span>Containment Tank Type</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal hidden sm:inline">(टैंक प्रकार)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.tankType)}
                        className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Eye size={12} />
                        <span>Guide / फोटो</span>
                      </button>
                    </div>

                    {/* Image Preview Thumbnail */}
                    <div
                      onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.tankType)}
                      className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 mb-3 bg-slate-900 aspect-[16/9] sm:h-32 w-full"
                    >
                      <img
                        src={TECHNICAL_GUIDES.tankType.imageSrc}
                        alt={TECHNICAL_GUIDES.tankType.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-2">
                        <span className="text-[11px] font-medium text-white/95 truncate">
                          2-Chamber vs Leach Pit
                        </span>
                        <span className="text-[10px] font-bold text-white bg-teal-600/90 hover:bg-teal-500 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-sm shrink-0">
                          <ZoomIn size={11} />
                          <span>Zoom</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <select
                      value={formData.tankType}
                      onChange={(e) => setFormData({ ...formData, tankType: e.target.value })}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600 transition-colors"
                    >
                      <option value="CONVENTIONAL_TWO_CHAMBER">Conventional 2-Chamber Septic Tank</option>
                      <option value="CIRCULAR_PIT">Single Circular Leach Pit</option>
                      <option value="TWIN_LEACH_PIT">Twin Leach Pit (SBM-G)</option>
                      <option value="CONTAINMENT_BOX">Masonry Holding Tank</option>
                    </select>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                      <span>Concrete cover vs circular soak pit</span>
                    </p>
                  </div>
                </div>

                {/* 2. Estimated Tank Capacity */}
                <div className="bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <span>Estimated Tank Capacity</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal hidden sm:inline">(क्षमता लीटर में)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.tankVolume)}
                        className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Eye size={12} />
                        <span>Guide / फोटो</span>
                      </button>
                    </div>

                    {/* Image Preview Thumbnail */}
                    <div
                      onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.tankVolume)}
                      className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 mb-3 bg-slate-900 aspect-[16/9] sm:h-32 w-full"
                    >
                      <img
                        src={TECHNICAL_GUIDES.tankVolume.imageSrc}
                        alt={TECHNICAL_GUIDES.tankVolume.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-2">
                        <span className="text-[11px] font-medium text-white/95 truncate">
                          Family Size Sizing Chart
                        </span>
                        <span className="text-[10px] font-bold text-white bg-teal-600/90 hover:bg-teal-500 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-sm shrink-0">
                          <ZoomIn size={11} />
                          <span>Zoom</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <select
                      value={formData.tankVolumeLitres}
                      onChange={(e) => setFormData({ ...formData, tankVolumeLitres: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600 transition-colors"
                    >
                      <option value={1500}>1,500 Litres (Small household 3-4 users)</option>
                      <option value={2500}>2,500 Litres (Standard family 5-6 users)</option>
                      <option value={3500}>3,500 Litres (Large joint family / School)</option>
                      <option value={5000}>5,000 Litres (Commercial / Community)</option>
                    </select>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                      <span>Standard family of 5-6 typically uses 2,500 Litres</span>
                    </p>
                  </div>
                </div>

                {/* 3. Approach Road Width */}
                <div className="bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <span>Approach Road Width (Meters)</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal hidden sm:inline">(रास्ते की चौड़ाई)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.roadWidth)}
                        className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Eye size={12} />
                        <span>Guide / फोटो</span>
                      </button>
                    </div>

                    {/* Image Preview Thumbnail */}
                    <div
                      onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.roadWidth)}
                      className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 mb-3 bg-slate-900 aspect-[16/9] sm:h-32 w-full"
                    >
                      <img
                        src={TECHNICAL_GUIDES.roadWidth.imageSrc}
                        alt={TECHNICAL_GUIDES.roadWidth.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-2">
                        <span className="text-[11px] font-medium text-white/95 truncate">
                          Tractor (&lt;3.5m) vs Truck (&gt;3.5m)
                        </span>
                        <span className="text-[10px] font-bold text-white bg-teal-600/90 hover:bg-teal-500 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-sm shrink-0">
                          <ZoomIn size={11} />
                          <span>Zoom</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={formData.roadWidthMeters}
                        onChange={(e) => setFormData({ ...formData, roadWidthMeters: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600 transition-colors"
                      />
                      <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">m</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                      <span>If &lt; 3.5m, mini-tractor unit will be automatically allocated</span>
                    </p>
                  </div>
                </div>

                {/* 4. Distance from Road to Tank */}
                <div className="bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-teal-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <span>Distance to Tank (Meters)</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal hidden sm:inline">(सड़क से दूरी)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.distanceFromRoad)}
                        className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Eye size={12} />
                        <span>Guide / फोटो</span>
                      </button>
                    </div>

                    {/* Image Preview Thumbnail */}
                    <div
                      onClick={() => setActiveGuideModal(TECHNICAL_GUIDES.distanceFromRoad)}
                      className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 mb-3 bg-slate-900 aspect-[16/9] sm:h-32 w-full"
                    >
                      <img
                        src={TECHNICAL_GUIDES.distanceFromRoad.imageSrc}
                        alt={TECHNICAL_GUIDES.distanceFromRoad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-2">
                        <span className="text-[11px] font-medium text-white/95 truncate">
                          Suction Pipe Hose Length
                        </span>
                        <span className="text-[10px] font-bold text-white bg-teal-600/90 hover:bg-teal-500 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-sm shrink-0">
                          <ZoomIn size={11} />
                          <span>Zoom</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.distanceFromRoadMeters}
                        onChange={(e) => setFormData({ ...formData, distanceFromRoadMeters: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600 transition-colors"
                      />
                      <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">m</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                      <span>Walking distance from parking truck to septic tank manhole</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Recommended Fleet Allocation Chip */}
              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 flex items-center gap-3">
                <Truck className="text-teal-700 dark:text-teal-300 shrink-0" size={24} />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">Suggested Dispatch Unit: </span>
                  <strong className="text-teal-700 dark:text-teal-300 font-mono font-bold">{suggestedVehicle}</strong>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                    Automatic vehicle match based on lane width ({formData.roadWidthMeters}m) and tank capacity ({formData.tankVolumeLitres} L).
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-1.5"
                >
                  <span>Next: Pricing & Payment</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Step 4: Pricing & Quote */}
        {currentStep === 4 && (
          <GlassCard title="4. Transparent GP Tariff & Nearest Facility Routing" moduleTag="PRICING & ROUTING">
            <div className="space-y-5">
              {/* Nearest FSTP Routing Banner */}
              {nearestFstp && (
                <div className="p-3.5 rounded-2xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                      <Factory size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300">AUTO-ASSIGNED DISPOSAL FACILITY</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{nearestFstp.name}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-teal-700 dark:text-teal-400 font-bold">{nearestFstp.distanceKm} km away</span>
                    <div className="text-[10px] text-slate-500">{nearestFstp.type} ({nearestFstp.capacityKLD} KLD)</div>
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Desludging Tariff (up to 5 km)</span>
                  <span>₹800.00</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Distance Haul Surcharge ({nearestFstp?.distanceKm || 8} km to FSTP)</span>
                  <span>₹{Math.max(0, Math.round(((nearestFstp?.distanceKm || 8) - 5) * 25))}.00</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Tank Capacity Multiplier ({formData.tankVolumeLitres} L)</span>
                  <span>+ ₹{formData.tankVolumeLitres > 3000 ? 400 : 225}.00</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Gram Panchayat Admin & Sanitation Cess</span>
                  <span>₹100.00</span>
                </div>
                {formData.isEmergency && (
                  <div className="flex justify-between text-rose-700 dark:text-rose-400 font-bold">
                    <span>Emergency Expedited Surcharge (25%)</span>
                    <span>+ ₹{Math.round(estimatedPrice * 0.2)}.00</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between text-base font-bold text-slate-900 dark:text-white">
                  <span>Total Calculated Tariff</span>
                  <span className="text-teal-700 dark:text-teal-400 text-xl font-display font-extrabold">₹{estimatedPrice}.00</span>
                </div>
              </div>

              {/* Payment Mode Choice */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Preferred Payment Option</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2 ${
                      formData.paymentMethod === 'UPI'
                        ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>UPI (Paytm / PhonePe / GPay)</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2 ${
                      formData.paymentMethod === 'CASH'
                        ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      checked={formData.paymentMethod === 'CASH'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'CASH' })}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Cash on Service Completion</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm & Submit Request</span>
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Step 5: Instant Confirmation & Track */}
        {currentStep === 5 && createdRequestResult && (
          <div className="glass-panel rounded-2xl p-8 border border-teal-500 text-center space-y-6 animate-in fade-in shadow-clean-lg">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-clean">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <DataTag color="green">REQUEST LOGGED SUCCESSFULLY</DataTag>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                Desludging Service Scheduled
              </h2>
              <div className="font-mono text-sm text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-white/5 inline-block px-4 py-1.5 rounded-full border border-teal-200 dark:border-white/10">
                {createdRequestResult.requestNo}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                An SMS confirmation with tracking URL has been sent to {createdRequestResult.citizenPhone}. Gram Panchayat & Vendor will dispatch the vehicle shortly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>VILLAGE: <strong className="text-slate-900 dark:text-white">{createdRequestResult.village}</strong></div>
              <div>GPS LOCATION: <strong className="text-slate-900 dark:text-white">{createdRequestResult.latitude}, {createdRequestResult.longitude}</strong></div>
              {createdRequestResult.targetFstpName && (
                <div>TARGET FSTP: <strong className="text-purple-700 dark:text-purple-300">{createdRequestResult.targetFstpName} ({createdRequestResult.distanceToFstpKm} km)</strong></div>
              )}
              <div>DATE: <strong className="text-slate-900 dark:text-white">{createdRequestResult.scheduledDate}</strong></div>
              <div>ESTIMATED TARIFF: <strong className="text-teal-700 dark:text-teal-400">₹{createdRequestResult.estimatedCost}</strong></div>
              <div>PAYMENT: <span className="text-sky-700 dark:text-sky-300 font-semibold">{createdRequestResult.paymentMethod}</span></div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/app/requests')}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md"
              >
                Track Live in Operations Portal
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setCreatedRequestResult(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-semibold"
              >
                Book Another Household
              </button>
            </div>
          </div>
        )}

        {/* Technical Guide Lightbox Zoom Modal */}
        {activeGuideModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setActiveGuideModal(null)}
          >
            <div
              className="bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-white/20 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-white/10 shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {activeGuideModal.title}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    {activeGuideModal.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveGuideModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close guide"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {/* Full Visual Guide Image */}
                <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 flex items-center justify-center">
                  <img
                    src={activeGuideModal.imageSrc}
                    alt={activeGuideModal.title}
                    className="w-full max-h-[280px] sm:max-h-[340px] object-contain rounded-lg"
                  />
                </div>

                {/* Practical Hindi Tip Box */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                  <HelpCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">सलाह / हिंदी निर्देश:</span>
                    <span className="leading-relaxed">{activeGuideModal.hindiTip}</span>
                  </div>
                </div>

                {/* Detailed English Description */}
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200/60 dark:border-white/5">
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1">Field Guideline:</span>
                  {activeGuideModal.description}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-4 sm:px-5 py-3 border-t border-slate-200 dark:border-white/10 shrink-0 bg-slate-50/50 dark:bg-white/[0.02] flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveGuideModal(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Got it / समझ गया
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
