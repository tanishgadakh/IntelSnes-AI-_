import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const roleCards = {
  admin: {
    name: 'Admin',
    subtitle: 'Platform Management',
    badges: ['Users', 'AI Monitoring', 'Security', 'Reports'],
    stats: {
      totalUsers: '1,250',
      pendingAnalystRequests: '18',
      aiPredictionsToday: '12,458',
      platformHealth: '99.9%'
    },
    summary: 'Monitor platform health, approve analysts, and keep every business process running at scale.'
  },
  analyst: {
    name: 'Analyst',
    subtitle: 'AI Workspace',
    badges: ['Analytics', 'Reports', 'AI Assistant', 'Bulk Analysis'],
    stats: {
      sentimentPositive: '72%',
      sentimentNeutral: '18%',
      sentimentNegative: '10%',
      recentAction: 'Analyze Text'
    },
    summary: 'Access reviews, build reports, trigger AI workflows, and turn feedback into decisions.'
  },
  customer: {
    name: 'Customer',
    subtitle: 'Feedback Portal',
    badges: ['Submit Feedback', 'View Results', 'History', 'Reports'],
    stats: {
      totalFeedback: '15',
      summaryLabel: 'Positive',
      sentimentScore: '80%',
      latestResult: 'Positive',
      confidence: '98%'
    },
    summary: 'See your score, review customer-facing results, and understand how feedback is being measured.'
  }
};

const featureCards = [
  { icon: '📈', title: 'Interactive Charts', description: 'Track sentiment trends, growth, and metrics with live-like visual widgets.' },
  { icon: '📄', title: 'Export Reports', description: 'Generate crisp summaries and downloadable reports for leadership and teams.' },
  { icon: '🤖', title: 'AI Assistant', description: 'Surface insight summaries and suggested actions directly inside the workflow.' },
  { icon: '🔔', title: 'Notifications', description: 'Stay informed with AI alerts, updates, and operational system signals.' },
  { icon: '📊', title: 'Real-Time Analytics', description: 'Monitor sentiment and platform activity in a fast-moving executive dashboard.' },
  { icon: '📱', title: 'Mobile Responsive', description: 'Every screen remains polished and easy to use on desktop, tablet, and mobile.' }
];

const workflowSteps = ['Login', 'Dashboard', 'Role Detection', 'Load Widgets', 'Fetch Data', 'Display Analytics', 'AI Processing', 'Generate Reports'];

const widgetCards = [
  { title: 'Positive Reviews', value: '72%', trend: '▲ 5%' },
  { title: 'Role Distribution', value: 'Admin / Analyst / Customer', trend: 'Live' },
  { title: 'Weekly Sentiment Trend', value: 'Upward momentum', trend: '▲ 8%' },
  { title: 'New AI Insight Available', value: 'Click to view', trend: 'Now' }
];

const defaultPreview = {
  roleStats: {
    admin: { totalUsers: '1,250', pendingAnalystRequests: '18', aiPredictionsToday: '12,458', platformHealth: '99.9%' },
    analyst: { sentimentPositive: '72%', sentimentNeutral: '18%', sentimentNegative: '10%', recentAction: 'Analyze Text' },
    customer: { totalFeedback: '15', summaryLabel: 'Positive', sentimentScore: '80%', latestResult: 'Positive', confidence: '98%' }
  },
  platformHealth: { score: '99.9%', latency: '183ms', uptime: '24/7', activeWorkflows: '48 active' },
  recentActivities: ['New Analyst Registered', 'Model Updated', 'Database Backup Completed', 'Role Access Updated']
};

const defaultInsights = [
  {
    title: 'AI Insight',
    description: 'Delivery satisfaction dropped by 8% during the last week.',
    recommendation: 'Improve logistics.',
    impact: '-8%'
  },
  {
    title: 'AI Insight',
    description: 'Customer support received 92% positive feedback.',
    recommendation: 'Maintain current service quality.',
    impact: '+92%'
  }
];

const comparisonRows = [
  ['Dashboard', '✅', '✅', '✅'],
  ['Manage Users', '✅', '❌', '❌'],
  ['AI Analysis', '❌', '✅', 'Basic'],
  ['Reports', 'Platform', 'Business', 'Personal'],
  ['AI Assistant', '❌', '✅', '❌'],
  ['Feedback Submission', '❌', '❌', '✅'],
  ['Settings', 'Full', 'Limited', 'Profile Only']
];

function DashboardPreviewPage() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [previewData, setPreviewData] = useState(defaultPreview);
  const [insights, setInsights] = useState(defaultInsights);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourMode, setTourMode] = useState(false);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const [previewResponse, insightsResponse] = await Promise.all([
          api.get('/api/public/dashboard-preview'),
          api.get('/api/public/demo-insights')
        ]);

        if (previewResponse?.data) setPreviewData(previewResponse.data);
        if (insightsResponse?.data?.length) setInsights(insightsResponse.data);
      } catch (error) {
        console.error('Dashboard preview data unavailable, using default content.', error);
      }
    };

    fetchPreviewData();
  }, []);

  useEffect(() => {
    if (!tourMode) return undefined;

    const timer = setInterval(() => {
      setTourIndex((current) => (current + 1) % 4);
    }, 2400);

    return () => clearInterval(timer);
  }, [tourMode]);

  const activeStats = useMemo(() => {
    const currentRoleStats = previewData.roleStats?.[selectedRole] || roleCards[selectedRole].stats;
    return Object.entries(currentRoleStats);
  }, [previewData.roleStats, selectedRole]);

  return (
    <div className="dashboard-preview-page">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Dashboard Preview</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/ai-technology">AI Technology</Link>
          <Link to="/login">Login</Link>
        </nav>

        <div className="landing-actions">
          <button type="button" className="ghost-btn" onClick={() => setTourMode((current) => !current)}>
            {tourMode ? 'Stop Tour' : 'Guided Tour'}
          </button>
          <Link className="button-link" to="/register">Register</Link>
        </div>
      </header>

      <main>
        <section className="dashboard-preview-hero">
          <div className="dashboard-preview-copy">
            <span className="eyebrow-pill">Explore IntelSense AI</span>
            <h2>Enterprise dashboards built for every stakeholder.</h2>
            <p>
              Discover how Admins, Analysts, and Customers experience the platform with live-like demo data,
              analytics widgets, and AI insight previews designed for secure public exploration.
            </p>
            <div className="hero-buttons">
              <button type="button" className="button-link" onClick={() => setTourMode(true)}>Try Interactive Demo</button>
              <Link className="ghost-btn" to="/features">View Features</Link>
            </div>
          </div>

          <div className="dashboard-preview-visual" aria-label="Dashboard preview mockup">
            <div className="dashboard-window glass-card">
              <div className="window-header">
                <span className="window-dot red" />
                <span className="window-dot yellow" />
                <span className="window-dot green" />
                <span className="window-title">IntelSense AI</span>
              </div>

              <div className="window-body">
                <aside className="window-sidebar">
                  <span>Overview</span>
                  <span>Reports</span>
                  <span>Insights</span>
                  <span>Alerts</span>
                </aside>

                <div className="window-main">
                  <div className="kpi-row">
                    <div className="mini-kpi">
                      <label>Total Users</label>
                      <strong>1,250</strong>
                    </div>
                    <div className="mini-kpi">
                      <label>AI Predictions</label>
                      <strong>12,458</strong>
                    </div>
                    <div className="mini-kpi">
                      <label>Platform Health</label>
                      <strong>99.9%</strong>
                    </div>
                  </div>

                  <div className="chart-row">
                    <div className="mini-chart chart-one" />
                    <div className="mini-chart chart-two" />
                  </div>

                  <div className="activity-panel">
                    <strong>Recent Activities</strong>
                    <ul>
                      {previewData.recentActivities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-notification notification-top">New AI insight available</div>
            <div className="floating-notification notification-bottom">Review alert resolved</div>
          </div>
        </section>

        <section className="dashboard-role-section">
          <div className="section-heading">
            <p className="section-label">Role Selection</p>
            <h3>Switch between business roles to explore the product</h3>
          </div>

          <div className="role-card-grid">
            {Object.entries(roleCards).map(([key, card]) => (
              <button
                key={key}
                type="button"
                className={`role-card glass-card ${selectedRole === key ? 'active' : ''}`}
                onClick={() => setSelectedRole(key)}
              >
                <span className="role-headline">{card.name}</span>
                <h4>{card.subtitle}</h4>
                <div className="role-badges">
                  {card.badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
                <strong>Preview</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-demo-section">
          <div className="section-heading">
            <p className="section-label">Interactive Dashboard Preview</p>
            <h3>{roleCards[selectedRole].name} experience</h3>
          </div>

          <div className="dashboard-demo-layout">
            <div className="dashboard-demo-sidebar glass-card">
              <h4>Quick Actions</h4>
              <ul>
                {roleCards[selectedRole].badges.map((badge) => (
                  <li key={badge}>{badge}</li>
                ))}
              </ul>
            </div>

            <div className="dashboard-demo-panel glass-card">
              <div className="demo-header-row">
                <div>
                  <span className="section-label">IntelSense AI</span>
                  <h4>{selectedRole === 'admin' ? 'Dashboard' : selectedRole === 'analyst' ? 'Welcome Analyst' : 'Welcome Customer'}</h4>
                </div>
                <span className="status-pill">Live Demo</span>
              </div>

              <div className="demo-metric-grid">
                {activeStats.map(([key, value], index) => (
                  <div key={`${key}-${index}`} className={`demo-stat ${tourMode && tourIndex === index % 4 ? 'highlighted' : ''}`}>
                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="demo-chart-grid">
                <div className="demo-chart mini-lines">
                  <span style={{ height: '38%' }} />
                  <span style={{ height: '55%' }} />
                  <span style={{ height: '60%' }} />
                  <span style={{ height: '74%' }} />
                  <span style={{ height: '84%' }} />
                  <span style={{ height: '96%' }} />
                </div>
                <div className="demo-chart donut-wrap">
                  <div className="donut-ring" />
                  <span>Positive</span>
                </div>
                <div className="demo-chart donut-wrap second">
                  <div className="donut-ring alt" />
                  <span>Neutral</span>
                </div>
              </div>

              <div className="demo-feed">
                <strong>Recent Feedback</strong>
                <ul>
                  {selectedRole === 'customer' ? (
                    <>
                      <li>★★★★★ Great Service</li>
                      <li>★★★ Delivery Delayed</li>
                    </>
                  ) : selectedRole === 'analyst' ? (
                    <>
                      <li>Product quality is excellent.</li>
                      <li>Delivery is slow.</li>
                      <li>Support team is amazing.</li>
                    </>
                  ) : (
                    <>
                      <li>New Analyst Registered</li>
                      <li>Model Updated</li>
                      <li>Database Backup Completed</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-features-section">
          <div className="section-heading">
            <p className="section-label">Dashboard Features</p>
            <h3>Built to help every team move faster</h3>
          </div>

          <div className="feature-grid dashboard-feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="feature-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section">
          <div className="section-heading">
            <p className="section-label">Dashboard Workflow</p>
            <h3>From login to insight in one smooth flow</h3>
          </div>

          <div className="workflow-flow">
            {workflowSteps.map((step, index) => (
              <div key={`${step}-${index}`} className="workflow-step glass-card">
                <span>{step}</span>
                {index < workflowSteps.length - 1 && <span className="workflow-arrow">↓</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="widget-showcase-section">
          <div className="section-heading">
            <p className="section-label">Live Widget Showcase</p>
            <h3>Enterprise widgets that feel real and operational</h3>
          </div>

          <div className="widget-grid">
            {widgetCards.map((widget) => (
              <div key={widget.title} className="widget-card glass-card">
                <span>{widget.title}</span>
                <strong>{widget.value}</strong>
                <small>{widget.trend}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="insights-section">
          <div className="section-heading">
            <p className="section-label">AI Insights Preview</p>
            <h3>Mock insights generated from enterprise-style demo data</h3>
          </div>

          <div className="insight-grid">
            {insights.map((item) => (
              <article key={`${item.title}-${item.description}`} className="insight-card glass-card">
                <span className="insight-label">{item.title}</span>
                <p>{item.description}</p>
                <div className="insight-divider" />
                <strong>Recommended Action</strong>
                <p>{item.recommendation}</p>
                <small>Impact: {item.impact}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="mobile-preview-section">
          <div className="section-heading">
            <p className="section-label">Mobile Dashboard Preview</p>
            <h3>Responsive experiences across all role screens</h3>
          </div>

          <div className="mobile-grid">
            <div className="phone-mockup glass-card">
              <div className="phone-header">Admin Mobile</div>
              <div className="phone-body">
                <span>Dashboard</span>
              </div>
            </div>
            <div className="phone-mockup glass-card">
              <div className="phone-header">Analyst Mobile</div>
              <div className="phone-body">
                <span>AI Workspace</span>
              </div>
            </div>
            <div className="phone-mockup glass-card">
              <div className="phone-header">Customer Mobile</div>
              <div className="phone-body">
                <span>Feedback Portal</span>
              </div>
            </div>
          </div>
        </section>

        <section className="comparison-section">
          <div className="section-heading">
            <p className="section-label">Dashboard Comparison</p>
            <h3>Role visibility designed for business clarity</h3>
          </div>

          <div className="comparison-table glass-card">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Admin</th>
                  <th>Analyst</th>
                  <th>Customer</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready to experience</p>
              <h3>IntelSense AI across every role and workflow</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/register">Register</Link>
              <Link className="ghost-btn" to="/login">Login</Link>
              <a className="ghost-btn" href="#top">Book Enterprise Demo</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>IntelSense AI</h4>
            <a href="/features">Features</a>
            <a href="/ai-technology">AI Technology</a>
            <a href="/dashboard-preview">Dashboard Preview</a>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
            <Link to="/documentation">Documentation</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link to="/documentation">API</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/enterprise">Security</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/about">Privacy</Link>
            <Link to="/about">Terms</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI</p>
      </footer>
    </div>
  );
}

export default DashboardPreviewPage;
