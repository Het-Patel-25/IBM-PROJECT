import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Users, MapPin, Wrench, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function CrewPlanningPage({ onNavigate }) {
  const { crews, tickets, assets, assignCrew } = useGrid();
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const openTickets = tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status) && !t.assignedCrew);
  const assignedTickets = tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status) && t.assignedCrew);
  const availableCrews = crews.filter(c => c.status === 'Available');
  const dispatchedCrews = crews.filter(c => c.status === 'Dispatched');

  const handleAssign = (crewId) => {
    if (!selectedTaskId) return;
    assignCrew(selectedTaskId, crewId, 'Admin');
    setSelectedTaskId(null);
  };

  const pColor = p => ({ P1: 'var(--color-critical)', P2: 'var(--color-high)', P3: 'var(--color-warning)', P4: 'var(--color-normal)' }[p] || 'var(--text-muted)');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Crew Planning</h1>
          <p className="page-subtitle">{availableCrews.length} crews available · {dispatchedCrews.length} dispatched · {openTickets.length} unassigned tasks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Crews', val: crews.length, color: 'var(--border-strong)' },
          { label: 'Available', val: availableCrews.length, color: 'var(--color-normal)' },
          { label: 'Dispatched', val: dispatchedCrews.length, color: 'var(--color-high)' },
          { label: 'Unassigned Tasks', val: openTickets.length, color: 'var(--color-warning)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Crew Status */}
        <div className="card">
          <div className="card-header"><div className="card-title"><Users size={14} />Crew Units</div></div>
          <div style={{ padding: 0 }}>
            {crews.map(crew => {
              const assignment = tickets.find(t => t.assignedCrew === crew.id && !['Completed', 'Cancelled'].includes(t.status));
              const isDispatched = crew.status === 'Dispatched';
              return (
                <div key={crew.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isDispatched ? 'var(--color-high)' : 'var(--color-normal)' }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{crew.name}</span>
                        <span className={`badge ${isDispatched ? 'badge-high' : 'badge-normal'}`}>{crew.status}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 6 }}>
                        {crew.techCount} technicians · {crew.currentDepot}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {crew.skills.map(s => (
                          <span key={s} className="badge badge-neutral" style={{ fontSize: 10 }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {assignment && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{assignment.assetName}</div>
                          <div>{assignment.id}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isDispatched && openTickets.length > 0 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        if (selectedTaskId) handleAssign(crew.id);
                        else alert('Select a task first from the right panel, then click Assign.');
                      }}
                    >
                      {selectedTaskId ? `Assign to ${tickets.find(t => t.id === selectedTaskId)?.assetName}` : 'Assign to Task'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {openTickets.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><AlertTriangle size={14} />Unassigned Tasks</div>
                {selectedTaskId && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTaskId(null)}>Clear Selection</button>
                )}
              </div>
              {openTickets.map(task => (
                <div
                  key={task.id}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: selectedTaskId === task.id ? 'var(--color-accent-bg)' : 'transparent',
                    borderLeft: selectedTaskId === task.id ? '3px solid var(--color-accent)' : '3px solid transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                  onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{task.id}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: pColor(task.priority) }}>{task.priority}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{task.assetName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Due: {task.deadline}</div>
                    </div>
                    {selectedTaskId === task.id && (
                      <div className="flex gap-2">
                        {availableCrews.map(c => (
                          <button key={c.id} className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); handleAssign(c.id); }}>
                            Assign {c.name.split(' ')[1]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {assignedTickets.length > 0 && (
            <div className="card">
              <div className="card-header"><div className="card-title"><Wrench size={14} />Active Assignments</div></div>
              {assignedTickets.map(task => {
                const crew = crews.find(c => c.id === task.assignedCrew);
                return (
                  <div key={task.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{task.assetName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Crew: {task.assignedCrewName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Skills: {crew?.skills?.slice(0, 2).join(', ')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${task.priority === 'P1' ? 'badge-critical' : 'badge-high'}`}>{task.priority}</span>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                          <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{task.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {openTickets.length === 0 && assignedTickets.length === 0 && (
            <div className="card empty-state" style={{ padding: 48 }}>
              <CheckCircle size={28} className="empty-state-icon" style={{ color: 'var(--color-normal)' }} />
              <div className="empty-state-title">All tasks assigned</div>
              <div className="empty-state-desc">No unassigned maintenance tasks at this time.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
