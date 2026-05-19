import React, { useState } from 'react';
import { createQuestion } from '../api/questionBankApi';

export default function QuestionBankForm({ onSuccess }) {
  const [form, setForm] = useState({
    topic: '', question: '', difficulty: '', answer: '', confidence: '', last_revised: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createQuestion({
        ...form,
        confidence: Number(form.confidence)
      });
      setForm({ topic: '', question: '', difficulty: '', answer: '', confidence: '', last_revised: '' });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add question');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Question</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="topic" placeholder="Topic" value={form.topic} onChange={handleChange} required />
          <input className="form-control" name="question" placeholder="Question" value={form.question} onChange={handleChange} required style={{ flex: 2 }} />
          <select className="form-control" name="difficulty" value={form.difficulty} onChange={handleChange} required>
            <option value="">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input className="form-control" name="answer" placeholder="Answer/Key Points" value={form.answer} onChange={handleChange} />
          <input className="form-control" name="confidence" placeholder="Confidence (1-5)" value={form.confidence} onChange={handleChange} required />
          <input className="form-control" name="last_revised" type="date" value={form.last_revised} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}