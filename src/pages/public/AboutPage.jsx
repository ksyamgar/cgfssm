import React from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import { ROLE_CONFIG } from '../../constants/roles';
import { Shield, Droplet, AlertTriangle, CheckCircle, Info, HeartHandshake, PhoneCall } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Mission Banner */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-teal-500/40 space-y-4 shadow-clean">
          <DataTag color="teal">SBM-G PHASE II • ODF+ & ODF++ ACCELERATION</DataTag>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            About the Chhattisgarh Rural FSSM Digital Platform
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl font-sans">
            Under the guidance of the Department of Panchayat & Rural Development, Government of Chhattisgarh, and with technical support from UNICEF, this digital operating system formalizes and monitors the entire Faecal Sludge & Septage Management (FSSM) value chain for rural communities across all 33 districts.
          </p>
        </div>

        {/* The Rural Challenge & IEC Health Hazards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard title="The Rural Sanitation Challenge" moduleTag="IEC: CONTEXT">
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              <p>
                In rural Chhattisgarh, over 3.8 million individual household latrines (IHHL) rely on on-site containment structures (single pits, twin pits, or septic tanks). Without structured desludging services, full containment tanks frequently overflow into village drains and agricultural fields.
              </p>
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-red-950/20 border border-rose-200 dark:border-red-500/30 text-rose-900 dark:text-red-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-400">
                  <AlertTriangle size={16} />
                  <span>Hazards of Unsafe Disposal & Manual Scavenging:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <li>Pathogen contamination of shallow groundwater and drinking tubewells.</li>
                  <li>Spread of diarrhoeal diseases, cholera, and child stunting.</li>
                  <li>Severe environmental degradation of river basins (Mahanadi, Kharun, Shivnath, Indravati).</li>
                  <li>Prohibition of hazardous manual cleaning under the MS Act 2013.</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="The Digital Solution Architecture" moduleTag="IEC: SOLUTION">
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              <p>
                The platform bridges the gap between rural citizens, Gram Panchayats, private desludging operators (PSSO), and mechanized treatment facilities (FSTPs/STPs).
              </p>
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <span className="text-teal-700 dark:text-teal-400 font-bold">1.</span>
                  <span><strong>Algorithmic Dispatch:</strong> Matches tank size with optimal tractor/truck unit.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <span className="text-teal-700 dark:text-teal-400 font-bold">2.</span>
                  <span><strong>Live GPS Geo-Fencing:</strong> TraqIndia telemetry ensures zero illegal dumping.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <span className="text-teal-700 dark:text-teal-400 font-bold">3.</span>
                  <span><strong>Worker Safety & PPE:</strong> Mandatory gear verification and digital photo evidence.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <span className="text-teal-700 dark:text-teal-400 font-bold">4.</span>
                  <span><strong>Circular Economy:</strong> Safe conversion into bio-compost for rural agriculture.</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 11 Roles RBAC Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                Role-Based Access Control (11 Personas)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Granular multi-tenant permissions enforced across State, District, Block, GP, and Facility levels.
              </p>
            </div>
            <DataTag color="teal">SECURITY: RBAC</DataTag>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-clean">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Role Title</th>
                    <th className="py-3.5 px-4 font-bold">Administrative Scope</th>
                    <th className="py-3.5 px-4 font-bold">Key Responsibilities</th>
                    <th className="py-3.5 px-4 font-bold">Security Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {Object.values(ROLE_CONFIG).map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{role.name}</div>
                        <div className="text-[10px] font-hindi font-medium text-teal-700 dark:text-teal-400">{role.hindiName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-sky-800 dark:text-sky-300">{role.scope}</td>
                      <td className="py-3.5 px-4">{role.description}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <DataTag color="slate">{role.badge}</DataTag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact & Support Strip */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-clean">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-transparent">
              <PhoneCall size={24} />
            </div>
            <div>
              <div className="font-display font-bold text-base text-slate-900 dark:text-white">
                State FSSM Technical & Operational Cell
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Vikas Bhavan, Sector 19, North Block, Nava Raipur Atal Nagar, Chhattisgarh - 492002
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">TOLL FREE HELPLINE</div>
            <div className="font-display font-extrabold text-xl text-teal-700 dark:text-teal-400">1800-233-1234</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
