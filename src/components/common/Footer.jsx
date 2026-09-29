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
    <footer className="w-full bg-cg-ink dark:bg-cg-ink bg-slate-900 text-cg-textDarkMuted border-t border-white/10 mt-auto transition-colors">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & SBM-G Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo/fssmlogo.png"
                alt="FSSM Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-display font-bold text-white text-base block leading-tight">
                  CG Rural FSSM Platform
                </span>
                <span className="text-[11px] text-cg-teal font-mono">
                  SBM-G ODF+ / ODF++ INITIATIVE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Statewide digital operating system connecting citizen desludging requests, live GPS fleet dispatch,
              geofenced treatment at FSTPs, and transparent financial ledgers for rural Chhattisgarh.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="/logo/Swachh_Bharat_Mission_Logo.png"
                alt="SBM-G"
                className="h-8 object-contain"
                title="Swachh Bharat Mission (Gramin)"
              />
              <div className="h-6 w-px bg-slate-700 dark:bg-white/20"></div>
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo/Chhattisgarh.webp"
                  alt="CG Govt"
                  className="h-8 object-contain"
                  title="Government of Chhattisgarh"
                />
                <img
                  src="/logo/unicef.webp"
                  alt="UNICEF"
                  className="h-7 max-h-7 w-auto object-contain"
                  title="Supported by UNICEF"
                />
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm tracking-wide uppercase border-l-2 border-cg-teal pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cg-teal transition-colors flex items-center gap-1.5">
                  • {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cg-teal transition-colors flex items-center gap-1.5">
                  • {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cg-teal transition-colors flex items-center gap-1.5">
                  • {t('nav_dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-cg-teal transition-colors flex items-center gap-1.5 font-semibold text-cg-teal">
                  • {t('nav_book')} (Instant)
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-cg-teal transition-colors flex items-center gap-1.5">
                  • {t('nav_app')} (RBAC Login)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm tracking-wide uppercase border-l-2 border-cg-cyan pl-2">
              Government Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://sbmrural.cgstate.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cg-cyan transition-colors flex items-center gap-1"
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
                  className="hover:text-cg-cyan transition-colors flex items-center gap-1"
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
                  className="hover:text-cg-cyan transition-colors flex items-center gap-1"
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
                  className="hover:text-cg-cyan transition-colors flex items-center gap-1"
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
                  className="hover:text-cg-cyan transition-colors flex items-center gap-1"
                >
                  <span>eGramSwaraj Accounting Interface</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Compliance */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm tracking-wide uppercase border-l-2 border-cg-amber pl-2">
              Support & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-cg-amber transition-colors">
                  • Contact State FSSM Cell (Toll-Free: 1800-233-1234)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cg-amber transition-colors">
                  • GIGW & Accessibility Statement
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cg-amber transition-colors">
                  • Website & Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cg-amber transition-colors">
                  • Disclaimer & Open Data Standards
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cg-amber transition-colors">
                  • Portal Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Official Government Strip */}
      <div className="w-full bg-slate-950 py-2.5 px-4 text-[11px] border-t border-white/10 flex flex-col md:flex-row items-center justify-between font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="truncate">GOVT. OF CHHATTISGARH • DEPT. OF PANCHAYAT & RURAL DEVELOPMENT • SBM-GRAMIN</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 bg-white/10 px-2 py-0.5 rounded border border-white/10 shadow-sm">
            <img src="/logo/Swachh_Bharat_Mission_Logo.png" alt="SBM" className="h-3.5 max-h-3.5 w-auto object-contain" title="Swachh Bharat Mission (Gramin)" />
            <span className="h-3 w-px bg-white/20"></span>
            <div className="flex items-center gap-2">
              <img src="/logo/Chhattisgarh.webp" alt="Chhattisgarh" className="h-4 max-h-4 w-auto object-contain" title="Government of Chhattisgarh" />
              <img src="/logo/unicef.webp" alt="UNICEF" className="h-3.5 max-h-3.5 w-auto object-contain" title="Supported by UNICEF" />
            </div>
          </div>
          <span>•</span>
          <span className="text-teal-400 font-semibold">LIVE TELEMETRY: 8731177e</span>
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-cg-navy/90 py-3 px-4 border-t border-white/5 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-cg-teal" />
            <span>CG FSSM Cell, Department of Panchayat & Rural Development, Government of Chhattisgarh</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Last Updated: {currentDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Activity size={12} className="text-cg-green" />
              <span>Portal Hits: <strong className="text-white">1,48,290</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Exact Copyright Line as required by §13 */}
      <div className="bg-black/50 py-3 px-4 border-t border-white/5 text-center text-xs text-slate-400">
        <p className="font-medium tracking-tight">
          © Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh | Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
