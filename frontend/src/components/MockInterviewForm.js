import React, { useState } from 'react';
import { createMockInterview } from '../api/mockInterviewApi';

export default function MockInterviewForm({ onSuccess }) {
  const [form, setForm] = useState({
    date: '', type: '', platform: '', score: '', strengths: '', weak_areas: '', action_items: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createMockInterview({
        ...form,
        score: Number(form.score)
      });
      setForm({ date: '', type: '', platform: '', score: '', strengths: '', weak_areas: '', action_items: '' });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add mock interview');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Mock Interview</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="date" type="date" value={form.date} onChange={handleChange} required />
          <input className="form-control" name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
          <input className="form-control" name="platform" placeholder="Platform" value={form.platform} onChange={handleChange} />
          <input className="form-control" name="score" placeholder="Score (1-10)" value={form.score} onChange={handleChange} required />
          <input className="form-control" name="strengths" placeholder="Strengths" value={form.strengths} onChange={handleChange} />
          <input className="form-control" name="weak_areas" placeholder="Weak Areas" value={form.weak_areas} onChange={handleChange} />
          <input className="form-control" name="action_items" placeholder="Action Items" value={form.action_items} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}