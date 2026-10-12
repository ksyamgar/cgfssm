import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFsm } from '../../context/FsmContext';
import { DataTag } from './DataTag';
import {
  LayoutDashboard,
  ClipboardList,
  Navigation,
  MapPin,
  Truck,
  Users,
  Factory,
  Building2,
  Database,
  FileSpreadsheet,
  Cpu,
  Globe,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Bell,
  Wifi,
  WifiOff,
  UserCheck,
  CheckCircle2,
  Home,
  User,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

export const AppShell = ({ children }) => {
  const { currentUser, currentRole, currentRoleConfig, logout } = useAuth();
  const { t, lang, setLang, languages } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isOnline, pendingSyncCount } = useFsm();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const {
    districts,
    blocks,
    gramPanchayats,
    villages,
    selectedDistrict,
    selectedBlock,
    selectedGp,
    selectedVillage,
    handleDistrictChange,
    handleBlockChange,
    handleGpChange,
    handleVillageChange,
    resetScope
  } = useGeoScope();

  // Navigation definition with role gates
  const navSections = [
    {
      label: t('section_operations') || 'OPERATIONS',
      items: [
        {
          label: t('nav_app'),
          path: '/app',
          icon: LayoutDashboard,
          roles: ['ALL']
        },
        {
          label: t('nav_requests'),
          path: '/app/requests',
          icon: ClipboardList,
          roles: ['ALL']
        },
        {
          label: t('nav_trips'),
          path: '/app/trips',
          icon: Navigation,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'VENDOR_ADMIN', 'DRIVER', 'FSTP_OPERATOR', 'AUDITOR']
        },
        {
          label: t('nav_map'),
          path: '/app/map',
          icon: MapPin,
          roles: ['ALL']
        }
      ]
    },
    {
      label: t('section_resources') || 'RESOURCES & ENTITIES',
      items: [
        {
          label: t('nav_fleet'),
          path: '/app/fleet',
          icon: Truck,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'VENDOR_ADMIN']
        },
        {
          label: t('nav_people'),
          path: '/app/people',
          icon: Users,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'GP_OPERATOR', 'VENDOR_ADMIN', 'AUDITOR']
        },
        {
          label: t('nav_fstp'),
          path: '/app/fstp',
          icon: Factory,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'FSTP_OPERATOR', 'AUDITOR']
        },
        {
          label: t('nav_vendors'),
          path: '/app/vendors',
          icon: Building2,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'VENDOR_ADMIN']
        }
      ]
    },
    {
      label: t('section_analytics') || 'ANALYTICS & MASTERS',
      items: [
        {
          label: t('nav_reports'),
          path: '/app/reports',
          icon: FileSpreadsheet,
          roles: ['ALL']
        },
        {
          label: t('nav_ai'),
          path: '/app/ai',
          icon: Cpu,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'AUDITOR']
        },
        {
          label: t('nav_masters'),
          path: '/app/masters',
          icon: Database,
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'GP_OPERATOR']
        }
      ]
    },
    {
      label: t('section_admin') || 'SYSTEM ADMIN & ACCOUNT',
      items: [
        {
          label: t('nav_profile'),
          path: '/app/profile',
          icon: User,
          roles: ['ALL']
        },
        {
          label: t('nav_cms'),
          path: '/app/cms',
          icon: Globe,
          roles: ['SUPER_ADMIN']
        },
        {
          label: t('nav_database'),
          path: '/app/database',
          icon: Database,
          roles: ['SUPER_ADMIN']
        },
        {
          label: t('nav_audit'),
          path: '/app/audit',
          icon: ShieldCheck,
          roles: ['SUPER_ADMIN', 'AUDITOR', 'STATE_OFFICER']
        },
        {
          label: t('nav_settings'),
          path: '/app/settings',
          icon: Settings,
          roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR']
        }
      ]
    }
  ];

  // Check if current user has permission to see nav item
  const canViewItem = (itemRoles) => {
    if (itemRoles.includes('ALL')) return true;
    if (currentRole === 'SUPER_ADMIN') return true;
    return itemRoles.includes(currentRole);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-cg-navy text-slate-800 dark:text-slate-100 antialiased font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-cg-ink/95 border-r border-slate-200 dark:border-white/10 flex flex-col transition-all duration-300 z-40 shrink-0 shadow-clean ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`h-16 border-b border-slate-200 dark:border-white/10 flex items-center ${isCollapsed ? 'justify-center px-2 flex-col gap-1' : 'justify-between px-3.5'}`}>
          {!isCollapsed ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition-opacity flex-1"
                title={t('nav_home') || 'Go to Main Website'}
              >
                <img src="/logo/fssmlogo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform" />
                <div className="truncate">
                  <div className="font-display font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                    CG RURAL FSSM
                  </div>
                  <div className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">OPERATIONS HUB</div>
                </div>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                {/* Home Icon: Navigate to Main Landing Page */}
                <Link
                  to="/"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/15 transition-colors"
                  title={t('nav_home') || 'Go to Main Page'}
                >
                  <Home size={18} />
                </Link>

                {/* Collapse / Expand Toggle */}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/15 transition-colors"
                title={t('nav_home') || 'Go to Main Page'}
              >
                <Home size={18} />
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* User Persona Profile Strip (Clickable to Edit Profile) */}
        <Link
          to="/app/profile"
          className="p-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors group block"
          title="Click to view & edit your profile"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
              {currentUser?.name?.[0] || 'U'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 transition-colors flex items-center justify-between">
                  <span>{currentUser?.name || 'User'}</span>
                  <span className="text-[10px] text-teal-600 font-semibold">{t('edit_profile') || 'Edit'}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-semibold text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-500/15 px-1.5 py-0.5 rounded truncate">
                    {currentRoleConfig?.name?.split(' ')[0] || currentRole}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navSections.map((section, idx) => {
            const visibleItems = section.items.filter(item => canViewItem(item.roles));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {section.label}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white font-bold shadow-clean-md'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-2">
          {/* Offline / Online Status Indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-transparent">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {!isCollapsed && <span className="text-emerald-700 dark:text-emerald-400 font-bold">{t('status_online') || 'ONLINE'}</span>}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {!isCollapsed && <span className="text-amber-700 dark:text-amber-400 font-bold">{t('status_offline') || 'OFFLINE (DEXIE)'}</span>}
                </>
              )}
            </div>
            {!isCollapsed && pendingSyncCount > 0 && (
              <span className="bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 px-1.5 rounded font-bold">
                {pendingSyncCount} sync
              </span>
            )}
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Return to Public Website"
          >
            <Globe size={15} />
            {!isCollapsed && <span>{t('nav_public_portal') || 'Public Portal'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar with Compact Cascading Geo-Scope Filter */}
        <header className="h-14 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-cg-ink/80 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between gap-2 z-30 shadow-sm shrink-0">
          {/* Cascading Geo-Scope Filter (District -> Block -> GP) */}
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-teal-800 dark:text-teal-400 shrink-0">
              <Filter size={13} />
              <span className="hidden lg:inline text-[10px] uppercase">GEO:</span>
            </div>

            {/* District Select */}
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-slate-50 dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-lg text-xs py-1 px-2 text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none max-w-[125px] sm:max-w-[160px] truncate"
              title={selectedDistrict || 'All Districts (State)'}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Block Select */}
            {selectedDistrict && (
              <select
                value={selectedBlock}
                onChange={(e) => handleBlockChange(e.target.value)}
                className="bg-slate-50 dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-lg text-xs py-1 px-2 text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none max-w-[110px] sm:max-w-[140px] truncate"
                title={selectedBlock || 'All Blocks'}
              >
                <option value="">All Blocks</option>
                {blocks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            )}

            {/* Gram Panchayat Select */}
            {selectedBlock && (
              <select
                value={selectedGp}
                onChange={(e) => handleGpChange(e.target.value)}
                className="bg-slate-50 dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-lg text-xs py-1 px-2 text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none max-w-[110px] sm:max-w-[140px] truncate hidden sm:block"
                title={selectedGp || 'All Gram Panchayats'}
              >
                <option value="">All GPs</option>
                {gramPanchayats.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}

            {(selectedDistrict || selectedBlock || selectedGp) && (
              <button
                onClick={resetScope}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-md shrink-0 font-medium"
                title="Reset Geo Filter to State"
              >
                {t('btn_reset') || 'Reset'}
              </button>
            )}
          </div>

          {/* Right Tools: Language Toggle, Theme Toggle, Public Portal Link */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                aria-label="Change Language"
                title="Change Platform Language"
              >
                <Globe size={13} className="text-teal-600 dark:text-teal-400" />
                <span className="uppercase text-[11px] font-mono">{lang}</span>
                <ChevronDown size={11} className="opacity-60" />
              </button>
              {isLangOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-white dark:bg-cg-ink border border-slate-200 dark:border-white/15 rounded-xl p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-white/10 mb-1">
                    {t('select_language') || 'Language'}
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        lang === l.code
                          ? 'bg-teal-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] font-mono opacity-80">{l.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-700 dark:text-slate-300" />}
            </button>

            {/* Public Portal Link */}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors shrink-0"
              title="Return to Public Portal"
            >
              <Home size={13} className="text-teal-600 dark:text-teal-400" />
              <span className="hidden md:inline">{t('nav_public_portal') || 'Public Portal'}</span>
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-cg-navy">
          {children}
        </main>
      </div>
    </div>
  );
};
