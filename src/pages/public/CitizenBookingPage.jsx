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
  ShieldCheck
} from 'lucide-react';

export const CitizenBookingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { createRequest } = useFsm();
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

  // Form State
  const [formData, setFormData] = useState({
    citizenName: currentUser?.name || 'Bhupendra Chandrakar',
    citizenPhone: currentUser?.phone || '9826198765',
    district: selectedDistrict || 'Raipur (378)',
    block: selectedBlock || 'Dharsiwa (3836)',
    gp: selectedGp || 'Mandir Hasaud (124805)',
    village: selectedVillage || 'Mandir Hasaud (444102)',
    habitation: 'Near Primary School, Ward 02',
    isEmergency: false,
    scheduledDate: new Date().toISOString().split('T')[0],
    tankType: 'CONVENTIONAL_TWO_CHAMBER',
    tankVolumeLitres: 3000,
    roadWidthMeters: 4.0,
    distanceFromRoadMeters: 15,
    paymentMethod: 'UPI'
  });

  const [createdRequestResult, setCreatedRequestResult] = useState(null);

  // Dynamic price calculation
  const calculatePrice = () => {
    const base = 800;
    const estDistanceKm = 8;
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
      estimatedCost: estimatedPrice
    };

    const res = await createRequest(payload);
    setCreatedRequestResult(res);
    setCurrentStep(5);
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Containment Tank Type</label>
                  <select
                    value={formData.tankType}
                    onChange={(e) => setFormData({ ...formData, tankType: e.target.value })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  >
                    <option value="CONVENTIONAL_TWO_CHAMBER">Conventional 2-Chamber Septic Tank</option>
                    <option value="CIRCULAR_PIT">Single Circular Leach Pit</option>
                    <option value="TWIN_LEACH_PIT">Twin Leach Pit (SBM-G)</option>
                    <option value="CONTAINMENT_BOX">Masonry Holding Tank</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                    Estimated Tank Capacity (Litres)
                  </label>
                  <select
                    value={formData.tankVolumeLitres}
                    onChange={(e) => setFormData({ ...formData, tankVolumeLitres: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  >
                    <option value={1500}>1,500 Litres (Small household 3-4 users)</option>
                    <option value={2500}>2,500 Litres (Standard family 5-6 users)</option>
                    <option value={3500}>3,500 Litres (Large joint family / School)</option>
                    <option value={5000}>5,000 Litres (Commercial / Community)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                    Approach Road Width (Meters)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.roadWidthMeters}
                    onChange={(e) => setFormData({ ...formData, roadWidthMeters: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  />
                  <span className="text-[11px] text-slate-500">If &lt; 3.5m, tractor mini-unit will be allocated</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                    Distance from Road to Tank (Meters)
                  </label>
                  <input
                    type="number"
                    value={formData.distanceFromRoadMeters}
                    onChange={(e) => setFormData({ ...formData, distanceFromRoadMeters: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  />
                  <span className="text-[11px] text-slate-500">Pipe length required for suction</span>
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
          <GlassCard title="4. Transparent GP Tariff Breakdown" moduleTag="PRICING ENGINE">
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Desludging Tariff (up to 5 km)</span>
                  <span>₹800.00</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Distance Haul Surcharge (approx 8 km)</span>
                  <span>₹75.00</span>
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

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-sm mx-auto text-left font-mono text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>VILLAGE: <strong className="text-slate-900 dark:text-white">{createdRequestResult.village}</strong></div>
              <div>DATE: <strong className="text-slate-900 dark:text-white">{createdRequestResult.scheduledDate}</strong></div>
              <div>ESTIMATED TARIFF: <strong className="text-teal-700 dark:text-teal-400">₹{createdRequestResult.estimatedCost}</strong></div>
              <div>PAYMENT: <span className="text-sky-700 dark:text-sky-300 font-semibold">{createdRequestResult.paymentMethod}</span></div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/app/requests')}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md"
              >
                Track Live in Control Room
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
      </main>

      <Footer />
    </div>
  );
};
