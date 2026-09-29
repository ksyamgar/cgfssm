import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Database, ShieldAlert, Download, RefreshCw, CheckCircle2, Trash2, HardDrive } from 'lucide-react';
import { getStorageData, setStorageData, initializeStorage, STORAGE_KEYS } from '../../services/storageService';

export const DatabaseManagerPage = () => {
  const { currentRole } = useAuth();
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Enforce Super Admin only
  if (currentRole !== 'SUPER_ADMIN') {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-red-300 dark:border-red-500/40 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xl">
        <ShieldAlert size={48} className="mx-auto text-red-600 dark:text-red-400" />
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">403 — Unauthorized Access</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Database management operations are strictly restricted to the State Super Admin root account.
        </p>
      </div>
    );
  }

  const handleExportBackup = () => {
    const backupObj = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      requests: getStorageData(STORAGE_KEYS.REQUESTS, []),
      vehicles: getStorageData(STORAGE_KEYS.VEHICLES, []),
      fstps: getStorageData(STORAGE_KEYS.FSTPS, []),
      vendors: getStorageData(STORAGE_KEYS.VENDORS, []),
      tariffs: getStorageData(STORAGE_KEYS.TARIFFS, {}),
      auditLogs: getStorageData(STORAGE_KEYS.AUDIT_LOGS, [])
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CG_FSSM_DB_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setFeedbackMsg('Full JSON database backup downloaded successfully.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleReSeed = () => {
    localStorage.clear();
    initializeStorage();
    setFeedbackMsg('Database re-seeded with fresh Chhattisgarh SBM-G baseline datasets.');
    setTimeout(() => {
      setFeedbackMsg('');
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="red">SUPER ADMIN ROOT ONLY</DataTag>
            <DataTag color="teal">MS SQL / PRISMA SCHEMA</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Database Operations, Backup & Seed Management
          </h1>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-cg-teal/20 border border-teal-200 dark:border-cg-teal/40 text-teal-800 dark:text-cg-teal text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup & Snapshot */}
        <GlassCard title="Database Snapshot & Export" icon={Download} moduleTag="JSON DUMP">
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-600 dark:text-slate-300">
              Download complete transactional ledger including all 18-step FSM requests, GPS coordinates, manifests, and audit trails for offline archival.
            </p>
            <button
              onClick={handleExportBackup}
              className="px-5 py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Download size={15} />
              <span>Download Full DB Snapshot (.json)</span>
            </button>
          </div>
        </GlassCard>

        {/* Database Re-seed & Integrity */}
        <GlassCard title="Seed Baseline Datasets" icon={RefreshCw} moduleTag="RESET / RE-SEED">
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-600 dark:text-slate-300">
              Re-initialize baseline LGD tables, sample FSTPs (Arang, Patan, Bilha), empaneled PSSO vendors, and TraqIndia demo GPS vehicles.
            </p>
            <button
              onClick={handleReSeed}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <RefreshCw size={15} />
              <span>Re-seed Baseline Demo Database</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
