import React from 'react';
import { DataTag } from './DataTag';

export const GlassCard = ({
  children,
  title,
  icon: Icon,
  moduleTag,
  action,
  level = 'l2', // l1, l2, l3
  className = ''
}) => {
  const levelClass =
    level === 'l3'
      ? 'glass-panel-l3'
      : level === 'l1'
      ? 'glass-panel-subtle'
      : 'glass-panel';

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 transition-all duration-200 text-slate-800 dark:text-slate-100 ${levelClass} ${className}`}
    >
      {(title || moduleTag || Icon || action) && (
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-cg-teal/15 text-cg-teal flex items-center justify-center shrink-0 border border-teal-200/50 dark:border-transparent">
                <Icon size={18} />
              </div>
            )}
            {title && (
              <h3 className="font-display font-bold text-base md:text-lg text-slate-900 dark:text-white truncate">
                {title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {moduleTag && <DataTag color="teal">{moduleTag}</DataTag>}
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
