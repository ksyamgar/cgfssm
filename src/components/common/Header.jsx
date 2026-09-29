import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sun,
  Moon,
  Globe,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
  Radio,
  Sparkles
} from 'lucide-react';
import { DataTag } from './DataTag';

export const Header = () => {
  const { currentUser, currentRole, currentRoleConfig, loginAsRole, allRoles, allMockUsers, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { lang, setLang, t, languages } = useLanguage();
  const location = useLocation();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAppShell = location.pathname.startsWith('/app');

  return (
    <>
      {/* Main Navigation Bar (Pinned to sticky top-0) */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 dark:bg-cg-navy/95 border-b border-slate-200 dark:border-white/10 transition-colors shadow-clean">
        <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 lg:gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/logo/fssmlogo.png"
                alt="CG Rural FSSM Logo"
                className="w-9 h-9 sm:w-11 sm:h-11 max-h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                    CG RURAL FSSM
                  </span>
                  <span className="bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border border-teal-200 dark:border-transparent">
                    v1.0
                  </span>
                </div>
                <p className="text-[10px] lg:text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[160px] xl:max-w-[220px] font-sans">
                  {t('tagline')}
                </p>
              </div>
            </Link>

            {/* Official Partner Emblems */}
            <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-white/10 shrink-0">
              <img
                src="/logo/Swachh_Bharat_Mission_Logo.png"
                alt="Swachh Bharat Mission Logo"
                className="h-8 max-h-8 w-auto object-contain"
                title="Swachh Bharat Mission (Gramin)"
              />
              <div className="h-6 w-px bg-slate-300 dark:bg-white/20"></div>
              <div className="flex items-center gap-2">
                <img
                  src="/logo/Chhattisgarh.webp"
                  alt="Chhattisgarh Govt Emblem"
                  className="h-8 max-h-8 w-auto object-contain drop-shadow-sm"
                  title="Government of Chhattisgarh"
                />
                <img
                  src="/logo/unicef.webp"
                  alt="UNICEF Logo"
                  className="h-7 max-h-7 w-auto object-contain"
                  title="Supported by UNICEF"
                />
              </div>
            </div>
          </div>

          {/* Public Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            <Link
              to="/"
              className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                location.pathname === '/'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15'
                  : 'text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {t('nav_home')}
            </Link>
            <Link
              to="/about"
              className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                location.pathname === '/about'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15'
                  : 'text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {t('nav_about')}
            </Link>
            <Link
              to="/dashboard"
              className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                location.pathname === '/dashboard'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15'
                  : 'text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {t('nav_dashboard')}
            </Link>
            <Link
              to="/book"
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                location.pathname === '/book'
                  ? 'text-white bg-teal-600 shadow-clean-md'
                  : 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15 hover:bg-teal-100 dark:hover:bg-teal-500/25 border border-teal-200 dark:border-transparent'
              }`}
            >
              <Sparkles size={14} />
              <span>{t('nav_book')}</span>
            </Link>
            <Link
              to="/app"
              className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                location.pathname.startsWith('/app')
                  ? 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30'
                  : 'text-slate-700 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <Radio size={13} className="text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>{t('nav_app')}</span>
            </Link>
          </nav>

          {/* Right Tools & 11-Role Quick Persona Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 11-Role Tester Switcher Button */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-teal-200 dark:border-teal-500/40 bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-500/20 text-xs font-mono font-semibold transition-all shadow-sm shrink-0 whitespace-nowrap"
              title="Switch between all 11 RBAC roles for live evaluation"
            >
              <UserCheck size={14} />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-bold text-sky-700 dark:text-sky-300">{currentRoleConfig?.name?.split(' ')[0] || 'Role'}</span>
              <ChevronDown size={13} />
            </button>

            {/* Language Selector */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-2 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                aria-label="Change Language"
              >
                <Globe size={16} />
                <span className="uppercase text-[11px]">{lang}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-cg-ink border border-slate-200 dark:border-white/15 rounded-xl p-1.5 shadow-clean-lg z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        lang === l.code
                          ? 'bg-teal-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] opacity-75">{l.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 shrink-0"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white dark:bg-cg-ink border-b border-slate-200 dark:border-white/10 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-500/10"
          >
            {t('nav_home')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-500/10"
          >
            {t('nav_about')}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-500/10"
          >
            {t('nav_dashboard')}
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10"
          >
            {t('nav_book')}
          </Link>
          <Link
            to="/app"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10"
          >
            {t('nav_app')}
          </Link>
        </div>
      )}

      {/* 11-Role Fast Persona Switcher Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-cg-ink max-w-2xl w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 shadow-clean-lg animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    RBAC Role Evaluator (11 Roles)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Switch instant persona to verify role-gated permissions, actions, and data scopes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {allMockUsers.map((user) => {
                const isSelected = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      loginAsRole(user.role);
                      setIsRoleModalOpen(false);
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-500/20 shadow-clean'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100/80 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs font-mono text-teal-700 dark:text-teal-400 font-bold">
                          {user.role}
                        </div>
                      </div>
                      <DataTag color={isSelected ? 'teal' : 'slate'}>
                        {user.district?.split(' ')[0] || 'STATE'}
                      </DataTag>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                      {user.designation}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-slate-700 dark:text-white"
              >
                Close Switcher
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  </>
);
};
