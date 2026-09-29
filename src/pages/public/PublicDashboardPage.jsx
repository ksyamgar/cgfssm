import React, { useState } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { KpiCard } from '../../components/common/KpiCard';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { ChoroplethMap } from '../../components/maps/ChoroplethMap';
import { useFsm } from '../../context/FsmContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Activity, ShieldCheck, Factory, Truck, MapPin, Download } from 'lucide-react';
import { exportToPdf, exportToExcel } from '../../services/exportService';

export const PublicDashboardPage = () => {
  const { requests, vehicles, fstps } = useFsm();
  const [selectedMetric, setSelectedMetric] = useState('requests');

  // Trend data for monthly desludging volumes
  const monthlyTrends = [
    { month: 'Apr', requests: 740, volumeKL: 2220, safeDisposalPct: 98 },
    { month: 'May', requests: 880, volumeKL: 2640, safeDisposalPct: 99 },
    { month: 'Jun', requests: 950, volumeKL: 2850, safeDisposalPct: 99 },
    { month: 'Jul', requests: 1100, volumeKL: 3300, safeDisposalPct: 100 },
    { month: 'Aug', requests: 1240, volumeKL: 3720, safeDisposalPct: 100 },
    { month: 'Sep', requests: 1480, volumeKL: 4440, safeDisposalPct: 100 }
  ];

  // FSTP capacity utilization data
  const fstpUtilizationData = fstps.map((f) => ({
    name: f.name.split(' ')[0],
    fullName: f.name,
    capacityKLD: f.capacityKLD,
    currentVolumeKLD: f.currentVolumeKLD,
    utilizationPct: Math.round((f.currentVolumeKLD / f.capacityKLD) * 100)
  }));

  const handleExportSummary = (format) => {
    const columns = [
      { header: 'Month', key: 'month' },
      { header: 'Total Requests', key: 'requests' },
      { header: 'Volume Treated (kL)', key: 'volumeKL' },
      { header: 'Safe Disposal (%)', key: 'safeDisposalPct' }
    ];
    if (format === 'pdf') {
      exportToPdf({
        title: 'Statewide Public FSSM Aggregate Summary',
        subtitle: 'Government of Chhattisgarh • SBM-Gramin FSSM Cell',
        columns,
        rows: monthlyTrends,
        filename: 'CG_FSSM_Public_Dashboard.pdf'
      });
    } else {
      exportToExcel({
        title: 'Public Summary',
        columns,
        rows: monthlyTrends,
        filename: 'CG_FSSM_Public_Dashboard.xlsx'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Page Title & Export Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <DataTag color="teal">PUBLIC STATE DASHBOARD</DataTag>
              <DataTag color="cyan">REAL-TIME AGGREGATE</DataTag>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
              Chhattisgarh Rural Sanitation & FSSM Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Aggregated open data indicators for citizen transparency. Refreshes every 60 seconds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportSummary('pdf')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-white border border-slate-300 dark:border-transparent flex items-center gap-1.5 transition-colors shadow-clean"
            >
              <Download size={14} />
              <span>PDF Report</span>
            </button>
            <button
              onClick={() => handleExportSummary('excel')}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/20 dark:hover:bg-teal-500/30 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-transparent text-xs font-bold flex items-center gap-1.5 transition-colors shadow-clean"
            >
              <Download size={14} />
              <span>Excel Export</span>
            </button>
          </div>
        </div>

        {/* 4 Key Public KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Statewide Desludging Requests"
            value="14,824"
            unit="Services"
            kpiCode="1.1.1"
            delta="+18.2% MoM"
            isPositive={true}
            sparklineData={[120, 150, 180, 220, 290, 340, 420]}
            color="teal"
          />
          <KpiCard
            label="Total Volume Safely Decanted"
            value="48.6"
            unit="ML"
            kpiCode="2.1.1"
            delta="+22.4%"
            isPositive={true}
            sparklineData={[28, 32, 36, 40, 44, 46, 48]}
            color="cyan"
          />
          <KpiCard
            label="Safe Disposal Rate (Zero Dumping)"
            value="99.4"
            unit="%"
            kpiCode="2.1.2"
            delta="100% Geo-verified"
            isPositive={true}
            sparklineData={[96, 97, 98, 98, 99, 99, 100]}
            color="green"
          />
          <KpiCard
            label="Average Service Turnaround"
            value="26.4"
            unit="Hours"
            kpiCode="1.2.1"
            delta="-4.2 hrs"
            isPositive={true}
            sparklineData={[42, 38, 35, 32, 30, 28, 26]}
            color="amber"
          />
        </div>

        {/* Middle Row: District Choropleth Map + FSTP Capacity Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Choropleth Map (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                District Desludging Choropleth Map
              </h3>
              <span className="text-xs font-mono font-semibold text-teal-700 dark:text-teal-400">33 DISTRICTS COVERED</span>
            </div>
            <ChoroplethMap height="460px" />
          </div>

          {/* FSTP Capacity Utilizations (1 col) */}
          <div className="space-y-4">
            <GlassCard title="FSTP / STP Capacity Utilization" moduleTag="PLANT STATUS">
              <div className="space-y-4">
                {fstpUtilizationData.map((plant, idx) => (
                  <div key={idx} className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{plant.fullName}</span>
                      <span className="font-mono text-teal-700 dark:text-teal-400 font-extrabold">{plant.utilizationPct}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-cg-navy overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          plant.utilizationPct > 85
                            ? 'bg-amber-500'
                            : plant.utilizationPct > 60
                            ? 'bg-teal-600'
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${plant.utilizationPct}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>Intake: {plant.currentVolumeKLD} KLD</span>
                      <span>Cap: {plant.capacityKLD} KLD</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Row: Monthly Volume Trends Chart */}
        <GlassCard title="Monthly Septage Treatment & Safe Disposal Trends" moduleTag="HISTORICAL ANALYTICS">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#0D9488',
                    borderRadius: '0.75rem',
                    color: '#0F172A',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="volumeKL" name="Sludge Treated (kL)" fill="#0D9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="requests" name="Total Desludgings" fill="#0284C7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
};
