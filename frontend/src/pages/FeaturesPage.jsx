import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const aiFeatures = [
  {
    icon: '🤖',
    title: 'Sentiment Analysis',
    description: 'Automatically classifies customer feedback into Positive, Neutral, and Negative using transformer AI.',
    demo: '★★★★★ Great Product',
    result: 'Positive',
    confidence: '99%'
  },
  {
    icon: '😊',
    title: 'Emotion Detection',
    description: 'Capture customer intent and feeling with emotion tags like happy, angry, sad, frustrated, and excited.',
    demo: 'Happy • Angry • Sad • Frustrated • Excited',
    result: 'Happy',
    confidence: '96%'
  },
  {
    icon: '📌',
    title: 'Aspect Analysis',
    description: 'Break down reviews to isolate key issue areas such as delivery, product quality, and support quality.',
    demo: 'Delivery was slow but support was excellent.',
    result: 'Delivery: Negative • Support: Positive',
    confidence: '97%'
  },
  {
    icon: '🔑',
    title: 'Keyword Extraction',
    description: 'Identify the most impactful product and service phrases from large volumes of unstructured feedback.',
    demo: 'Fast Delivery • Excellent Packaging • Friendly Staff',
    result: 'Fast Delivery',
    confidence: '94%'
  },
  {
    icon: '💡',
    title: 'AI Recommendations',
    description: 'Generate operational recommendations that help teams reduce churn, improve product quality, and speed support.',
    demo: 'Improve logistics • Increase stock • Maintain support quality',
    result: 'Improve logistics',
    confidence: '95%'
  },
  {
    icon: '📄',
    title: 'AI Summary',
    description: 'Condense thousands of reviews into executive-ready summaries for faster decision-making.',
    demo: 'Customers love product quality, but complain about delivery delays.',
    result: 'Delivery delay risk flagged',
    confidence: '98%'
  }
];

const businessFeatures = [
  { title: 'Live Analytics', description: 'Pie charts, line graphs, bar charts, and heat maps for multi-dimensional customer insight.', icon: '📊' },
  { title: 'Report Generation', description: 'Export AI findings as PDF, Excel, or CSV for leadership reviews and delivery teams.', icon: '📄' },
  { title: 'Trend Detection', description: 'See how sentiment changes across weekly, monthly, and quarterly business periods.', icon: '📈' },
  { title: 'Customer Satisfaction', description: 'Measure loyalty and service quality with satisfaction score tracking and sentiment baselines.', icon: '📉' },
  { title: 'Department Comparison', description: 'Benchmark Sales, Support, Delivery, and Marketing performance side by side.', icon: '🧭' },
  { title: 'Performance Insights', description: 'Identify top and worst products by region, segment, or channel in seconds.', icon: '🏆' }
];

const enterpriseFeatures = [
  { title: 'Security', points: ['JWT Authentication', 'BCrypt Encryption', 'HTTPS', 'RBAC'], icon: '🔐' },
  { title: 'Role-Based Access', points: ['Admin', 'Analyst', 'Customer'], icon: '👥' },
  { title: 'Cloud Ready', points: ['Docker', 'AWS', 'Azure', 'GCP'], icon: '☁' },
  { title: 'High Performance', points: ['120ms Prediction', '99.2% Accuracy'], icon: '⚡' },
  { title: 'REST API', points: ['Spring Boot', 'FastAPI', 'JSON'], icon: '🔄' },
  { title: 'Batch Processing', points: ['CSV', 'Excel', 'TXT'], icon: '📦' }
];

const workflowSteps = ['Customer', 'Feedback', 'Spring Boot', 'FastAPI', 'RoBERTa', 'Prediction', 'Dashboard', 'Business Insights'];

const comparisonRows = [
  ['Manual Review', 'AI Analysis', 'Hours', 'Seconds', 'Basic Reports', 'Interactive Dashboards', 'Human Errors', 'AI Accuracy', 'Static Data', 'Real-Time Insights'],
  ['Traditional', 'IntelSense AI']
];

const useCases = [
  'Retail', 'Healthcare', 'Education', 'Finance', 'Hospitality', 'Government', 'Manufacturing', 'Telecommunications'
];

const performanceMetrics = [
  { value: 99.2, suffix: '%', label: 'Accuracy' },
  { value: 120, suffix: 'ms', label: 'Prediction Time' },
  { value: 2.5, suffix: 'M', label: 'Predictions' },
  { value: 99.9, suffix: '%', label: 'Availability' }
];

const integrations = ['React', 'Spring Boot', 'FastAPI', 'MySQL', 'JWT', 'REST API', 'Docker', 'AWS'];

const defaultFeatureData = {
  aiAccuracy: 99.2,
  predictionSpeedMs: 120,
  supportedFeatures: ['Sentiment Analysis', 'Emotion Detection', 'Aspect Analysis', 'Keyword Extraction', 'AI Recommendations', 'AI Summary']
};

const defaultMetrics = {
  totalPredictions: 2500000,
  organizations: 250,
  activeUsers: 50000
};

function formatNumber(value) {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat('en-US').format(value);
}

export default function FeaturesPage() {
  const [featureData, setFeatureData] = useState(defaultFeatureData);
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [displayMetrics, setDisplayMetrics] = useState({ totalPredictions: 0, organizations: 0, activeUsers: 0 });
  const [demoState, setDemoState] = useState({ sentiment: 'Positive', confidence: '98%', note: 'Register to use real AI' });
  const [activeUseCase, setActiveUseCase] = useState('Retail');

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [featuresResponse, metricsResponse] = await Promise.all([
          api.get('/api/public/features'),
          api.get('/api/public/platform-metrics')
        ]);

        if (featuresResponse?.data) setFeatureData(featuresResponse.data);
        if (metricsResponse?.data) setMetrics(metricsResponse.data);
      } catch (error) {
        console.error('Feature data unavailable, using default content.', error);
      }
    };

    fetchPublicData();
  }, []);

  useEffect(() => {
    const start = performance.now();
    let rafId;

    const tick = (time) => {
      const progress = Math.min((time - start) / 1100, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayMetrics({
        totalPredictions: Math.round(metrics.totalPredictions * ease),
        organizations: Math.round(metrics.organizations * ease),
        activeUsers: Math.round(metrics.activeUsers * ease)
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [metrics]);

  const activeUseCaseText = useMemo(() => ({
    Retail: 'IntelSense AI helps Retail teams detect churn drivers, product issues, and support friction before they affect loyalty.',
    Healthcare: 'Healthcare organizations use AI to monitor patient sentiment, service quality, and operational experience across care journeys.',
    Education: 'Education teams can improve learner trust, course quality, and support experience by identifying friction signals early.',
    Finance: 'Finance teams reduce churn and trust gaps by spotting issues in customer service and product sentiment in real time.',
    Hospitality: 'Hospitality leaders track guest experience, service quality, and negative sentiment across brand touchpoints.',
    Government: 'Government teams gain service intelligence to improve public satisfaction and operational responsiveness at scale.',
    Manufacturing: 'Manufacturing teams use AI to monitor after-sales service quality and reliability feedback from customers and field teams.',
    Telecommunications: 'Telecom teams reduce churn risk by identifying service quality issues and sentiment shifts across subscriber journeys.'
  }[activeUseCase]), [activeUseCase]);

  return (
    <div className="features-page">
      <header className="landing-header features-header">
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
          <a href="#technology">Technology</a>
          <a href="#solutions">Use Cases</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="features-hero">
          <div className="features-hero-copy">
            <span className="eyebrow-pill">Enterprise AI Features</span>
            <h2>Everything your organization needs to turn customer feedback into business intelligence.</h2>
            <p>
              IntelSense AI combines sentiment analysis, emotion detection, trend tracking, and actionable recommendations
              to help teams improve service quality, growth, and customer experience at scale.
            </p>
            <div className="hero-buttons">
              <button type="button" className="button-link">Try Interactive Demo</button>
              <Link className="ghost-btn" to="/register">Explore Dashboard</Link>
            </div>
          </div>

          <div className="features-visual" aria-label="AI feature dashboard preview">
            <div className="floating-card card-one">
              <span>AI Confidence</span>
              <strong>{featureData.aiAccuracy.toFixed(1)}%</strong>
            </div>
            <div className="floating-card card-two">
              <span>Prediction Time</span>
              <strong>{featureData.predictionSpeedMs}ms</strong>
            </div>
            <div className="feature-hero-panel glass-card">
              <div className="preview-header">
                <div>
                  <span className="dashboard-badge">Live intelligence</span>
                  <h3>Insights Engine</h3>
                </div>
                <span className="status-pill">Active</span>
              </div>
              <div className="hero-chart">
                <div className="chart-line">
                  <span style={{ height: '40%' }} />
                  <span style={{ height: '58%' }} />
                  <span style={{ height: '65%' }} />
                  <span style={{ height: '72%' }} />
                  <span style={{ height: '86%' }} />
                  <span style={{ height: '94%' }} />
                </div>
              </div>
              <div className="mini-metrics">
                <div>
                  <small>Positive</small>
                  <strong>72%</strong>
                </div>
                <div>
                  <small>Neutral</small>
                  <strong>18%</strong>
                </div>
                <div>
                  <small>Negative</small>
                  <strong>10%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="technology">
          <div className="section-heading">
            <p className="section-label">AI Intelligence Features</p>
            <h3>Actionable intelligence for modern business teams</h3>
          </div>
          <div className="feature-grid ai-grid">
            {aiFeatures.map((feature) => (
              <article key={feature.title} className="feature-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                <div className="feature-demo-box">
                  <span>{feature.demo}</span>
                  <strong>{feature.result}</strong>
                  <small>{feature.confidence}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section business-section">
          <div className="section-heading">
            <p className="section-label">Business Intelligence Features</p>
            <h3>From raw feedback to executive insight</h3>
          </div>
          <div className="business-grid">
            {businessFeatures.map((feature) => (
              <article key={feature.title} className="business-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                <div className="chart-mini">
                  <span style={{ height: '35%' }} />
                  <span style={{ height: '52%' }} />
                  <span style={{ height: '68%' }} />
                  <span style={{ height: '76%' }} />
                  <span style={{ height: '92%' }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section enterprise-section">
          <div className="section-heading">
            <p className="section-label">Enterprise Features</p>
            <h3>Built for secure, scalable operations</h3>
          </div>
          <div className="enterprise-grid">
            {enterpriseFeatures.map((feature) => (
              <article key={feature.title} className="enterprise-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <ul>
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section demo-section">
          <div className="section-heading">
            <p className="section-label">Interactive Demo</p>
            <h3>Try IntelSense AI in demo mode</h3>
          </div>
          <div className="demo-panel glass-card">
            <div className="demo-panel-header">
              <span>Enter Feedback</span>
              <span className="demo-status">Demo Mode</span>
            </div>
            <textarea
              className="demo-input"
              value="The product is excellent and the team support was helpful."
              readOnly
            />
            <button type="button" className="button-link demo-button" onClick={() => setDemoState({ sentiment: 'Positive', confidence: '98%', note: 'Register to use real AI' })}>Analyze</button>
            <div className="demo-output">
              <strong>{demoState.sentiment}</strong>
              <span>{demoState.confidence}</span>
              <small>{demoState.note}</small>
            </div>
          </div>
        </section>

        <section className="features-section workflow-section">
          <div className="section-heading">
            <p className="section-label">Enterprise Workflow</p>
            <h3>From feedback to business insight</h3>
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

        <section className="features-section comparison-section">
          <div className="section-heading">
            <p className="section-label">Feature Comparison</p>
            <h3>Higher velocity, lower friction</h3>
          </div>
          <div className="comparison-table glass-card">
            <div className="comparison-row comparison-header">
              <span>Capability</span>
              <span>Traditional</span>
              <span>IntelSense AI</span>
            </div>
            {[
              ['Review Time', 'Hours', 'Seconds'],
              ['Reporting', 'Basic Reports', 'Interactive Dashboards'],
              ['Accuracy', 'Human Errors', 'AI Accuracy'],
              ['Data', 'Static Data', 'Real-Time Insights'],
              ['Decision Quality', 'Manual Analysis', 'Actionable Recommendations']
            ].map(([label, traditional, ai]) => (
              <div key={label} className="comparison-row">
                <span>{label}</span>
                <span>{traditional}</span>
                <span>{ai}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section solutions-section" id="solutions">
          <div className="section-heading">
            <p className="section-label">Industry Use Cases</p>
            <h3>Built for real-world operational outcomes</h3>
          </div>
          <div className="solutions-grid">
            {useCases.map((useCase) => (
              <button
                key={useCase}
                type="button"
                className={`solution-card glass-card ${activeUseCase === useCase ? 'active' : ''}`}
                onClick={() => setActiveUseCase(useCase)}
              >
                <span>{useCase}</span>
              </button>
            ))}
          </div>
          <div className="use-case-panel glass-card">
            <h4>How IntelSense AI helps {activeUseCase}.</h4>
            <p>{activeUseCaseText}</p>
          </div>
        </section>

        <section className="features-section metrics-section">
          <div className="section-heading">
            <p className="section-label">Platform Performance</p>
            <h3>Enterprise-grade speed and reliability</h3>
          </div>
          <div className="performance-grid">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="performance-card glass-card">
                <strong>{metric.value}{metric.suffix}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          <div className="stats-inline">
            <div className="stat-cell glass-card">
              <small>Predictions</small>
              <strong>{formatNumber(displayMetrics.totalPredictions)}</strong>
            </div>
            <div className="stat-cell glass-card">
              <small>Organizations</small>
              <strong>{formatNumber(displayMetrics.organizations)}</strong>
            </div>
            <div className="stat-cell glass-card">
              <small>Active Users</small>
              <strong>{formatNumber(displayMetrics.activeUsers)}</strong>
            </div>
          </div>
        </section>

        <section className="features-section integrations-section">
          <div className="section-heading">
            <p className="section-label">Integration Support</p>
            <h3>Open platform for modern enterprise stacks</h3>
          </div>
          <div className="integration-grid">
            {integrations.map((item) => (
              <div key={item} className="integration-card glass-card">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready to modernize</p>
              <h3>Customer intelligence for your next growth stage</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/register">Register</Link>
              <Link className="ghost-btn" to="/login">Login</Link>
              <a className="ghost-btn" href="#technology">Book Demo</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>IntelSense AI</h4>
            <a href="#technology">About</a>
            <a href="#solutions">Use Cases</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#technology">Features</a>
            <a href="#technology">AI Technology</a>
            <a href="#solutions">Solutions</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API</a>
            <a href="#">GitHub</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI</p>
      </footer>
    </div>
  );
}
