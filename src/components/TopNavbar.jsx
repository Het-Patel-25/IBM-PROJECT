import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  BookOpen, 
  Zap,
  Activity,
  Shield,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  admin:              'Administrator',
  department_manager: 'Dept. Manager',
  employee:           'Field Employee'
};

const ROLE_COLORS = {
  admin:              '#dc2626',
  department_manager: '#d97706',
  employee:           '#16a34a'
};

export default function TopNavbar({ 
  onOpenArchitecture, 
  onNavigate, 
  alertsCount = 4,
  onOpenProfile
}) {
  const { user, can } = useAuth();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleString('en-US', options).replace(',', ' -'));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const roleColor = ROLE_COLORS[user?.role] || '#64748b';

  return (
    <header className="academic-topbar">
      {/* Brand Header */}
      <div className="topbar-brand">
        <div className="topbar-logo-box">
          <Zap size={18} />
        </div>
        <div>
          <h2 className="topbar-title">GridPulse AI</h2>
          <p className="topbar-sub">Power Grid Monitoring & ML Outage Prediction</p>
        </div>
      </div>

      {/* Center Status Pill */}
      <div className="topbar-center">
        <div className="simulation-status-pill">
          <div className="pulse-dot-blue" />
          <span>Simulation Active • 25 Grid Assets • RF Calibrated ML Model (97.7% Acc)</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="topbar-right">
        {/* Time */}
        <div className="topbar-time">
          <Clock size={14} className="text-muted" />
          <span>{currentTime}</span>
        </div>

        {/* Architecture button */}
        <button 
          className="btn-spec-trigger"
          onClick={onOpenArchitecture}
          title="View System Architecture and ML Specs"
        >
          <BookOpen size={15} />
          <span>System Architecture &amp; ML Specs</span>
        </button>

        {/* Alerts Bell */}
        <button 
          className="topbar-icon-btn"
          onClick={() => onNavigate('dashboard')}
          title="Active Alerts"
        >
          <Bell size={17} />
          {alertsCount > 0 && <span className="topbar-badge">{alertsCount}</span>}
        </button>

        {/* User Role Badge + Avatar */}
        {user && (
          <div className="topbar-user-group">
            <div
              className="topbar-role-badge"
              style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}40` }}
            >
              <Shield size={11} />
              <span>{ROLE_LABELS[user.role] || user.role}</span>
            </div>
            <div
              className="topbar-avatar"
              title={`${user.name} — ${ROLE_LABELS[user.role]}`}
              onClick={onOpenProfile}
              style={{ cursor: 'pointer' }}
            >
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
