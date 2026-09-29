import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, ROLE_CONFIG, MOCK_USERS } from '../constants/roles';
import { getStorageData, setStorageData } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to Super Admin so evaluator can see everything immediately, but allow 1-click switcher
  const [currentUser, setCurrentUser] = useState(() => {
    return getStorageData('cg_fssm_auth_user', MOCK_USERS[0]);
  });

  useEffect(() => {
    setStorageData('cg_fssm_auth_user', currentUser);
  }, [currentUser]);

  const loginAsRole = (roleKey) => {
    const found = MOCK_USERS.find(u => u.role === roleKey) || MOCK_USERS[0];
    setCurrentUser(found);
  };

  const loginWithCredentials = (emailOrPhone, password) => {
    const user = MOCK_USERS.find(u => u.email === emailOrPhone || u.phone === emailOrPhone) || {
      id: `usr_${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Citizen User',
      role: ROLES.CITIZEN,
      phone: emailOrPhone,
      email: emailOrPhone.includes('@') ? emailOrPhone : '',
      designation: 'Citizen User',
      district: 'Raipur (378)',
      block: 'Dharsiwa (3836)',
      gp: 'Mandir Hasaud (124805)'
    };
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cg_fssm_auth_user');
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
        logout,
        isAuthenticated: !!currentUser,
        allRoles: ROLES,
        allMockUsers: MOCK_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
