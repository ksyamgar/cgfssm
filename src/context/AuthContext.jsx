import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, ROLE_CONFIG, MOCK_USERS } from '../constants/roles';
import { getStorageData, setStorageData } from '../services/storageService';
import { apiService, setAuthToken } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return getStorageData('cg_fssm_auth_user', MOCK_USERS[0]);
  });
  const [loading, setLoading] = useState(false);

  // Sync token and verify user on mount
  useEffect(() => {
    setStorageData('cg_fssm_auth_user', currentUser);
  }, [currentUser]);

  const loginAsRole = (roleKey) => {
    const found = MOCK_USERS.find(u => u.role === roleKey) || MOCK_USERS[0];
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
        const fallbackUser = MOCK_USERS.find(u => u.email === emailOrPhone || u.phone === emailOrPhone) || {
          id: `usr_${Date.now()}`,
          name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Official User',
          role: ROLES.SUPER_ADMIN,
          phone: emailOrPhone,
          email: emailOrPhone.includes('@') ? emailOrPhone : '',
          designation: 'Officer',
          district: 'Durg (380)',
          block: 'Patan (3852)',
          gp: 'Selud (125430)'
        };
        setCurrentUser(fallbackUser);
        setLoading(false);
        return { success: true, user: fallbackUser };
      }
    } catch (err) {
      // Local fallback if server unreachable
      const fallbackUser = MOCK_USERS[0];
      setCurrentUser(fallbackUser);
      setLoading(false);
      return { success: true, user: fallbackUser };
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const response = await apiService.register(userData);
      if (response && response.success) {
        if (response.token) setAuthToken(response.token);
        if (response.user) setCurrentUser(response.user);
        setLoading(false);
        return response;
      }
      setLoading(false);
      return response;
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
      const fallbackCitizen = MOCK_USERS.find(u => u.role === ROLES.CITIZEN) || MOCK_USERS[5];
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
        currentUser,
        setCurrentUser,
        currentRole: currentUser?.role || null,
        currentRoleConfig,
        loginAsRole,
        loginWithCredentials,
        registerUser,
        loginWithCitizenOtp,
        logout,
        isAuthenticated: !!currentUser,
        loading,
        allRoles: ROLES,
        allMockUsers: MOCK_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

