import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Save,
  Users,
  Bell,
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ROLES, CREATION_HIERARCHY } from '../../constants/roles';

export const ProfilePage = () => {
  const { currentUser, currentRoleConfig, updateUser, canCreate } = useAuth();
  const { t, lang, setLang, languages } = useLanguage();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUser(currentUser.id, {
      name,
      phone,
      email,
      designation
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const hierarchyInfo = CREATION_HIERARCHY[currentUser?.role] || { level: 99, title: 'Standard' };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <DataTag color="teal">ACCOUNT SETTINGS</DataTag>
            <DataTag color="cyan">{currentUser?.role}</DataTag>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold">
              LEVEL {hierarchyInfo.level} ({hierarchyInfo.title})
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            {t('profile_title') || 'My Profile & Security Settings'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('profile_subtitle') || 'Manage your personal credentials, contact numbers for SMS dispatch, and notifications'}
          </p>
        </div>
      </div>

      {/* Admin Quick Link Banner (For Super Admin / State Officer / District Coordinator) */}
      {canCreate && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-teal-500/10 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-clean">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Administrative Account & Registration Privileges
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                You have authority to register and edit accounts below your level ({hierarchyInfo.title}).
              </p>
            </div>
          </div>
          <Link
            to="/app/people"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105"
          >
            <span>{t('nav_people') || 'Personnel Directory & Registration'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Profile Form */}
      <GlassCard title={currentUser?.name} icon={User} moduleTag={currentRoleConfig?.badge}>
        <form onSubmit={handleSave} className="space-y-5 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                {t('full_name') || 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                {t('official_designation') || 'Official Designation / Title'}
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                {t('admin_jurisdiction') || 'Administrative Jurisdiction (District / GP)'}
              </label>
              <input
                type="text"
                value={currentUser?.district || 'Statewide (All 33 Districts)'}
                disabled
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                {t('mobile_phone') || 'Mobile Phone (Primary 2FA & SMS Dispatch)'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                {t('official_email') || 'Official Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Preferences & Notifications */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <Bell size={14} className="text-teal-600" />
              <span>{t('notifications_prefs') || 'Notification & Language Preferences'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                <span>{t('sms_trip_alerts') || 'Receive Real-Time SMS on Trip Status'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                <span>{t('email_alerts') || 'Email Digest for Escalations & Approvals'}</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
            {isSaved ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} />
                <span>{t('profile_updated') || 'Profile updated successfully!'}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">All changes are synchronized across the control tower.</span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md flex items-center gap-1.5 transition-all"
            >
              <Save size={15} />
              <span>{t('save_changes') || 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
