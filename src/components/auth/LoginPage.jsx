// GridPulse AI – Login Page with 2FA Support

import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ onNavigateToSignup }) {
  const { login, verify2fa } = useAuth();

  const [step, setStep]         = useState('credentials'); // 'credentials' | 'twofactor'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode]         = useState('');
  const [preAuthToken, setPAT]  = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleCredentials = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (result.requiresTwoFactor) {
        setPAT(result.preAuthToken);
        setStep('twofactor');
      }
      // If no 2FA, AuthContext already set user – App will re-render
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verify2fa({ preAuthToken, code: code.trim() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
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

        {step === 'credentials' ? (
          <>
            <div className="auth-header">
              <h2 className="auth-title">Sign In</h2>
              <p className="auth-subtitle">Access your grid monitoring dashboard</p>
            </div>

            <form onSubmit={handleCredentials} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="you@gridpulse.ai"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle"
                    onClick={() => setShowPwd(v => !v)}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
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
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer-link">
              Don't have an account?{' '}
              <button className="auth-link-btn" onClick={onNavigateToSignup}>
                Create account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="auth-header">
              <div className="auth-2fa-icon">
                <Shield size={28} />
              </div>
              <h2 className="auth-title">Two-Factor Verification</h2>
              <p className="auth-subtitle">
                Enter the 6-digit code from your authenticator app (Google Authenticator / Authy)
              </p>
            </div>

            <form onSubmit={handle2FA} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Authentication Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="auth-input auth-otp-input"
                  placeholder="000 000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="auth-error">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading || code.length < 6}>
                {loading ? <Loader size={16} className="spin" /> : null}
                {loading ? 'Verifying…' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                className="auth-back-btn"
                onClick={() => { setStep('credentials'); setError(''); setCode(''); }}
              >
                Back to login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
