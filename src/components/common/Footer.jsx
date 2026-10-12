import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, ExternalLink, Activity, Award, Heart } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <footer className="w-full bg-slate-100 dark:bg-[#031d30] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/10 mt-auto transition-colors duration-200">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & SBM-G Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo/fssmlogo.png"
                alt="FSSM Logo"
                className="w-10 h-10 object-contain drop-shadow-xs"
              />
              <div>
                <span className="font-display font-bold text-slate-900 dark:text-white text-base block leading-tight">
                  CG Rural FSSM Platform
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-mono font-bold">
                  SBM-G ODF+ / ODF++ INITIATIVE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Statewide digital operating system connecting citizen desludging requests, live GPS fleet dispatch,
              geofenced treatment at FSTPs, and transparent financial ledgers for rural Chhattisgarh.
            </p>
            <div className="inline-flex items-center gap-3 pt-1 bg-white dark:bg-white/10 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
              <img
                src="/logo/Swachh_Bharat_Mission_Logo.png"
                alt="SBM-G"
                className="h-7 sm:h-8 object-contain"
                title="Swachh Bharat Mission (Gramin)"
              />
              <div className="h-6 w-px bg-slate-200 dark:bg-white/20"></div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <img
                  src="/logo/Chhattisgarh.webp"
                  alt="CG Govt"
                  className="h-7 sm:h-8 object-contain drop-shadow-xs"
                  title="Government of Chhattisgarh"
                />
                <img
                  src="/logo/unicef.webp"
                  alt="UNICEF"
                  className="h-6 sm:h-7 max-h-7 w-auto object-contain"
                  title="Supported by UNICEF"
                />
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase border-l-2 border-teal-600 dark:border-teal-400 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  • {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  • {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  • {t('nav_dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors flex items-center gap-1.5 font-bold">
                  • {t('nav_book')} (Instant)
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  • {t('nav_app')} (RBAC Login)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase border-l-2 border-sky-600 dark:border-sky-400 pl-2">
              Government Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://sbmrural.cgstate.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <span>Dept. of Panchayat & Rural Development</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://cgstate.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <span>Govt. of Chhattisgarh Official Portal</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://swachhbharatmission.ddws.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <span>Swachh Bharat Mission - Gramin (GoI)</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://lgdirectory.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <span>Local Government Directory (LGD)</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://egramswaraj.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <span>eGramSwaraj Accounting Interface</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Compliance */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase border-l-2 border-amber-600 dark:border-amber-400 pl-2">
              Support & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  • Contact State FSSM Cell (Toll-Free: 1800-233-1234)
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  • GIGW & Accessibility Statement
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  • Website & Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  • Disclaimer & Open Data Standards
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  • Portal Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Official Government Strip */}
      <div className="w-full bg-slate-200/90 dark:bg-slate-950 py-2.5 px-4 text-[11px] border-t border-slate-300/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between font-mono text-slate-700 dark:text-slate-400 gap-2 transition-colors">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="truncate font-semibold">GOVT. OF CHHATTISGARH • DEPT. OF PANCHAYAT & RURAL DEVELOPMENT • SBM-GRAMIN</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-slate-300 dark:border-white/10 shadow-xs">
            <img src="/logo/Swachh_Bharat_Mission_Logo.png" alt="SBM" className="h-3.5 max-h-3.5 w-auto object-contain" title="Swachh Bharat Mission (Gramin)" />
            <span className="h-3 w-px bg-slate-300 dark:bg-white/20"></span>
            <div className="flex items-center gap-2">
              <img src="/logo/Chhattisgarh.webp" alt="Chhattisgarh" className="h-4 max-h-4 w-auto object-contain" title="Government of Chhattisgarh" />
              <img src="/logo/unicef.webp" alt="UNICEF" className="h-3.5 max-h-3.5 w-auto object-contain" title="Supported by UNICEF" />
            </div>
          </div>
          <span className="opacity-60">•</span>
          <span className="text-teal-700 dark:text-teal-400 font-bold">LIVE TELEMETRY: 8731177e</span>
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-slate-100 dark:bg-[#021827] py-3 px-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>CG FSSM Cell, Department of Panchayat & Rural Development, Government of Chhattisgarh</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Last Updated: {currentDate}</span>
            <span className="opacity-60">•</span>
            <span className="flex items-center gap-1">
              <Activity size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>Portal Hits: <strong className="text-slate-900 dark:text-white font-bold">1,48,290</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Exact Copyright Line */}
      <div className="bg-slate-200/90 dark:bg-black/60 py-3 px-4 border-t border-slate-300/80 dark:border-white/5 text-center text-xs text-slate-700 dark:text-slate-400 transition-colors">
        <p className="font-medium tracking-tight text-slate-800 dark:text-slate-300">
          © Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh | Designed by Raj Yamgar @UNICEF 2026, India. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
