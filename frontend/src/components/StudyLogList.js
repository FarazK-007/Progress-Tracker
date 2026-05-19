import React, { useEffect, useState } from 'react';
import { fetchStudyLogs, deleteStudyLog, updateStudyLog } from '../api/studyLogApi';
import StudyLogForm from './StudyLogForm';

function EditRow({ log, onSave, onCancel }) {
  const [form, setForm] = useState({ ...log });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...form, hours: Number(form.hours) });
  };
  return (
    <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input className="form-control" name="date" type="date" value={form.date} onChange={handleChange} required style={{width:130}} />
      <input className="form-control" name="topic" value={form.topic} onChange={handleChange} required style={{width:130}} />
      <input className="form-control" name="hours" type="number" value={form.hours} onChange={handleChange} required style={{width:80}} />
      <button className="btn btn-primary" type="submit">💾 Save</button>
      <button className="btn" type="button" onClick={onCancel} style={{ background: '#e2e8f0' }}>❌ Cancel</button>
    </form>
  );
}

export default function StudyLogList() {
  const [logs, setLogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const loadLogs = () => fetchStudyLogs().then(res => setLogs(res.data));
  useEffect(() => { loadLogs(); }, []);
  const handleDelete = async (id) => {
    if (window.confirm('Delete this study log?')) {
      await deleteStudyLog(id);
      loadLogs();
    }
  };
  const handleEdit = (id) => setEditId(id);
  const handleCancel = () => setEditId(null);
  const handleSave = async (form) => {
    await updateStudyLog(form.id, form);
    setEditId(null);
    loadLogs();
  };
  return (
    <div>
      <StudyLogForm onSuccess={loadLogs} />
      <div className="table-responsive">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Topic</th>
              <th>Subtopic</th>
              <th>Hours</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className={editId === log.id ? 'editing-row' : ''}>
                {editId === log.id ? (
                  <td colSpan="6">
                    <EditRow log={log} onSave={handleSave} onCancel={handleCancel} />
                  </td>
                ) : (
                  <>
                    <td style={{ fontWeight: 600 }}>{log.date}</td>
                    <td>{log.topic}</td>
                    <td>{log.subtopic || '-'}</td>
                    <td>{log.hours}h</td>
                    <td><span className="status-badge status-info">{log.confidence}/5</span></td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(log.id)}>✏️ Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(log.id)}>🗑️ Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 0 }}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <div className="empty-state-text">No study logs found.</div>
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
