import React, { useState } from 'react';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useFsm } from '../../context/FsmContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { Database, IndianRupee, Clock, ShieldCheck, Save } from 'lucide-react';

export const MastersPage = () => {
  const { districts, blocks, gramPanchayats, villages, hierarchyData } = useGeoScope();
  const { tariffs } = useFsm();

  const [tariffState, setTariffState] = useState({
    basePriceINR: tariffs?.basePriceINR || 800,
    ratePerAdditionalKmINR: tariffs?.ratePerAdditionalKmINR || 25,
    gpAdministrativeFeeINR: tariffs?.gpAdministrativeFeeINR || 100
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveTariff = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <DataTag color="teal">MASTERS & CONFIGURATION</DataTag>
            <DataTag color="cyan">LGD CODE MAPPING</DataTag>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Geographic Hierarchy & Tariff Configuration
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LGD Geo Hierarchy Browser */}
        <GlassCard title="LGD Administrative Scope Browser" icon={Database} moduleTag="33 DISTRICTS">
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-600 dark:text-slate-300">
              Complete hierarchical mapping of Chhattisgarh Local Government Directory (LGD) codes for revenue villages and Gram Panchayats.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Districts:</span>
                <strong className="text-slate-900 dark:text-white">{districts.length || 33}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Gram Panchayats:</span>
                <strong className="text-teal-700 dark:text-cg-teal font-bold">11,664</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Revenue Villages:</span>
                <strong className="text-sky-700 dark:text-cg-cyan font-bold">20,126</strong>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-900 dark:text-white">Sample District Index</label>
              <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-slate-50 dark:bg-cg-navy rounded-xl border border-slate-200 dark:border-white/10">
                {districts.map((d, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-700 dark:text-slate-300 py-1 px-2 hover:bg-slate-200/60 dark:hover:bg-white/5 rounded">
                    • {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Dynamic Tariff Configuration */}
        <GlassCard title="Tariff & User Fee Rules" icon={IndianRupee} moduleTag="DYNAMIC PRICING">
          <form onSubmit={handleSaveTariff} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Base Desludging Tariff (First 5 km) (₹)</label>
              <input
                type="number"
                value={tariffState.basePriceINR}
                onChange={(e) => setTariffState({ ...tariffState, basePriceINR: Number(e.target.value) })}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Rate per Additional Km Beyond Perimeter (₹)</label>
              <input
                type="number"
                value={tariffState.ratePerAdditionalKmINR}
                onChange={(e) => setTariffState({ ...tariffState, ratePerAdditionalKmINR: Number(e.target.value) })}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Gram Panchayat Administrative Sanitation Cess (₹)</label>
              <input
                type="number"
                value={tariffState.gpAdministrativeFeeINR}
                onChange={(e) => setTariffState({ ...tariffState, gpAdministrativeFeeINR: Number(e.target.value) })}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved && <span className="text-emerald-700 dark:text-cg-green font-mono text-xs font-bold">✓ Tariffs updated successfully</span>}
              <button
                type="submit"
                className="ml-auto px-5 py-2 rounded-xl bg-cg-teal hover:bg-cg-tealDark text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Save size={15} />
                <span>Save Tariff Rules</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
