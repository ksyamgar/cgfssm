import React, { useState } from 'react';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { ShieldCheck, Search, Download, Filter } from 'lucide-react';
import { exportToPdf, exportToExcel } from '../../services/exportService';

export const AuditLogPage = () => {
  const { auditLogs } = useFsm();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.actor?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q)
    );
  });

  const handleExport = (format) => {
    const columns = [
      { header: 'Action', key: 'action' },
      { header: 'Actor Name', key: 'actor' },
      { header: 'Role', key: 'actorRole' },
      { header: 'Timestamp', key: 'timestamp' },
      { header: 'IP Address', key: 'ip' },
      { header: 'Details', key: 'details' }
    ];
    if (format === 'pdf') {
      exportToPdf({
        title: 'Immutable System Audit Ledger',
        columns,
        rows: filteredLogs,
        filename: 'CG_FSSM_Audit_Log.pdf'
      });
    } else {
      exportToExcel({
        title: 'Audit Log',
        columns,
        rows: filteredLogs,
        filename: 'CG_FSSM_Audit_Log.xlsx'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">SECURITY & AUDIT</DataTag>
            <DataTag color="cyan">IMMUTABLE EVENT LOG</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            System Security & Transaction Audit Trail
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold dark:text-white flex items-center gap-1.5 border border-slate-200 dark:border-transparent"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-cg-teal/20 dark:hover:bg-cg-teal/30 dark:text-cg-teal text-xs font-semibold flex items-center gap-1.5 border border-teal-200 dark:border-transparent"
          >
            <Download size={14} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600"
            placeholder="Search audit action, actor name, notes..."
          />
        </div>
        <DataTag color="green">{filteredLogs.length} AUDIT ENTRIES</DataTag>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300 font-mono text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-700 dark:text-cg-teal">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-900 dark:text-white font-medium">{log.actor}</div>
                    <div className="text-[10px] text-sky-700 dark:text-cg-cyan font-semibold">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300 text-xs">
                    {log.details}
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
