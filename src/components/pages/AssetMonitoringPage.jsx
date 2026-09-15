import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Search, Plus, Filter, ChevronRight, AlertTriangle, Download, CheckCircle } from 'lucide-react';
import AddAssetModal from '../common/AddAssetModal';
import { exportToCSV } from '../../utils/exportCsv';

function getRiskBadgeClass(status) {
  return { Critical: 'badge-critical', High: 'badge-high', Warning: 'badge-warning', Normal: 'badge-normal' }[status] || 'badge-neutral';
}

export default function AssetMonitoringPage({ onViewAsset }) {
  const { assets, createMaintenanceTask, dashboardStats } = useGrid();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [exportNotice, setExportNotice] = useState(null);

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.id.toLowerCase().includes(search.toLowerCase()) ||
                        (a.location || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || a.type === filterType;
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const types = ['All', ...new Set(assets.map(a => a.type))];
  const statuses = ['All', 'Critical', 'High', 'Warning', 'Normal'];

  const handleExportCSV = () => {
    const headers = [
      'Asset ID',
      'Asset Name',
      'Type',
      'Status',
      'Location',
      'Zone',
      'Health Score (%)',
      'Failure Probability (%)',
      'Grid Impact',
      'Overall Risk Score',
      'Duval Fault Diagnosis'
    ];
    
    const rows = filtered.map(a => [
      a.id,
      a.name,
      a.type,
      a.status,
      a.location || a.zone || '',
      a.zone || '',
      a.healthScore,
      a.failureProbability,
      a.gridImpact,
      a.overallRisk,
      a.duvalFault || 'Normal Operation'
    ]);

    const filename = `gridsentinel_assets_${new Date().toISOString().split('T')[0]}`;
    const result = exportToCSV({ filename, headers, rows });

    if (result.success) {
      setExportNotice(`Exported ${result.count} assets to ${result.filename}`);
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
          <h1 className="page-title">Asset Registry</h1>
          <p className="page-subtitle">{assets.length} assets monitored · {dashboardStats.criticalAssets} critical</p>
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export filtered assets to CSV spreadsheet"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="filter-bar">
          <div className="search-wrap" style={{ flex: 1, maxWidth: 320 }}>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, ID, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 4px' }} />
          <div className="flex gap-2 items-center">
            <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>Type</span>
            {types.map(t => (
              <button key={t} className={`filter-btn ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 4px' }} />
          <div className="flex gap-2 items-center">
            <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>Status</span>
            {statuses.map(s => (
              <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name & Location</th>
                <th>Type</th>
                <th>Health</th>
                <th>Failure Prob.</th>
                <th>Grid Impact</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{asset.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{asset.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>{asset.location}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{asset.type}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60 }}>
                        <div className="health-bar-wrap" style={{ height: 4 }}>
                          <div
                            className="health-bar-fill"
                            style={{
                              width: `${asset.healthScore}%`,
                              background: asset.healthScore >= 70 ? 'var(--color-normal)' : asset.healthScore >= 50 ? 'var(--color-warning)' : 'var(--color-critical)'
                            }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{asset.healthScore}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: asset.failureProbability >= 80 ? 'var(--color-critical)' : asset.failureProbability >= 60 ? 'var(--color-high)' : asset.failureProbability >= 35 ? 'var(--color-warning)' : 'var(--color-normal)'
                    }}>
                      {asset.failureProbability}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                      {asset.gridImpact}/100
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: { P1: 'var(--color-critical)', P2: 'var(--color-high)', P3: 'var(--color-warning)', P4: 'var(--color-normal)' }[asset.priority?.code] || 'var(--text-muted)'
                    }}>
                      {asset.priority?.code || 'P4'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getRiskBadgeClass(asset.status)}`}>
                      <span className="badge-dot" />{asset.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" onClick={() => onViewAsset(asset.id)}>
                        View <ChevronRight size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state">
                      <AlertTriangle size={28} className="empty-state-icon" />
                      <div className="empty-state-title">No assets found</div>
                      <div className="empty-state-desc">Try adjusting your search or filter criteria.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddAssetModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
