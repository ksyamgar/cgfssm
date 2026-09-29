import React, { useState } from 'react';
import { PPE_ITEMS, FSM_STATUS } from '../../constants/fsm';
import { Camera, ShieldCheck, CheckCircle2, AlertTriangle, X, Upload, MapPin } from 'lucide-react';
import { calculateDistanceKm } from '../../services/traqIndia';

export const EvidenceUploadModal = ({ request, isOpen, onClose, onSubmitEvidence }) => {
  const [ppeState, setPpeState] = useState({
    gloves: true,
    boots: true,
    mask: true,
    suit: true,
    goggles: true,
    sanitizer: true
  });

  const [extractedVolumeLitres, setExtractedVolumeLitres] = useState(request?.tankVolumeLitres || 3000);
  const [beforeCaptured, setBeforeCaptured] = useState(false);
  const [afterCaptured, setAfterCaptured] = useState(false);
  const [simulatedDeviceGps, setSimulatedDeviceGps] = useState({
    lat: request?.lat ? request.lat + 0.0002 : 21.2514,
    lng: request?.lng ? request.lng + 0.0001 : 81.6296
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !request) return null;

  // Verify GPS proximity: must be within 200 meters (0.2 km)
  const distanceKm = calculateDistanceKm(
    simulatedDeviceGps.lat,
    simulatedDeviceGps.lng,
    request.lat,
    request.lng
  );
  const isWithinProximity = distanceKm <= 0.2;

  const allPpeChecked = Object.values(ppeState).every(Boolean);

  const handleSubmit = () => {
    if (!allPpeChecked) {
      setErrorMsg('Mandatory safety protocol: All PPE checklist items must be verified.');
      return;
    }
    if (!isWithinProximity) {
      setErrorMsg(`Device GPS (${(distanceKm * 1000).toFixed(0)}m away) is outside the permitted 200m radius of the household septic tank.`);
      return;
    }
    if (!beforeCaptured || !afterCaptured) {
      setErrorMsg('Both BEFORE and AFTER geotagged cleaning photos must be captured via in-app camera.');
      return;
    }

    onSubmitEvidence({
      ppeChecklist: ppeState,
      extractedVolumeLitres: Number(extractedVolumeLitres),
      beforePhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%23033550"><rect width="100%" height="100%"/><text x="50%" y="50%" fill="white" font-size="14" text-anchor="middle">BEFORE: Sludge Level Full (Verified)</text></svg>',
      afterPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%230E9488"><rect width="100%" height="100%"/><text x="50%" y="50%" fill="white" font-size="14" text-anchor="middle">AFTER: Desludged & Washed Clean</text></svg>',
      capturedGps: simulatedDeviceGps,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/30 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-cg-teal/20 text-teal-700 dark:text-cg-teal flex items-center justify-center border border-teal-200 dark:border-transparent">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Sanitation Worker Evidence & PPE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 font-mono">
                {request.requestNo} • {request.village}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: GPS Proximity Verification */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-700 dark:text-cg-cyan font-bold">
              <MapPin size={14} />
              <span>GEOTAG PROXIMITY CHECK (±200m GATE)</span>
            </div>
            {isWithinProximity ? (
              <span className="text-[11px] font-mono text-emerald-800 dark:text-cg-green bg-emerald-100 dark:bg-cg-green/15 px-2 py-0.5 rounded font-bold border border-emerald-300 dark:border-transparent">
                ✓ PROXIMITY VERIFIED ({(distanceKm * 1000).toFixed(0)}m)
              </span>
            ) : (
              <span className="text-[11px] font-mono text-red-800 dark:text-cg-red bg-red-100 dark:bg-cg-red/15 px-2 py-0.5 rounded font-bold border border-red-300 dark:border-transparent">
                ⚠ OUT OF RANGE ({(distanceKm * 1000).toFixed(0)}m)
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Request Pin: [{request.lat}, {request.lng}] | Device Live: [{simulatedDeviceGps.lat.toFixed(4)}, {simulatedDeviceGps.lng.toFixed(4)}]
          </div>
        </div>

        {/* Section 2: PPE Mandatory Checklist */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-teal-600 dark:text-cg-teal" />
              <span>Mandatory Safety PPE Checklist</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">All 6 items required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PPE_ITEMS.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  ppeState[item.id]
                    ? 'border-teal-500 bg-teal-50 dark:bg-cg-teal/10 text-teal-950 dark:text-white font-medium'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={ppeState[item.id]}
                  onChange={(e) =>
                    setPpeState({ ...ppeState, [item.id]: e.target.checked })
                  }
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                <span className="truncate">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Before & After Camera Capture */}
        <div className="mb-5 space-y-3">
          <div className="text-xs font-semibold text-slate-900 dark:text-white">In-App Camera Geotagged Evidence</div>
          <div className="grid grid-cols-2 gap-3">
            {/* Before Photo */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-2">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">1. BEFORE Cleaning</div>
              {beforeCaptured ? (
                <div className="p-3 bg-emerald-50 dark:bg-cg-teal/20 border border-emerald-200 dark:border-transparent rounded-lg text-emerald-800 dark:text-cg-teal text-xs font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 size={16} />
                  <span>Photo Geotagged</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setBeforeCaptured(true)}
                  className="w-full py-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 dark:bg-cg-teal/20 dark:hover:bg-cg-teal/30 dark:text-cg-teal text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Camera size={15} />
                  <span>Capture Photo</span>
                </button>
              )}
            </div>

            {/* After Photo */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-2">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">2. AFTER Cleaning</div>
              {afterCaptured ? (
                <div className="p-3 bg-emerald-50 dark:bg-cg-teal/20 border border-emerald-200 dark:border-transparent rounded-lg text-emerald-800 dark:text-cg-teal text-xs font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 size={16} />
                  <span>Photo Geotagged</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAfterCaptured(true)}
                  className="w-full py-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 dark:bg-cg-teal/20 dark:hover:bg-cg-teal/30 dark:text-cg-teal text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Camera size={15} />
                  <span>Capture Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Extracted Volume Log */}
        <div className="mb-6 space-y-1.5">
          <label className="text-xs font-semibold text-slate-900 dark:text-white">
            Actual Faecal Sludge Volume Extracted (Litres)
          </label>
          <input
            type="number"
            value={extractedVolumeLitres}
            onChange={(e) => setExtractedVolumeLitres(e.target.value)}
            className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
            placeholder="e.g. 3000"
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
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-xs font-bold text-white shadow-md flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} />
            <span>Verify & Complete Cleaning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
