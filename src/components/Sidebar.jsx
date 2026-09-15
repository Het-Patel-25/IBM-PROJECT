import React from 'react';
import { LayoutDashboard, Activity, BarChart3, Cpu, Wrench, Users, RotateCcw, Map } from 'lucide-react';
import GridSentinelSymbol from './common/GridSentinelSymbol';
import { useAuth } from '../context/AuthContext';
import { useGrid } from '../context/GridContext';

const ROLE_NAMES = {
  admin: { name: 'Ananya Sharma', initials: 'AS', title: 'Grid Operations Director', color: '#3b82f6' },
  technician: { name: 'Rahul Verma', initials: 'RV', title: 'Lead Field Technician', color: '#22c55e' },
  viewer: { name: 'Dr. Vikram Singh', initials: 'VS', title: 'Data Scientist', color: '#a78bfa' }
};

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout, hasAccess } = useAuth();
  const { resetAll } = useGrid();
  const persona = ROLE_NAMES[user?.role] || ROLE_NAMES.admin;

  const sections = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'assets', label: 'Assets', icon: Activity }
      ]
    },
    {
      label: 'Intelligence',
      items: [
        { id: 'risk', label: 'Risk Analysis', icon: BarChart3, access: 'risk' },
        { id: 'prediction', label: 'AI Prediction', icon: Cpu, access: 'prediction' }
      ]
    },
    {
      label: 'Operations',
      items: [
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, access: 'maintenance' },
        { id: 'crew', label: 'Crew Planning', icon: Users, access: 'crew' }
      ]
    },
    {
      label: 'Command',
      items: [
        { id: 'map', label: 'Project Map', icon: Map, access: 'map' }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <GridSentinelSymbol size={32} glow={true} />
        <div>
          <h2>GridSentinel</h2>
          <span>AI Grid Advisor</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <div className="nav-section-label">{section.label}</div>
            )}
            {section.items
              .filter(item => !item.access || hasAccess(item.access))
              .map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id || (activePage === 'asset-detail' && item.id === 'assets');
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar-sm" style={{ borderColor: persona.color, color: persona.color }}>
            {persona.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {persona.name}
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>
              {persona.title}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ flex: 1, fontSize: 11 }}
            onClick={logout}
          >
            Sign Out
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            title="Reset demo data"
            onClick={() => { if(window.confirm('Reset all simulation data?')) resetAll(); }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}
