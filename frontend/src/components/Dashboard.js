import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import API_BASE_URL from '../api/config';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const endpoints = [
      { key: 'dailyPlans', url: `${API_BASE_URL}/dailyplan/` },
      { key: 'questions', url: `${API_BASE_URL}/questions/` },
      { key: 'milestones', url: `${API_BASE_URL}/milestones/` },
      { key: 'targets', url: `${API_BASE_URL}/targetcompanies/` },
      { key: 'jobApps', url: `${API_BASE_URL}/jobapps/` },
      { key: 'studyLogs', url: `${API_BASE_URL}/studylogs/` },
      { key: 'mocks', url: `${API_BASE_URL}/mockinterviews/` },
      { key: 'reminders', url: `${API_BASE_URL}/reminders/` },
      { key: 'offers', url: `${API_BASE_URL}/offers/` },
    ];

    Promise.all(
      endpoints.map(ep => fetch(ep.url).then(r => r.json()).then(data => ({ key: ep.key, data })))
    ).then(results => {
      const s = {};
      results.forEach(r => { s[r.key] = r.data; });
      setStats(s);
      setError(null);
    }).catch((err) => {
      console.error('Dashboard fetch error:', err);
      setError('Could not connect to the backend. Make sure the API server is running on ' + API_BASE_URL);
      setStats({});
    });
  }, []);

  if (error) {
    return (
      <div className="section-page">
        <div className="section-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Connection Error
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            {error}
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
            onClick={() => { setError(null); setStats(null); window.location.reload(); }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="section-page">
        <div className="section-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>⏳</div>
          <div style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const dailyDone = (stats.dailyPlans || []).filter(p => {
    const s = (p.status || '').toLowerCase();
    return s.includes('done') || s.includes('complete');
  }).length;
  const totalPlans = (stats.dailyPlans || []).length;
  const progressPct = totalPlans > 0 ? Math.round((dailyDone / totalPlans) * 100) : 0;

  const questionTopics = [...new Set((stats.questions || []).map(q => q.topic))];
  const milestoneDone = (stats.milestones || []).filter(m => {
    const s = (m.status || '').toLowerCase();
    return s.includes('done') || s.includes('complete');
  }).length;

  const cards = [
    {
      icon: '📅', iconClass: 'purple', value: totalPlans,
      label: 'Daily Plans', trend: `${dailyDone} completed`, trendClass: dailyDone > 0 ? 'up' : 'neutral',
      path: '/daily'
    },
    {
      icon: '💡', iconClass: 'blue', value: (stats.questions || []).length,
      label: 'Questions', trend: `${questionTopics.length} topics`, trendClass: 'neutral',
      path: '/questions'
    },
    {
      icon: '🚀', iconClass: 'green', value: (stats.milestones || []).length,
      label: 'Milestones', trend: `${milestoneDone} done`, trendClass: milestoneDone > 0 ? 'up' : 'neutral',
      path: '/milestones'
    },
    {
      icon: '🎯', iconClass: 'orange', value: (stats.targets || []).length,
      label: 'Target Companies', trend: 'Companies tracked', trendClass: 'neutral',
      path: '/targets'
    },
    {
      icon: '🏢', iconClass: 'pink', value: (stats.jobApps || []).length,
      label: 'Applications', trend: 'Submitted', trendClass: 'neutral',
      path: '/jobs'
    },
    {
      icon: '🎤', iconClass: 'cyan', value: (stats.mocks || []).length,
      label: 'Mock Interviews', trend: 'Completed', trendClass: 'neutral',
      path: '/mock'
    },
  ];

  // Recent daily plans
  const recentPlans = (stats.dailyPlans || []).slice(0, 7);

  // Upcoming (next 5 plans that are not done)
  const today = new Date().toISOString().split('T')[0];
  const upcoming = (stats.dailyPlans || [])
    .filter(p => p.date >= today && !(p.status || '').toLowerCase().includes('done'))
    .slice(0, 5);

  return (
    <div className="section-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        {cards.map(card => (
          <div key={card.label} className="stat-card" onClick={() => navigate(card.path)}>
            <div className={`stat-icon ${card.iconClass}`}>{card.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              <span className={`stat-trend ${card.trendClass}`}>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📈 Overall Daily Plan Progress
        </h3>
        <div style={{
          background: 'var(--bg-main)', borderRadius: '2rem', height: '1.5rem', overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: `${progressPct}%`, height: '100%',
            background: progressPct > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
            borderRadius: '2rem', transition: 'width 1s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: 'white',
            minWidth: progressPct > 0 ? '2.5rem' : 0
          }}>
            {progressPct > 0 && `${progressPct}%`}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{dailyDone} / {totalPlans} days completed</span>
          <span>{totalPlans - dailyDone} remaining</span>
        </div>
      </div>

      {/* Two-column: Upcoming & Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Upcoming Tasks */}
        <div className="section-card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            ⏳ Upcoming Tasks
          </h3>
          {upcoming.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {upcoming.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.75rem', background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, minWidth: '5.5rem' }}>
                    {p.date}
                  </span>
                  <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{p.focus_area}</span>
                  <span className="status-badge status-neutral" style={{ fontSize: '0.65rem' }}>{p.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">All caught up!</div>
            </div>
          )}
        </div>

        {/* Question Topics Breakdown */}
        <div className="section-card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            💡 Questions by Topic
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {questionTopics.map(topic => {
              const count = (stats.questions || []).filter(q => q.topic === topic).length;
              const pct = Math.round((count / (stats.questions || []).length) * 100);
              return (
                <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: '5.5rem', color: 'var(--text-primary)' }}>{topic}</span>
                  <div style={{ flex: 1, background: 'var(--bg-main)', borderRadius: '2rem', height: '0.5rem', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: '2rem',
                      background: 'var(--accent)'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', minWidth: '1.5rem', textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
