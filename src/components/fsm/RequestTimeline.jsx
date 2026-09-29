import React from 'react';
import { DataTag } from '../common/DataTag';
import { CheckCircle, Clock, ShieldCheck, Camera, QrCode } from 'lucide-react';

export const RequestTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">No transition history logged yet.</div>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/15">
      {history.map((step, idx) => {
        const isLatest = idx === history.length - 1;
        const formattedTime = new Date(step.time).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });

        return (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform ${
                isLatest
                  ? 'bg-cg-teal border-white shadow-md scale-110'
                  : 'bg-slate-100 dark:bg-cg-ink border-teal-600 text-teal-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>

            {/* Content Card */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">
                  {step.action.replace(/_/g, ' ')}
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {formattedTime}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-sky-700 dark:text-cg-cyan font-semibold">{step.actor}</span>
              </div>

              {step.note && (
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 p-2 rounded-lg mt-1.5 border border-slate-200 dark:border-white/5 font-sans">
                  {step.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
