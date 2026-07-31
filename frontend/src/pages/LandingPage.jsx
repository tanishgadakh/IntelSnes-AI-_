import { Link } from 'react-router-dom';

const trustedLogos = ['Retail', 'E-Commerce', 'Banking', 'Healthcare', 'Hospitality', 'Education'];
const problems = [
  'Thousands of Reviews',
  'Manual Analysis',
  'Delayed Decisions',
  'Hidden Customer Pain Points',
  'Poor Business Intelligence',
  'Missed Revenue Opportunities'
];
const workflow = [
  'Customer Review',
  'AI Processing',
  'Sentiment Detection',
  'Aspect Analysis',
  'Business Insights',
  'Decision Making'
];
const howSteps = [
  { title: 'Upload Feedback', detail: 'Securely import customer reviews from every channel.' },
  { title: 'AI Cleans Data', detail: 'Remove noise, normalize language, and surface key signals.' },
  { title: 'Transformer Models Analyze', detail: 'State-of-the-art AI detects sentiment, topics, and intent.' },
  { title: 'Explainable AI', detail: 'Understand why every insight was generated.' },
  { title: 'Dashboard Analytics', detail: 'Visualize trends, anomalies, and team performance.' },
  { title: 'Business Recommendations', detail: 'Deploy prioritized actions, faster.' }
];
const features = [
  { title: 'AI Sentiment Analysis', bullets: ['Positive', 'Neutral', 'Negative'] },
  { title: 'Emotion Detection', bullets: ['Happy', 'Angry', 'Frustrated', 'Excited'] },
  { title: 'Aspect-Based Analysis', bullets: ['Price', 'Delivery', 'Quality', 'Support'] },
  { title: 'AI Chat Assistant', bullets: ['Why are customers unhappy?', 'Which product has the most complaints?', 'Summarize this week’s feedback.'] },
  { title: 'Explainable AI', bullets: ['Highlighted keywords', 'Model rationale', 'Trustworthy results'] },
  { title: 'Recommendation Engine', bullets: ['Problem → AI Analysis → Action'] }
];
const models = [
  { name: 'RoBERTa Sentiment', purpose: 'Fast Prediction' },
  { name: 'DistilRoBERTa', purpose: 'Aspect Analysis' },
  { name: 'KeyBERT', purpose: 'Keywords' },
  { name: 'BERTopic', purpose: 'Topic Discovery' },
  { name: 'SHAP Explainability', purpose: 'Why it predicted that' },
  { name: 'BART Summarization', purpose: 'Summary Generation' }
];
const enterpriseFeatures = ['JWT Authentication', 'Role-Based Access Control', 'REST API', 'AI Microservices', 'Real-Time Dashboard', 'Docker Ready', 'Secure Storage', 'Audit Logs', 'Export Reports', 'Multi-User Platform', 'Explainable AI', 'Cloud Deployment'];
const roles = [
  { title: 'Admin', items: ['Manage Users', 'Analytics', 'AI Settings', 'Reports'] },
  { title: 'Analyst', items: ['Dashboard', 'Reports', 'AI Chat', 'Export'] },
  { title: 'Customer', items: ['Submit Feedback', 'View Results', 'Track History'] }
];
const faqs = [
  { question: 'How accurate is IntelSense AI?', answer: 'IntelSense uses production-grade transformer models and enterprise training pipelines to sustain 99%+ sentiment accuracy in real-world feedback.' },
  { question: 'Which AI models are used?', answer: 'We combine RoBERTa, DistilRoBERTa, KeyBERT, BERTopic, SHAP, and BART to deliver explainable predictions and business-ready output.' },
  { question: 'Is customer data secure?', answer: 'Yes. Your data is stored securely with encryption, role-based access, and audit logging across the platform.' },
  { question: 'Can I export reports?', answer: 'Absolutely — download PDF, Excel, CSV, and PowerPoint-ready summaries directly from the dashboard.' },
  { question: 'Does it support multiple users?', answer: 'The platform supports admins, analysts, and customers with full role separation and enterprise onboarding.' }
];

export default function LandingPage() {
  return (
    <div className="landing-shell premium-landing">
      <header className="landing-header landing-nav">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">⚡</div>
          <div>
            <h1>IntelSense AI</h1>
            <p>Enterprise customer intelligence</p>
          </div>
        </div>
        <nav className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#technology">AI Technology</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#enterprise">Enterprise</a>
          <a href="#docs">Documentation</a>
        </nav>
        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <span className="eyebrow-pill">Enterprise AI Platform</span>
            <p className="eyebrow-label">Powered by Transformer AI</p>
            <h2>Transform Customer Feedback into Intelligent Business Decisions</h2>
            <p className="hero-subtitle">Analyze thousands of customer reviews instantly using state-of-the-art AI models. Detect sentiment, discover hidden issues, generate business recommendations, and visualize insights through an enterprise analytics dashboard.</p>
            <div className="hero-buttons">
              <Link className="button-link" to="/register">Start Free</Link>
              <a className="ghost-btn" href="#dashboard">Watch Demo</a>
            </div>
            <div className="hero-stats">
              <div><strong>99.2%</strong> AI Accuracy</div>
              <div><strong>&lt;150ms</strong> Prediction</div>
              <div><strong>1M+</strong> Reviews Supported</div>
              <div><strong>24/7</strong> Availability</div>
            </div>
          </div>

          <div className="dashboard-preview" id="dashboard">
            <div className="dashboard-panel">
              <div className="preview-header">
                <div>
                  <span className="dashboard-badge">Live Insights</span>
                  <h3>Business recommendation feed</h3>
                </div>
                <span className="status-pill">Active</span>
              </div>
              <div className="preview-widgets">
                <div className="preview-card preview-graph">
                  <span>Sentiment</span>
                  <div className="chart pie-chart"></div>
                </div>
                <div className="preview-card preview-line">
                  <span>Trend</span>
                  <div className="chart line-chart"></div>
                </div>
                <div className="preview-card preview-score">
                  <span>AI Confidence</span>
                  <strong>92%</strong>
                </div>
                <div className="preview-card preview-feed">
                  <span>Recent Predictions</span>
                  <ul>
                    <li>Delivery issue detected — Explore root cause</li>
                    <li>Price sentiment negative — Flag for review</li>
                    <li>Support response praised — Highlight success</li>
                  </ul>
                </div>
                <div className="preview-card preview-action">
                  <span>Business Recommendation</span>
                  <p>Increase retention by improving support workflows during peak hours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trusted-section">
          <h3>Trusted by modern businesses</h3>
          <div className="trusted-grid">
            {trustedLogos.map((logo) => (
              <div key={logo} className="trusted-logo">{logo}</div>
            ))}
          </div>
        </section>

        <section className="problem-section" id="problems">
          <div className="section-heading">
            <p className="section-label">Problem</p>
            <h3>Customer Feedback is Growing Faster Than Humans Can Analyze</h3>
          </div>
          <div className="problem-grid">
            {problems.map((item) => (
              <div key={item} className="problem-card">
                <span>•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="solution-section" id="solution">
          <div className="section-heading">
            <p className="section-label">Solution</p>
            <h3>Meet IntelSense AI</h3>
          </div>
          <div className="solution-flow">
            {workflow.map((step, index) => (
              <div key={step} className="flow-stage">
                <div className="flow-index">{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="how-it-works" id="features">
          <div className="section-heading">
            <p className="section-label">How IntelSense Works</p>
            <h3>Six premium steps to actionable intelligence</h3>
          </div>
          <div className="step-grid">
            {howSteps.map((step) => (
              <div key={step.title} className="step-card">
                <h4>{step.title}</h4>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section" id="technology">
          <div className="section-heading">
            <p className="section-label">AI Features</p>
            <h3>Premium AI capabilities for modern enterprises</h3>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <h4>{feature.title}</h4>
                <ul>
                  {feature.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="preview-section">
          <div className="section-heading">
            <p className="section-label">Dashboard</p>
            <h3>Interactive dashboard preview</h3>
          </div>
          <div className="preview-shell">
            <div className="preview-kpis">
              <div className="kpi-card"><small>Sentiment</small><strong>72%</strong></div>
              <div className="kpi-card"><small>CSAT</small><strong>4.8/5</strong></div>
              <div className="kpi-card"><small>Insights</small><strong>18</strong></div>
            </div>
            <div className="preview-panels">
              <div className="preview-panel">Live activity feed</div>
              <div className="preview-panel">Heatmap & trend analysis</div>
            </div>
          </div>
        </section>

        <section className="architecture-section" id="enterprise">
          <div className="section-heading">
            <p className="section-label">Architecture</p>
            <h3>Enterprise architecture built for automation</h3>
          </div>
          <div className="architecture-grid">
            {['React Frontend', 'Spring Boot Backend', 'FastAPI AI Service', 'Transformer Models', 'MySQL Database', 'Analytics Dashboard'].map((item) => (
              <div key={item} className="architecture-card">{item}</div>
            ))}
          </div>
        </section>

        <section className="models-section" id="docs">
          <div className="section-heading">
            <p className="section-label">AI Models</p>
            <h3>Specialized models powering every insight</h3>
          </div>
          <div className="model-grid">
            {models.map((model) => (
              <div key={model.name} className="model-card">
                <h4>{model.name}</h4>
                <p>{model.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="enterprise-section">
          <div className="section-heading">
            <p className="section-label">Enterprise Features</p>
            <h3>Everything an enterprise-grade platform should include</h3>
          </div>
          <div className="enterprise-grid">
            {enterpriseFeatures.map((item) => <div key={item} className="enterprise-card">{item}</div>)}
          </div>
        </section>

        <section className="roles-section">
          <div className="section-heading">
            <p className="section-label">Role-Based Platform</p>
            <h3>Each user sees the tools they need</h3>
          </div>
          <div className="role-grid">
            {roles.map((role) => (
              <div key={role.title} className="role-card">
                <h4>{role.title}</h4>
                <ul>{role.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-section">
          <div className="section-heading">
            <p className="section-label">Analytics</p>
            <h3>Enterprise analytics built for fast decisions</h3>
          </div>
          <div className="analytics-grid">
            {['Sentiment Distribution', 'Monthly Trends', 'Department Analysis', 'Word Cloud', 'Emotion Heatmap', 'Confidence Score'].map((item) => (
              <div key={item} className="analytics-card">{item}</div>
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <div className="section-heading">
            <p className="section-label">Testimonials</p>
            <h3>What customers say about IntelSense AI</h3>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-photo">A</div>
              <p>“IntelSense turned our review backlog into on-demand business guidance.”</p>
              <span>— Alex, Retail</span>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-photo">B</div>
              <p>“The AI insights help us catch product issues before they damage our rating.”</p>
              <span>— Priya, Healthcare</span>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-photo">C</div>
              <p>“Exporting reports for exec review takes seconds, not hours.”</p>
              <span>— Miguel, Banking</span>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="section-heading">
            <p className="section-label">Pricing</p>
            <h3>Flexible editions for every team</h3>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <span className="pricing-badge">Starter</span>
              <h4>For students</h4>
              <p>Basic analytics and AI insights</p>
            </div>
            <div className="pricing-card pricing-card-highlighted">
              <span className="pricing-badge">Professional</span>
              <h4>For small businesses</h4>
              <p>Advanced reporting and team dashboards</p>
            </div>
            <div className="pricing-card">
              <span className="pricing-badge">Enterprise</span>
              <h4>For large organizations</h4>
              <p>Custom onboarding, security, and scale</p>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">
            <p className="section-label">FAQ</p>
            <h3>Questions our customers ask most</h3>
          </div>
          <div className="faq-grid">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <div>
              <p className="section-label">Ready to transform customer feedback?</p>
              <h3>Experience enterprise AI intelligence today.</h3>
            </div>
            <div className="hero-buttons">
              <Link className="button-link" to="/register">Start Free</Link>
              <Link className="ghost-btn" to="/login">Request Demo</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#technology">AI Models</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#docs">Documentation</a>
            <a href="#">API</a>
            <a href="#">Blog</a>
            <a href="#">GitHub</a>
          </div>
          <div>
            <h4>Social</h4>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
            <a href="#">X</a>
            <a href="#">YouTube</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI. Built for intelligent customer feedback and enterprise decision-making.</p>
      </footer>
    </div>
  );
}
