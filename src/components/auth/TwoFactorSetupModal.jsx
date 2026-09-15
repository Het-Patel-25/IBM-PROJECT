// GridPulse AI – 2FA Setup Modal
// Shown after login when user hasn't set up 2FA yet (optional setup prompt)
// Also used from profile settings to enable/disable 2FA

import React, { useState } from 'react';
import { Shield, Smartphone, Copy, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TwoFactorSetupModal({ onClose, onComplete }) {
  const { setup2fa, confirm2fa } = useAuth();

  const [step, setStep]       = useState('intro');   // 'intro' | 'qr' | 'confirm' | 'done'
  const [qrData, setQrData]   = useState(null);
  const [code, setCode]       = useState('');
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await setup2fa();
      setQrData(data);
      setStep('qr');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirm2fa(code.trim());
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    if (qrData?.manualEntryKey) {
      navigator.clipboard.writeText(qrData.manualEntryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box twofa-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Shield size={18} className="modal-title-icon" />
            <h3 className="modal-title">Two-Factor Authentication Setup</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          {step === 'intro' && (
            <div className="twofa-intro">
              <div className="twofa-feature-list">
                <div className="twofa-feature">
                  <Smartphone size={16} />
                  <div>
                    <div className="twofa-feature-title">Authenticator App Required</div>
                    <div className="twofa-feature-desc">Use Google Authenticator, Authy, or any TOTP app</div>
                  </div>
                </div>
                <div className="twofa-feature">
                  <Shield size={16} />
                  <div>
                    <div className="twofa-feature-title">TOTP — Time-based One-Time Password</div>
                    <div className="twofa-feature-desc">A new 6-digit code every 30 seconds</div>
                  </div>
                </div>
              </div>
              {error && <div className="auth-error"><AlertCircle size={14} /><span>{error}</span></div>}
              <button className="auth-submit-btn" onClick={startSetup} disabled={loading}>
                {loading ? <Loader size={15} className="spin" /> : <Shield size={15} />}
                {loading ? 'Generating QR Code…' : 'Begin Setup'}
              </button>
              <button className="auth-back-btn" onClick={onClose}>Skip for now</button>
            </div>
          )}

          {step === 'qr' && qrData && (
            <div className="twofa-qr-step">
              <p className="twofa-instruction">
                Scan this QR code with your authenticator app, then enter the 6-digit code to verify.
              </p>
              <div className="twofa-qr-wrapper">
                <img src={qrData.qrCode} alt="2FA QR Code" className="twofa-qr-img" />
              </div>
              <div className="twofa-manual-key">
                <span className="twofa-manual-label">Manual entry key:</span>
                <code className="twofa-key-code">{qrData.manualEntryKey}</code>
                <button className="twofa-copy-btn" onClick={copySecret}>
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <button className="auth-submit-btn" onClick={() => setStep('confirm')}>
                I've scanned the code — Continue
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="twofa-confirm-step">
              <p className="twofa-instruction">
                Enter the 6-digit code shown in your authenticator app to complete setup.
              </p>
              <form onSubmit={handleConfirm}>
                <div className="auth-field">
                  <label className="auth-label">Authenticator Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="auth-input auth-otp-input"
                    placeholder="000 000"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    autoFocus
                  />
                </div>
                {error && <div className="auth-error"><AlertCircle size={14} /><span>{error}</span></div>}
                <button type="submit" className="auth-submit-btn" disabled={loading || code.length < 6}>
                  {loading ? <Loader size={16} className="spin" /> : null}
                  {loading ? 'Verifying…' : 'Enable 2FA'}
                </button>
                <button type="button" className="auth-back-btn" onClick={() => setStep('qr')}>
                  Back to QR Code
                </button>
              </form>
            </div>
          )}

          {step === 'done' && (
            <div className="twofa-done-step">
              <div className="twofa-done-icon">
                <CheckCircle size={40} />
              </div>
              <h3 className="twofa-done-title">2FA Enabled Successfully!</h3>
              <p className="twofa-done-desc">
                Your account is now protected with two-factor authentication.
                You'll be asked for a code each time you sign in.
              </p>
              <button className="auth-submit-btn" onClick={() => { onComplete?.(); onClose?.(); }}>
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
