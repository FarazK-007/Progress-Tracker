import React, { useEffect, useState } from 'react';
import { fetchDailyPlans, deleteDailyPlan, updateDailyPlan } from '../api/dailyPlanApi';
import DailyPlanForm from './DailyPlanForm';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const getDailyPlanStatusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('complete')) return 'status-badge status-success';
  if (s.includes('progress')) return 'status-badge status-info';
  if (s.includes('skip') || s.includes('fail')) return 'status-badge status-danger';
  return 'status-badge status-neutral';
};

const getStatusIcon = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('complete')) return '✅';
  if (s.includes('progress')) return '🔄';
  if (s.includes('skip')) return '⏭️';
  return '⬜';
};

// Parse semicolon-separated tasks into a checklist with interactive checkboxes



function TaskChecklist({ plan, onToggleTask, reloadPlans }) {
  const tasks = plan.tasks;
  const [showOutput, setShowOutput] = React.useState({}); // {index: bool}
  const [loadingOutput, setLoadingOutput] = React.useState({}); // {index: bool}

  // Always derive outputs from plan.ai_guide (source of truth)
  let aiOutputs = {};
  if (plan.ai_guide) {
    try {
      const parsed = JSON.parse(plan.ai_guide);
      if (typeof parsed === 'object' && parsed !== null) aiOutputs = parsed;
    } catch (e) {}
  }


  // Generate AI output for a single task using Gemini
  const generateTaskGuide = async (task, index) => {
    setLoadingOutput(prev => ({ ...prev, [index]: true }));
    try {
      const gatewayUrl = localStorage.getItem('AI_GATEWAY_URL') || '';
      const apiKey = localStorage.getItem('AI_API_KEY');
      const model = localStorage.getItem('AI_MODEL') || '';
      if (!apiKey) {
        // Save error to backend as well
        const newOutputs = { ...aiOutputs, [index]: '❌ API Key not set in Settings.' };
        const updatedPlan = { ...plan, ai_guide: JSON.stringify(newOutputs) };
        await updateDailyPlan(plan.id, updatedPlan);
        setLoadingOutput(prev => ({ ...prev, [index]: false }));
        return;
      }
      const prompt = `I am preparing for software/data engineering interviews.\nMy focus area for today is '${plan.focus_area}'.\nToday's task: ${task}\n\nPlease act as an expert technical tutor. Provide a comprehensive, high-quality study guide for this specific task.\nYou MUST provide the actual answers, solutions, and detailed explanations for any concepts, questions, or topics mentioned in the task. Do not just tell me what to study; actually teach it to me and provide the material directly in your response.\nFormat your response cleanly in Markdown, using headings, bullet points, tables, and code blocks where appropriate to make the UI look premium. Keep it highly actionable.`;

      // Only use Gemini logic if the URL is clearly a Google Gemini endpoint
      let url = '';
      let headers = {};
      let body = {};
      if (/generativelanguage\.googleapis\.com/.test(gatewayUrl)) {
        // Gemini-compatible (Google)
        url = `${gatewayUrl.replace(/\/$/, '')}/${model}:generateContent?key=${apiKey}`;
        headers = { 'Content-Type': 'application/json' };
        body = { contents: [{ parts: [{ text: prompt }] }] };
      } else {
        // Default to OpenAI-compatible
        url = gatewayUrl.endsWith('/v1/chat/completions') ? gatewayUrl : `${gatewayUrl.replace(/\/$/, '')}/v1/chat/completions`;
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };
        body = {
          model,
          messages: [
            { role: 'system', content: 'You are a helpful technical tutor.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }
      const data = await response.json();
      let text = '';
      if (data.choices && data.choices[0]?.message?.content) {
        // OpenAI
        text = data.choices[0].message.content;
      } else if (data.candidates && data.candidates[0]?.content?.parts) {
        // Gemini
        text = data.candidates[0].content.parts.map(p => p.text).join('\n');
      } else {
        text = JSON.stringify(data);
      }
      // Save to backend (merge with previous outputs)
      const newOutputs = { ...aiOutputs, [index]: text };
      const updatedPlan = { ...plan, ai_guide: JSON.stringify(newOutputs) };
      await updateDailyPlan(plan.id, updatedPlan);
      if (typeof reloadPlans === 'function') reloadPlans();
    } catch (error) {
      const newOutputs = { ...aiOutputs, [index]: '❌ Error: ' + error.message };
      const updatedPlan = { ...plan, ai_guide: JSON.stringify(newOutputs) };
      await updateDailyPlan(plan.id, updatedPlan);
      if (typeof reloadPlans === 'function') reloadPlans();
    } finally {
      setLoadingOutput(prev => ({ ...prev, [index]: false }));
    }
  };

  if (!tasks) return <span style={{ color: 'var(--text-muted)' }}>No tasks defined</span>;

  const items = tasks.split(';').map(t => {
    let text = t.trim();
    if (!text) return null;
    let done = false;
    if (text.startsWith('[x] ') || text.startsWith('[X] ')) {
      done = true;
      text = text.substring(4);
    } else if (text.startsWith('[ ] ')) {
      done = false;
      text = text.substring(4);
    }
    return { text, done, original: t.trim() };
  }).filter(Boolean);

  const handleToggle = (index) => {
    const newItems = [...items];
    newItems[index].done = !newItems[index].done;
    const newTasksString = newItems.map(item => `[${item.done ? 'x' : ' '}] ${item.text}`).join('; ');
    onToggleTask(plan, newTasksString);
  };

  const renderTaskText = (text) => {
    const parts = [];
    const regex = /\[(.*?)\]\((.*?)\)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
      }
      parts.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noreferrer"
           style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 500 }}
           onClick={e => e.stopPropagation()}>
          {match[1]}
        </a>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }
    return parts.length > 0 ? parts : text;
  };

  const handleToggleOutput = (index, task) => {
    setShowOutput(prev => {
      const next = { ...prev, [index]: !prev[index] };
      // Only generate if opening, not loading, and output is truly missing in plan.ai_guide
      if (next[index] && !loadingOutput[index] && (!aiOutputs || !aiOutputs[index])) {
        generateTaskGuide(task, index);
      }
      return next;
    });
  };

  return (
    <ul style={{
      listStyle: 'none', padding: 0, margin: 0,
      display: 'flex', flexDirection: 'column', gap: '0.5rem'
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: 'flex', flexDirection: 'column', gap: '0.3rem',
          fontSize: '0.9rem', color: item.done ? 'var(--text-muted)' : 'var(--text-primary)',
          lineHeight: 1.5, textDecoration: item.done ? 'line-through' : 'none',
          transition: 'all var(--transition)',
          background: 'var(--bg-main)', borderRadius: '6px', padding: '0.5rem 0.5rem 0.5rem 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); handleToggle(i); }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '1.25rem', height: '1.25rem', borderRadius: '4px',
              border: item.done ? '2px solid var(--success)' : '2px solid var(--border)',
              flexShrink: 0, marginTop: '0.1rem',
              background: item.done ? 'var(--success)' : 'var(--bg-main)',
              color: 'white', fontSize: '0.8rem', transition: 'all var(--transition)'
            }}>
              {item.done && '✓'}
            </div>
            <div style={{ flex: 1 }}>{renderTaskText(item.text)}</div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', marginLeft: '0.5rem' }}
              onClick={e => { e.stopPropagation(); handleToggleOutput(i, item.text); }}
              disabled={loadingOutput[i]}
            >
              {showOutput[i] ? 'Hide Output' : 'Show Output'}
            </button>
            {showOutput[i] && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', marginLeft: '0.5rem', color: 'var(--accent)' }}
                onClick={e => { e.stopPropagation(); generateTaskGuide(item.text, i); }}
                disabled={loadingOutput[i]}
                title="Regenerate AI Output"
              >
                🔄 Regenerate
              </button>
            )}
          </div>
          {showOutput[i] && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '4px', margin: '0.3rem 0 0.2rem 2.2rem', padding: '0.7rem',
              fontSize: '0.88rem', color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              {loadingOutput[i] ? (
                <span style={{ color: 'var(--text-muted)' }}>Generating AI output...</span>
              ) : aiOutputs[i] ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiOutputs[i]}</ReactMarkdown>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No output yet.</span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// Inline edit form for a single plan
function EditPlanInline({ plan, onSave, onCancel }) {
  const [form, setForm] = useState({ ...plan });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...form,
      day: Number(form.day),
      hours_planned: Number(form.hours_planned),
      hours_actual: form.hours_actual ? Number(form.hours_actual) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg-main)', borderRadius: 'var(--radius-md)',
      padding: '1.25rem', border: '2px solid var(--accent-light)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input className="form-control" name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle}>Focus Area</label>
          <input className="form-control" name="focus_area" value={form.focus_area} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle}>Week</label>
          <input className="form-control" name="week" value={form.week} onChange={handleChange} required />
        </div>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>Tasks (semicolon-separated)</label>
        <textarea className="form-control" name="tasks" value={form.tasks} onChange={handleChange} rows={3}
          style={{ width: '100%', minWidth: '100%' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <label style={labelStyle}>Hours Planned</label>
          <input className="form-control" name="hours_planned" type="number" value={form.hours_planned} onChange={handleChange} />
        </div>
        <div>
          <label style={labelStyle}>Hours Actual</label>
          <input className="form-control" name="hours_actual" type="number" value={form.hours_actual || ''} onChange={handleChange} />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select className="form-control" name="status" value={form.status} onChange={handleChange}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Skipped">Skipped</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Day #</label>
          <input className="form-control" name="day" type="number" value={form.day} onChange={handleChange} />
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Notes</label>
        <input className="form-control" name="notes" value={form.notes || ''} onChange={handleChange} placeholder="Any notes..." style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" type="submit">💾 Save Changes</button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: 'var(--text-secondary)', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: '0.3rem'
};

export default function DailyPlanList() {
  const [plans, setPlans] = useState([]);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filterWeek, setFilterWeek] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  // AI Guide State
  const [aiGuides, setAiGuides] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [showAiGuide, setShowAiGuide] = useState({});

  const loadPlans = () => fetchDailyPlans().then(res => setPlans(res.data));
  useEffect(() => { loadPlans(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this daily plan?')) {
      await deleteDailyPlan(id);
      loadPlans();
    }
  };
  const handleSave = async (form) => {
    await updateDailyPlan(form.id, form);
    setEditId(null);
    loadPlans();
  };

  const handleToggleTask = async (plan, newTasksString) => {
    // Optimistic update
    setPlans(plans.map(p => p.id === plan.id ? { ...p, tasks: newTasksString } : p));
    await updateDailyPlan(plan.id, { ...plan, tasks: newTasksString });
    loadPlans();
  };

  const generateGuide = async (plan) => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || localStorage.getItem('AI_API_KEY');
    if (!apiKey) {
      alert("Please configure your AI API Key in the Settings page first.");
      return;
    }

    setAiLoading(prev => ({ ...prev, [plan.id]: true }));
    setAiGuides(prev => ({ ...prev, [plan.id]: null })); // clear previous

    try {
      const gatewayUrl = localStorage.getItem('AI_GATEWAY_URL') || '';
      const model = localStorage.getItem('AI_MODEL') || 'gemini-2.5-flash';
      
      const prompt = `I am preparing for software/data engineering interviews. 
My focus area for today is '${plan.focus_area}' and my tasks are: 
${plan.tasks}

Please act as an expert technical tutor. Provide a comprehensive, high-quality study guide for these specific tasks. 
CRITICAL: You MUST provide the actual answers, solutions, and detailed explanations for any concepts, questions, or topics mentioned in the tasks. Do not just tell me what to study; actually teach it to me and provide the material directly in your response.
Format your response cleanly in Markdown, using headings, bullet points, tables, and code blocks where appropriate to make the UI look premium. Keep it highly actionable.`;

      let text = '';
      if (/generativelanguage\.googleapis\.com/.test(gatewayUrl)) {
        const url = `${gatewayUrl.replace(/\/$/, '')}/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        const data = await response.json();
        text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || JSON.stringify(data);
      } else {
        const url = gatewayUrl.endsWith('/v1/chat/completions') ? gatewayUrl : `${gatewayUrl.replace(/\/$/, '')}/v1/chat/completions`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are a helpful technical tutor.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        const data = await response.json();
        text = data.choices?.[0]?.message?.content || JSON.stringify(data);
      }
      
      setAiGuides(prev => ({ ...prev, [plan.id]: text }));
      
      // Save to backend
      await updateDailyPlan(plan.id, { ...plan, ai_guide: text });
      loadPlans();
    } catch (error) {
      console.error(error);
      setAiGuides(prev => ({ ...prev, [plan.id]: "❌ **Error generating guide:** " + error.message }));
    } finally {
      setAiLoading(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  // Get unique weeks for filter
  const weeks = [...new Set(plans.map(p => p.week))].sort();

  // Apply filters
  let filtered = plans;
  if (filterWeek !== 'all') filtered = filtered.filter(p => p.week === filterWeek);
  if (filterStatus !== 'all') {
    filtered = filtered.filter(p => {
      const s = (p.status || '').toLowerCase();
      if (filterStatus === 'done') return s.includes('done') || s.includes('complete');
      if (filterStatus === 'pending') return !s.includes('done') && !s.includes('complete');
      return true;
    });
  }

  // Stats
  const totalHours = filtered.reduce((sum, p) => sum + (p.hours_planned || 0), 0);
  const doneCount = filtered.filter(p => {
    const s = (p.status || '').toLowerCase();
    return s.includes('done') || s.includes('complete');
  }).length;

  return (
    <div>
      <DailyPlanForm onSuccess={loadPlans} />
      {/* Filters & Summary Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem',
        flexWrap: 'wrap', padding: '0.75rem 1rem',
        background: 'var(--bg-main)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Week:</span>
          <select className="form-control" value={filterWeek} onChange={e => setFilterWeek(e.target.value)}
            style={{ minWidth: '80px', flex: 'none', padding: '0.4rem 0.6rem' }}>
            <option value="all">All</option>
            {weeks.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ minWidth: '100px', flex: 'none', padding: '0.4rem 0.6rem' }}>
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> days
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--success)' }}>{doneCount}</strong> done
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent)' }}>{totalHours}h</strong> planned
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.map(plan => {
          const isExpanded = expandedId === plan.id;
          const isEditing = editId === plan.id;
          const taskCount = plan.tasks ? plan.tasks.split(';').filter(t => t.trim()).length : 0;

          return (
            <div key={plan.id} style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
              border: `1px solid ${isEditing ? 'var(--accent)' : 'var(--border)'}`,
              overflow: 'hidden', transition: 'all var(--transition)',
              boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            }}>
              {/* Collapsed Header Row */}
              <div
                onClick={() => !isEditing && setExpandedId(isExpanded ? null : plan.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5rem 1fr auto',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  cursor: isEditing ? 'default' : 'pointer',
                  gap: '0.75rem',
                  transition: 'background var(--transition)',
                  background: isExpanded ? 'var(--bg-main)' : 'transparent',
                }}
              >
                {/* Day number circle */}
                <div style={{
                  width: '2.2rem', height: '2.2rem', borderRadius: '50%',
                  background: isExpanded ? 'var(--accent)' : 'var(--bg-main)',
                  color: isExpanded ? 'white' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  border: isExpanded ? 'none' : '1px solid var(--border)',
                  transition: 'all var(--transition)',
                }}>
                  {plan.day}
                </div>

                {/* Main info */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {plan.focus_area}
                    </span>
                    <span className={getDailyPlanStatusBadge(plan.status)} style={{ fontSize: '0.65rem' }}>
                      {getStatusIcon(plan.status)} {plan.status}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--text-muted)',
                      background: 'var(--bg-main)', padding: '0.15rem 0.5rem',
                      borderRadius: '2rem', border: '1px solid var(--border)',
                    }}>
                      {plan.week}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', gap: '1rem' }}>
                    <span>📅 {plan.date}</span>
                    <span>⏱️ {plan.hours_planned}h planned{plan.hours_actual ? ` · ${plan.hours_actual}h actual` : ''}</span>
                    <span>📋 {taskCount} task{taskCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Expand chevron */}
                <div style={{
                  fontSize: '1rem', color: 'var(--text-muted)',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--transition)',
                }}>
                  ▾
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && !isEditing && (
                <div style={{
                  padding: '0 1rem 1rem', borderTop: '1px solid var(--border)',
                  animation: 'slideUp 0.3s ease forwards',
                }}>
                  {/* Task Checklist */}
                  <div style={{ padding: '1rem 0' }}>
                    <div style={{ ...labelStyle, marginBottom: '0.6rem' }}>Tasks</div>
                    <TaskChecklist plan={plan} onToggleTask={handleToggleTask} />
                  </div>

                  {/* Hours & Notes Row */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem', marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={labelStyle}>Hours Planned</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                        {plan.hours_planned}h
                      </div>
                    </div>
                    <div>
                      <div style={labelStyle}>Hours Actual</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: plan.hours_actual ? 'var(--success)' : 'var(--text-muted)' }}>
                        {plan.hours_actual ? `${plan.hours_actual}h` : '—'}
                      </div>
                    </div>
                    <div>
                      <div style={labelStyle}>Notes</div>
                      <div style={{ fontSize: '0.85rem', color: plan.notes ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {plan.notes || 'No notes'}
                      </div>
                    </div>
                  </div>

                  {/* AI Guide Section */}
                  {showAiGuide[plan.id] && (aiLoading[plan.id] || aiGuides[plan.id] || plan.ai_guide) && (
                    <div className="ai-guide-box" style={{ position: 'relative' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowAiGuide(prev => ({ ...prev, [plan.id]: false })); }}
                        style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                        title="Hide Guide"
                      >
                        ✖
                      </button>
                      <div className="ai-guide-header">
                        <span style={{ fontSize: '1.2rem' }}>🤖</span> 
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>AI Study Guide</span>
                      </div>
                      <div className="ai-guide-content">
                        {aiLoading[plan.id] ? (
                          <div className="chat-loading" style={{ padding: '0.5rem 0' }}>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                          </div>
                        ) : (
                          <div className="markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {aiGuides[plan.id] || plan.ai_guide}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-edit" onClick={(e) => { e.stopPropagation(); setEditId(plan.id); }}>✏️ Edit</button>
                    <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>🗑️ Delete</button>
                    {!(plan.status || '').toLowerCase().includes('done') && (
                      <button className="btn btn-primary" onClick={async (e) => {
                        e.stopPropagation();
                        await updateDailyPlan(plan.id, { ...plan, status: 'Done' });
                        loadPlans();
                      }}>✅ Mark Done</button>
                    )}
                    {plan.ai_guide || aiGuides[plan.id] ? (
                      <>
                        <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); setShowAiGuide(prev => ({ ...prev, [plan.id]: !prev[plan.id] })); }}>
                          🤖 {showAiGuide[plan.id] ? 'Hide Study Guide' : 'Show Study Guide'}
                        </button>
                        <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); generateGuide(plan); setShowAiGuide(prev => ({ ...prev, [plan.id]: true })); }} disabled={aiLoading[plan.id]}>
                          🔄 Regenerate
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); generateGuide(plan); setShowAiGuide(prev => ({ ...prev, [plan.id]: true })); }} disabled={aiLoading[plan.id]}>
                        🤖 Generate Study Guide
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Editing Mode */}
              {isEditing && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
                  <EditPlanInline plan={plan} onSave={handleSave} onCancel={() => setEditId(null)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">No daily plans match your filters.</div>
          <div className="empty-state-sub">Try adjusting the week or status filter above.</div>
        </div>
      )}
    </div>
  );
}
