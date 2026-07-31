import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const sectionMeta = {
  dashboard: {
    title: 'Dashboard',
    eyebrow: 'Customer Portal'
  },
  'ai-studio': {
    title: 'AI Studio',
    eyebrow: 'Analysis Workspace'
  },
  'submit-feedback': {
    title: 'Submit Feedback',
    eyebrow: 'Customer Input'
  },
  analytics: {
    title: 'Analytics',
    eyebrow: 'Personal Insights'
  },
  'prediction-history': {
    title: 'Prediction History',
    eyebrow: 'Past Analyses'
  },
  reports: {
    title: 'Reports',
    eyebrow: 'Downloads & Summaries'
  },
  subscription: {
    title: 'My Subscription',
    eyebrow: 'Plan Details'
  },
  notifications: {
    title: 'Notifications',
    eyebrow: 'Updates & Alerts'
  },
  profile: {
    title: 'Profile',
    eyebrow: 'Account Details'
  },
  settings: {
    title: 'Settings',
    eyebrow: 'Preferences'
  },
  'help-support': {
    title: 'Help & Support',
    eyebrow: 'Customer Care'
  },
  assistant: {
    title: 'AI Assistant',
    eyebrow: 'Premium Guidance'
  }
};

const quickActions = [
  { label: 'Run AI Analysis', to: '/prediction' },
  { label: 'Submit Feedback', to: '/submit-feedback' },
  { label: 'View Reports', to: '/reports' }
];

const supportItems = [
  { title: 'FAQs', detail: 'Find answers for product, billing, and account usage.' },
  { title: 'Documentation', detail: 'Read the customer guide and AI workflow overview.' },
  { title: 'Contact Support', detail: 'Open a ticket for technical help or account support.' }
];

export default function CustomerPortalPage({ section = 'dashboard', user }) {
  const meta = sectionMeta[section] || sectionMeta.dashboard;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({ title: '', category: '', details: '' });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('intelsense-token') || '';
        const resp = await api.get('/api/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!cancelled) {
          const payload = Array.isArray(resp.data) ? resp.data : [];
          setHistory(payload);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          const stored = localStorage.getItem('intelsense-history');
          try {
            setHistory(stored ? JSON.parse(stored) : []);
          } catch {
            setHistory([]);
          }
          setError('Live history is temporarily unavailable; showing the latest stored activity.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentPredictions = useMemo(() => history.slice(0, 3).map((item) => ({
    id: item.id || 'n/a',
    summary: item.aiResult || item.text || 'No summary yet',
    score: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Pending'
  })), [history]);

  const overviewStats = useMemo(() => [
    { label: 'Stored analyses', value: history.length.toString(), detail: 'Persisted feedback records' },
    { label: 'Latest activity', value: history[0]?.createdAt ? new Date(history[0].createdAt).toLocaleDateString() : 'No data', detail: 'Most recent submission' },
    { label: 'Status', value: error ? 'Sync warning' : 'Live', detail: error || 'Connected to API' }
  ], [error, history]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.details.trim()) {
      setFeedbackMessage('Please add feedback details before submitting.');
      return;
    }

    setFeedbackSubmitting(true);
    setFeedbackMessage('');

    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const payload = {
        text: `${feedbackForm.title ? `${feedbackForm.title}: ` : ''}${feedbackForm.details}`,
        source: feedbackForm.category || 'customer-portal'
      };
      const resp = await api.post('/api/feedback', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const nextItem = {
        id: resp.data?.id || Date.now(),
        text: resp.data?.text || payload.text,
        source: resp.data?.source || payload.source,
        aiResult: resp.data?.aiResult || 'Processed',
        createdBy: resp.data?.createdBy || user?.username || 'customer',
        createdAt: resp.data?.createdAt || new Date().toISOString()
      };
      setHistory((prev) => [nextItem, ...prev]);
      setFeedbackForm({ title: '', category: '', details: '' });
      setFeedbackMessage('Feedback submitted successfully.');
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.detail || 'Unable to submit feedback right now.';
      setFeedbackMessage(message);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="customer-portal-page">
      <div className="customer-portal-header glass-card">
        <div>
          <p className="section-label">{meta.eyebrow}</p>
          <h2>{meta.title}</h2>
          <p className="customer-portal-subtitle">Welcome back, {user?.username || 'Customer'} — your AI workspace is ready.</p>
        </div>
        <div className="customer-portal-badge">Customer Plan · Pro</div>
      </div>

      {section === 'dashboard' && (
        <div className="customer-grid">
          <section className="glass-card customer-hero-card">
            <div>
              <p className="section-label">Your AI workspace</p>
              <h3>Get fast sentiment, emotion, and recommendation insights from every customer voice.</h3>
            </div>
            <div className="customer-actions">
              {quickActions.map((action) => (
                <Link key={action.to} className="button-link" to={action.to}>{action.label}</Link>
              ))}
            </div>
          </section>

          <div className="customer-stats-grid">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="glass-card customer-stat-card">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
            ))}
          </div>

          <div className="customer-panels">
            <div className="glass-card customer-panel-card">
              <h4>Recent predictions</h4>
              {loading ? (
                <p className="customer-portal-subtitle">Loading your latest predictions…</p>
              ) : (
                <ul>
                  {recentPredictions.length === 0 ? (
                    <li><strong>No data yet</strong><span>Submit feedback to populate this panel.</span></li>
                  ) : recentPredictions.map((item) => (
                    <li key={item.id}>
                      <strong>{item.id}</strong>
                      <span>{item.summary}</span>
                      <em>{item.score}</em>
                    </li>
                  ))}
                </ul>
              )}
              {error && <p className="customer-portal-subtitle">{error}</p>}
            </div>
            <div className="glass-card customer-panel-card">
              <h4>Notifications</h4>
              <ul>
                <li><strong>Report ready</strong><span>Your weekly summary is available to download.</span></li>
                <li><strong>Plan update</strong><span>Your subscription renews in 8 days.</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {section === 'ai-studio' && (
        <div className="customer-grid single-grid">
          <div className="glass-card customer-panel-card">
            <h4>AI Studio</h4>
            <label>
              <span>Enter feedback text</span>
              <textarea defaultValue="The product is excellent but delivery was delayed twice." />
            </label>
            <div className="customer-actions">
              <button type="button" className="button-link">Analyze Feedback</button>
              <button type="button" className="ghost-btn">Export Result</button>
            </div>
          </div>
          <div className="glass-card customer-panel-card">
            <h4>Analysis summary</h4>
            <ul>
              <li><strong>Sentiment:</strong> Positive</li>
              <li><strong>Emotion:</strong> Satisfaction</li>
              <li><strong>Keywords:</strong> Product, delivery, experience</li>
              <li><strong>Recommendation:</strong> Improve delivery reliability</li>
            </ul>
          </div>
        </div>
      )}

      {section === 'submit-feedback' && (
        <form onSubmit={handleFeedbackSubmit} className="glass-card customer-panel-card">
          <h4>Submit Feedback</h4>
          <label>
            <span>Feedback title</span>
            <input type="text" value={feedbackForm.title} onChange={(e) => setFeedbackForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Share your experience" />
          </label>
          <label>
            <span>Category</span>
            <input type="text" value={feedbackForm.category} onChange={(e) => setFeedbackForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Product, support, billing" />
          </label>
          <label>
            <span>Details</span>
            <textarea value={feedbackForm.details} onChange={(e) => setFeedbackForm((prev) => ({ ...prev, details: e.target.value }))} placeholder="Describe the issue or praise you want to send for analysis." />
          </label>
          <div className="customer-actions">
            <button type="submit" className="button-link" disabled={feedbackSubmitting}>{feedbackSubmitting ? 'Submitting…' : 'Save Feedback'}</button>
            <button type="button" className="ghost-btn">Attach File</button>
          </div>
          {feedbackMessage && <p className="customer-portal-subtitle">{feedbackMessage}</p>}
        </form>
      )}

      {section === 'analytics' && (
        <div className="customer-grid single-grid">
          <div className="glass-card customer-panel-card">
            <h4>Sentiment distribution</h4>
            <div className="chart-placeholder">Bar chart preview</div>
          </div>
          <div className="glass-card customer-panel-card">
            <h4>Monthly trend</h4>
            <div className="chart-placeholder">Line chart preview</div>
          </div>
        </div>
      )}

      {section === 'prediction-history' && (
        <div className="glass-card customer-panel-card">
          <h4>Prediction History</h4>
          <div className="customer-table">
            <div className="customer-table-head">
              <span>ID</span><span>Date</span><span>Score</span><span>Status</span>
            </div>
            {recentPredictions.map((item) => (
              <div key={item.id} className="customer-table-row">
                <span>{item.id}</span><span>Today</span><span>{item.score}</span><span>Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'reports' && (
        <div className="glass-card customer-panel-card">
          <h4>Reports</h4>
          <div className="customer-actions">
            <button type="button" className="button-link">Download PDF</button>
            <button type="button" className="ghost-btn">Export CSV</button>
          </div>
          <p className="customer-portal-subtitle">Generate summaries, weekly progress reports, and AI insight exports.</p>
        </div>
      )}

      {section === 'subscription' && (
        <div className="glass-card customer-panel-card">
          <h4>My Subscription</h4>
          <p>Pro plan · 1,240 predictions remaining · Renews on 15 August 2026</p>
          <div className="customer-actions">
            <button type="button" className="button-link">Upgrade Plan</button>
            <button type="button" className="ghost-btn">Billing History</button>
          </div>
        </div>
      )}

      {section === 'notifications' && (
        <div className="glass-card customer-panel-card">
          <h4>Notifications</h4>
          <ul>
            <li><strong>AI completed</strong><span>Prediction A-104 finished successfully.</span></li>
            <li><strong>Report ready</strong><span>Your weekly report is available.</span></li>
            <li><strong>Plan expiry</strong><span>Your plan renews in 8 days.</span></li>
          </ul>
        </div>
      )}

      {section === 'profile' && (
        <div className="glass-card customer-panel-card">
          <h4>Profile</h4>
          <p>Name: {user?.username || 'Customer User'}</p>
          <p>Organization: IntelSense Demo</p>
          <p>Email: customer@intelsense.ai</p>
          <div className="customer-actions">
            <button type="button" className="button-link">Edit Profile</button>
            <button type="button" className="ghost-btn">Change Password</button>
          </div>
        </div>
      )}

      {section === 'settings' && (
        <div className="glass-card customer-panel-card">
          <h4>Settings</h4>
          <ul>
            <li>Theme: Dark</li>
            <li>Language: English</li>
            <li>Notifications: Enabled</li>
            <li>Privacy: Private</li>
          </ul>
        </div>
      )}

      {section === 'help-support' && (
        <div className="customer-grid single-grid">
          {supportItems.map((item) => (
            <div key={item.title} className="glass-card customer-panel-card">
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      )}

      {section === 'assistant' && (
        <div className="glass-card customer-panel-card">
          <h4>AI Assistant</h4>
          <p>Ask about predictions, reports, or your dashboard and get guided support in real time.</p>
          <div className="customer-actions">
            <button type="button" className="button-link" onClick={() => navigate('/assistant')}>Start Chat</button>
          </div>
        </div>
      )}
    </div>
  );
}
