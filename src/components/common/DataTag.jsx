import React from 'react';

export const DataTag = ({ children, color = 'cyan', className = '' }) => {
  const colorMap = {
    cyan: 'text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-500/15 dark:border-sky-500/30',
    teal: 'text-teal-700 bg-teal-50 border-teal-200 dark:text-teal-300 dark:bg-teal-500/15 dark:border-teal-500/30',
    amber: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/15 dark:border-amber-500/30',
    green: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30',
    red: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/15 dark:border-rose-500/30',
    violet: 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/15 dark:border-purple-500/30',
    slate: 'text-slate-700 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-500/15 dark:border-slate-500/30'
  };

  const selectedColor = colorMap[color] || colorMap.cyan;

  return (
    <span
      className={`inline-flex items-center font-mono text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${selectedColor} ${className}`}
    >
      [{children}]
    </span>
  );
};
