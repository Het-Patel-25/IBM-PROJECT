// GridPulse AI – Auth Context (React Context API)
// Manages: JWT token, user object, permissions, login/signup/logout flow

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = '/api/auth';

// Permission matrix (mirrors backend config/permissions.js)
const PERMISSIONS = {
  admin: {
    pages: ['dashboard', 'assets', 'risk', 'prediction', 'maintenance', 'crew', 'admin'],
    canManageUsers: true,
    canDeleteAssets: true,
    canRunPrediction: true,
    canEditMaintenance: true,
    canViewAllAssets: true,
    canViewRiskAnalysis: true,
    canManageCrew: true,
    canViewAdminPanel: true,
    label: 'System Administrator'
  },
  department_manager: {
    pages: ['dashboard', 'assets', 'risk', 'prediction', 'maintenance', 'crew'],
    canManageUsers: false,
    canDeleteAssets: false,
    canRunPrediction: true,
    canEditMaintenance: true,
    canViewAllAssets: true,
    canViewRiskAnalysis: true,
    canManageCrew: true,
    canViewAdminPanel: false,
    label: 'Department Manager'
  },
  employee: {
    pages: ['dashboard', 'assets', 'maintenance'],
    canManageUsers: false,
    canDeleteAssets: false,
    canRunPrediction: false,
    canEditMaintenance: false,
    canViewAllAssets: false,
    canViewRiskAnalysis: false,
    canManageCrew: false,
    canViewAdminPanel: false,
    label: 'Field Employee'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(() => localStorage.getItem('gp_token'));
  const [loading, setLoading]     = useState(true);
  const [permissions, setPerms]   = useState(PERMISSIONS.employee);

  // Auto-load user from stored token on mount
  useEffect(() => {
    if (token) {
      fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(u => {
          setUser(u);
          setPerms(PERMISSIONS[u.role] || PERMISSIONS.employee);
        })
        .catch(() => {
          localStorage.removeItem('gp_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const saveSession = (tok, usr) => {
    localStorage.setItem('gp_token', tok);
    setToken(tok);
    setUser(usr);
    setPerms(PERMISSIONS[usr.role] || PERMISSIONS.employee);
  };

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = useCallback(async ({ name, email, password, role, department }) => {
    const res = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, department })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    saveSession(data.token, data.user);
    return data;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.requiresTwoFactor) {
      return { requiresTwoFactor: true, preAuthToken: data.preAuthToken };
    }
    saveSession(data.token, data.user);
    return { requiresTwoFactor: false };
  }, []);

  // ── Verify 2FA ────────────────────────────────────────────────────────────
  const verify2fa = useCallback(async ({ preAuthToken, code }) => {
    const res = await fetch(`${API}/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preAuthToken, code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '2FA verification failed');
    saveSession(data.token, data.user);
    return data;
  }, []);

  // ── Setup 2FA ─────────────────────────────────────────────────────────────
  const setup2fa = useCallback(async () => {
    const res = await fetch(`${API}/setup-2fa`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data; // { secret, qrCode, manualEntryKey }
  }, [token]);

  // ── Confirm 2FA ───────────────────────────────────────────────────────────
  const confirm2fa = useCallback(async (code) => {
    const res = await fetch(`${API}/confirm-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    // Refresh user state to reflect twoFactorEnabled
    const me = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (me.ok) { const u = await me.json(); setUser(u); }
    return data;
  }, [token]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('gp_token');
    setToken(null);
    setUser(null);
    setPerms(PERMISSIONS.employee);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const can = useCallback((permission) => {
    return !!permissions[permission];
  }, [permissions]);

  const canAccessPage = useCallback((page) => {
    return permissions.pages?.includes(page) ?? false;
  }, [permissions]);

  // Authenticated fetch helper (auto-attaches Bearer token)
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }
    return res;
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{
      user, token, loading, permissions,
      isAuthenticated: !!user,
      signup, login, verify2fa, setup2fa, confirm2fa, logout,
      can, canAccessPage, authFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { PERMISSIONS };
