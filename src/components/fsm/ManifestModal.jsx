import React, { useState } from 'react';
import { QrCode, Factory, CheckCircle2, X, ShieldCheck, Download } from 'lucide-react';
import { DataTag } from '../common/DataTag';

export const ManifestModal = ({ request, fstps = [], isOpen, onClose, onSignManifest }) => {
  const [selectedFstpId, setSelectedFstpId] = useState(request?.targetFstpId || fstps[0]?.id || 'fstp_01');
  const [decantedLitres, setDecantedLitres] = useState(request?.decantedVolumeLitres || request?.tankVolumeLitres || 3000);
  const [sludgeQuality, setSludgeQuality] = useState('STANDARD_FAECAL_DOMESTIC');
  const [operatorNotes, setOperatorNotes] = useState('Volume verified against vehicle dipstick. Standard septage quality.');

  if (!isOpen || !request) return null;

  const manifestNo = `MNF-CG-${request.requestNo.split('-').pop()}`;

  const handleSign = () => {
    onSignManifest(request.id, selectedFstpId, decantedLitres, operatorNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/30 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-cg-violet/20 text-purple-700 dark:text-cg-violet flex items-center justify-center border border-purple-200 dark:border-transparent">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Digital Decanting Manifest
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-cg-teal">{manifestNo}</span>
                <DataTag color="violet">FSTP SAFE INTAKE</DataTag>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* QR Code Graphic & Verification Box */}
        <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-md border border-slate-200">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              <rect x="0" y="0" width="30" height="30" />
              <rect x="70" y="0" width="30" height="30" />
              <rect x="0" y="70" width="30" height="30" />
              <rect x="10" y="10" width="10" height="10" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="white" />
              <rect x="40" y="10" width="20" height="10" />
              <rect x="40" y="30" width="10" height="20" />
              <rect x="60" y="40" width="30" height="10" />
              <rect x="30" y="60" width="20" height="20" />
              <rect x="70" y="70" width="20" height="20" />
            </svg>
          </div>

          <div className="text-xs space-y-1 font-mono text-slate-700 dark:text-slate-300">
            <div>REQUEST: <strong className="text-slate-900 dark:text-white">{request.requestNo}</strong></div>
            <div>VEHICLE: <strong className="text-sky-700 dark:text-cg-cyan">{request.assignedVehicleNo || 'CG-04-ME-4821'}</strong></div>
            <div>DRIVER: <strong className="text-slate-900 dark:text-white">{request.assignedDriverName || 'Ramesh Patel'}</strong></div>
            <div>ORIGIN: <span className="text-slate-500 dark:text-slate-400">{request.village}, {request.gp}</span></div>
            <div className="text-emerald-700 dark:text-cg-green font-semibold pt-1">● Geofence Entry Verified</div>
          </div>
        </div>

        {/* FSTP Facility Selection */}
        <div className="mb-4 space-y-1.5">
          <label className="text-xs font-semibold text-slate-900 dark:text-white">Receiving Treatment Facility (FSTP / STP)</label>
          <select
            value={selectedFstpId}
            onChange={(e) => setSelectedFstpId(e.target.value)}
            className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
          >
            {fstps.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.capacityKLD} KLD • {f.district})
              </option>
            ))}
          </select>
        </div>

        {/* Decanted Volume */}
        <div className="mb-4 space-y-1.5">
          <label className="text-xs font-semibold text-slate-900 dark:text-white">Verified Decanted Volume (Litres)</label>
          <input
            type="number"
            value={decantedLitres}
            onChange={(e) => setDecantedLitres(e.target.value)}
            className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
          />
        </div>

        {/* Operator Inspection Note */}
        <div className="mb-6 space-y-1.5">
          <label className="text-xs font-semibold text-slate-900 dark:text-white">Plant Operator Quality Assessment</label>
          <textarea
            value={operatorNotes}
            onChange={(e) => setOperatorNotes(e.target.value)}
            rows={2}
            className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold dark:text-white border border-slate-200 dark:border-transparent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSign}
            className="px-5 py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-xs font-bold text-white shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck size={16} />
            <span>Digitally Sign & Verify Disposal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
