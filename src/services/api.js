// GridPulse AI - Frontend API Service Layer (v2.5 — RBAC-aware)
// Connects to Express backend with JWT auth headers + resilient local fallback

import { INITIAL_ASSETS, INITIAL_MAINTENANCE, getRiskLevel } from '../data/mockAssets';

const API_BASE_URL = '/api';

// Get stored JWT token
function getToken() {
  return localStorage.getItem('gp_token');
}

// Authenticated fetch — auto-attaches Bearer token
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
}

// Health check
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return { connected: true, ...data };
    }
  } catch {}
  return { connected: false, message: 'Local Demo Mode' };
}

// 1. Fetch Assets
export async function getAssets() {
  try {
    const res = await authFetch(`${API_BASE_URL}/assets`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}

  const stored = localStorage.getItem('gridpulse_assets');
  if (stored) { try { return JSON.parse(stored); } catch {} }
  localStorage.setItem('gridpulse_assets', JSON.stringify(INITIAL_ASSETS));
  return INITIAL_ASSETS;
}

// 2. Fetch Single Asset
export async function getAssetById(id) {
  try {
    const res = await authFetch(`${API_BASE_URL}/assets/${id}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {}

  const assets = await getAssets();
  return assets.find((a) => a.id === id || a._id === id) || assets[0];
}

// 3. Predict Failure Risk
export async function predictRisk(sensorData) {
  const { temperature, load, vibration, humidity, age } = sensorData;

  try {
    const res = await authFetch(`${API_BASE_URL}/predict`, {
      method:  'POST',
      body:    JSON.stringify(sensorData),
      signal:  AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
    if (res.status === 403) {
      return { error: 'You do not have permission to run predictions.', forbidden: true };
    }
  } catch {}

  // Local fallback
  let score = 15;
  if (temperature > 70) score += (temperature - 70) * 1.6;
  if (temperature > 90) score += 15;
  if (load > 65) score += (load - 65) * 0.9;
  if (load > 85) score += 12;
  if (vibration > 2.5) score += (vibration - 2.5) * 14;
  if (humidity > 70) score += (humidity - 70) * 0.4;
  if (age > 10) score += (age - 10) * 0.8;
  score = Math.min(99, Math.max(5, Math.round(score)));

  let riskCategory = 'Normal';
  let possibleFailure = 'Nominal Condition';
  let recommendation = 'No immediate maintenance required.';

  if (score >= 86) {
    riskCategory = 'Critical';
    possibleFailure = temperature > 85 ? 'Thermal Overheating & Winding Dielectric Breakdown' : 'Severe Mechanical Wear';
    recommendation = 'IMMEDIATE INTERVENTION REQUIRED. Dispatch emergency repair crew.';
  } else if (score >= 71) {
    riskCategory = 'High';
    possibleFailure = 'Accelerated Thermal & Mechanical Stress';
    recommendation = 'Schedule priority inspection within 24 hours.';
  } else if (score >= 41) {
    riskCategory = 'Warning';
    possibleFailure = 'Moderate Operational Degradation';
    recommendation = 'Monitor closely during peak load.';
  }

  return {
    failureProbability: score,
    riskCategory,
    possibleFailure,
    recommendation,
    modelUsed: 'Simulated RF Baseline (Local Mode)'
  };
}

// 4. Fetch Maintenance Records
export async function getMaintenance() {
  try {
    const res = await authFetch(`${API_BASE_URL}/maintenance`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}

  const stored = localStorage.getItem('gridpulse_maintenance');
  if (stored) { try { return JSON.parse(stored); } catch {} }
  localStorage.setItem('gridpulse_maintenance', JSON.stringify(INITIAL_MAINTENANCE));
  return INITIAL_MAINTENANCE;
}

// 5. Create Maintenance Task
export async function createMaintenance(newTask) {
  try {
    const res = await authFetch(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      body:   JSON.stringify(newTask),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
    if (res.status === 403) throw new Error('You do not have permission to create maintenance tasks.');
  } catch (err) {
    if (err.message.includes('permission')) throw err;
  }

  const current = await getMaintenance();
  const task = { id: `maint-${Date.now()}`, ...newTask, createdAt: new Date().toLocaleString() };
  const updated = [task, ...current];
  localStorage.setItem('gridpulse_maintenance', JSON.stringify(updated));
  return task;
}

// 6. Update Maintenance Task
export async function updateMaintenance(id, updates) {
  try {
    const res = await authFetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PATCH',
      body:   JSON.stringify(updates),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
    if (res.status === 403) throw new Error('You do not have permission to update maintenance tasks.');
  } catch (err) {
    if (err.message.includes('permission')) throw err;
  }

  const current = await getMaintenance();
  const updated = current.map((item) => (item.id === id || item._id === id ? { ...item, ...updates } : item));
  localStorage.setItem('gridpulse_maintenance', JSON.stringify(updated));
  return updated.find((item) => item.id === id || item._id === id);
}
