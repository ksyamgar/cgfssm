// API Client for CG Rural FSSM Platform

const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('cg_fssm_auth_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('cg_fssm_auth_token', token);
  } else {
    localStorage.removeItem('cg_fssm_auth_token');
  }
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // 1. AUTH & USER MANAGEMENT
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async login(emailOrPhone, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ emailOrPhone, password })
    });
    return await res.json();
  },

  async loginCitizenOtp(phone, otp) {
    const res = await fetch(`${API_BASE}/auth/citizen-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ phone, otp })
    });
    return await res.json();
  },

  async getMe() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  async getAllUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.users || [];
    } catch {
      return [];
    }
  },

  // 2. FSM OPERATIONS
  async getRequests(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/fsm/requests?${query}`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.requests || [];
    } catch {
      return [];
    }
  },

  async createRequest(reqData) {
    const res = await fetch(`${API_BASE}/fsm/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reqData)
    });
    return await res.json();
  },

  async updateRequestStatus(id, updateData) {
    const res = await fetch(`${API_BASE}/fsm/requests/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  },

  async getVehicles() {
    try {
      const res = await fetch(`${API_BASE}/fsm/vehicles`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.vehicles || [];
    } catch {
      return [];
    }
  },

  async getFstps() {
    try {
      const res = await fetch(`${API_BASE}/fsm/fstps`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.fstps || [];
    } catch {
      return [];
    }
  },

  async getTariffs() {
    try {
      const res = await fetch(`${API_BASE}/fsm/tariffs`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.tariffs || [];
    } catch {
      return [];
    }
  },

  async getAuditLogs() {
    try {
      const res = await fetch(`${API_BASE}/fsm/audit-logs`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.auditLogs || [];
    } catch {
      return [];
    }
  }
};
