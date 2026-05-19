import React, { useState } from 'react';
import { createMilestone } from '../api/milestoneApi';

export default function MilestoneForm({ onSuccess }) {
  const [form, setForm] = useState({
    project: '', milestone: '', owner: '', due_date: '', status: '', github_url: '', notes: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createMilestone({ ...form });
      setForm({ project: '', milestone: '', owner: '', due_date: '', status: '', github_url: '', notes: '' });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add milestone');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Project Milestone</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="project" placeholder="Project" value={form.project} onChange={handleChange} required />
          <input className="form-control" name="milestone" placeholder="Milestone" value={form.milestone} onChange={handleChange} required />
          <input className="form-control" name="owner" placeholder="Owner" value={form.owner} onChange={handleChange} required />
          <input className="form-control" name="due_date" type="date" value={form.due_date} onChange={handleChange} required />
          <input className="form-control" name="status" placeholder="Status" value={form.status} onChange={handleChange} required />
          <input className="form-control" name="github_url" placeholder="GitHub URL" value={form.github_url} onChange={handleChange} />
          <input className="form-control" name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}