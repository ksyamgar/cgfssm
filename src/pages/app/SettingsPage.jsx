import React, { useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Settings, Save, Radio, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPage = () => {
  const [traqToken, setTraqToken] = useState('8731177e-cg-fssm-live-token');
  const [pollInterval, setPollInterval] = useState(30);
  const [slaHours, setSlaHours] = useState(24);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

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
            <DataTag color="teal">PLATFORM CONFIG</DataTag>
            <DataTag color="cyan">TRAQINDIA & SLA</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            System & Integration Parameters
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GPS Integration */}
        <GlassCard title="TraqIndia GPS Integration" icon={Radio} moduleTag="TELEMETRY">
          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">TraqIndia API Authentication Token</label>
              <input
                type="text"
                value={traqToken}
                onChange={(e) => setTraqToken(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Fleet Polling Frequency (Seconds)</label>
              <input
                type="number"
                value={pollInterval}
                onChange={(e) => setPollInterval(Number(e.target.value))}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save size={14} />
              <span>Update GPS Config</span>
            </button>
          </form>
        </GlassCard>

        {/* SLA & Alerts */}
        <GlassCard title="SLA & Escalation Timers" icon={Clock} moduleTag="GOVERNANCE">
          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Gram Panchayat Approval SLA (Hours)</label>
              <input
                type="number"
                value={slaHours}
                onChange={(e) => setSlaHours(Number(e.target.value))}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Auto-escalates to Block Coordinator upon breach</span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                <span>Enable Automated SMS Gateway Alerts to Citizens & Drivers</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save size={14} />
              <span>Update SLA Timers</span>
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
