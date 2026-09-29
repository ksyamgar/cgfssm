import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { User, ShieldCheck, Mail, Phone, MapPin, KeyRound, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, currentRoleConfig } = useAuth();
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">ACCOUNT & SECURITY</DataTag>
            <DataTag color="cyan">{currentUser?.role}</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            User Profile & Official Credentials
          </h1>
        </div>
      </div>

      <GlassCard title={currentUser?.name} icon={User} moduleTag={currentRoleConfig?.badge}>
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Official Designation</label>
              <input
                type="text"
                value={currentUser?.designation || ''}
                disabled
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Administrative Jurisdiction</label>
              <input
                type="text"
                value={currentUser?.district || 'Statewide'}
                disabled
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Mobile Phone (2FA & SMS)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
            {isSaved && <span className="text-emerald-700 dark:text-cg-green font-mono text-xs font-bold">✓ Profile updated</span>}
            <button
              type="submit"
              className="ml-auto px-5 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
