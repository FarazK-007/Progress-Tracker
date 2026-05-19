import React, { useEffect, useState } from 'react';
import { fetchReminders, deleteReminder, updateReminder } from '../api/reminderApi';
import ReminderForm from './ReminderForm';

function EditRow({ reminder, onSave, onCancel }) {
  const [form, setForm] = useState({ ...reminder });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...form });
  };
  return (
    <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input className="form-control" name="title" value={form.title} onChange={handleChange} required style={{flex: 1}} />
      <input className="form-control" name="due_date" type="date" value={form.due_date} onChange={handleChange} required style={{width:130}} />
      <select className="form-control" name="completed" value={form.completed ? 'true' : 'false'} onChange={e => setForm({ ...form, completed: e.target.value === 'true' })} style={{width:100}}>
        <option value="false">Pending</option>
        <option value="true">Done</option>
      </select>
      <button className="btn btn-primary" type="submit">💾 Save</button>
      <button className="btn" type="button" onClick={onCancel} style={{ background: '#e2e8f0' }}>❌ Cancel</button>
    </form>
  );
}

export default function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const [editId, setEditId] = useState(null);
  const loadReminders = () => fetchReminders().then(res => setReminders(res.data));
  useEffect(() => { loadReminders(); }, []);
  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      await deleteReminder(id);
      loadReminders();
    }
  };
  const handleEdit = (id) => setEditId(id);
  const handleCancel = () => setEditId(null);
  const handleSave = async (form) => {
    await updateReminder(form.id, {...form, completed: form.completed === true || form.completed === 'true'});
    setEditId(null);
    loadReminders();
  };
  const toggleComplete = async (reminder) => {
    await updateReminder(reminder.id, { ...reminder, completed: !reminder.completed });
    loadReminders();
  };
  return (
    <div>
      <ReminderForm onSuccess={loadReminders} />
      <div className="table-responsive">
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>✓</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(reminder => (
              <tr key={reminder.id} className={editId === reminder.id ? 'editing-row' : ''}>
                {editId === reminder.id ? (
                  <td colSpan="5">
                    <EditRow reminder={reminder} onSave={handleSave} onCancel={handleCancel} />
                  </td>
                ) : (
                  <>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={reminder.completed} 
                        onChange={() => toggleComplete(reminder)}
                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ fontWeight: 600, textDecoration: reminder.completed ? 'line-through' : 'none', color: reminder.completed ? '#94a3b8' : 'inherit' }}>
                      {reminder.title}
                    </td>
                    <td>{reminder.due_date}</td>
                    <td>
                      {reminder.completed ? <span className="status-badge status-success">Done</span> : <span className="status-badge status-warning">Pending</span>}
                    </td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(reminder.id)}>✏️ Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(reminder.id)}>🗑️ Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {reminders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 0 }}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🔔</div>
                    <div className="empty-state-text">No reminders found.</div>
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
