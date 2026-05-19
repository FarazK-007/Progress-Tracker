import React, { useState } from 'react';
import { createReminder } from '../api/reminderApi';

export default function ReminderForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '', due_date: '', completed: false, notes: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createReminder({ ...form });
      setForm({ title: '', due_date: '', completed: false, notes: '' });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add reminder');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Reminder</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{flex:2}} />
          <input className="form-control" name="due_date" type="date" value={form.due_date} onChange={handleChange} required />
          <input className="form-control" name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} style={{flex:2}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <input name="completed" type="checkbox" checked={form.completed} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem' }} /> Completed
          </label>
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}