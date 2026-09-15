import React from 'react';
import { useGrid } from '../../context/GridContext';
import { AlertTriangle, Zap, Wrench, Users, CloudLightning, Activity, Clock, ChevronRight, ArrowRight } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    'Critical': 'badge-critical',
    'High': 'badge-high',
    'Warning': 'badge-warning',
    'Normal': 'badge-normal'
  };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}><span className="badge-dot" />{status}</span>;
}

function StatCard({ label, value, sub, accentColor }) {
  return (
    <div className="stat-card" style={{ '--accent-color': accentColor }}>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

export default function DashboardPage({ onNavigate }) {
  const { assets, tickets, crews, auditLog, dashboardStats, createMaintenanceTask, approveResponsePlan, responseApproved, weatherData } = useGrid();

  const criticalAssets = assets.filter(a => a.status === 'Critical');
  const highAssets = assets.filter(a => a.status === 'High');
  const openTickets = tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status));
  const p1Tickets = openTickets.filter(t => t.priority === 'P1');
  const recentAudit = auditLog.slice(0, 8);

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid">
        <StatCard label="Total Assets" value={dashboardStats.totalAssets} sub="Monitored fleet" accentColor="var(--border-strong)" />
        <StatCard label="Critical Assets" value={dashboardStats.criticalAssets} sub="Immediate action" accentColor="var(--color-critical)" />
        <StatCard label="High Risk" value={dashboardStats.highRiskAssets} sub="Within 24 hours" accentColor="var(--color-high)" />
        <StatCard label="Open Tasks" value={dashboardStats.openMaintenance} sub={`${dashboardStats.completedToday} completed`} accentColor="var(--color-warning)" />
        <StatCard label="Active Crews" value={dashboardStats.activeCrews} sub={`${dashboardStats.availableCrews} available`} accentColor="var(--color-accent)" />
        <StatCard label="P1 Incidents" value={p1Tickets.length} sub="Need immediate action" accentColor="var(--color-critical)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Critical Assets */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><AlertTriangle size={14} />Critical Assets</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('assets')}>
              View All <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ padding: 0 }}>
            {criticalAssets.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <div className="empty-state-title">No critical assets</div>
              </div>
            ) : criticalAssets.slice(0, 4).map(asset => (
              <div
                key={asset.id}
                style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                onClick={() => onNavigate('asset-detail', asset.id)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{asset.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{asset.id} · {asset.zone}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={asset.status} />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
                      Risk {asset.overallRisk}/100
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div className="health-bar-wrap">
                    <div
                      className="health-bar-fill"
                      style={{
                        width: `${asset.failureProbability}%`,
                        background: asset.failureProbability >= 80 ? 'var(--color-critical)' : asset.failureProbability >= 60 ? 'var(--color-high)' : 'var(--color-warning)'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 3 }}>
                    Failure Probability: {asset.failureProbability}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Maintenance */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Wrench size={14} />Active Maintenance</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('maintenance')}>
              View All <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ padding: 0 }}>
            {openTickets.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <div className="empty-state-title">No open tasks</div>
              </div>
            ) : openTickets.slice(0, 4).map(ticket => (
              <div
                key={ticket.id}
                style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                onClick={() => onNavigate('maintenance')}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{ticket.assetName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{ticket.id} · Due {ticket.deadline}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${ticket.priority === 'P1' ? 'badge-critical' : ticket.priority === 'P2' ? 'badge-high' : 'badge-warning'}`}>
                      {ticket.priority}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{ticket.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Weather */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><CloudLightning size={14} />Weather Risk Zones</div>
          </div>
          <div style={{ padding: 0 }}>
            {Object.entries(weatherData).map(([zone, w]) => (
              <div key={zone} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{zone}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {w.condition} · {w.wind} km/h · {w.rain}mm
                    </div>
                  </div>
                  <span className={`badge ${w.risk === 'Severe' ? 'badge-critical' : w.risk === 'Moderate' ? 'badge-warning' : 'badge-normal'}`}>
                    {w.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Activity size={14} />Audit Log</div>
          </div>
          <div style={{ padding: '12px 20px' }}>
            {recentAudit.map(entry => (
              <div key={entry.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                  {new Date(entry.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {entry.user}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{entry.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
