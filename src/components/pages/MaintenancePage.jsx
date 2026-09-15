import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { useAuth } from '../../context/AuthContext';
import { Wrench, CheckSquare, Square, ChevronDown, ChevronUp, User, Clock, AlertTriangle, Download, CheckCircle } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

const STATUS_COLORS = {
  Open: 'badge-neutral', Assigned: 'badge-accent', 'In Progress': 'badge-warning',
  Completed: 'badge-normal', Failed: 'badge-critical', 'Requires Follow-Up': 'badge-high', Cancelled: 'badge-neutral'
};

const STATUS_OPTIONS = ['Open', 'Assigned', 'In Progress', 'Completed', 'Failed', 'Requires Follow-Up', 'Cancelled'];

export default function MaintenancePage({ onNavigate }) {
  const { tickets, toggleChecklistItem, completeMaintenanceTask, updateTicketStatus, crews } = useGrid();
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [reportForms, setReportForms] = useState({});
  const [exportNotice, setExportNotice] = useState(null);

  const isTech = user?.role === 'technician';

  const filtered = tickets.filter(t => {
    const sMatch = filterStatus === 'All' || t.status === filterStatus;
    const pMatch = filterPriority === 'All' || t.priority === filterPriority;
    return sMatch && pMatch;
  });

  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Asset ID',
      'Asset Name',
      'Title',
      'Priority',
      'Status',
      'Assigned Crew',
      'Assigned To',
      'Estimated Hours',
      'Checklist Progress'
    ];

    const rows = filtered.map(t => {
      const doneItems = (t.checklist || []).filter(c => c.done).length;
      const totalItems = (t.checklist || []).length;
      return [
        t.id,
        t.assetId,
        t.assetName,
        t.title,
        t.priority,
        t.status,
        t.assignedCrew || 'Unassigned',
        t.assignedTo || 'Unassigned',
        t.estimatedHours || 2,
        `${doneItems}/${totalItems}`
      ];
    });

    const filename = `gridsentinel_work_orders_${new Date().toISOString().split('T')[0]}`;
    const result = exportToCSV({ filename, headers, rows });

    if (result.success) {
      setExportNotice(`Exported ${result.count} maintenance tickets to ${result.filename}`);
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  const setReportField = (taskId, field, value) => {
    setReportForms(prev => ({ ...prev, [taskId]: { ...(prev[taskId] || {}), [field]: value } }));
  };

  const handleComplete = (taskId) => {
    const report = reportForms[taskId] || {};
    if (!report.findings) { alert('Please add your findings before completing.'); return; }
    completeMaintenanceTask(taskId, report, isTech ? 'Rahul Verma' : 'Admin');
    setExpandedId(null);
  };

  const pColor = p => ({ P1: 'var(--color-critical)', P2: 'var(--color-high)', P3: 'var(--color-warning)', P4: 'var(--color-normal)' }[p] || 'var(--text-muted)');

  const openCount = tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status)).length;
  const completedCount = tickets.filter(t => t.status === 'Completed').length;

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
          <h1 className="page-title">Maintenance Queue</h1>
          <p className="page-subtitle">{openCount} open · {completedCount} completed · Full technician workflow</p>
        </div>
        <div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export maintenance tickets to CSV"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Open Tasks', val: tickets.filter(t => t.status === 'Open').length, color: 'var(--color-warning)' },
          { label: 'Assigned', val: tickets.filter(t => t.status === 'Assigned').length, color: 'var(--color-accent)' },
          { label: 'In Progress', val: tickets.filter(t => t.status === 'In Progress').length, color: 'var(--color-high)' },
          { label: 'Completed', val: tickets.filter(t => t.status === 'Completed').length, color: 'var(--color-normal)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: 16, borderRadius: 8, border: '1px solid var(--border-default)', padding: '10px 16px' }}>
        <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>Status</span>
        {['All', ...STATUS_OPTIONS.slice(0, 5)].map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
        <div style={{ width: 1, height: 16, background: 'var(--border-default)' }} />
        <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>Priority</span>
        {['All', 'P1', 'P2', 'P3', 'P4'].map(p => (
          <button key={p} className={`filter-btn ${filterPriority === p ? 'active' : ''}`} onClick={() => setFilterPriority(p)}>{p === 'All' ? 'All' : p}</button>
        ))}
      </div>

      {/* Task Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div className="empty-state card" style={{ padding: 48 }}>
            <Wrench size={32} className="empty-state-icon" />
            <div className="empty-state-title">No tasks match filters</div>
          </div>
        )}

        {filtered.map(task => {
          const isExpanded = expandedId === task.id;
          const allChecked = task.checklist?.every(c => c.checked);
          const checkedCount = task.checklist?.filter(c => c.checked).length || 0;
          const isCompleted = task.status === 'Completed';
          const report = reportForms[task.id] || {};

          return (
            <div key={task.id} className="card" style={{ borderLeft: `3px solid ${pColor(task.priority)}` }}>
              {/* Header */}
              <div
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
                onClick={() => setExpandedId(isExpanded ? null : task.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>{task.id}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: pColor(task.priority) }}>{task.priority}</span>
                    <span className={`badge ${STATUS_COLORS[task.status] || 'badge-neutral'}`}>{task.status}</span>
                    {task.assignedCrewName && (
                      <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>→ {task.assignedCrewName}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{task.assetName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{task.assetLocation}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 4 }}>
                    <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />Due {task.deadline}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {checkedCount}/{task.checklist?.length || 0} items
                  </div>
                </div>
                <div style={{ color: 'var(--text-faint)' }}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-default)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left: Checklist */}
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
                      Work Checklist
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      {task.checklist?.map(item => (
                        <label
                          key={item.id}
                          className={`checklist-item ${item.checked ? 'checked' : ''}`}
                          style={{ marginBottom: 4, cursor: isCompleted ? 'default' : 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            disabled={isCompleted}
                            onChange={() => toggleChecklistItem(task.id, item.id)}
                          />
                          <span className="checklist-item-text">{item.text}</span>
                        </label>
                      ))}
                    </div>

                    {/* AI Reason */}
                    <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>AI Reason</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{task.aiReason}</div>
                    </div>

                    {/* Status Change (Admin) */}
                    {!isTech && !isCompleted && (
                      <div style={{ marginTop: 12 }}>
                        <label className="form-label" style={{ marginBottom: 6 }}>Update Status</label>
                        <select
                          className="form-input"
                          value={task.status}
                          onChange={e => updateTicketStatus(task.id, e.target.value, 'Admin')}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Right: Report */}
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
                      Technician Report
                    </div>

                    {isCompleted ? (
                      <div className="alert-banner success">
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>Inspection Complete</div>
                          <div style={{ fontSize: 12 }}>{task.technicianReport?.findings || 'Completed'}</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label required">Findings</label>
                          <textarea
                            className="form-input"
                            rows={3}
                            placeholder="Describe what you found during the inspection..."
                            value={report.findings || ''}
                            onChange={e => setReportField(task.id, 'findings', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Recommendation</label>
                          <input
                            className="form-input"
                            placeholder="Further action required..."
                            value={report.recommendation || ''}
                            onChange={e => setReportField(task.id, 'recommendation', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Severity Assessment</label>
                          <select
                            className="form-input"
                            value={report.severity || 'Medium'}
                            onChange={e => setReportField(task.id, 'severity', e.target.value)}
                          >
                            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                          </select>
                        </div>
                        <button
                          className="btn btn-success btn-block"
                          disabled={!allChecked}
                          onClick={() => handleComplete(task.id)}
                        >
                          ✓ Complete & Submit Report
                        </button>
                        {!allChecked && (
                          <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>
                            Complete all {task.checklist?.length} checklist items to submit.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
