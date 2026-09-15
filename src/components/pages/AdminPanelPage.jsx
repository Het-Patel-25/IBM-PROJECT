// GridPulse AI – Admin Panel Page
// Only accessible by role: admin
// Allows: user management, role assignment, asset assignment for employees

import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, UserCheck, UserX, Edit3, Trash2, 
  ChevronDown, Search, Plus, Save, X, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_COLORS = {
  admin:              { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  department_manager: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  employee:           { bg: '#dcfce7', text: '#16a34a', border: '#86efac' }
};

const ROLE_LABELS = {
  admin:              'Admin',
  department_manager: 'Dept. Manager',
  employee:           'Employee'
};

export default function AdminPanelPage() {
  const { authFetch, user: currentUser } = useAuth();
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [editId, setEditId]     = useState(null);
  const [editData, setEditData] = useState({});

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res  = await authFetch('/api/auth/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
      else setError(data.error);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const saveEdit = async (id) => {
    try {
      const res  = await authFetch(`/api/auth/users/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(editData)
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(u => u.map(x => x.id === id ? data : x));
        setEditId(null);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Update failed.');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      const res = await authFetch(`/api/auth/users/${id}`, { method: 'DELETE' });
      if (res.ok) setUsers(u => u.filter(x => x.id !== id));
      else { const d = await res.json(); setError(d.error); }
    } catch {
      setError('Delete failed.');
    }
  };

  const toggleActive = async (u) => {
    const res  = await authFetch(`/api/auth/users/${u.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ isActive: !u.isActive })
    });
    const data = await res.json();
    if (res.ok) setUsers(us => us.map(x => x.id === u.id ? data : x));
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:    users.length,
    admin:    users.filter(u => u.role === 'admin').length,
    manager:  users.filter(u => u.role === 'department_manager').length,
    employee: users.filter(u => u.role === 'employee').length,
    active:   users.filter(u => u.isActive).length
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Shield size={22} className="page-title-icon" />
            User Management
          </h1>
          <p className="page-subtitle">Manage accounts, roles, and access permissions</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="admin-stats-row">
        {[
          { label: 'Total Users',   value: stats.total,    icon: Users,     color: '#3b82f6' },
          { label: 'Active Users',  value: stats.active,   icon: UserCheck, color: '#16a34a' },
          { label: 'Admins',        value: stats.admin,    icon: Shield,    color: '#dc2626' },
          { label: 'Dept. Managers',value: stats.manager,  icon: UserCheck, color: '#d97706' },
          { label: 'Employees',     value: stats.employee, icon: Users,     color: '#7c5cd8' }
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ color: s.color }}>
                <Icon size={18} />
              </div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="auth-error admin-error">
          <AlertCircle size={14} />
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={12} /></button>
        </div>
      )}

      {/* Search */}
      <div className="admin-toolbar">
        <div className="auth-input-wrap admin-search">
          <Search size={15} className="auth-input-icon" />
          <input
            className="auth-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading users…</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>2FA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isEditing  = editId === u.id;
                const roleColor  = ROLE_COLORS[u.role] || ROLE_COLORS.employee;
                const isSelf     = u.id === currentUser?.id;

                return (
                  <tr key={u.id} className={isEditing ? 'editing-row' : ''}>
                    <td className="admin-name-cell">
                      <div className="admin-avatar">
                        {u.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span>{u.name}</span>
                      {isSelf && <span className="admin-self-badge">You</span>}
                    </td>
                    <td className="admin-email">{u.email}</td>
                    <td>
                      {isEditing ? (
                        <select
                          className="admin-inline-select"
                          value={editData.role}
                          onChange={e => setEditData(d => ({ ...d, role: e.target.value }))}
                        >
                          <option value="employee">Employee</option>
                          <option value="department_manager">Dept. Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className="admin-role-badge"
                          style={{ background: roleColor.bg, color: roleColor.text, border: `1px solid ${roleColor.border}` }}
                        >
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          className="admin-inline-input"
                          value={editData.department}
                          onChange={e => setEditData(d => ({ ...d, department: e.target.value }))}
                        />
                      ) : (
                        <span className="admin-dept">{u.department || '—'}</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`admin-status-btn ${u.isActive ? 'active' : 'inactive'}`}
                        onClick={() => !isSelf && toggleActive(u)}
                        title={isSelf ? 'Cannot deactivate own account' : ''}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <span className={`admin-2fa-badge ${u.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                        {u.twoFactorEnabled ? 'Enabled' : 'Off'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        {isEditing ? (
                          <>
                            <button className="admin-action-btn save" onClick={() => saveEdit(u.id)} title="Save">
                              <Save size={13} />
                            </button>
                            <button className="admin-action-btn cancel" onClick={() => setEditId(null)} title="Cancel">
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="admin-action-btn edit"
                              onClick={() => { setEditId(u.id); setEditData({ role: u.role, department: u.department || '' }); }}
                              title="Edit role / department"
                            >
                              <Edit3 size={13} />
                            </button>
                            {!isSelf && (
                              <button className="admin-action-btn delete" onClick={() => deleteUser(u.id)} title="Delete user">
                                <Trash2 size={13} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="admin-empty">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
