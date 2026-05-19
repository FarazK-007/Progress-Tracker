import React, { useState } from 'react';
import { createTargetCompany } from '../api/targetCompanyApi';

export default function TargetCompanyForm({ onSuccess }) {
  const [form, setForm] = useState({
    company: '', tier: '', role: '', why_it_fits: '', referral_contact: '', status: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createTargetCompany({ ...form });
      setForm({ company: '', tier: '', role: '', why_it_fits: '', referral_contact: '', status: '' });
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add target company');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#4f46e5' }}>Add Target Company</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input className="form-control" name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
          <select className="form-control" name="tier" value={form.tier} onChange={handleChange} required>
            <option value="">Select Tier</option>
            <option value="T1">T1 — Dream</option>
            <option value="T2">T2 — Strong Fit</option>
            <option value="T3">T3 — Good Fit</option>
          </select>
          <input className="form-control" name="role" placeholder="Role Type" value={form.role} onChange={handleChange} />
          <input className="form-control" name="why_it_fits" placeholder="Why It Fits" value={form.why_it_fits} onChange={handleChange} style={{flex: 2}} />
          <input className="form-control" name="referral_contact" placeholder="Referral Contact" value={form.referral_contact} onChange={handleChange} />
          <select className="form-control" name="status" value={form.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Not Contacted">Not Contacted</option>
            <option value="Contacted">Contacted</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="btn btn-primary" type="submit">➕ Add</button>
        </div>
        {error && <div style={{ color: '#e11d48', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </form>
    </div>
  );
}
