import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { useLanguage } from '../../context/LanguageContext';
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
  CheckCircle2
} from 'lucide-react';

export const AppShell = ({ children }) => {
  const { currentUser, currentRole, currentRoleConfig, logout } = useAuth();
  const { t, lang } = useLanguage();
  const { isOnline, pendingSyncCount } = useFsm();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      label: 'OPERATIONS',
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
      label: 'RESOURCES & ENTITIES',
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
          roles: ['SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'VENDOR_ADMIN']
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
      label: 'ANALYTICS & MASTERS',
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
      label: 'SYSTEM ADMIN',
      items: [
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
        <div className="h-16 px-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <img src="/logo/fssmlogo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <div className="truncate">
                <div className="font-display font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                  CG RURAL FSSM
                </div>
                <div className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">CONTROL TOWER</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Persona Profile Strip */}
        <div className="p-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser?.name?.[0] || 'U'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'User'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-semibold text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-500/15 px-1.5 py-0.5 rounded truncate">
                    {currentRoleConfig?.name?.split(' ')[0] || currentRole}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

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
                  {!isCollapsed && <span className="text-emerald-700 dark:text-emerald-400 font-bold">ONLINE</span>}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {!isCollapsed && <span className="text-amber-700 dark:text-amber-400 font-bold">OFFLINE (DEXIE)</span>}
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
            {!isCollapsed && <span>Public Portal</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar with Cascading Geo-Scope Filter */}
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-cg-ink/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-30 shadow-clean">
          {/* Cascading Geo-Scope Filter (District -> Block -> GP -> Village) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-2xl">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-teal-800 dark:text-teal-400 shrink-0">
              <Filter size={14} />
              <span className="hidden sm:inline">GEO-SCOPE:</span>
            </div>

            {/* District Select */}
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-slate-50 dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-lg text-xs py-1.5 px-2 text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none"
            >
              <option value="">All Districts (State)</option>
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
                className="bg-slate-50 dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-lg text-xs py-1.5 px-2 text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none"
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
                className="bg-slate-50 dark:bg-cg-navy border border-slate-300 dark:border-white/15 rounded-lg text-xs py-1.5 px-2 text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none"
              >
                <option value="">All Gram Panchayats</option>
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
                className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg shrink-0 font-medium"
                title="Reset Geo Filter to State"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right Tools: Role Badge & Return to Home */}
          <div className="flex items-center gap-3 shrink-0">
            <DataTag color="teal">
              {currentUser?.district?.split(' ')[0] || 'STATEWIDE'}
            </DataTag>
            <Link
              to="/book"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean"
            >
              + New Desludge
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
