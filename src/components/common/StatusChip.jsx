import React from 'react';
import { STATUS_META } from '../../constants/fsm';
import { useLanguage } from '../../context/LanguageContext';

export const StatusChip = ({ status, className = '' }) => {
  const { lang } = useLanguage();
  const meta = STATUS_META[status] || {
    label: status || 'UNKNOWN',
    hindiLabel: status || 'अज्ञात',
    bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    color: 'slate'
  };

  const displayText = (lang === 'hi' || lang === 'hne') ? meta.hindiLabel : meta.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${meta.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {displayText}
    </span>
  );
};
