import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { DataTag } from '../../components/common/DataTag';
import { useAuth } from '../../context/AuthContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { LocationPicker } from '../../components/maps/LocationPicker';
import {
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Lock,
  Sparkles,
  KeyRound,
  RotateCcw,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { notifySuccess, notifyError, notifyInfo, notifyWarning } from '../../services/toastService';
import { CG_URBAN_BODIES } from '../../constants/urbanBodies';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { allRoles, registerUser, sendEmailOtp, verifyEmailOtp, loading } = useAuth();
  const {
    districts,
    blocks,
    gramPanchayats,
    villages,
    handleDistrictChange,
    handleBlockChange,
    handleGpChange,
    handleVillageChange
  } = useGeoScope();

  const [roleType, setRoleType] = useState('CITIZEN'); // CITIZEN, VENDOR_ADMIN, DRIVER, SANITATION_WORKER, FSTP_OPERATOR
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    areaType: 'RURAL', // DEFAULT: RURAL
    district: '',
    block: '',
    gp: '',
    village: '',
    ulb: CG_URBAN_BODIES[0],
    ward: '',
    locality: '',
    vehicleNo: '',
    companyName: '',
    latitude: 21.2514,
    longitude: 81.6296
  });

  // Email OTP state for Citizen verification
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');
  const [otpSending, setOtpSending] = useState(false);

  const [isSubmittedPending, setIsSubmittedPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpSent && otpTimer > 0 && !isEmailVerified) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer, isEmailVerified]);

  // Handle Send OTP
  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setOtpError('Please enter a valid email address first.');
      return;
    }
    setOtpError('');
    setOtpSending(true);

    const res = await sendEmailOtp(formData.email);
    setOtpSending(false);

    if (res.success) {
      setOtpSent(true);
      setDemoOtp(res.otp);
      setOtpTimer(60);
      notifyInfo(`Verification OTP sent to ${formData.email} (Demo OTP: ${res.otp})`, 'OTP Dispatched');
    } else {
      const err = res.message || 'Failed to dispatch verification code.';
      setOtpError(err);
      notifyError(err, 'Dispatch Failed');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = () => {
    if (!inputOtp || inputOtp.length < 4) {
      setOtpError('Please enter the 6-digit verification code.');
      notifyWarning('Please enter the complete 6-digit verification code.', 'Incomplete Code');
      return;
    }

    const res = verifyEmailOtp(formData.email, inputOtp);
    if (res.success) {
      setIsEmailVerified(true);
      setOtpError('');
      notifySuccess('Email address verified successfully!', 'Verified');
    } else {
      const err = res.message || 'Invalid verification code.';
      setOtpError(err);
      notifyError(err, 'Verification Failed');
    }
  };

  // Quick autofill OTP in demo
  const handleQuickFillOtp = () => {
    if (demoOtp) {
      setInputOtp(demoOtp);
      const res = verifyEmailOtp(formData.email, demoOtp);
      if (res.success) {
        setIsEmailVerified(true);
        setOtpError('');
        notifySuccess('Demo OTP autofilled and verified successfully!', 'Verified');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // If citizen, require email OTP verification
    if (roleType === 'CITIZEN' && !isEmailVerified) {
      const err = 'Please verify your email address via OTP before proceeding.';
      setErrorMsg(err);
      notifyWarning(err, 'Verification Required');
      return;
    }

    const payload = {
      ...formData,
      role: roleType,
      password: formData.password || `${formData.phone.slice(-4)}@Fssm2026`
    };

    const res = await registerUser(payload);
    if (res?.success) {
      if (roleType === 'CITIZEN') {
        notifySuccess('Citizen registration successful! Redirecting to booking wizard...', 'Registered');
        navigate('/book');
      } else {
        notifySuccess(`Registration application for ${roleType} submitted for District approval!`, 'Application Submitted');
        setIsSubmittedPending(true);
      }
    } else {
      const err = res?.message || 'Registration failed. Please check your details.';
      setErrorMsg(err);
      notifyError(err, 'Registration Error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-10 flex-1 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-clean border border-teal-200 dark:border-transparent">
            <UserPlus size={26} />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            Register for CG Rural FSSM Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Citizen self-service or Operator/Vendor enrollment (subject to District approval)
          </p>
        </div>

        {isSubmittedPending ? (
          <div className="glass-panel rounded-2xl p-8 border border-teal-500 text-center space-y-4 animate-in fade-in shadow-clean-lg">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-transparent">
              <CheckCircle2 size={36} />
            </div>
            <DataTag color="amber">ACCOUNT PENDING VERIFICATION</DataTag>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Application Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-sm mx-auto">
              Your registration as <strong>{roleType}</strong> has been routed to the District Coordinator for document & KYC verification. You will receive an SMS upon approval.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md inline-block"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-white/15 shadow-clean-lg">
            {/* Persona Type Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                Select Registration Category
              </label>
              <select
                value={roleType}
                onChange={(e) => {
                  setRoleType(e.target.value);
                  setIsEmailVerified(false);
                  setOtpSent(false);
                }}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600 font-semibold"
              >
                <option value="CITIZEN">Citizen / Rural Beneficiary (Instant Access via Email OTP)</option>
                <option value="VENDOR_ADMIN">Private Sanitation Operator / PSSO Agency (Approval Required)</option>
                <option value="DRIVER">Desludging Vehicle Driver (Approval Required)</option>
                <option value="SANITATION_WORKER">Sanitation Worker / Swachhata Mitra (Approval Required)</option>
                <option value="FSTP_OPERATOR">FSTP Treatment Plant Operator (Approval Required)</option>
              </select>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9826198765"
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  required
                />
              </div>

              {/* Email & OTP Verification Row */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-slate-700 dark:text-slate-300 font-semibold block">
                  Email Address {roleType === 'CITIZEN' ? '(Requires OTP Verification *)' : ''}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={formData.email}
                      disabled={isEmailVerified}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="citizen@example.com"
                      className={`w-full bg-white dark:bg-cg-navy border ${
                        isEmailVerified
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-300 dark:border-white/20 text-slate-900 dark:text-white'
                      } rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-600`}
                      required
                    />
                    {isEmailVerified && (
                      <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    )}
                  </div>

                  {roleType === 'CITIZEN' && !isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending || !formData.email}
                      className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shrink-0 shadow-clean flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Mail size={13} />
                      <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                    </button>
                  )}
                </div>

                {/* Email Verified Badge */}
                {isEmailVerified && (
                  <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>✓ Email Verified Successfully</span>
                  </div>
                )}

                {/* OTP Entry Box */}
                {otpSent && !isEmailVerified && (
                  <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-teal-900 dark:text-teal-200">
                        Enter 6-Digit Email Verification Code
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {otpTimer > 0 ? `Expires in ${otpTimer}s` : 'Code expired'}
                      </span>
                    </div>

                    {/* Demo Code Helper Box */}
                    {demoOtp && (
                      <div className="flex items-center justify-between bg-white dark:bg-cg-navy p-2 rounded-lg border border-teal-300 dark:border-teal-500/40 text-[11px] font-mono">
                        <span className="text-teal-800 dark:text-teal-300">
                          📨 Demo Verification Code: <strong>{demoOtp}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleQuickFillOtp}
                          className="px-2 py-0.5 rounded bg-teal-600 text-white text-[10px] font-bold hover:bg-teal-700"
                        >
                          Quick Verify
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6-digit code"
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        className="flex-1 bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs text-center font-mono tracking-widest text-slate-900 dark:text-white outline-none focus:border-teal-600"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean"
                      >
                        Verify
                      </button>
                    </div>

                    {otpError && (
                      <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                        {otpError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password or auto-generated"
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                />
              </div>

              {/* Mandatory Urban or Rural Question - RURAL AS DEFAULT */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span>Is this registration Urban or Rural? (क्षेत्र प्रकार) *</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-transparent">
                    Default: Rural (ग्रामीण)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Select whether your location is under a Rural Gram Panchayat (SBM-G) or an Urban Local Body (ULB).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaType: 'RURAL' })}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      (formData.areaType || 'RURAL') === 'RURAL'
                        ? 'border-emerald-500 bg-white dark:bg-cg-navy ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-base">🌱</span>
                        <span>Rural (ग्रामीण)</span>
                      </span>
                      {(formData.areaType || 'RURAL') === 'RURAL' && (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Gram Panchayat, Block & Village jurisdiction under SBM-G
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaType: 'URBAN' })}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      formData.areaType === 'URBAN'
                        ? 'border-sky-500 bg-white dark:bg-cg-navy ring-2 ring-sky-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-base">🏢</span>
                        <span>Urban (शहरी / नगर निकाय)</span>
                      </span>
                      {formData.areaType === 'URBAN' && (
                        <CheckCircle2 size={16} className="text-sky-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Nagar Palik Nigam, Palika Parishad & Urban Wards
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Jurisdiction Fields based on Urban vs Rural */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">District (जिला) *</label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    handleDistrictChange(e.target.value);
                    setFormData({ ...formData, district: e.target.value, block: '', gp: '', village: '' });
                  }}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {(formData.areaType || 'RURAL') === 'RURAL' ? (
                <>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Block (विकासखंड) *</label>
                    <select
                      value={formData.block}
                      onChange={(e) => {
                        handleBlockChange(e.target.value);
                        setFormData({ ...formData, block: e.target.value, gp: '', village: '' });
                      }}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                      required
                    >
                      <option value="">Select Block</option>
                      {blocks.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Gram Panchayat (ग्राम पंचायत)</label>
                    <select
                      value={formData.gp}
                      onChange={(e) => {
                        handleGpChange(e.target.value);
                        setFormData({ ...formData, gp: e.target.value, village: '' });
                      }}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                    >
                      <option value="">Select Gram Panchayat</option>
                      {gramPanchayats.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Village (ग्राम / पारा)</label>
                    <select
                      value={formData.village}
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
                </>
              ) : (
                <>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Urban Local Body (ULB / नगर निकाय) *</label>
                    <select
                      value={formData.ulb || CG_URBAN_BODIES[0]}
                      onChange={(e) => setFormData({ ...formData, ulb: e.target.value })}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                      required
                    >
                      {CG_URBAN_BODIES.map((ub) => (
                        <option key={ub} value={ub}>{ub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Ward Number / Zone (वार्ड क्रमांक / ज़ोन) *</label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      placeholder="e.g. Ward 14 / Zone 2"
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                      required
                    >
                    </input>
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Locality / Mohalla / Colony (मोहल्ला / कॉलोनी)</label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="e.g. Shanti Nagar, Near Water Tank"
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                    />
                  </div>
                </>
              )}
            </div>

            {/* GPS Location Pinning */}
            <div className="pt-1">
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={({ lat, lng }) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                label={roleType === 'CITIZEN' ? "Pin Household Location on Map" : "Pin Operating Base / Station on Map"}
                helpText="Pin precise location or click 'Detect Live GPS' to enable auto-assignment to the closest treatment plant (FSTP/STP) and vehicle."
              />
            </div>

            {roleType !== 'CITIZEN' && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-mono">
                ℹ Accounts for {roleType} are routed to the District Coordinator for review & empanelment approval.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center justify-center gap-1.5 pt-2 transition-all hover:scale-[1.01]"
            >
              <span>{roleType === 'CITIZEN' ? 'Complete Registration & Book Desludge' : 'Submit Registration Application'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};
