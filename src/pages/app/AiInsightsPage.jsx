import React from 'react';
import { useFsm } from '../../context/FsmContext';
import { generateAiInsights } from '../../services/aiService';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Cpu, TrendingUp, AlertTriangle, CheckCircle2, Sparkles, Factory, Truck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const AiInsightsPage = () => {
  const { requests, vehicles, fstps } = useFsm();
  const insights = generateAiInsights(requests, vehicles, fstps);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">AI PREDICTIVE ENGINE</DataTag>
            <DataTag color="cyan">OPENROUTER / LLM TELEMETRY</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Predictive Desludging & Fleet Optimization AI
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">Q4 PREDICTED DEMAND</div>
          <div className="font-display font-bold text-2xl text-teal-700 dark:text-cg-teal">{insights.summary.predictedMonthlyDemandKL} kL</div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Confidence: {insights.summary.confidenceScore}%</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">3-YEAR CYCLE SATURATION</div>
          <div className="font-semibold text-sm text-slate-900 dark:text-white">{insights.summary.threeYearCycleSaturation}</div>
          <div className="text-[10px] font-mono text-sky-700 dark:text-cg-cyan font-bold">PROACTIVE DISPATCH READY</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">CARBON ABATEMENT</div>
          <div className="font-display font-bold text-2xl text-emerald-700 dark:text-cg-green">{insights.summary.co2eOffsetTons} tCO2e</div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Avoided Methane Emissions</div>
        </div>
      </div>

      {/* Demand Forecast Chart */}
      <GlassCard title="6-Month Demand & Plant Capacity Forecast (kL)" icon={TrendingUp} moduleTag="TIME-SERIES ML">
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={insights.demandForecast}>
              <defs>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#0D9488',
                  borderRadius: '0.75rem',
                  color: '#0f172a',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="predictedKL" name="Predicted Sludge (kL)" stroke="#0D9488" fill="url(#aiGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="capacityKL" name="Plant Capacity (kL)" stroke="#7C3AED" fill="transparent" strokeDasharray="4 4" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Anomaly Detections & 3-Year Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Route & Telemetry Anomaly Flags" icon={AlertTriangle} moduleTag="GEO-SECURITY">
          <div className="space-y-3 text-xs font-sans">
            {insights.anomalies.map((anom) => (
              <div key={anom.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-600 dark:text-red-400 font-mono text-[11px]">{anom.type}</span>
                  <DataTag color={anom.severity === 'HIGH' ? 'red' : 'amber'}>{anom.severity}</DataTag>
                </div>
                <div className="text-slate-900 dark:text-white font-medium">{anom.location} &bull; <span className="text-sky-700 dark:text-cg-cyan font-bold">{anom.vehicleNo}</span></div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{anom.explanation}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="3-Year Desludging Proactive Rollout" icon={Sparkles} moduleTag="PROACTIVE CYCLE">
          <div className="space-y-3 text-xs font-sans">
            {insights.threeYearRecommendations.map((gp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{gp.gp}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: {gp.householdsTarget} HHs &bull; Enrolled: {gp.enrolledScheduled}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-teal-700 dark:text-cg-teal font-bold">{gp.estimatedSludgeKL} kL</div>
                  <DataTag color={gp.riskLevel === 'HIGH' ? 'amber' : 'green'}>{gp.riskLevel} RISK</DataTag>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
