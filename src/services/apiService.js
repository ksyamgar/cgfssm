// API Client for CG Rural FSSM Platform (Dynamic SQLite Backend Integration)

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

  // 2. FSM REQUESTS CRUD
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

  async updateRequest(id, updateData) {
    const res = await fetch(`${API_BASE}/fsm/requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  },

  // 3. VEHICLES CRUD
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

  async createVehicle(vehData) {
    const res = await fetch(`${API_BASE}/fsm/vehicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vehData)
    });
    return await res.json();
  },

  async updateVehicle(id, updateData) {
    const res = await fetch(`${API_BASE}/fsm/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  },

  async bulkUpsertVehicles(vehiclesList) {
    try {
      const res = await fetch(`${API_BASE}/fsm/vehicles/bulk`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ vehicles: vehiclesList })
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend bulk upsert offline, cached in localStorage');
      return { success: false };
    }
  },

  // 4. FSTPs CRUD
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

  async createFstp(fstpData) {
    const res = await fetch(`${API_BASE}/fsm/fstps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(fstpData)
    });
    return await res.json();
  },

  async updateFstp(id, updateData) {
    const res = await fetch(`${API_BASE}/fsm/fstps/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  },

  // 5. VENDORS CRUD
  async getVendors() {
    try {
      const res = await fetch(`${API_BASE}/fsm/vendors`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.vendors || [];
    } catch {
      return [];
    }
  },

  async createVendor(vendorData) {
    const res = await fetch(`${API_BASE}/fsm/vendors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vendorData)
    });
    return await res.json();
  },

  // 6. TARIFFS
  async getTariffs() {
    try {
      const res = await fetch(`${API_BASE}/fsm/tariffs`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.tariffs || {};
    } catch {
      return {};
    }
  },

  async updateTariff(district, tariffData) {
    const res = await fetch(`${API_BASE}/fsm/tariffs/${encodeURIComponent(district)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(tariffData)
    });
    return await res.json();
  },

  // 7. SETTINGS
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/fsm/settings`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.settings || {};
    } catch {
      return {};
    }
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/fsm/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData)
    });
    return await res.json();
  },

  // 8. AUDIT LOGS
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
  },

  async createAuditLog(logData) {
    const res = await fetch(`${API_BASE}/fsm/audit-logs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(logData)
    });
    return await res.json();
  },

  // 9. DYNAMIC KPIS & STATS
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/fsm/stats`, {
        headers: getHeaders()
      });
      const data = await res.json();
      return data.stats || null;
    } catch {
      return null;
    }
  }
};
