import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Globe, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const CmsPage = () => {
  const { currentRole } = useAuth();
  const [heroHeading, setHeroHeading] = useState('CG Rural FSSM Platform');
  const [heroTagline, setHeroTagline] = useState('The Digital Operating System for Rural Sanitation Infrastructure in Chhattisgarh.');
  const [helplineNumber, setHelplineNumber] = useState('1800-233-1234');
  const [isSaved, setIsSaved] = useState(false);

  if (currentRole !== 'SUPER_ADMIN') {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-red-300 dark:border-red-500/40 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xl">
        <ShieldAlert size={48} className="mx-auto text-red-600 dark:text-red-400" />
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">403 — Unauthorized Access</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          CMS content editing is restricted to the Super Admin.
        </p>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">PORTAL CMS</DataTag>
            <DataTag color="amber">SUPER ADMIN</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Public Website Content Management
          </h1>
        </div>
      </div>

      <GlassCard title="Homepage Hero Copy & IEC Notices" icon={Globe} moduleTag="CMS EDITOR">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Hero Display Headline</label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Supporting Mission Statement</label>
            <textarea
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              rows={3}
              className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Statewide Citizen Helpline</label>
            <input
              type="text"
              value={helplineNumber}
              onChange={(e) => setHelplineNumber(e.target.value)}
              className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved && <span className="text-emerald-700 dark:text-cg-green font-mono text-xs font-bold">✓ Content updated on public portal</span>}
            <button
              type="submit"
              className="ml-auto px-5 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Save size={15} />
              <span>Publish Updates</span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
