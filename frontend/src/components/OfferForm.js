import React, { useState } from 'react';
import { createOffer } from '../api/offerApi';

export default function OfferForm({ onSuccess }) {
  const [form, setForm] = useState({
    company: '', role: '', ctc: '', base: '', bonus: '', stocks: '', benefits: '', notes: '', status: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createOffer({
        ...form,
        ctc: Number(form.ctc),
        base: Number(form.base),
        bonus: Number(form.bonus),
        stocks: Number(form.stocks)
      });
      setForm({ company: '', role: '', ctc: '', base: '', bonus: '', stocks: '', benefits: '', notes: '', status: '' });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add offer');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Offer</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
          <input className="form-control" name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
          <input className="form-control" name="ctc" placeholder="CTC" value={form.ctc} onChange={handleChange} required />
          <input className="form-control" name="base" placeholder="Base" value={form.base} onChange={handleChange} required />
          <input className="form-control" name="bonus" placeholder="Bonus" value={form.bonus} onChange={handleChange} required />
          <input className="form-control" name="stocks" placeholder="Stocks" value={form.stocks} onChange={handleChange} required />
          <input className="form-control" name="benefits" placeholder="Benefits" value={form.benefits} onChange={handleChange} />
          <input className="form-control" name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
          <input className="form-control" name="status" placeholder="Status" value={form.status} onChange={handleChange} required />
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}