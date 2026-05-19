import React, { useEffect, useState } from 'react';
import { fetchJobApps, deleteJobApp, updateJobApp } from '../api/jobAppApi';
import JobAppForm from './JobAppForm';

function EditRow({ app, onSave, onCancel }) {
  const [form, setForm] = useState({ ...app });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...form });
  };
  return (
    <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input className="form-control" name="company" value={form.company} onChange={handleChange} required style={{width:120}} />
      <input className="form-control" name="role" value={form.role} onChange={handleChange} required style={{width:120}} />
      <input className="form-control" name="status" value={form.status} onChange={handleChange} required style={{width:100}} />
      <button className="btn btn-primary" type="submit">💾 Save</button>
      <button className="btn" type="button" onClick={onCancel} style={{ background: '#e2e8f0' }}>❌ Cancel</button>
    </form>
  );
}

const getStatusBadgeClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('offer')) return 'status-badge status-success';
  if (s.includes('reject')) return 'status-badge status-danger';
  if (s.includes('interview')) return 'status-badge status-info';
  if (s.includes('contacted') || s.includes('applied')) return 'status-badge status-neutral';
  return 'status-badge status-neutral';
};

export default function JobAppList() {
  const [apps, setApps] = useState([]);
  const [editId, setEditId] = useState(null);
  const loadApps = () => fetchJobApps().then(res => setApps(res.data));
  useEffect(() => { loadApps(); }, []);
  const handleDelete = async (id) => {
    if (window.confirm('Delete this job application?')) {
      await deleteJobApp(id);
      loadApps();
    }
  };
  const handleEdit = (id) => setEditId(id);
  const handleCancel = () => setEditId(null);
  const handleSave = async (form) => {
    await updateJobApp(form.id, form);
    setEditId(null);
    loadApps();
  };
  return (
    <div>
      <JobAppForm onSuccess={loadApps} />
      <div className="table-responsive">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Referral</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id} className={editId === app.id ? 'editing-row' : ''}>
                {editId === app.id ? (
                  <td colSpan="6">
                    <EditRow app={app} onSave={handleSave} onCancel={handleCancel} />
                  </td>
                ) : (
                  <>
                    <td style={{ fontWeight: 600 }}>{app.company}</td>
                    <td>{app.role}</td>
                    <td>{app.location || '-'}</td>
                    <td>{app.referral || '-'}</td>
                    <td>
                      <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(app.id)}>✏️ Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(app.id)}>🗑️ Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 0 }}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🏢</div>
                    <div className="empty-state-text">No job applications found.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
