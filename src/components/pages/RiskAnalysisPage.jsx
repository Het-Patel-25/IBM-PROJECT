import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { BarChart3, ChevronRight, AlertTriangle, Download, CheckCircle } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function RiskAnalysisPage({ onNavigate }) {
  const { assets, createMaintenanceTask } = useGrid();
  const [filterPriority, setFilterPriority] = useState('All');
  const [exportNotice, setExportNotice] = useState(null);

  const sorted = [...assets].sort((a, b) => b.overallRisk - a.overallRisk);
  const filtered = sorted.filter(a => filterPriority === 'All' || a.priority?.code === filterPriority);

  const priorityGroups = {
    P1: assets.filter(a => a.priority?.code === 'P1'),
    P2: assets.filter(a => a.priority?.code === 'P2'),
    P3: assets.filter(a => a.priority?.code === 'P3'),
    P4: assets.filter(a => a.priority?.code === 'P4'),
  };

  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Asset ID',
      'Asset Name',
      'Type',
      'Priority Level',
      'Failure Probability (%)',
      'Grid Impact Score',
      'Overall Risk (0-100)',
      'Status',
      'Recommended Action'
    ];

    const rows = filtered.map((a, idx) => [
      idx + 1,
      a.id,
      a.name,
      a.type,
      a.priority?.code || 'P3',
      a.failureProbability,
      a.gridImpact,
      a.overallRisk,
      a.status,
      a.aiRecommendation?.action || 'Inspect asset telemetry'
    ]);

    const filename = `gridsentinel_risk_matrix_${new Date().toISOString().split('T')[0]}`;
    const result = exportToCSV({ filename, headers, rows });

    if (result.success) {
      setExportNotice(`Exported ${result.count} risk records to ${result.filename}`);
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  return (
    <div>
      {exportNotice && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600,
          fontSize: 13,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle size={16} />
          {exportNotice}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Risk Analysis</h1>
          <p className="page-subtitle">AI-computed failure probability and grid impact across all assets</p>
        </div>
        <div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export risk rankings to CSV"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Priority Summary */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {[
          { code: 'P1', label: 'P1 Critical', color: 'var(--color-critical)', count: priorityGroups.P1.length, sub: 'Immediate action' },
          { code: 'P2', label: 'P2 High', color: 'var(--color-high)', count: priorityGroups.P2.length, sub: 'Within 24 hours' },
          { code: 'P3', label: 'P3 Medium', color: 'var(--color-warning)', count: priorityGroups.P3.length, sub: 'Schedule soon' },
          { code: 'P4', label: 'P4 Low', color: 'var(--color-normal)', count: priorityGroups.P4.length, sub: 'Continue monitoring' },
        ].map(p => (
          <div
            key={p.code}
            className="stat-card"
            style={{ '--accent-color': p.color, cursor: 'pointer', borderColor: filterPriority === p.code ? p.color : '' }}
            onClick={() => setFilterPriority(filterPriority === p.code ? 'All' : p.code)}
          >
            <div className="stat-card-label" style={{ color: p.color }}>{p.label}</div>
            <div className="stat-card-value" style={{ color: p.color }}>{p.count}</div>
            <div className="stat-card-sub">{p.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="filter-bar" style={{ marginBottom: 16, borderRadius: 8, border: '1px solid var(--border-default)', padding: '10px 16px' }}>
        {['All', 'P1', 'P2', 'P3', 'P4'].map(p => (
          <button key={p} className={`filter-btn ${filterPriority === p ? 'active' : ''}`} onClick={() => setFilterPriority(p)}>
            {p === 'All' ? 'All Assets' : p}
          </button>
        ))}
      </div>

      {/* Risk Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Asset</th>
              <th>Failure Prob.</th>
              <th>Risk Breakdown</th>
              <th>Grid Impact</th>
              <th>Overall Risk</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset, idx) => {
              const pColor = { P1: 'var(--color-critical)', P2: 'var(--color-high)', P3: 'var(--color-warning)', P4: 'var(--color-normal)' }[asset.priority?.code] || 'var(--text-muted)';
              return (
                <tr key={asset.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800, color: 'var(--text-faint)' }}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{asset.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{asset.id} · {asset.zone}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, color: pColor }}>
                      {asset.failureProbability}%
                    </span>
                  </td>
                  <td style={{ minWidth: 160 }}>
                    {Object.entries(asset.riskContributors).slice(0, 3).map(([k, v]) => (
                      <div className="risk-bar-item" key={k} style={{ marginBottom: 4 }}>
                        <div className="risk-bar-label" style={{ width: 90, fontSize: 11 }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="risk-bar-track" style={{ height: 3 }}>
                          <div className="risk-bar-fill" style={{ width: `${v}%`, background: v >= 25 ? 'var(--color-critical)' : v >= 15 ? 'var(--color-high)' : 'var(--color-warning)' }} />
                        </div>
                        <div className="risk-bar-value" style={{ fontSize: 10 }}>+{v}%</div>
                      </div>
                    ))}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                      {asset.gridImpact}/100
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="health-bar-wrap" style={{ width: 60, height: 4 }}>
                        <div className="health-bar-fill" style={{ width: `${asset.overallRisk}%`, background: pColor }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{asset.overallRisk}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: pColor }}>
                      {asset.priority?.code}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('asset-detail', asset.id)}>
                        Detail <ChevronRight size={12} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => createMaintenanceTask(asset.id)}>
                        Dispatch
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8}>
                <div className="empty-state">
                  <div className="empty-state-title">No assets in this priority level</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
