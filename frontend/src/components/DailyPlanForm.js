import React, { useState } from 'react';
import { createDailyPlan } from '../api/dailyPlanApi';

export default function DailyPlanForm({ onSuccess }) {
  const [form, setForm] = useState({
    day: '',
    date: '',
    week: '',
    focus_area: '',
    tasks: '',
    hours_planned: '',
    status: '',
    hours_actual: '',
    notes: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createDailyPlan({
        ...form,
        day: Number(form.day),
        hours_planned: Number(form.hours_planned),
        hours_actual: form.hours_actual ? Number(form.hours_actual) : null
      });
      setForm({
        day: '', date: '', week: '', focus_area: '', tasks: '', hours_planned: '', status: '', hours_actual: '', notes: ''
      });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add daily plan');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Daily Plan</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="day" placeholder="Day (number)" value={form.day} onChange={handleChange} required />
          <input className="form-control" name="date" type="date" value={form.date} onChange={handleChange} required />
          <input className="form-control" name="week" placeholder="Week" value={form.week} onChange={handleChange} required />
          <input className="form-control" name="focus_area" placeholder="Focus Area" value={form.focus_area} onChange={handleChange} required />
          <input className="form-control" name="tasks" placeholder="Tasks" value={form.tasks} onChange={handleChange} required style={{ flex: 2 }} />
          <input className="form-control" name="hours_planned" placeholder="Hours Planned" value={form.hours_planned} onChange={handleChange} required />
          <input className="form-control" name="status" placeholder="Status" value={form.status} onChange={handleChange} required />
          <input className="form-control" name="hours_actual" placeholder="Hours Actual" value={form.hours_actual} onChange={handleChange} />
          <input className="form-control" name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}
