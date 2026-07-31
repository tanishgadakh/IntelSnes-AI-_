import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const trustedCompanies = ['Microsoft', 'Google', 'Amazon', 'IBM', 'Oracle', 'Infosys', 'TCS'];

const whyCards = [
  'AI Powered',
  'Enterprise Security',
  'Role Based Access',
  'Real Time Analytics',
  'Cloud Ready',
  'Fast Predictions'
];

const featureCards = [
  { icon: '🤖', title: 'AI Sentiment Analysis', description: 'Track brand sentiment and early warning signals across every customer channel.' },
  { icon: '😊', title: 'Emotion Detection', description: 'Understand exact emotional drivers behind customer comments and support tickets.' },
  { icon: '📊', title: 'Live Analytics', description: 'Turn real-time feedback into operational action for leaders and teams.' },
  { icon: '📄', title: 'Smart Reports', description: 'Generate executive-ready reports for reviews, trends, and decision-making.' },
  { icon: '💬', title: 'AI Assistant', description: 'Guide teams with contextual recommendations and conversational insight generation.' },
  { icon: '🔒', title: 'Enterprise Security', description: 'Protect dashboards, workflows, and data with enterprise-grade controls and permissions.' }
];

const technologyCards = ['React', 'Spring Boot', 'FastAPI', 'Python', 'RoBERTa', 'JWT', 'MySQL'];
const technologyFlow = ['Customer Feedback', 'Preprocessing', 'RoBERTa', 'Emotion Detection', 'Business Recommendation', 'Dashboard'];

const dashboardCards = [
  { title: 'Admin', tone: 'admin', summary: 'Manage users, approve analysts, and monitor AI operations at scale.' },
  { title: 'Analyst', tone: 'analyst', summary: 'Analyze reviews, generate reports, and collaborate with AI assistance.' },
  { title: 'Customer', tone: 'customer', summary: 'Submit feedback, track history, and monitor AI insights for better outcomes.' }
];

const workflowSteps = [
  'Customer',
  'Feedback Submitted',
  'Spring Boot Backend',
  'FastAPI AI Service',
  'RoBERTa Model',
  'Database',
  'Dashboard',
  'Business Decision'
];

const industrySolutions = [
  { title: 'Retail', description: 'Understand churn drivers, basket sentiment, and customer experience across stores.' },
  { title: 'Healthcare', description: 'Track patient sentiment and care experience signals across service calls and surveys.' },
  { title: 'Education', description: 'Improve learner satisfaction, course quality, and support sentiment across institutions.' },
  { title: 'Finance', description: 'Detect trust issues, sentiment changes, and service friction in customer journeys.' },
  { title: 'Hospitality', description: 'Monitor guest feedback, service quality, and operational sentiment in real time.' },
  { title: 'Government', description: 'Improve public services with sentiment and service intelligence at scale.' },
  { title: 'Manufacturing', description: 'Tune field service quality, support experiences, and operational reliability.' },
  { title: 'E-Commerce', description: 'Uncover product complaints, conversion friction, and purchase sentiment insights.' }
];

const securityPoints = ['JWT Authentication', 'BCrypt Encryption', 'HTTPS', 'Role Based Access', 'Audit Logs', 'Secure APIs', 'Data Privacy'];

const defaultStats = {
  predictions: 2500000,
  accuracy: 99.2,
  organizations: 250,
  users: 50000
};

const defaultTestimonials = [
  { quote: 'Reduced manual work by 80% and gave our leadership team instant clarity.', author: 'Alex Morgan', company: 'Northstar Retail', rating: 5 },
  { quote: 'Improved customer satisfaction across every region in under a month.', author: 'Priya Shah', company: 'BluePeak Health', rating: 5 },
  { quote: 'AI accuracy is excellent and the dashboard feels built for enterprise operations.', author: 'Marcus Lee', company: 'Crestline Finance', rating: 5 }
];

const pricingPlans = [
  { name: 'Starter', price: 'Free', description: 'For students and pilots', features: ['Basic Dashboard', '1 Team Workspace', 'Core AI Insights'] },
  { name: 'Professional', price: '₹999/month', description: 'For growing businesses', features: ['Analytics', 'Reports', 'AI Recommendations', 'Priority Support'], featured: true },
  { name: 'Enterprise', price: 'Custom Pricing', description: 'For large scale operations', features: ['Unlimited Users', 'Dedicated Support', 'Cloud Deployment', 'Custom Integrations'] }
];

const faqs = [
  { q: 'What is IntelSense AI?', a: 'IntelSense AI is an enterprise customer intelligence platform that combines sentiment analysis, emotion detection, recommendation logic, and dashboard reporting for business teams.' },
  { q: 'How does AI work?', a: 'Customer feedback is processed in the backend, then analyzed by the intelligent pipeline using transformer-based models and recommendation logic before results appear in dashboards.' },
  { q: 'How secure is the platform?', a: 'The platform uses JWT-based authentication, encrypted passwords, HTTPS deployment patterns, RBAC, and audit logging to support enterprise security requirements.' },
  { q: 'Can I upload Excel files?', a: 'The platform is designed for managed feedback and operational datasets, with file upload support available in the authenticated product experience as needed.' },
  { q: 'What roles are supported?', a: 'The system supports Admin, Analyst, Customer, and Manager-style operational roles with role-specific access and dashboard experiences.' }
];

function formatNumber(value) {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat('en-US').format(value);
}

export default function LandingPage() {
  const [stats, setStats] = useState(defaultStats);
  const [displayStats, setDisplayStats] = useState({ predictions: 0, accuracy: 0, organizations: 0, users: 0 });
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [statsResponse, testimonialsResponse] = await Promise.all([
          api.get('/api/public/platform-stats'),
          api.get('/api/public/testimonials')
        ]);

        if (statsResponse?.data) setStats(statsResponse.data);
        if (testimonialsResponse?.data?.length) setTestimonials(testimonialsResponse.data);
      } catch (error) {
        console.error('Landing data unavailable, using default content.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  useEffect(() => {
    const start = performance.now();
    let rafId;

    const tick = (time) => {
      const progress = Math.min((time - start) / 1200, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayStats({
        predictions: Math.round(stats.predictions * ease),
        accuracy: Number((stats.accuracy * ease).toFixed(1)),
        organizations: Math.round(stats.organizations * ease),
        users: Math.round(stats.users * ease)
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [stats]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4200);

    return () => clearInterval(id);
  }, [testimonials.length]);

  const statList = useMemo(() => [
    { label: 'Predictions', value: formatNumber(displayStats.predictions), suffix: ' Predictions' },
    { label: 'Accuracy', value: `${displayStats.accuracy.toFixed(1)}%`, suffix: ' Accuracy' },
    { label: 'Organizations', value: formatNumber(displayStats.organizations), suffix: ' Organizations' },
    { label: 'Users', value: formatNumber(displayStats.users), suffix: ' Users' }
  ], [displayStats]);

  return (
    <div className="landing-shell premium-landing">
      <header className="landing-header landing-nav">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Enterprise AI intelligence</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/ai-technology">AI Technology</Link>
          <Link to="/dashboard-preview">Dashboard</Link>
          <Link to="/enterprise">Enterprise</Link>
          <Link to="/documentation">Docs</Link>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <span className="eyebrow-pill">AI Powered Enterprise Platform</span>
            <h2>
              <span>Transform Customer Feedback</span>
              <span className="gradient-text">Into Business Intelligence</span>
            </h2>
            <p className="hero-subtitle">
              Understand every customer voice using Artificial Intelligence, Sentiment Analysis, Emotion Detection, and Predictive Insights.
            </p>

            <div className="hero-buttons">
              <Link className="button-link" to="/register">Get Started</Link>
              <a className="ghost-btn" href="#dashboard">Watch Demo</a>
            </div>

            <div className="hero-showcase glass-card">
              <div className="demo-label">AI Preview</div>
              <div className="demo-row">
                <span className="demo-badge positive">😊 Positive</span>
                <strong>72%</strong>
              </div>
              <div className="demo-row">
                <span className="demo-badge neutral">😐 Neutral</span>
                <strong>18%</strong>
              </div>
              <div className="demo-row">
                <span className="demo-badge negative">😠 Negative</span>
                <strong>10%</strong>
              </div>
              <div className="demo-divider" />
              <div className="demo-result">
                <span>Prediction</span>
                <strong>Positive</strong>
                <small>Confidence 99.2%</small>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="AI dashboard preview">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="dashboard-panel hero-dashboard-panel">
              <div className="preview-header">
                <div>
                  <span className="dashboard-badge">Live insights</span>
                  <h3>AI command center</h3>
                </div>
                <span className="status-pill">Active</span>
              </div>

              <div className="preview-grid">
                <div className="preview-card preview-sentiment">
                  <span>Customer Sentiment</span>
                  <div className="mini-donut">
                    <div className="donut-ring" />
                  </div>
                  <strong>+18.4%</strong>
                </div>

                <div className="preview-card preview-trend">
                  <span>Trend Signals</span>
                  <div className="mini-bars">
                    <i style={{ height: '38%' }} />
                    <i style={{ height: '60%' }} />
                    <i style={{ height: '55%' }} />
                    <i style={{ height: '80%' }} />
                    <i style={{ height: '92%' }} />
                  </div>
                </div>

                <div className="preview-card preview-score">
                  <span>AI Confidence</span>
                  <strong>99.2%</strong>
                </div>

                <div className="preview-card preview-feed">
                  <span>Actionable Signals</span>
                  <ul>
                    <li>Delivery issue trending upward</li>
                    <li>Support sentiment improving</li>
                    <li>Retention strategy recommended</li>
                  </ul>
                </div>

                <div className="preview-card preview-action">
                  <span>Recommendation</span>
                  <p>Reduce churn by improving onboarding support across your highest-volume regions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trusted-section" aria-label="Trusted companies">
          <h3>Trusted by Modern Organizations</h3>
          <div className="trusted-grid">
            {trustedCompanies.map((company) => (
              <div key={company} className="trusted-logo">{company}</div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="section-heading">
            <p className="section-label">Live Platform Statistics</p>
            <h3>Operational scale across modern enterprises</h3>
          </div>
          <div className="metric-grid">
            {statList.map((item) => (
              <div key={item.label} className="metric-card glass-card">
                <span className="metric-label">{item.label}</span>
                <strong className="metric-value">{item.value}</strong>
                <small>{item.suffix}</small>
              </div>
            ))}
          </div>
          {loading && <p className="subtle-note">Loading platform metrics…</p>}
        </section>

        <section className="why-section">
          <div className="section-heading">
            <p className="section-label">Why IntelSense AI?</p>
            <h3>Built for business teams that need clarity, speed, and confidence</h3>
          </div>
          <div className="why-grid">
            {whyCards.map((card, index) => (
              <div key={card} className="why-card glass-card">
                <div className="why-index">0{index + 1}</div>
                <h4>{card}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="section-label">Core Features Preview</p>
            <h3>Premium intelligence for customer experience teams</h3>
          </div>
          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="feature-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                <Link to="/features" className="feature-link">Learn More →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="technology-section" id="technology">
          <div className="section-heading">
            <p className="section-label">AI Technology Preview</p>
            <h3>Modern AI stack for enterprise intelligence</h3>
          </div>
          <div className="technology-layout">
            <div className="technology-timeline">
              {technologyFlow.map((step, index) => (
                <div key={step} className="timeline-step">
                  <span className="timeline-node">{index + 1}</span>
                  <span>{step}</span>
                  {index < technologyFlow.length - 1 && <span className="timeline-arrow">↓</span>}
                </div>
              ))}
            </div>
            <div className="technology-grid">
              {technologyCards.map((tech) => (
                <div key={tech} className="technology-card glass-card">
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-preview-section" id="dashboard">
          <div className="section-heading">
            <p className="section-label">Dashboard Preview</p>
            <h3>Built for every stakeholder</h3>
          </div>
          <div className="dashboard-cards">
            {dashboardCards.map((card) => (
              <div key={card.title} className="dashboard-card glass-card">
                <div className={`dashboard-visual dashboard-visual--${card.tone}`} />
                <h4>{card.title}</h4>
                <p>{card.summary}</p>
                <div className="dashboard-card-actions">
                  <Link to="/dashboard-preview" className="small-button">Preview →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="workflow-section">
          <div className="section-heading">
            <p className="section-label">How IntelSense AI Works</p>
            <h3>From customer voice to business decision</h3>
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

        <section className="solutions-section" id="solutions">
          <div className="section-heading">
            <p className="section-label">Industry Solutions</p>
            <h3>Purpose-built intelligence for every domain</h3>
          </div>
          <div className="solutions-grid">
            {industrySolutions.map((item) => (
              <article key={item.title} className="solution-card glass-card">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <Link to="/solutions" className="feature-link">How IntelSense AI helps {item.title} →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="security-section">
          <div className="section-heading">
            <p className="section-label">Security & Privacy</p>
            <h3>Enterprise security without compromise</h3>
          </div>
          <div className="security-layout">
            <div className="security-list glass-card">
              {securityPoints.map((point) => (
                <div key={point} className="security-item">
                  <span className="security-check">✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className="security-visual glass-card">
              <div className="security-illustration">
                <div className="shield-core">🔒</div>
                <div className="shield-ring ring-one" />
                <div className="shield-ring ring-two" />
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="section-heading">
            <p className="section-label">Customer Success Stories</p>
            <h3>Trusted by teams that need faster decisions</h3>
          </div>
          <div className="testimonial-stage glass-card">
            <div className="stars">★★★★★</div>
            <p>“{testimonials[activeTestimonial].quote}”</p>
            <div className="testimonial-footer">
              <div className="testimonial-avatar">{testimonials[activeTestimonial].author.charAt(0)}</div>
              <div>
                <strong>{testimonials[activeTestimonial].author}</strong>
                <span>{testimonials[activeTestimonial].company}</span>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((item, index) => (
                <button
                  key={`${item.author}-${index}`}
                  type="button"
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  aria-label={`View testimonial ${index + 1}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <div className="section-heading">
            <p className="section-label">Pricing</p>
            <h3>Flexible plans for every stage of growth</h3>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`pricing-card glass-card ${plan.featured ? 'featured' : ''}`}>
                <span className="pricing-badge">{plan.name}</span>
                <h4>{plan.price}</h4>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link to="/pricing" className="button-link pricing-button">Choose Plan</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">
            <p className="section-label">Frequently Asked Questions</p>
            <h3>Everything you need to know before you start</h3>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <div key={item.q} className={`faq-item glass-card ${openFaq === index ? 'open' : ''}`}>
                <button type="button" className="faq-question" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{item.q}</span>
                  <span>{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && <p>{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready to transform</p>
              <h3>Customer intelligence for your next growth stage</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/register">Register</Link>
              <Link className="ghost-btn" to="/login">Login</Link>
              <Link className="ghost-btn" to="/contact">Book Demo</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="documentation">
        <div className="footer-grid">
          <div>
            <h4>IntelSense AI</h4>
            <Link to="/about">About</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/features">Features</Link>
            <Link to="/ai-technology">AI Technology</Link>
            <Link to="/dashboard-preview">Dashboard</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link to="/documentation">Documentation</Link>
            <Link to="/documentation">API</Link>
            <a href="https://github.com/tanishgadakhpatil-art/IntelSense" target="_blank" rel="noreferrer">GitHub</a>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/about">Privacy</Link>
            <Link to="/about">Terms</Link>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI</p>
      </footer>
    </div>
  );
}
