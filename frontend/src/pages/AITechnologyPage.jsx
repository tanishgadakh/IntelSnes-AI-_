import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const pipelineSteps = [
  { title: 'Customer Feedback', detail: 'Voice of the customer enters from reviews, forms, surveys, and support tickets.' },
  { title: 'Text Cleaning', detail: 'Noise, duplicates, and formatting issues are normalized for consistent analysis.' },
  { title: 'Language Detection', detail: 'The system identifies the language before NLP preprocessing begins.' },
  { title: 'Tokenization', detail: 'Text is segmented into meaningful units for model input preparation.' },
  { title: 'RoBERTa Transformer', detail: 'Large transformer-based architecture extracts semantic understanding and context.' },
  { title: 'Sentiment Prediction', detail: 'Feedback is classified into positive, neutral, or negative outcomes.' },
  { title: 'Emotion Detection', detail: 'The system identifies emotional cues like happy, angry, sad, and frustrated.' },
  { title: 'Aspect Analysis', detail: 'Key categories such as product, support, pricing, and delivery are isolated.' },
  { title: 'Keyword Extraction', detail: 'High-signal phrases and complaint themes are highlighted for teams.' },
  { title: 'Business Recommendation', detail: 'AI recommends operational actions aligned with business priorities.' },
  { title: 'Dashboard', detail: 'Insights are ready for dashboards, alerts, and executive reporting.' }
];

const modelCards = [
  { title: 'RoBERTa', purpose: 'Sentiment Analysis', accuracy: '99.2%', framework: 'PyTorch' },
  { title: 'Emotion Detection', purpose: 'Happy • Angry • Sad • Fear • Excited', accuracy: '96%', framework: 'Transformers' },
  { title: 'Aspect Analysis', purpose: 'Product • Support • Delivery • Pricing • Website • Mobile App', accuracy: '97%', framework: 'NLP' },
  { title: 'Keyword Extraction', purpose: 'Important words • Trending topics • Frequent complaints', accuracy: '94%', framework: 'Text Mining' },
  { title: 'Recommendation Engine', purpose: 'Business suggestions • Improvement areas • Priority issues', accuracy: '95%', framework: 'Decision Logic' }
];

const techGroups = [
  { title: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'] },
  { title: 'Backend', items: ['Spring Boot', 'Spring Security', 'JWT', 'REST API'] },
  { title: 'AI', items: ['Python', 'FastAPI', 'Transformers', 'PyTorch', 'HuggingFace', 'NumPy', 'Pandas'] },
  { title: 'Database', items: ['MySQL', 'JPA', 'Hibernate'] },
  { title: 'Deployment', items: ['Docker', 'AWS', 'Azure', 'Linux', 'GitHub Actions'] }
];

const securityPoints = ['JWT Authentication', 'Encrypted APIs', 'HTTPS', 'Role Based Access', 'Input Validation', 'Secure Model Access', 'Audit Logs'];

const roadmap = [
  { version: 'Version 1', title: 'Sentiment Analysis' },
  { version: 'Version 2', title: 'Emotion Detection' },
  { version: 'Version 3', title: 'Business Recommendations' },
  { version: 'Version 4', title: 'Voice Analysis' },
  { version: 'Version 5', title: 'Multilingual AI' }
];

const architectureBlocks = [
  { title: 'React Frontend', info: 'User experience layer with charts and dashboards.' },
  { title: 'Axios', info: 'Communicates with public and protected backend APIs.' },
  { title: 'Spring Boot', info: 'Secure application and business logic orchestrator.' },
  { title: 'JWT Security', info: 'Authorizes authenticated user roles and requests.' },
  { title: 'FastAPI AI Service', info: 'Runs model inference and AI processing endpoints.' },
  { title: 'RoBERTa', info: 'Transformer model powering sentiment and context analysis.' },
  { title: 'MySQL', info: 'Stores analytics, predictions, and business metadata.' },
  { title: 'Dashboard', info: 'Present insights, trends, and recommendations.' }
];

const defaultAiInfo = {
  currentModel: 'RoBERTa',
  version: '1.0',
  supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Arabic'],
  accuracy: 99.2
};

const defaultPerformance = {
  predictionSpeedMs: 120,
  availability: 99.9,
  totalPredictions: 2500000
};

const defaultPopup = {
  title: 'Sentiment Prediction',
  body: 'A customer review is classified using contextual NLP patterns and transformer embeddings.'
};

export default function AITechnologyPage() {
  const [aiInfo, setAiInfo] = useState(defaultAiInfo);
  const [performance, setPerformance] = useState(defaultPerformance);
  const [activePopup, setActivePopup] = useState(null);
  const [demoInput, setDemoInput] = useState('Amazing service.');
  const [demoOutput, setDemoOutput] = useState({ sentiment: 'Positive', confidence: '99%', note: 'Register to use real AI' });

  useEffect(() => {
    const fetchPublicAiData = async () => {
      try {
        const [aiResponse, performanceResponse] = await Promise.all([
          api.get('/api/public/ai-info'),
          api.get('/api/public/performance')
        ]);

        if (aiResponse?.data) setAiInfo(aiResponse.data);
        if (performanceResponse?.data) setPerformance(performanceResponse.data);
      } catch (error) {
        console.error('AI technology data unavailable, using default content.', error);
      }
    };

    fetchPublicAiData();
  }, []);

  const performanceMetrics = useMemo(() => [
    { value: aiInfo.accuracy, suffix: '%', label: 'Accuracy' },
    { value: performance.predictionSpeedMs, suffix: 'ms', label: 'Prediction Time' },
    { value: performance.totalPredictions / 1000000, suffix: 'M', label: 'Predictions', format: (v) => `${v.toFixed(1)}` },
    { value: 25, suffix: '+', label: 'Languages' },
    { value: performance.availability, suffix: '%', label: 'Availability' }
  ], [aiInfo.accuracy, performance]);

  return (
    <div className="ai-tech-page">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>AI Technology</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <a href="#pipeline">Pipeline</a>
          <a href="#models">Models</a>
          <a href="#architecture">Architecture</a>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="ai-hero">
          <div className="ai-hero-copy">
            <span className="eyebrow-pill">Artificial Intelligence That Understands Customer Emotions</span>
            <h2>AI built for enterprise customer intelligence.</h2>
            <p>
              Powered by transformer models, FastAPI AI services, secure backend orchestration, and explainable analytics.
              IntelSense AI processes feedback into sentiment, emotion, keywords, recommendations, and business action.
            </p>
            <div className="hero-buttons">
              <a className="button-link" href="#pipeline">Explore AI Pipeline</a>
              <a className="ghost-btn" href="#architecture">View Architecture</a>
            </div>
          </div>

          <div className="ai-hero-visual" aria-label="AI technology visualization">
            <div className="neural-network">
              <span className="node node-a" />
              <span className="node node-b" />
              <span className="node node-c" />
              <span className="node node-d" />
              <span className="node node-e" />
              <span className="node node-f" />
            </div>
            <div className="floating-card ai-card-one">
              <span>Sentiment</span>
              <strong>Positive</strong>
              <small>{aiInfo.accuracy.toFixed(1)}%</small>
            </div>
            <div className="floating-card ai-card-two">
              <span>Emotion</span>
              <strong>Happy</strong>
            </div>
            <div className="floating-card ai-card-three">
              <span>Keywords</span>
              <strong>Fast Delivery</strong>
            </div>
            <div className="floating-card ai-card-four">
              <span>Recommendation</span>
              <strong>Maintain Quality</strong>
            </div>
          </div>
        </section>

        <section className="features-section" id="pipeline">
          <div className="section-heading">
            <p className="section-label">AI Processing Pipeline</p>
            <h3>How IntelSense AI transforms raw customer text into action</h3>
          </div>
          <div className="pipeline-wrapper">
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className="pipeline-item-wrap">
                <button
                  type="button"
                  className="pipeline-item glass-card"
                  onClick={() => setActivePopup({ title: step.title, body: step.detail })}
                >
                  <span>{step.title}</span>
                  {index < pipelineSteps.length - 1 && <em>↓</em>}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section" id="models">
          <div className="section-heading">
            <p className="section-label">AI Models</p>
            <h3>Purpose-built intelligence for every customer signal</h3>
          </div>
          <div className="ai-model-grid">
            {modelCards.map((model) => (
              <article key={model.title} className="model-card glass-card">
                <div className="model-header">
                  <h4>{model.title}</h4>
                </div>
                <p><strong>Purpose</strong><br />{model.purpose}</p>
                <p><strong>Accuracy</strong><br />{model.accuracy}</p>
                <p><strong>Framework</strong><br />{model.framework}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section xai-section">
          <div className="section-heading">
            <p className="section-label">Explainable AI (XAI)</p>
            <h3>Why the model made this prediction</h3>
          </div>
          <div className="xai-panel glass-card">
            <div className="xai-copy">
              <p className="xai-label">Input</p>
              <blockquote>“Delivery was extremely slow.”</blockquote>
              <div className="xai-result">
                <div>
                  <span>Prediction</span>
                  <strong>Negative</strong>
                </div>
                <div>
                  <span>Confidence</span>
                  <strong>99%</strong>
                </div>
              </div>
              <div className="xai-words">
                <span>Slow</span>
                <span>Delivery</span>
                <span>Extremely</span>
              </div>
            </div>
            <div className="xai-visual">
              <div className="confidence-bar">
                <span style={{ width: '99%' }} />
              </div>
              <div className="highlight-text">
                <span className="highlight">Delivery</span> was <span className="highlight">extremely</span> <span className="highlight">slow</span>.
              </div>
            </div>
          </div>
        </section>

        <section className="features-section architecture-section" id="architecture">
          <div className="section-heading">
            <p className="section-label">AI Architecture</p>
            <h3>Connected layers that make enterprise AI actionable</h3>
          </div>
          <div className="architecture-flow">
            {architectureBlocks.map((block) => (
              <div key={block.title} className="architecture-node glass-card" title={`${block.title}: ${block.info}`}>
                <span>{block.title}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section stack-section">
          <div className="section-heading">
            <p className="section-label">Technology Stack</p>
            <h3>Engineering foundations behind the platform</h3>
          </div>
          <div className="tech-grid">
            {techGroups.map((group) => (
              <div key={group.title} className="tech-group glass-card">
                <h4>{group.title}</h4>
                <div className="tech-tag-grid">
                  {group.items.map((item) => (
                    <span key={item} className="tech-tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section metrics-section">
          <div className="section-heading">
            <p className="section-label">AI Performance</p>
            <h3>Measured performance for enterprise reliability</h3>
          </div>
          <div className="ai-metric-grid">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="ai-metric glass-card">
                <strong>{metric.format ? metric.format(metric.value) : metric.value}{metric.suffix}</strong>
                <span>{metric.label}</span>
                <div className="meter"><span style={{ width: `${Math.min((metric.value / (metric.label === 'Accuracy' ? 100 : 100), 1) * 100, 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section security-section">
          <div className="section-heading">
            <p className="section-label">AI Security</p>
            <h3>Protected by secure enterprise controls</h3>
          </div>
          <div className="security-layout">
            <div className="security-list glass-card">
              {securityPoints.map((point) => (
                <div key={point} className="security-item"><span>✓</span><p>{point}</p></div>
              ))}
            </div>
            <div className="security-diagram glass-card">
              <div className="security-line">
                <span>User</span>
                <em>↓</em>
                <span>JWT</span>
                <em>↓</em>
                <span>Spring Boot</span>
                <em>↓</em>
                <span>Role Validation</span>
                <em>↓</em>
                <span>AI Service</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section roadmap-section">
          <div className="section-heading">
            <p className="section-label">AI Roadmap</p>
            <h3>Continuous innovation for customer intelligence</h3>
          </div>
          <div className="roadmap-timeline">
            {roadmap.map((item, index) => (
              <div key={item.version} className="roadmap-step glass-card">
                <span className="roadmap-label">{item.version}</span>
                <strong>{item.title}</strong>
                {index < roadmap.length - 1 && <em>↓</em>}
              </div>
            ))}
          </div>
        </section>

        <section className="features-section demo-section">
          <div className="section-heading">
            <p className="section-label">Interactive AI Demo</p>
            <h3>Try the AI technology experience</h3>
          </div>
          <div className="demo-panel glass-card">
            <div className="demo-panel-header">
              <span>Input</span>
              <span className="demo-status">Demo</span>
            </div>
            <textarea value={demoInput} onChange={(e) => setDemoInput(e.target.value)} className="demo-input" />
            <button type="button" className="button-link demo-button" onClick={() => setDemoOutput({ sentiment: 'Positive', confidence: '99%', note: 'Register to use real AI' })}>Analyze</button>
            <div className="demo-output">
              <strong>{demoOutput.sentiment}</strong>
              <span>{demoOutput.confidence}</span>
              <small>{demoOutput.note}</small>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready to experience</p>
              <h3>Enterprise AI built for measurable customer insights</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/register">Get Started</Link>
              <Link className="ghost-btn" to="/login">Login</Link>
              <a className="ghost-btn" href="#pipeline">Documentation</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>IntelSense AI</h4>
            <a href="#pipeline">AI Pipeline</a>
            <a href="#models">Models</a>
            <a href="#architecture">Architecture</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="/features">Features</a>
            <a href="/">Home</a>
            <a href="#">Documentation</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">API</a>
            <a href="#">Security</a>
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

      {activePopup && (
        <div className="popup-backdrop" onClick={() => setActivePopup(null)}>
          <div className="popup-card glass-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="popup-close" onClick={() => setActivePopup(null)} aria-label="Close popup">×</button>
            <strong>{activePopup.title}</strong>
            <p>{activePopup.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}
