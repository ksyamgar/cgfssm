import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Smartphone, KeyRound, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loginAsRole, loginWithCredentials, allRoles, allMockUsers } = useAuth();

  const [authMode, setAuthMode] = useState('STAFF'); // CITIZEN_OTP or STAFF
  const [phone, setPhone] = useState('9826198765');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('admin.fssm@cg.gov.in');
  const [password, setPassword] = useState('Admin@2026');

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('123456'); // Auto-fill demo OTP
  };

  const handleCitizenLogin = (e) => {
    e.preventDefault();
    loginAsRole(allRoles.CITIZEN);
    navigate('/app');
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    loginWithCredentials(email, password);
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12 flex-1 w-full flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-clean border border-teal-200 dark:border-transparent">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            CG Rural FSSM Portal Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Secure multi-tenant authentication for citizens, officials, and fleet operators
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl glass-panel text-xs font-semibold shadow-clean">
          <button
            type="button"
            onClick={() => setAuthMode('STAFF')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'STAFF' ? 'bg-teal-600 text-white font-bold shadow-clean-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Staff / Official Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('CITIZEN_OTP')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'CITIZEN_OTP' ? 'bg-teal-600 text-white font-bold shadow-clean-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Citizen OTP Login
          </button>
        </div>

        {/* Staff Login Form */}
        {authMode === 'STAFF' ? (
          <form onSubmit={handleStaffLogin} className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-white/15 shadow-clean-lg">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Official Email / User ID</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                placeholder="e.g. admin.fssm@cg.gov.in"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center justify-center gap-1.5 pt-2"
            >
              <span>Sign In to Control Room</span>
              <ArrowRight size={15} />
            </button>
          </form>
        ) : (
          /* Citizen OTP Form */
          <form onSubmit={handleCitizenLogin} className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-white/15 shadow-clean-lg">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Mobile Number (10 Digits)</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
                  placeholder="9826100000"
                  required
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/20 border border-sky-200 dark:border-sky-500/40 text-sky-800 dark:text-sky-300 text-xs font-bold shrink-0"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 animate-in fade-in">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Enter 6-Digit OTP</label>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">OTP Sent: 123456</span>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-slate-900 dark:text-white outline-none focus:border-teal-600"
                  placeholder="123456"
                  maxLength={6}
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>Verify OTP & Proceed</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </form>
        )}

        {/* 1-Click Test Persona Selector */}
        <div className="glass-panel p-4 rounded-2xl border border-teal-200 dark:border-teal-500/30 space-y-2 text-center shadow-clean">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-teal-800 dark:text-teal-400 font-bold">
            <UserCheck size={14} />
            <span>INSTANT DEMO EVALUATOR (11 ROLES)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Click any role to bypass password and immediately inspect tailored permissions & views:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-2">
            {allMockUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  loginAsRole(u.role);
                  navigate('/app');
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-500/20 border border-slate-200 dark:border-white/10 hover:border-teal-300 dark:hover:border-teal-500/40 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-white transition-colors truncate text-left"
                title={`${u.name} (${u.role})`}
              >
                • {u.role.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
