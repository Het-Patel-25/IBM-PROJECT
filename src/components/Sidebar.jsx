import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Cpu, 
  Wrench, 
  Users,
  Zap,
  ShieldCheck,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ALL_MENU_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',    icon: LayoutDashboard, page: 'dashboard'   },
  { id: 'assets',      label: 'Assets',       icon: Activity,        page: 'assets'      },
  { id: 'risk',        label: 'Risk Analysis', icon: BarChart3,      page: 'risk'        },
  { id: 'prediction',  label: 'AI Prediction', icon: Cpu,            page: 'prediction'  },
  { id: 'maintenance', label: 'Maintenance',   icon: Wrench,         page: 'maintenance' },
  { id: 'crew',        label: 'Crew Planning', icon: Users,          page: 'crew'        },
  { id: 'admin',       label: 'User Management', icon: ShieldCheck,  page: 'admin'       }
];

const ROLE_COLORS = {
  admin:              '#dc2626',
  department_manager: '#d97706',
  employee:           '#16a34a'
};

const ROLE_LABELS = {
  admin:              'Administrator',
  department_manager: 'Dept. Manager',
  employee:           'Field Employee'
};

export default function Sidebar({ activePage, onNavigate }) {
  const { user, canAccessPage, can, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  // Filter menu items by role permissions
  const visibleItems = ALL_MENU_ITEMS.filter(item => canAccessPage(item.page));

  const roleColor = ROLE_COLORS[user?.role] || '#64748b';

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Zap className="brand-icon" size={22} />
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <span className="brand-title">GridPulse AI</span>
            <span className="brand-version-badge">v2.5</span>
          </div>
          <span className="brand-subtitle">EE Final Project</span>
        </div>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {user.name?.[0]?.toUpperCase() || <User size={14} />}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div
              className="sidebar-user-role"
              style={{ color: roleColor }}
            >
              {ROLE_LABELS[user.role] || user.role}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links (role-filtered) */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">NAVIGATION</div>
        {visibleItems.map((item) => {
          const Icon    = item.icon;
          const isActive = (activePage === item.id) || 
                           (item.id === 'maintenance' && activePage === 'crew');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? 'active' : ''} ${item.id === 'admin' ? 'nav-item-admin' : ''}`}
            >
              <Icon size={18} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
              {item.id === 'admin' && (
                <span className="nav-admin-badge">Admin</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Model Accuracy Footer */}
      <div className="sidebar-footer">
        <div className="model-accuracy-card">
          <div className="accuracy-header">
            <span className="acc-label">Model Accuracy</span>
            <span className="acc-val">97.7%</span>
          </div>
          <div className="acc-progress-bar">
            <div className="acc-progress-fill" style={{ width: '97.7%' }} />
          </div>
          <div className="accuracy-sub">
            <span>RF Calibrated</span>
            <span>F1: 0.93</span>
          </div>
        </div>

        {/* Logout */}
        <button
          className="sidebar-logout-btn"
          onClick={() => setShowLogout(true)}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Logout confirmation */}
      {showLogout && (
        <div className="modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="modal-box" style={{ maxWidth: 320 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Sign Out</h3>
            </div>
            <div className="modal-body" style={{ padding: '1rem' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Are you sure you want to sign out?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="auth-submit-btn" style={{ flex: 1 }} onClick={logout}>
                  Sign Out
                </button>
                <button className="auth-back-btn" style={{ flex: 1 }} onClick={() => setShowLogout(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
