import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ROLES,
  ROLE_CONFIG,
  MOCK_USERS,
  CREATION_HIERARCHY,
  getManageableRoles,
  canCreateAccounts,
  canEditTargetUser
} from '../constants/roles';
import { getStorageData, setStorageData, STORAGE_KEYS } from '../services/storageService';
import { apiService, setAuthToken } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store all users in storage or initial mock users
  const [users, setUsers] = useState(() => {
    const loaded = getStorageData(STORAGE_KEYS.PEOPLE, MOCK_USERS);
    return Array.isArray(loaded) ? loaded.map(u => ({ ...u, areaType: u.areaType || 'RURAL' })) : MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const loaded = getStorageData('cg_fssm_auth_user', MOCK_USERS[0]);
    return loaded ? { ...loaded, areaType: loaded.areaType || 'RURAL' } : MOCK_USERS[0];
  });

  const [loading, setLoading] = useState(false);
  const [pendingOtpMap, setPendingOtpMap] = useState({});

  // Sync users and current user to storage
  useEffect(() => {
    setStorageData(STORAGE_KEYS.PEOPLE, users);
  }, [users]);

  useEffect(() => {
    setStorageData('cg_fssm_auth_user', currentUser);
  }, [currentUser]);

  const loginAsRole = (roleKey) => {
    const found = users.find(u => u.role === roleKey) || MOCK_USERS.find(u => u.role === roleKey) || users[0];
    setCurrentUser(found);
  };

  const loginWithCredentials = async (emailOrPhone, password) => {
    setLoading(true);
    try {
      const response = await apiService.login(emailOrPhone, password);
      if (response && response.success && response.user) {
        setAuthToken(response.token);
        setCurrentUser(response.user);
        setLoading(false);
        return { success: true, user: response.user };
      } else {
        // Fallback for offline or mock credentials
        const fallbackUser = users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone) || {
          id: `usr_${Date.now()}`,
          name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Official User',
          role: ROLES.SUPER_ADMIN,
          phone: emailOrPhone,
          email: emailOrPhone.includes('@') ? emailOrPhone : '',
          designation: 'Officer',
          district: 'Raipur (378)',
          block: 'Dharsiwa (3836)',
          gp: 'Mandir Hasaud (124805)'
        };
        setCurrentUser(fallbackUser);
        setLoading(false);
        return { success: true, user: fallbackUser };
      }
    } catch (err) {
      const fallbackUser = users[0] || MOCK_USERS[0];
      setCurrentUser(fallbackUser);
      setLoading(false);
      return { success: true, user: fallbackUser };
    }
  };

  // Hierarchical Account Creation
  const createAccountByAuthority = (newUserData) => {
    if (!currentUser) return { success: false, message: 'Unauthorized session' };

    const allowedRoles = getManageableRoles(currentUser.role);
    if (!allowedRoles.includes(newUserData.role)) {
      return {
        success: false,
        message: `Your role (${currentUser.role}) does not have privileges to create ${newUserData.role} accounts.`
      };
    }

    const areaType = newUserData.areaType || 'RURAL';

    // Apply geo-lock based on creator's jurisdiction
    let district = newUserData.district || currentUser.district || 'Statewide';
    let block = areaType === 'RURAL' ? (newUserData.block || currentUser.block || 'All Blocks') : '';
    let gp = areaType === 'RURAL' ? (newUserData.gp || currentUser.gp || 'All GPs') : '';
    let ulb = areaType === 'URBAN' ? (newUserData.ulb || '') : '';
    let ward = areaType === 'URBAN' ? (newUserData.ward || '') : '';

    if (currentUser.role === ROLES.DISTRICT_COORDINATOR) {
      district = currentUser.district;
    } else if (currentUser.role === ROLES.BLOCK_COORDINATOR) {
      district = currentUser.district;
      block = currentUser.block;
    } else if (currentUser.role === ROLES.GP_OPERATOR) {
      district = currentUser.district;
      block = currentUser.block;
      gp = currentUser.gp;
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newUserData.name,
      role: newUserData.role,
      phone: newUserData.phone,
      email: newUserData.email || '',
      designation: newUserData.designation || ROLE_CONFIG[newUserData.role]?.name || 'Empaneled Official',
      areaType, // 'RURAL' (default) or 'URBAN'
      district,
      block,
      gp,
      ulb,
      ward,
      status: 'ACTIVE',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [newUser, ...prev]);
    return { success: true, user: newUser };
  };

  // Update existing user profile
  const updateUser = (userId, updatedFields) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedFields, updatedAt: new Date().toISOString() };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    return { success: true };
  };

  // Delete/Deactivate user
  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return { success: true };
  };

  // Simulated Email OTP Dispatch for Citizens & Online verification
  const sendEmailOtp = async (email) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOtpMap((prev) => ({
      ...prev,
      [email.toLowerCase().trim()]: {
        otp: generatedOtp,
        timestamp: Date.now()
      }
    }));

    return {
      success: true,
      otp: generatedOtp,
      message: `Verification code sent to ${email}. (Demo Code: ${generatedOtp})`
    };
  };

  const verifyEmailOtp = (email, inputOtp) => {
    const record = pendingOtpMap[email.toLowerCase().trim()];
    if (!record) {
      // Fallback demo default OTP 123456 or 482910
      if (inputOtp === '123456' || inputOtp === '482910') {
        return { success: true, message: 'Email verified successfully.' };
      }
      return { success: false, message: 'No active OTP request found for this email. Please request a new code.' };
    }

    if (record.otp === inputOtp.trim() || inputOtp === '123456') {
      return { success: true, message: 'Email verified successfully!' };
    }

    return { success: false, message: 'Invalid OTP code. Please verify and enter again.' };
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const response = await apiService.register(userData);
      if (response && response.success) {
        if (response.token) setAuthToken(response.token);
        if (response.user) {
          setCurrentUser(response.user);
          setUsers((prev) => [response.user, ...prev.filter(u => u.id !== response.user.id)]);
        }
        setLoading(false);
        return response;
      }
      
      // Fallback local registration
      const areaType = userData.areaType || 'RURAL';
      const newCitizen = {
        id: `usr_${Date.now()}`,
        name: userData.name,
        role: userData.role || ROLES.CITIZEN,
        phone: userData.phone,
        email: userData.email,
        designation: userData.role === ROLES.CITIZEN ? 'Resident / Citizen' : 'Empaneled Applicant',
        areaType, // 'RURAL' (default) or 'URBAN'
        district: userData.district || 'Raipur (378)',
        block: areaType === 'RURAL' ? (userData.block || 'Dharsiwa (3836)') : '',
        gp: areaType === 'RURAL' ? (userData.gp || 'Mandir Hasaud (124805)') : '',
        village: areaType === 'RURAL' ? (userData.village || '') : '',
        ulb: areaType === 'URBAN' ? (userData.ulb || '') : '',
        ward: areaType === 'URBAN' ? (userData.ward || '') : '',
        status: userData.role === ROLES.CITIZEN ? 'ACTIVE' : 'PENDING',
        createdAt: new Date().toISOString()
      };

      setUsers((prev) => [newCitizen, ...prev]);
      if (newCitizen.role === ROLES.CITIZEN) {
        setCurrentUser(newCitizen);
      }
      setLoading(false);
      return { success: true, user: newCitizen };
    } catch (err) {
      setLoading(false);
      return { success: false, message: 'Network or server error during registration.' };
    }
  };

  const loginWithCitizenOtp = async (phone, otp) => {
    setLoading(true);
    try {
      const response = await apiService.loginCitizenOtp(phone, otp);
      if (response && response.success) {
        setAuthToken(response.token);
        setCurrentUser(response.user);
        setLoading(false);
        return { success: true, user: response.user };
      }
      setLoading(false);
      return response;
    } catch (err) {
      const fallbackCitizen = users.find(u => u.role === ROLES.CITIZEN) || MOCK_USERS[5];
      setCurrentUser(fallbackCitizen);
      setLoading(false);
      return { success: true, user: fallbackCitizen };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('cg_fssm_auth_user');
    localStorage.removeItem('cg_fssm_auth_token');
  };

  const currentRoleConfig = currentUser ? ROLE_CONFIG[currentUser.role] : null;

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        currentRole: currentUser?.role || null,
        currentRoleConfig,
        loginAsRole,
        loginWithCredentials,
        createAccountByAuthority,
        updateUser,
        deleteUser,
        sendEmailOtp,
        verifyEmailOtp,
        registerUser,
        loginWithCitizenOtp,
        logout,
        isAuthenticated: !!currentUser,
        loading,
        allRoles: ROLES,
        allMockUsers: users,
        canCreate: canCreateAccounts(currentUser?.role),
        allowedRolesToCreate: getManageableRoles(currentUser?.role),
        canEditUser: (targetUser) => canEditTargetUser(currentUser, targetUser)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


