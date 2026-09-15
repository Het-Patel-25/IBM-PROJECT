// GridPulse AI – Signup Page

import React, { useState } from 'react';
import { Zap, Mail, Lock, User, Building, Eye, EyeOff, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'employee',           label: 'Field Employee',       desc: 'View assigned assets and maintenance tasks' },
  { value: 'department_manager', label: 'Department Manager',   desc: 'Manage assets, maintenance, and AI predictions' },
  { value: 'admin',              label: 'System Administrator', desc: 'Full access including user management' }
];

const DEPARTMENTS = [
  'General', 'Transmission', 'Distribution', 'Substations', 'Operations', 'Maintenance', 'Engineering'
];

export default function SignupPage({ onNavigateToLogin }) {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'employee', department: 'General'
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())   return 'Name is required.';
    if (!form.email.trim())  return 'Email is required.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="auth-brand-title">GridPulse AI</h1>
            <p className="auth-brand-sub">Power Grid Monitoring System</p>
          </div>
        </div>

        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Set up your grid monitoring access credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name + Department row */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Department</label>
              <div className="auth-input-wrap">
                <Building size={16} className="auth-input-icon" />
                <select
                  className="auth-input auth-select"
                  value={form.department}
                  onChange={set('department')}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="you@gridpulse.ai"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>
          </div>

          {/* Password row */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                />
              </div>
            </div>
          </div>

          {/* Role selector */}
          <div className="auth-field">
            <label className="auth-label">Access Role</label>
            <div className="auth-role-grid">
              {ROLES.map(r => (
                <label
                  key={r.value}
                  className={`auth-role-card ${form.role === r.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={form.role === r.value}
                    onChange={set('role')}
                  />
                  {form.role === r.value && <CheckCircle size={14} className="auth-role-check" />}
                  <div className="auth-role-label">{r.label}</div>
                  <div className="auth-role-desc">{r.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader size={16} className="spin" /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-link">
          Already have an account?{' '}
          <button className="auth-link-btn" onClick={onNavigateToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
