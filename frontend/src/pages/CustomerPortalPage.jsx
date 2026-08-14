import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(section || 'dashboard');
  const currentSection = activeSection || section || 'dashboard';
  const meta = sectionMeta[currentSection] || sectionMeta.dashboard;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({ title: '', category: '', details: '' });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [studioText, setStudioText] = useState('The product is excellent but delivery was delayed twice.');
  const [studioResult, setStudioResult] = useState(null);
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioError, setStudioError] = useState('');

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'ai-studio', label: 'AI Studio', icon: '🎯' },
    { id: 'submit-feedback', label: 'Submit Feedback', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'prediction-history', label: 'History', icon: '⏱️' },
    { id: 'reports', label: 'Reports', icon: '📑' },
    { id: 'subscription', label: 'Subscription', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleUpgradePlan = () => navigate('/help-support');
  const handleBillingHistory = () => navigate('/billing');
  const handleExploreReports = () => alert('Report download initiated...');
  const handleEditProfile = () => alert('Edit profile dialog would open');
  const handleChangePassword = () => alert('Change password dialog would open');
  const handleAnalyzeFeedback = () => navigate('/prediction');
  const handleAttachFile = () => alert('File attachment dialog would open');
  const handleDownloadPDF = () => alert('Downloading PDF report...');
  const handleExportCSV = () => alert('Exporting to CSV...');
  const handleEnableMFA = () => alert('MFA setup dialog would open');

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

  const handleStudioAnalysis = async () => {
    if (!studioText.trim()) {
      setStudioError('Please enter some customer feedback before running the analysis.');
      return;
    }

    setStudioLoading(true);
    setStudioError('');
    setStudioResult(null);

    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const resp = await api.post('/api/feedback', { text: studioText, source: 'customer-portal' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = resp.data?.result || resp.data || {};
      setStudioResult(payload);
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.detail || 'Unable to analyze this feedback right now.';
      setStudioError(message);
    } finally {
      setStudioLoading(false);
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

      {statusMessage && <div className="user-action-banner">{statusMessage}</div>}

      <div className="customer-nav-tabs">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            className={`customer-nav-tab ${currentSection === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSection(tab.id)}
            title={tab.label}
          >
            <span className="customer-nav-icon">{tab.icon}</span>
            <span className="customer-nav-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {currentSection === 'dashboard' && (
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

      {currentSection === 'ai-studio' && (
        <div className="customer-grid single-grid">
          <div className="glass-card customer-panel-card">
            <h4>AI Studio</h4>
            <label>
              <span>Enter feedback text</span>
              <textarea value={studioText} onChange={(e) => setStudioText(e.target.value)} rows={8} />
            </label>
            <div className="customer-actions">
              <button type="button" className="button-link" onClick={handleStudioAnalysis} disabled={studioLoading}>
                {studioLoading ? 'Analyzing…' : 'Analyze Feedback'}
              </button>
              <button type="button" className="ghost-btn" onClick={handleExportCSV}>Export Result</button>
            </div>
            {studioError && <p className="customer-portal-subtitle error">{studioError}</p>}
          </div>
          <div className="glass-card customer-panel-card">
            <h4>Analysis summary</h4>
            {studioResult ? (
              <ul>
                <li><strong>Sentiment:</strong> {studioResult.sentiment?.label || 'n/a'} ({studioResult.sentiment?.score ?? 'n/a'})</li>
                <li><strong>Summary:</strong> {studioResult.summary || 'No summary available.'}</li>
                <li><strong>Keywords:</strong> {(studioResult.keywords || []).join(', ') || 'Not available'}</li>
                <li><strong>Recommendation:</strong> {(studioResult.recommendations || []).slice(0, 2).join(' • ') || 'No recommendation yet'}</li>
              </ul>
            ) : (
              <p className="customer-portal-subtitle">Run an analysis to populate the summary.</p>
            )}
          </div>
        </div>
      )}

      {currentSection === 'submit-feedback' && (
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
          <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelected} />
          <div className="customer-actions">
            <button type="submit" className="button-link" disabled={feedbackSubmitting}>{feedbackSubmitting ? 'Submitting…' : 'Save Feedback'}</button>
            <button type="button" className="ghost-btn" onClick={handleAttachFile}>Attach File</button>
          </div>
          {attachedFileName && <p className="customer-portal-subtitle">Attached file: {attachedFileName}</p>}
          {feedbackMessage && <p className="customer-portal-subtitle">{feedbackMessage}</p>}
        </form>
      )}

      {currentSection === 'analytics' && (
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

      {currentSection === 'prediction-history' && (
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

      {currentSection === 'reports' && (
        <div className="glass-card customer-panel-card">
          <h4>Reports</h4>
          <div className="customer-actions">
            <button type="button" className="button-link" onClick={handleDownloadPDF}>Download PDF</button>
            <button type="button" className="ghost-btn" onClick={handleExportCSV}>Export CSV</button>
          </div>
          <p className="customer-portal-subtitle">Generate summaries, weekly progress reports, and AI insight exports.</p>
        </div>
      )}

      {currentSection === 'subscription' && (
        <div className="glass-card customer-panel-card">
          <h4>My Subscription</h4>
          <p>Pro plan · 1,240 predictions remaining · Renews on 15 August 2026</p>
          <div className="customer-actions">
            <button type="button" className="button-link" onClick={handleUpgradePlan}>Upgrade Plan</button>
            <button type="button" className="ghost-btn" onClick={handleBillingHistory}>Billing History</button>
          </div>
        </div>
      )}

      {currentSection === 'notifications' && (
        <div className="glass-card customer-panel-card">
          <h4>Notifications</h4>
          <ul>
            <li><strong>AI completed</strong><span>Prediction A-104 finished successfully.</span></li>
            <li><strong>Report ready</strong><span>Your weekly report is available.</span></li>
            <li><strong>Plan expiry</strong><span>Your plan renews in 8 days.</span></li>
          </ul>
        </div>
      )}

      {currentSection === 'profile' && (
        <div className="glass-card customer-panel-card">
          <h4>Profile</h4>
          <p>Name: {user?.username || 'Customer User'}</p>
          <p>Organization: IntelSense Demo</p>
          <p>Email: customer@intelsense.ai</p>
          <div className="customer-actions">
            <button type="button" className="button-link" onClick={handleEditProfile}>Edit Profile</button>
            <button type="button" className="ghost-btn" onClick={handleChangePassword}>Change Password</button>
          </div>
        </div>
      )}

      {currentSection === 'settings' && (
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

      {currentSection === 'help-support' && (
        <div className="customer-grid single-grid">
          {supportItems.map((item) => (
            <div key={item.title} className="glass-card customer-panel-card">
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      )}

      {currentSection === 'assistant' && (
        <div className="glass-card customer-panel-card">
          <h4>AI Assistant</h4>
          <p>Ask about predictions, reports, or your dashboard and get guided support in real time.</p>
          <div className="customer-actions">
            <button type="button" className="button-link" onClick={handleAnalyzeFeedback}>Start Chat</button>
          </div>
        </div>
      )}
    </div>
  );
}
