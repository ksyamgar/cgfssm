import React, { useState } from 'react';
import { KPI_CATALOG } from '../../constants/kpis';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Download, FileSpreadsheet, Filter, CheckCircle2, TrendingUp } from 'lucide-react';
import { exportToPdf, exportToExcel } from '../../services/exportService';

export const ReportsPage = () => {
  const { requests, vehicles, fstps } = useFsm();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Operational', 'Environmental', 'Fleet', 'Governance', 'Financial', 'Circular Economy'];

  const filteredKpis = selectedCategory === 'ALL'
    ? KPI_CATALOG
    : KPI_CATALOG.filter(k => k.category === selectedCategory);

  const handleExport = (format) => {
    const columns = [
      { header: 'KPI Code', key: 'code' },
      { header: 'Indicator Name', key: 'name' },
      { header: 'Category', key: 'category' },
      { header: 'Benchmark Target', key: 'target' },
      { header: 'Unit', key: 'unit' }
    ];

    if (format === 'pdf') {
      exportToPdf({
        title: '23-KPI Statewide SBM-G Compliance Report',
        subtitle: `Category: ${selectedCategory} • SBM-Gramin Rural FSSM Cell`,
        columns,
        rows: filteredKpis,
        filename: 'CG_FSSM_23_KPI_Catalog.pdf'
      });
    } else {
      exportToExcel({
        title: 'KPI Report',
        columns,
        rows: filteredKpis,
        filename: 'CG_FSSM_23_KPI_Catalog.xlsx'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">23-KPI ENGINE</DataTag>
            <DataTag color="cyan">SBM-G ODF+ DIRECTORY</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Master Analytics & 23-KPI Catalog Reports
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold dark:text-white flex items-center gap-1.5 border border-slate-200 dark:border-transparent"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-cg-teal/20 dark:hover:bg-cg-teal/30 dark:text-cg-teal text-xs font-semibold flex items-center gap-1.5 border border-teal-200 dark:border-transparent"
          >
            <Download size={14} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              selectedCategory === c
                ? 'bg-cg-teal text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-transparent'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* KPI Catalog Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Indicator Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Benchmark Target</th>
                <th className="py-3 px-4">Reporting Unit</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {filteredKpis.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700 dark:text-cg-cyan">
                    {kpi.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    <div>{kpi.name}</div>
                    <div className="text-[10px] font-hindi text-slate-500 dark:text-slate-400">{kpi.hindiName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <DataTag color="slate">{kpi.category}</DataTag>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-700 dark:text-cg-teal font-bold">
                    {kpi.target}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {kpi.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] font-mono text-emerald-800 dark:text-cg-green bg-emerald-50 dark:bg-cg-green/15 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-transparent">
                      ● Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
