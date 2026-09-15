import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck, Activity, Cpu, Wrench } from 'lucide-react';
import GridSentinelSymbol from '../common/GridSentinelSymbol';

const ROLES = [
  {
    role: 'Admin',
    name: 'Ananya Sharma',
    email: 'admin@voltguard.com',
    access: 'Full System Access',
    modules: ['Dashboard', 'Assets', 'Risk', 'AI Prediction', 'Maintenance', 'Crew', 'Project Map'],
    color: '#3b82f6',
    icon: '👑'
  },
  {
    role: 'Field Technician',
    name: 'Rahul Verma',
    email: 'tech@voltguard.com',
    access: 'Field Operations',
    modules: ['Dashboard', 'Assets', 'Maintenance', 'Crew Planning'],
    color: '#f97316',
    icon: '🔧'
  },
  {
    role: 'Data Scientist',
    name: 'Dr. Vikram Singh',
    email: 'viewer@voltguard.com',
    access: 'Intelligence View',
    modules: ['Dashboard', 'Assets', 'Risk Analysis', 'AI Prediction'],
    color: '#22c55e',
    icon: '🔬'
  }
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) { setError('Enter both email and password.'); return; }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) { setError(result.error); setLoading(false); }
  };

  const quickFill = (roleData) => {
    setEmail(roleData.email);
    setPassword('password123');
    setError('');
    setSelectedRole(roleData.email);
  };

  const instantLogin = async (roleData) => {
    quickFill(roleData);
    setError('');
    setLoading(true);
    const result = await login(roleData.email, 'password123');
    if (!result.success) { setError(result.error); setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'stretch',
      background: '#07090e', fontFamily: 'var(--font-sans)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* ── Animated Background Grid ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(56, 189, 248, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
      }} />

      {/* Ambient Glowing Orbs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '12%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '12%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '55%', left: '28%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* ── Left Panel: Brand & Mission ── */}
      <div style={{
        flex: '0 0 460px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '56px 48px', position: 'relative', zIndex: 1,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10, 15, 26, 0.65)',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 44 }}>
            <GridSentinelSymbol size={48} glow={true} animate={true} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                GridSentinel
              </div>
              <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, letterSpacing: '1.6px', textTransform: 'uppercase', marginTop: 3 }}>
                AI Grid Advisor
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.8px' }}>
            Operational Command<br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>for Power Infrastructure</span>
          </h2>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 40, maxWidth: 360 }}>
            AI-computed failure prediction, real-time transformer telemetry, and crew mobilization — unified for reliable grid management.
          </p>

          {/* Key Capabilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: <Activity size={16} color="#38bdf8" />, label: 'Continuous Substation Sensor Telemetry' },
              { icon: <Cpu size={16} color="#a855f7" />, label: 'Duval Gas & AI Failure Prediction' },
              { icon: <ShieldCheck size={16} color="#22c55e" />, label: 'Digital Twin Interactive Topology Map' },
              { icon: <Wrench size={16} color="#f97316" />, label: 'Dispatch & Work Order Closed Loop' }
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info badge */}
        <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              Telemetry Server Active · 104 Monitored Nodes
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.4px' }}>
            © 2026 GridSentinel · IBM Project Initiative
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1, padding: '40px 60px'
      }}>
        <div style={{ width: '100%', maxWidth: 540 }}>

          {/* Title */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>
              Sign in to GridSentinel
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Select a demo role for 1-click entry, or enter credentials manually.
            </p>
          </div>

          {/* Quick Role Login Cards */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
              Quick Role Login (Click to Enter)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {ROLES.map(r => {
                const isSelected = selectedRole === r.email;
                return (
                  <div
                    key={r.email}
                    style={{
                      background: isSelected ? `${r.color}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? r.color + '66' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 12, padding: '14px 12px',
                      textAlign: 'left', transition: 'all 180ms ease',
                      position: 'relative', overflow: 'hidden',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}
                  >
                    {isSelected && (
                      <CheckCircle2 size={13} style={{ position: 'absolute', top: 8, right: 8, color: r.color }} />
                    )}
                    <div>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? r.color : '#fff', marginBottom: 2 }}>
                        {r.role}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                        {r.name.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: 9, color: isSelected ? r.color : 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {r.access}
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => instantLogin(r)}
                        style={{
                          flex: 1,
                          background: `${r.color}25`,
                          border: `1px solid ${r.color}55`,
                          color: r.color,
                          borderRadius: 6,
                          padding: '5px 0',
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = r.color; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${r.color}25`; e.currentTarget.style.color = r.color; }}
                      >
                        Instant In
                      </button>
                      <button
                        type="button"
                        onClick={() => quickFill(r)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.6)',
                          borderRadius: 6,
                          padding: '5px 8px',
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title="Autofill form"
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>or enter credentials</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13,
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ fontSize: 14 }}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@voltguard.com"
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: 13,
                    fontFamily: 'var(--font-sans)', outline: 'none', transition: 'border 150ms ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 42px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: 13,
                    fontFamily: 'var(--font-sans)', outline: 'none', transition: 'border 150ms ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2, zIndex: 1 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                border: 'none', borderRadius: 10, color: '#fff',
                fontSize: 14, fontWeight: 700, padding: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 180ms ease', letterSpacing: '0.2px',
                boxShadow: '0 4px 18px rgba(37,99,235,0.35)',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.filter = 'none'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Authenticating Session...
                </span>
              ) : (
                <>Sign in to GridSentinel <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Default credentials hint */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 20, textAlign: 'center' }}>
            Default password for all roles: <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>password123</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
