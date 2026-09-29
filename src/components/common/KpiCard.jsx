import React from 'react';
import { DataTag } from './DataTag';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const KpiCard = ({
  label,
  value,
  unit = '',
  kpiCode = '1.1.1',
  delta = '+12.4%',
  isPositive = true,
  sparklineData = [10, 15, 13, 18, 22, 28, 35],
  color = 'teal'
}) => {
  const chartData = sparklineData.map((val, idx) => ({ index: idx, value: val }));
  const strokeColor = color === 'cyan' ? '#0284C7' : color === 'amber' ? '#D97706' : '#0D9488';

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-5 flex flex-col justify-between hover:border-teal-500/50 hover:shadow-clean-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-2">
          {label}
        </span>
        <DataTag color={color}>{`KPI: ${kpiCode}`}</DataTag>
      </div>

      <div className="flex items-baseline justify-between gap-2 my-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-bold text-2xl md:text-3xl text-slate-900 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          )}
        </div>

        {delta && (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent'
                : 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-transparent'
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </div>
        )}
      </div>

      {/* Sparkline */}
      <div className="h-7 w-full mt-2 pt-1 border-t border-slate-100 dark:border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad_${kpiCode.replace(/\./g, '_')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={1.75}
              fillOpacity={1}
              fill={`url(#grad_${kpiCode.replace(/\./g, '_')})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
