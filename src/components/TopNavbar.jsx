import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGrid } from '../context/GridContext';

const ROLE_NAMES = {
  admin: { name: 'Ananya Sharma', initials: 'AS', title: 'Grid Operations Director' },
  technician: { name: 'Rahul Verma', initials: 'RV', title: 'Lead Field Technician' },
  viewer: { name: 'Dr. Vikram Singh', initials: 'VS', title: 'Data Scientist' }
};

export default function TopNavbar({ pageTitle, onNavigate }) {
  const { user } = useAuth();
  const { dashboardStats, tickets } = useGrid();
  const persona = ROLE_NAMES[user?.role] || ROLE_NAMES.admin;
  const openAlerts = tickets.filter(t => t.priority === 'P1' && !['Completed','Cancelled'].includes(t.status)).length;

  return (
    <header className="top-navbar">
      <div className="navbar-breadcrumb">
        <h2>{pageTitle}</h2>
        {dashboardStats.criticalAssets > 0 && (
          <>
            <span>/</span>
            <span style={{ fontSize: 12, color: 'var(--color-critical)', fontWeight: 600 }}>
              {dashboardStats.criticalAssets} Critical
            </span>
          </>
        )}
      </div>

      <div className="status-pill">
        <span className="pulse-dot" />
        System Active
      </div>

      <div className="navbar-actions">
        <div style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
          {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border-default)' }} />

        <button className="icon-btn" title="Notifications" onClick={() => onNavigate('maintenance')}>
          <Bell size={15} />
          {openAlerts > 0 && <span className="notification-badge">{openAlerts}</span>}
        </button>

        <div className="navbar-user" onClick={() => {}}>
          <div className="navbar-user-avatar">
            {persona.initials}
          </div>
          <div>
            <div className="navbar-user-name">{persona.name}</div>
            <div className="navbar-user-role" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
