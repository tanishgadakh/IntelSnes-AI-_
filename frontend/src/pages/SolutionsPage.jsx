import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const defaultChallengeCards = [
  {
    icon: '😓',
    title: 'Manual Feedback Analysis',
    description: 'Thousands of customer reviews cannot be processed by hand without missing important signals.'
  },
  {
    icon: '📉',
    title: 'Poor Customer Satisfaction',
    description: 'Businesses struggle to pinpoint the causes behind churn, complaints, and declining loyalty.'
  },
  {
    icon: '🐢',
    title: 'Slow Decision Making',
    description: 'Executive reporting takes hours or days, leaving leadership without real-time insight.'
  },
  {
    icon: '📊',
    title: 'Unorganized Feedback',
    description: 'Reviews span support systems, surveys, social media, and marketplaces without structure.'
  },
  {
    icon: '🔍',
    title: 'Hidden Trends',
    description: 'Teams cannot easily see patterns around product issues, service quality, or sentiment spikes.'
  },
  {
    icon: '💸',
    title: 'Revenue Loss',
    description: 'Unresolved customer pain points quietly erode retention, lifetime value, and brand trust.'
  }
];

const defaultIndustries = [
  {
    name: 'Retail',
    challenge: 'Product reviews, returns, and delivery experience need faster interpretation.',
    workflow: ['Analyze reviews', 'Find complaint themes', 'Track product sentiment', 'Improve loyalty'],
    metrics: ['32% fewer complaints', '8x faster insight'],
    highlight: 'Retail teams use IntelSense AI to identify product issues and improve customer experience.'
  },
  {
    name: 'Healthcare',
    challenge: 'Patient feedback and service experience need a dependable understanding of quality signals.',
    workflow: ['Monitor patient feedback', 'Uncover service gaps', 'Improve care satisfaction', 'Shape operations'],
    metrics: ['25% better perception', 'Real-time patient insights'],
    highlight: 'Hospitals use the platform to turn feedback into service improvements and care strategy.'
  },
  {
    name: 'Education',
    challenge: 'Students, faculty, and course feedback need faster and more actionable interpretation.',
    workflow: ['Review course sentiment', 'Track faculty experience', 'Improve retention', 'Support planning'],
    metrics: ['Higher course satisfaction', 'Faster academic analysis'],
    highlight: 'Educational institutions surface student pain points and improve learner satisfaction.'
  },
  {
    name: 'Banking',
    challenge: 'Digital banking and support interactions require clear trust and service monitoring.',
    workflow: ['Analyze banking reviews', 'Capture service friction', 'Measure trust', 'Support retention'],
    metrics: ['Fewer support escalations', 'Better service signals'],
    highlight: 'Banks uncover service issues before they become reputational risks.'
  }
];

const departmentSolutions = [
  {
    title: 'Customer Support',
    description: 'Analyze complaints, improve support quality, and measure satisfaction in real time.'
  },
  {
    title: 'Marketing',
    description: 'Track campaign sentiment, brand reputation, and the pulse of customer conversations.'
  },
  {
    title: 'Sales',
    description: 'Turn customer opinions into demand signals, objections, and upsell opportunities.'
  },
  {
    title: 'Product Team',
    description: 'Prioritize product changes, feature requests, and quality issues based on evidence.'
  },
  {
    title: 'HR',
    description: 'Monitor employee feedback and workplace sentiment to improve retention and culture.'
  },
  {
    title: 'Management',
    description: 'Surface executive-ready insights, KPIs, and strategic recommendations without manual reporting.'
  }
];

const useCaseSteps = [
  { title: 'Customer writes review', detail: 'Feedback arrives through support channels, surveys, or app reviews.' },
  { title: 'AI understands sentiment', detail: 'The platform classifies tone, urgency, and intent with contextual analysis.' },
  { title: 'Emotion detected', detail: 'The system identifies emotional signals such as frustration, delight, or confusion.' },
  { title: 'Keywords extracted', detail: 'Aspect-level keywords and themes are surfaced for faster interpretation.' },
  { title: 'Business recommendation', detail: 'Actionable suggestions are generated for product, support, and leadership teams.' },
  { title: 'Dashboard updated', detail: 'The insight is pushed into analytics views and executive reporting surfaces.' },
  { title: 'Manager notified', detail: 'Teams receive the signal they need to respond before issues spread.' }
];

const customerJourney = ['Customer', 'Feedback', 'AI', 'Database', 'Analytics', 'Reports', 'Decision', 'Better Experience'];

const successStories = [
  { title: 'Retail Company', result: 'Reduced customer complaints by 32% in six weeks.' },
  { title: 'Hospital', result: 'Improved patient experience scores by 25% across care units.' },
  { title: 'University', result: 'Improved course feedback analysis and student retention planning.' },
  { title: 'E-Commerce', result: 'Increased delivery satisfaction with faster issue detection.' }
];

const workflowSteps = ['Customers', 'Reviews', 'React', 'Spring Boot', 'FastAPI', 'RoBERTa', 'Database', 'Business Dashboard', 'Management'];

const defaultBusinessMetrics = {
  manualWorkReduction: 80,
  decisionSpeed: 5,
  satisfactionLift: 40,
  reportGeneration: 60
};

export default function SolutionsPage() {
  const [challengeCards, setChallengeCards] = useState(defaultChallengeCards);
  const [industries, setIndustries] = useState(defaultIndustries);
  const [businessMetrics, setBusinessMetrics] = useState(defaultBusinessMetrics);
  const [selectedIndustry, setSelectedIndustry] = useState(defaultIndustries[0].name);
  const [selectedUseCase, setSelectedUseCase] = useState(useCaseSteps[0].title);
  const [reviewVolume, setReviewVolume] = useState(12000);
  const [supportAgents, setSupportAgents] = useState(18);
  const [manualHours, setManualHours] = useState(120);
  const [animatedMetrics, setAnimatedMetrics] = useState({ manualWorkReduction: 0, decisionSpeed: 0, satisfactionLift: 0, reportGeneration: 0 });

  useEffect(() => {
    const fetchSolutionsData = async () => {
      try {
        const [solutionsResponse, metricsResponse] = await Promise.all([
          api.get('/api/public/solutions'),
          api.get('/api/public/business-metrics')
        ]);

        if (solutionsResponse?.data?.industries?.length) {
          setIndustries(solutionsResponse.data.industries);
        }

        if (solutionsResponse?.data?.challenges?.length) {
          setChallengeCards(solutionsResponse.data.challenges);
        }

        if (metricsResponse?.data) {
          setBusinessMetrics(metricsResponse.data);
        }
      } catch (error) {
        console.error('Solutions data unavailable, using default content.', error);
      }
    };

    fetchSolutionsData();
  }, []);

  useEffect(() => {
    const start = performance.now();
    let rafId;

    const tick = (time) => {
      const progress = Math.min((time - start) / 1100, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedMetrics({
        manualWorkReduction: Math.round(businessMetrics.manualWorkReduction * ease),
        decisionSpeed: Number((businessMetrics.decisionSpeed * ease).toFixed(1)),
        satisfactionLift: Math.round(businessMetrics.satisfactionLift * ease),
        reportGeneration: Math.round(businessMetrics.reportGeneration * ease)
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [businessMetrics]);

  const selectedIndustryInfo = useMemo(
    () => industries.find((industry) => industry.name === selectedIndustry) || industries[0],
    [industries, selectedIndustry]
  );

  const selectedUseCaseInfo = useMemo(
    () => useCaseSteps.find((step) => step.title === selectedUseCase) || useCaseSteps[0],
    [selectedUseCase]
  );

  const roiEstimate = useMemo(() => {
    const timeSavingsHours = Math.round(Math.max(30, manualHours * 0.72));
    const costSavings = Math.round(reviewVolume * 0.08 + supportAgents * 3100);
    const productivityGain = Math.min(95, Math.round(25 + reviewVolume / 2500 + supportAgents / 8));
    const roiPercent = Math.round(costSavings / Math.max(1, reviewVolume * 0.05));

    return {
      timeSavingsHours,
      costSavings,
      productivityGain,
      roiPercent
    };
  }, [manualHours, reviewVolume, supportAgents]);

  return (
    <div className="solutions-page">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Solutions Platform</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/solutions">Solutions</Link>
          <Link to="/ai-technology">AI Technology</Link>
          <Link to="/dashboard-preview">Dashboard</Link>
          <Link to="/enterprise">Enterprise</Link>
          <Link to="/documentation">Docs</Link>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Request Demo</Link>
        </div>
      </header>

      <main>
        <section className="solutions-hero">
          <div className="solutions-hero-copy">
            <span className="eyebrow-pill">Enterprise AI Solutions</span>
            <h2>Transform customer feedback into measurable business growth.</h2>
            <p>
              IntelSense AI helps enterprises understand customer pain points, improve services, and act on insight faster than manual reporting ever could.
            </p>
            <div className="feature-list-inline">
              <span>✔ Better Decisions</span>
              <span>✔ Faster Analysis</span>
              <span>✔ Higher Satisfaction</span>
            </div>
            <div className="hero-buttons">
              <Link className="button-link" to="/register">Explore Solutions</Link>
              <Link className="ghost-btn" to="/enterprise">Request Demo</Link>
            </div>
          </div>

          <div className="solutions-visual glass-card" aria-label="Solution flow illustration">
            <div className="solution-flow-node">Customer Reviews</div>
            <div className="solution-flow-arrow">↓</div>
            <div className="solution-flow-node">AI Analysis</div>
            <div className="solution-flow-arrow">↓</div>
            <div className="solution-flow-node">Business Insights</div>
            <div className="solution-flow-arrow">↓</div>
            <div className="solution-flow-node">Management Dashboard</div>
            <div className="solution-flow-arrow">↓</div>
            <div className="solution-flow-node accent-node">Better Decisions</div>
            <div className="floating-solution-card card-top">99.2% Accuracy</div>
            <div className="floating-solution-card card-bottom">Customer Satisfaction ↑</div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Problems Businesses Face</p>
            <h3>Turn operational friction into clear opportunities for change</h3>
          </div>

          <div className="challenge-grid">
            {challengeCards.map((item) => (
              <article key={item.title} className="challenge-card glass-card">
                <div className="feature-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Industry Solutions</p>
            <h3>Purpose-built AI workflows for the world’s most feedback-heavy industries</h3>
          </div>

          <div className="industry-selector solutions-selector">
            {industries.map((industry) => (
              <button
                key={industry.name}
                type="button"
                className={`industry-tag ${selectedIndustry === industry.name ? 'active' : ''}`}
                onClick={() => setSelectedIndustry(industry.name)}
              >
                {industry.name}
              </button>
            ))}
          </div>

          <div className="industry-solution-card glass-card">
            <div className="industry-solution-copy">
              <h4>{selectedIndustryInfo.name}</h4>
              <p>{selectedIndustryInfo.highlight}</p>
              <div className="industry-solution-stack">
                <div>
                  <h5>Common Challenges</h5>
                  <p>{selectedIndustryInfo.challenge}</p>
                </div>
                <div>
                  <h5>AI Solution</h5>
                  <ul>
                    {selectedIndustryInfo.workflow.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="industry-kpi-card">
              {selectedIndustryInfo.metrics.map((metric) => (
                <div key={metric} className="mini-kpi">{metric}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Department Solutions</p>
            <h3>Every role gets a path to faster, clearer decisions</h3>
          </div>

          <div className="department-grid">
            {departmentSolutions.map((item) => (
              <article key={item.title} className="department-card glass-card">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">AI Use Cases</p>
            <h3>Watch a single customer signal turn into operational action</h3>
          </div>

          <div className="use-case-layout">
            <div className="use-case-steps">
              {useCaseSteps.map((step) => (
                <button
                  key={step.title}
                  type="button"
                  className={`use-case-step ${selectedUseCase === step.title ? 'active' : ''}`}
                  onClick={() => setSelectedUseCase(step.title)}
                >
                  {step.title}
                </button>
              ))}
            </div>

            <div className="use-case-detail glass-card">
              <h4>{selectedUseCaseInfo.title}</h4>
              <p>{selectedUseCaseInfo.detail}</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Customer Journey</p>
            <h3>From feedback submission to better customer experience</h3>
          </div>

          <div className="journey-flow glass-card">
            {customerJourney.map((step, index) => (
              <div key={step} className="journey-step">
                <span>{step}</span>
                {index < customerJourney.length - 1 && <em>→</em>}
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Before vs After IntelSense AI</p>
            <h3>Replace manual analysis with intelligent, measurable decision support</h3>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card glass-card">
              <h4>Before IntelSense AI</h4>
              <ul>
                <li>Manual review reading across channels</li>
                <li>Hours of work for simple summaries</li>
                <li>Static Excel reporting</li>
                <li>Human error and delayed action</li>
              </ul>
            </div>
            <div className="comparison-card glass-card success-card">
              <h4>After IntelSense AI</h4>
              <ul>
                <li>Automatic AI analysis and sentiment discovery</li>
                <li>Seconds to generate actionable insight</li>
                <li>Live dashboards and executive views</li>
                <li>Smart recommendations and real-time analytics</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">ROI & Business Impact</p>
            <h3>Estimate the value of faster, smarter feedback intelligence</h3>
          </div>

          <div className="roi-layout">
            <div className="roi-form glass-card">
              <label>
                <span>Customer reviews per month</span>
                <input type="range" min="1000" max="50000" step="1000" value={reviewVolume} onChange={(event) => setReviewVolume(Number(event.target.value))} />
                <strong>{reviewVolume.toLocaleString()}</strong>
              </label>
              <label>
                <span>Support agents</span>
                <input type="range" min="5" max="80" step="1" value={supportAgents} onChange={(event) => setSupportAgents(Number(event.target.value))} />
                <strong>{supportAgents}</strong>
              </label>
              <label>
                <span>Manual hours per week</span>
                <input type="range" min="20" max="300" step="10" value={manualHours} onChange={(event) => setManualHours(Number(event.target.value))} />
                <strong>{manualHours} hrs</strong>
              </label>
            </div>

            <div className="roi-results">
              <div className="impact-card glass-card">
                <strong>{roiEstimate.timeSavingsHours} hrs</strong>
                <span>Time saved weekly</span>
              </div>
              <div className="impact-card glass-card">
                <strong>${roiEstimate.costSavings.toLocaleString()}</strong>
                <span>Estimated annual savings</span>
              </div>
              <div className="impact-card glass-card">
                <strong>{roiEstimate.productivityGain}%</strong>
                <span>Productivity improvement</span>
              </div>
              <div className="impact-card glass-card">
                <strong>{roiEstimate.roiPercent}%</strong>
                <span>Projected ROI</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Business Impact</p>
            <h3>Operational gains that scale with your customer volume</h3>
          </div>

          <div className="impact-grid">
            <div className="impact-card glass-card">
              <strong>{animatedMetrics.manualWorkReduction}%</strong>
              <span>Reduction in manual work</span>
            </div>
            <div className="impact-card glass-card">
              <strong>{animatedMetrics.decisionSpeed.toFixed(1)}x</strong>
              <span>Faster business decisions</span>
            </div>
            <div className="impact-card glass-card">
              <strong>{animatedMetrics.satisfactionLift}%</strong>
              <span>Higher customer satisfaction</span>
            </div>
            <div className="impact-card glass-card">
              <strong>{animatedMetrics.reportGeneration}%</strong>
              <span>Faster report generation</span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Success Stories</p>
            <h3>Real outcomes from enterprise feedback intelligence</h3>
          </div>

          <div className="success-grid">
            {successStories.map((story) => (
              <article key={story.title} className="success-card glass-card">
                <h4>{story.title}</h4>
                <p>{story.result}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Enterprise Workflow</p>
            <h3>A connected path from feedback to executive action</h3>
          </div>

          <div className="workflow-stack glass-card">
            {workflowSteps.map((step, index) => (
              <div key={step} className="workflow-stack-item">
                <span>{step}</span>
                {index < workflowSteps.length - 1 && <em>↓</em>}
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready to solve your customer feedback challenges?</p>
              <h3>Explore how IntelSense AI turns complex feedback into confident business action.</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/register">Get Started</Link>
              <Link className="ghost-btn" to="/enterprise">Contact Enterprise Team</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>IntelSense AI</h4>
            <a href="/features">Features</a>
            <a href="/solutions">Solutions</a>
            <a href="/enterprise">Enterprise</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="/documentation">Docs</a>
            <a href="/ai-technology">AI Technology</a>
            <a href="/dashboard-preview">Dashboard</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="mailto:support@intelsense.ai">Support</a>
            <a href="/register">Sign Up</a>
            <a href="/enterprise">Book Demo</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI</p>
      </footer>
    </div>
  );
}
