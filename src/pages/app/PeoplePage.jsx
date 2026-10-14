import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGeoScope } from '../../context/GeoScopeContext';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTag } from '../../components/common/DataTag';
import {
  Users,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Edit,
  Trash2,
  X,
  Search,
  Lock,
  Building2,
  MapPin,
  Sparkles,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { ROLE_CONFIG, CREATION_HIERARCHY, ROLES } from '../../constants/roles';
import { notifySuccess, notifyError, notifyWarning } from '../../services/toastService';
import { CG_URBAN_BODIES } from '../../constants/urbanBodies';

export const PeoplePage = () => {
  const {
    users,
    currentUser,
    currentRole,
    canCreate,
    allowedRolesToCreate,
    canEditUser,
    createAccountByAuthority,
    updateUser,
    deleteUser
  } = useAuth();

  const { districts, blocks, gramPanchayats } = useGeoScope();

  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('ALL'); // ALL, RURAL, URBAN

  // Helper to generate government standard official email from Name and Role
  const generateOfficialEmail = (name, role) => {
    if (!name || !name.trim()) return '';
    const cleanName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .join('.');

    const rolePrefixes = {
      SUPER_ADMIN: 'admin',
      STATE_OFFICER: 'state',
      DISTRICT_COORDINATOR: 'dc',
      BLOCK_COORDINATOR: 'bc',
      GP_OPERATOR: 'gp',
      VENDOR_ADMIN: 'vendor',
      DRIVER: 'driver',
      SANITATION_WORKER: 'worker',
      FSTP_OPERATOR: 'fstp',
      AUDITOR: 'audit',
      CITIZEN: 'citizen'
    };

    const roleTag = rolePrefixes[role] || (role ? role.toLowerCase().replace(/_/g, '.') : 'official');
    return cleanName ? `${cleanName}.${roleTag}@cgrural.gov.in` : '';
  };

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');
  const [isEmailManuallyEdited, setIsEmailManuallyEdited] = useState(false);

  // New User Form State - RURAL is default as requested
  const defaultNewRole = allowedRolesToCreate[0] || ROLES.SANITATION_WORKER;
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: defaultNewRole,
    phone: '',
    email: '',
    designation: '',
    areaType: 'RURAL', // DEFAULT: RURAL
    district: currentUser?.district || 'Raipur (378)',
    block: currentUser?.block || 'Dharsiwa (3836)',
    gp: currentUser?.gp || 'Mandir Hasaud (124805)',
    ulb: CG_URBAN_BODIES[0],
    ward: ''
  });

  // Handle Name Change with Auto-Email Generation
  const handleNameChange = (val) => {
    const autoEmail = !isEmailManuallyEdited ? generateOfficialEmail(val, newUserData.role) : newUserData.email;
    setNewUserData(prev => ({
      ...prev,
      name: val,
      email: autoEmail
    }));
  };

  // Handle Role Change with Auto-Email Generation
  const handleRoleChange = (newRole) => {
    const autoEmail = !isEmailManuallyEdited ? generateOfficialEmail(newUserData.name, newRole) : newUserData.email;
    setNewUserData(prev => ({
      ...prev,
      role: newRole,
      email: autoEmail
    }));
  };

  // Authority configuration
  const hierarchyConfig = CREATION_HIERARCHY[currentRole] || { level: 99, geoLock: 'SELF', title: 'Restricted' };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const userArea = u.areaType || 'RURAL';
    const matchesArea = selectedAreaFilter === 'ALL' || userArea === selectedAreaFilter;
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.phone.includes(searchQuery) ||
      (u.designation && u.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.ulb && u.ulb.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.ward && u.ward.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesDistrict = true;
    if (selectedDistrictFilter) {
      const cleanFilter = selectedDistrictFilter.replace(/\s*\(\d+\)$/, '').trim().toLowerCase();
      const userDist = (u.district || '').toLowerCase();
      const cleanUserDist = userDist.replace(/\s*\(\d+\)$/, '').trim();
      matchesDistrict =
        userDist.includes(cleanFilter) ||
        cleanUserDist.includes(cleanFilter) ||
        cleanFilter.includes(cleanUserDist) ||
        userDist.includes('state') ||
        userDist.includes('all');
    }

    return matchesRole && matchesArea && matchesSearch && matchesDistrict;
  });

  // Handle Create User Submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setActionErrorMsg('');
    setActionSuccessMsg('');

    if (!newUserData.name || !newUserData.phone) {
      const err = 'Please fill in required fields (Name and Mobile Phone).';
      setActionErrorMsg(err);
      notifyWarning(err, 'Missing Details');
      return;
    }

    // Ensure email is generated if empty
    const finalData = {
      ...newUserData,
      areaType: newUserData.areaType || 'RURAL',
      email: newUserData.email || generateOfficialEmail(newUserData.name, newUserData.role)
    };

    const res = createAccountByAuthority(finalData);
    if (res.success) {
      const msg = `Account successfully created for ${finalData.name} (${finalData.role} - ${finalData.areaType === 'URBAN' ? 'Urban' : 'Rural'})`;
      setActionSuccessMsg(`✓ ${msg}`);
      notifySuccess(msg, 'Account Created');
      setIsCreateModalOpen(false);
      setIsEmailManuallyEdited(false);
      setNewUserData({
        name: '',
        role: allowedRolesToCreate[0] || ROLES.SANITATION_WORKER,
        phone: '',
        email: '',
        designation: '',
        areaType: 'RURAL', // Make rural default
        district: currentUser?.district || 'Raipur (378)',
        block: currentUser?.block || 'Dharsiwa (3836)',
        gp: currentUser?.gp || 'Mandir Hasaud (124805)',
        ulb: CG_URBAN_BODIES[0],
        ward: ''
      });
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } else {
      const err = res.message || 'Failed to create user account.';
      setActionErrorMsg(err);
      notifyError(err, 'Creation Failed');
    }
  };

  // Handle Edit User Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, editingUser);
    const msg = `Profile updated for ${editingUser.name}`;
    setActionSuccessMsg(`✓ ${msg}`);
    notifySuccess(msg, 'User Updated');
    setEditingUser(null);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Handle Delete / Deactivate User
  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to deactivate and remove account: ${userName}?`)) {
      deleteUser(userId);
      const msg = `Account ${userName} has been removed.`;
      setActionSuccessMsg(`✓ ${msg}`);
      notifyWarning(msg, 'Account Deactivated');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Hierarchy Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <DataTag color="teal">CONTROL TOWER</DataTag>
            <DataTag color="cyan">PERSONNEL & RBAC DIRECTORY</DataTag>
            {canCreate ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-transparent flex items-center gap-1">
                <ShieldCheck size={12} />
                LEVEL {hierarchyConfig.level}: {hierarchyConfig.title}
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 font-medium">
                READ-ONLY DIRECTORY
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1.5">
            Personnel Directory & Account Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {canCreate
              ? `You have administrative privileges to register and edit profiles for accounts under your jurisdiction (${hierarchyConfig.title}).`
              : 'View verified personnel, Swachhata Mitra crew, and empanelled field operators.'}
          </p>
        </div>

        {/* Action Button */}
        {canCreate && (
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setActionErrorMsg('');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean-md transition-all shrink-0 hover:scale-[1.02]"
          >
            <UserPlus size={16} />
            <span>+ Register New Account</span>
          </button>
        )}
      </div>

      {/* Success / Error Notification Bar */}
      {actionSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}
      {actionErrorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{actionErrorMsg}</span>
          <button onClick={() => setActionErrorMsg('')} className="text-rose-600 hover:text-rose-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search personnel by name, phone, email, designation, or ULB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-cg-navy border border-slate-200 dark:border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
            />
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="w-full bg-white dark:bg-cg-navy border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500 font-medium"
            >
              <option value="ALL">All Areas (Urban & Rural)</option>
              <option value="RURAL">🌱 Rural Only (ग्रामीण)</option>
              <option value="URBAN">🏢 Urban Only (शहरी)</option>
            </select>
          </div>

          <div className="w-full sm:w-52 shrink-0">
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="w-full bg-white dark:bg-cg-navy border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setFilterRole('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              filterRole === 'ALL'
                ? 'bg-teal-600 text-white shadow-clean'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white'
            }`}
          >
            ALL ({users.length})
          </button>
          {Object.keys(ROLES).map((r) => {
            const count = users.filter((u) => u.role === r).length;
            if (count === 0 && !allowedRolesToCreate.includes(r)) return null;
            return (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterRole === r
                    ? 'bg-teal-600 text-white shadow-clean'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white'
                }`}
              >
                <span>{r.replace(/_/g, ' ')}</span>
                <span className="text-[10px] opacity-75 font-bold">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const isEditable = canEditUser(user);
          const isSelf = currentUser?.id === user.id;
          const isUrban = user.areaType === 'URBAN';

          return (
            <div
              key={user.id}
              className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all flex flex-col justify-between shadow-sm relative group"
            >
              <div className="space-y-3">
                {/* Header with Name and Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                      {user.role}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUrban ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 font-bold border border-sky-300 dark:border-transparent flex items-center gap-0.5">
                        <span>🏢</span> URBAN
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-transparent flex items-center gap-0.5">
                        <span>🌱</span> RURAL
                      </span>
                    )}

                    <DataTag color={user.role === ROLES.SUPER_ADMIN ? 'emerald' : user.role === ROLES.STATE_OFFICER ? 'teal' : 'cyan'}>
                      {user.district?.split(' ')[0] || 'STATE'}
                    </DataTag>
                  </div>
                </div>

                {/* Designation */}
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {user.designation || ROLE_CONFIG[user.role]?.name || 'Empaneled Official'}
                </div>

                {/* Contact Box */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                      <Mail size={13} className="text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={13} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                      {isUrban
                        ? `${user.ulb ? `${user.ulb}, ` : ''}${user.ward ? `${user.ward}, ` : ''}${user.district || 'Statewide'}`
                        : `${user.gp ? `${user.gp}, ` : ''}${user.block ? `${user.block}, ` : ''}${user.district || 'Statewide'}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Verified Status & Action Buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-white/10 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>{user.status || 'Active'}</span>
                </span>

                {/* Edit & Delete Action Buttons (Level-Gated) */}
                <div className="flex items-center gap-1.5">
                  {isEditable ? (
                    <>
                      <button
                        onClick={() => setEditingUser({ ...user })}
                        className="p-1.5 rounded-lg text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-500/20 transition-colors flex items-center gap-1 text-xs font-medium"
                        title="Edit User Profile"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      {!isSelf && (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-colors"
                          title="Deactivate / Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1" title="Restricted to higher authority">
                      <Lock size={12} />
                      <span>Protected</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
          <Users size={36} className="text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No personnel found matching the selected filters.
          </p>
          <button
            onClick={() => {
              setFilterRole('ALL');
              setSearchQuery('');
              setSelectedDistrictFilter('');
            }}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* CREATE NEW USER MODAL (Level-Wise Role Options) */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-cg-ink max-w-xl w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    Register Official Account
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create level-authorized account ({hierarchyConfig.title})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Role Selection (Level-Gated) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assigned Official Role (Level-Authorized) *
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  required
                >
                  {allowedRolesToCreate.map((r) => (
                    <option key={r} value={r}>
                      {r.replace(/_/g, ' ')} - {ROLE_CONFIG[r]?.name || r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Verma"
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="e.g. 9826100000"
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Official Email
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmailManuallyEdited(false);
                        setNewUserData(prev => ({
                          ...prev,
                          email: generateOfficialEmail(prev.name, prev.role)
                        }));
                      }}
                      className="text-[10px] font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
                      title="Auto generate official email from Name & Role"
                    >
                      <Sparkles size={11} />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => {
                      setIsEmailManuallyEdited(true);
                      setNewUserData({ ...newUserData, email: e.target.value });
                    }}
                    placeholder={newUserData.name ? generateOfficialEmail(newUserData.name, newUserData.role) : 'official@cgrural.gov.in'}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Auto-formatted: <span className="font-mono text-teal-600 dark:text-teal-400">{newUserData.email || 'name.role@cgrural.gov.in'}</span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={newUserData.designation}
                    onChange={(e) => setNewUserData({ ...newUserData, designation: e.target.value })}
                    placeholder="e.g. Lead FSTP Chemist"
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              {/* Mandatory Urban or Rural Question - RURAL IS DEFAULT */}
              <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span>Is this account Urban or Rural? (क्षेत्र प्रकार) *</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-transparent">
                    Default: Rural
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Specify whether this account operates within a Rural Panchayat (SBM-G) or an Urban Local Body (ULB).
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setNewUserData(prev => ({ ...prev, areaType: 'RURAL' }))}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      (newUserData.areaType || 'RURAL') === 'RURAL'
                        ? 'border-emerald-500 bg-white dark:bg-cg-navy ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-base">🌱</span>
                        <span>Rural (ग्रामीण)</span>
                      </span>
                      {(newUserData.areaType || 'RURAL') === 'RURAL' && (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Gram Panchayat, Block & Village jurisdiction (SBM-G)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUserData(prev => ({ ...prev, areaType: 'URBAN' }))}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      newUserData.areaType === 'URBAN'
                        ? 'border-sky-500 bg-white dark:bg-cg-navy ring-2 ring-sky-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-base">🏢</span>
                        <span>Urban (शहरी / ULB)</span>
                      </span>
                      {newUserData.areaType === 'URBAN' && (
                        <CheckCircle2 size={16} className="text-sky-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Nagar Palik Nigam, Palika Parishad & Urban Wards
                    </span>
                  </button>
                </div>
              </div>

              {/* Geo Jurisdictional Assignment (Dynamically switches for Rural vs Urban) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin size={13} className="text-teal-600" />
                    <span>
                      {(newUserData.areaType || 'RURAL') === 'RURAL'
                        ? 'RURAL JURISDICTIONAL SCOPE (SBM-G)'
                        : 'URBAN JURISDICTIONAL SCOPE (ULB / WARD)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {(newUserData.areaType || 'RURAL') === 'RURAL' ? 'Rural Hierarchy' : 'Urban Local Body'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">District (जिला) *</label>
                    <select
                      value={newUserData.district}
                      disabled={hierarchyConfig.geoLock === 'DISTRICT' || hierarchyConfig.geoLock === 'BLOCK' || hierarchyConfig.geoLock === 'GP'}
                      onChange={(e) => setNewUserData({ ...newUserData, district: e.target.value })}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white disabled:opacity-60 outline-none"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {(newUserData.areaType || 'RURAL') === 'RURAL' ? (
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Block (विकासखंड) *</label>
                      <select
                        value={newUserData.block}
                        disabled={hierarchyConfig.geoLock === 'BLOCK' || hierarchyConfig.geoLock === 'GP'}
                        onChange={(e) => setNewUserData({ ...newUserData, block: e.target.value })}
                        className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white disabled:opacity-60 outline-none"
                      >
                        <option value="All Blocks">All Blocks</option>
                        {blocks.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Urban Local Body (ULB / नगर निकाय) *</label>
                      <select
                        value={newUserData.ulb || CG_URBAN_BODIES[0]}
                        onChange={(e) => setNewUserData({ ...newUserData, ulb: e.target.value })}
                        className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                      >
                        {CG_URBAN_BODIES.map((ub) => (
                          <option key={ub} value={ub}>{ub}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(newUserData.areaType || 'RURAL') === 'RURAL' ? (
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Gram Panchayat (ग्राम पंचायत)</label>
                      <select
                        value={newUserData.gp}
                        disabled={hierarchyConfig.geoLock === 'GP'}
                        onChange={(e) => setNewUserData({ ...newUserData, gp: e.target.value })}
                        className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white disabled:opacity-60 outline-none"
                      >
                        <option value="All GPs">All Gram Panchayats</option>
                        {gramPanchayats.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Ward Number / Zone (वार्ड क्रमांक / ज़ोन) *</label>
                      <input
                        type="text"
                        value={newUserData.ward}
                        onChange={(e) => setNewUserData({ ...newUserData, ward: e.target.value })}
                        placeholder="e.g. Ward 12 / Zone 3"
                        className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-slate-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean flex items-center gap-1.5"
                >
                  <UserPlus size={15} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER PROFILE MODAL */}
      {editingUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="bg-white dark:bg-cg-ink max-w-lg w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <Edit size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    Edit Profile: {editingUser.name}
                  </h3>
                  <p className="text-xs font-mono text-teal-700 dark:text-teal-400">
                    Role: {editingUser.role} (ID: {editingUser.id})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editingUser.designation || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, designation: e.target.value })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(prev => ({
                        ...prev,
                        email: generateOfficialEmail(prev.name, prev.role)
                      }));
                    }}
                    className="text-[10px] font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
                    title="Generate official email pattern"
                  >
                    <Sparkles size={11} />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-teal-600 outline-none"
                />
              </div>

              {/* Area Type Selection for Edit */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Area Classification (क्षेत्र प्रकार) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(prev => ({ ...prev, areaType: 'RURAL' }))}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      (editingUser.areaType || 'RURAL') === 'RURAL'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>🌱 Rural (ग्रामीण)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(prev => ({ ...prev, areaType: 'URBAN' }))}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      editingUser.areaType === 'URBAN'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>🏢 Urban (शहरी)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    District Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={editingUser.district || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, district: e.target.value })}
                    className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                  />
                </div>

                {(editingUser.areaType || 'RURAL') === 'RURAL' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Block / Gram Panchayat
                    </label>
                    <input
                      type="text"
                      value={editingUser.block || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, block: e.target.value })}
                      placeholder="e.g. Dharsiwa"
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Urban Local Body (ULB)
                    </label>
                    <select
                      value={editingUser.ulb || CG_URBAN_BODIES[0]}
                      onChange={(e) => setEditingUser({ ...editingUser, ulb: e.target.value })}
                      className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-600 outline-none"
                    >
                      {CG_URBAN_BODIES.map((ub) => (
                        <option key={ub} value={ub}>{ub}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-slate-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-clean flex items-center gap-1.5"
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
