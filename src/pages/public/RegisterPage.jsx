import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { useAuth } from '../../context/AuthContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { ShieldCheck, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { allRoles, registerUser, loginAsRole, loading } = useAuth();
  const { districts, blocks, gramPanchayats, villages, handleDistrictChange, handleBlockChange } = useGeoScope();

  const [roleType, setRoleType] = useState('CITIZEN'); // CITIZEN, VENDOR_ADMIN, DRIVER, SANITATION_WORKER, FSTP_OPERATOR
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    district: '',
    block: '',
    gp: '',
    vehicleNo: '',
    companyName: ''
  });

  const [isSubmittedPending, setIsSubmittedPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      ...formData,
      role: roleType,
      password: formData.password || `${formData.phone.slice(-4)}@Fssm2026`
    };

    const res = await registerUser(payload);
    if (res?.success) {
      if (roleType === 'CITIZEN') {
        navigate('/book');
      } else {
        setIsSubmittedPending(true);
      }
    } else {
      setErrorMsg(res?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-12 flex-1 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-clean border border-teal-200 dark:border-transparent">
            <UserPlus size={28} />
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Select Registration Category</label>
              <select
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
              >
                <option value="CITIZEN">Citizen / Rural Beneficiary (Instant Access)</option>
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
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty for auto-generated OTP"
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    handleDistrictChange(e.target.value);
                    setFormData({ ...formData, district: e.target.value });
                  }}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Block</label>
                <select
                  value={formData.block}
                  onChange={(e) => {
                    handleBlockChange(e.target.value);
                    setFormData({ ...formData, block: e.target.value });
                  }}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  required
                >
                  <option value="">Select Block</option>
                  {blocks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {roleType !== 'CITIZEN' && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-mono">
                ℹ Accounts for {roleType} are set to PENDING status upon creation and require District Coordinator authorization.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center justify-center gap-1.5 pt-2"
            >
              <span>{roleType === 'CITIZEN' ? 'Create Account & Book' : 'Submit Registration Application'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};
