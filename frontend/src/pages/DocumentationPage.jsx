import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const categoryCards = [
  { title: 'Getting Started', icon: '🚀', description: 'Install, configure, and launch IntelSense AI quickly.' },
  { title: 'User Guide', icon: '👤', description: 'Learn how customers, analysts, and admins use the platform.' },
  { title: 'Developer Guide', icon: '👨‍💻', description: 'Understand the frontend, backend, and AI service architecture.' },
  { title: 'AI Service', icon: '🤖', description: 'Explore the AI pipeline, models, endpoints, and outputs.' },
  { title: 'API Reference', icon: '🔌', description: 'Browse public endpoints, methods, headers, and example payloads.' },
  { title: 'Database', icon: '🗄', description: 'Review system entities, relationships, and core storage patterns.' },
  { title: 'Deployment', icon: '☁', description: 'Plan local, container, or cloud deployment paths.' },
  { title: 'FAQ', icon: '❓', description: 'Find answers to common questions about setup and usage.' }
];

const gettingStartedCards = [
  { title: 'Installation', steps: ['Clone repository', 'Install dependencies', 'Configure environment'] },
  { title: 'Requirements', steps: ['Java', 'Python', 'Node.js', 'MySQL'] },
  { title: 'Run Project', steps: ['Frontend', 'Backend', 'AI Service'] }
];

const userGuides = [
  {
    title: 'Customer Guide',
    items: ['Register', 'Submit Feedback', 'View Results', 'Download Reports']
  },
  {
    title: 'Analyst Guide',
    items: ['Login', 'Analyze Reviews', 'Generate Reports', 'Export Results']
  },
  {
    title: 'Admin Guide',
    items: ['Approve Analysts', 'Manage Users', 'View Logs', 'System Settings']
  }
];

const developerGuides = [
  { title: 'Frontend', items: ['React', 'Vite', 'Axios', 'Responsive UI'] },
  { title: 'Backend', items: ['Spring Boot', 'JWT', 'REST API', 'Service Layers'] },
  { title: 'AI Service', items: ['FastAPI', 'RoBERTa', 'Transformers', 'PyTorch'] }
];

const defaultApiReference = [
  {
    name: 'Authentication',
    method: 'POST',
    endpoint: '/api/auth/login',
    description: 'Authenticate users and receive an access token.',
    headers: ['Content-Type: application/json'],
    body: '{"email":"demo@intelsense.ai","password":"demo123"}',
    response: '{"token":"...","role":"ANALYST"}'
  },
  {
    name: 'Prediction',
    method: 'POST',
    endpoint: '/api/predict',
    description: 'Submit feedback text for sentiment and AI analysis.',
    headers: ['Authorization: Bearer <token>'],
    body: '{"text":"Great product but delivery was slow"}',
    response: '{"sentiment":"neutral","confidence":0.96}'
  },
  {
    name: 'Reports',
    method: 'GET',
    endpoint: '/api/reports',
    description: 'Retrieve summary reports and analytics snapshots.',
    headers: ['Authorization: Bearer <token>'],
    body: 'None',
    response: '[{"id":1,"summary":"Positive trend"}]'
  },
  {
    name: 'Feedback',
    method: 'POST',
    endpoint: '/api/feedback',
    description: 'Create new feedback records for downstream intelligence.',
    headers: ['Authorization: Bearer <token>'],
    body: '{"customer":"A. Lee","feedback":"Loved the onboarding experience"}',
    response: '{"status":"created"}'
  }
];

const aiPipeline = [
  'Customer Feedback',
  'Preprocessing',
  'RoBERTa Model',
  'Emotion Detection',
  'Aspect Analysis',
  'Recommendation Engine',
  'Prediction Response'
];

const modelInfo = [
  { label: 'Model', value: 'RoBERTa' },
  { label: 'Version', value: 'v1.0' },
  { label: 'Accuracy', value: '99.2%' },
  { label: 'Language Support', value: 'English' },
  { label: 'Confidence Score', value: 'Available' }
];

const aiEndpoints = ['/predict', '/bulk-predict', '/emotion', '/aspects', '/summary'];

const databaseTables = [
  { name: 'Users', details: 'Stores identity, roles, and account security information.' },
  { name: 'Feedback', details: 'Captures customer comments and review entries.' },
  { name: 'Predictions', details: 'Holds AI analysis outputs and confidence scores.' },
  { name: 'Reports', details: 'Contains generated executive summaries and analytics.' },
  { name: 'Audit Logs', details: 'Tracks admin activity and system events.' }
];

const architectureComponents = [
  { name: 'Frontend', purpose: 'React-based experience for dashboards, reports, and workflows.', tech: ['React', 'Vite', 'Axios'] },
  { name: 'Spring Boot', purpose: 'Backend layer for business logic, authentication, and API orchestration.', tech: ['Spring Boot', 'JWT', 'REST'] },
  { name: 'FastAPI', purpose: 'AI service host that exposes prediction endpoints and model utilities.', tech: ['FastAPI', 'PyTorch', 'Transformers'] },
  { name: 'Database', purpose: 'Stores users, feedback, predictions, reports, and audit data.', tech: ['MySQL', 'SQL'] }
];

const deploymentModes = [
  { title: 'Local', items: ['Windows', 'Linux', 'Mac'] },
  { title: 'Docker', items: ['Containers', 'Docker Compose', 'Microservices'] },
  { title: 'Cloud', items: ['AWS', 'Azure', 'Google Cloud'] }
];

const faqs = [
  { q: 'How do I register?', a: 'Use the sign-up flow to create an account and then access the platform as a Customer, Analyst, or Admin.' },
  { q: 'How does AI prediction work?', a: 'Feedback is routed through the backend and AI service, which applies model inference and returns analysis results.' },
  { q: 'Can analysts upload CSV?', a: 'Batch data flows are supported through the authenticated product experience and backend services.' },
  { q: 'How secure is JWT?', a: 'JWT-based access control is paired with role-based permissions, secure password handling, and audit logging.' },
  { q: 'How do I deploy?', a: 'You can deploy locally, with Docker, or in the cloud depending on your operational scale.' }
];

const supportItems = ['Email Support', 'Live Chat', 'Documentation', 'GitHub', 'Report Issue', 'Community Forum'];

const defaultDocsMeta = {
  title: 'IntelSense AI Documentation',
  description: 'Everything you need to learn, develop, deploy, and manage IntelSense AI.',
  version: 'v3.0'
};

const defaultVersionInfo = {
  frontend: '1.0.0',
  backend: '2.1.0',
  aiService: '3.0.0'
};

export default function DocumentationPage() {
  const [docsMeta, setDocsMeta] = useState(defaultDocsMeta);
  const [apiReference, setApiReference] = useState(defaultApiReference);
  const [versionInfo, setVersionInfo] = useState(defaultVersionInfo);
  const [search, setSearch] = useState('');
  const [selectedGuide, setSelectedGuide] = useState('Customer Guide');
  const [selectedTable, setSelectedTable] = useState(databaseTables[0].name);
  const [selectedArchitecture, setSelectedArchitecture] = useState(architectureComponents[0].name);
  const [openFaq, setOpenFaq] = useState(0);
  const [copiedEndpoint, setCopiedEndpoint] = useState('');

  useEffect(() => {
    const fetchDocsData = async () => {
      try {
        const [docsResponse, apiResponse, versionResponse] = await Promise.all([
          api.get('/api/public/docs'),
          api.get('/api/public/api-reference'),
          api.get('/api/public/version')
        ]);

        if (docsResponse?.data) setDocsMeta((prev) => ({ ...prev, ...docsResponse.data }));
        if (apiResponse?.data?.length) setApiReference(apiResponse.data);
        if (versionResponse?.data) setVersionInfo(versionResponse.data);
      } catch (error) {
        console.error('Documentation data unavailable, using defaults.', error);
      }
    };

    fetchDocsData();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase();
    return categoryCards.filter((category) => {
      const haystack = `${category.title} ${category.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search]);

  const filteredApis = useMemo(() => {
    const query = search.toLowerCase();
    return apiReference.filter((endpoint) => {
      const haystack = `${endpoint.name} ${endpoint.endpoint} ${endpoint.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [apiReference, search]);

  const selectedGuideItem = useMemo(() => userGuides.find((guide) => guide.title === selectedGuide) || userGuides[0], [selectedGuide]);
  const selectedTableInfo = useMemo(() => databaseTables.find((table) => table.name === selectedTable) || databaseTables[0], [selectedTable]);
  const selectedArchitectureInfo = useMemo(() => architectureComponents.find((component) => component.name === selectedArchitecture) || architectureComponents[0], [selectedArchitecture]);

  const handleCopy = async (snippet) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedEndpoint(snippet);
      window.setTimeout(() => setCopiedEndpoint(''), 1400);
    } catch (error) {
      console.error('Unable to copy snippet.', error);
    }
  };

  const quickSuggestions = ['JWT', 'Prediction API', 'Deployment', 'RoBERTa', 'Spring Boot'];

  return (
    <div className="documentation-page">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Knowledge Center</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/enterprise">Enterprise</Link>
          <Link to="/documentation">Docs</Link>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="documentation-hero">
          <div className="documentation-hero-copy">
            <span className="eyebrow-pill">IntelSense AI Documentation</span>
            <h2>Everything you need to learn, develop, deploy, and manage IntelSense AI.</h2>
            <p>{docsMeta.description}</p>
            <div className="hero-buttons">
              <Link className="button-link" to="/register">Get Started</Link>
              <a className="ghost-btn" href="#api-docs">API Docs</a>
            </div>
          </div>

          <div className="documentation-visual glass-card" aria-label="Documentation overview illustration">
            <div className="doc-screen">
              <div className="doc-toolbar" />
              <div className="doc-body">
                <div className="doc-sidebar" />
                <div className="doc-content">
                  <div className="doc-line short" />
                  <div className="doc-line" />
                  <div className="doc-line" />
                  <div className="doc-line short" />
                </div>
              </div>
            </div>
            <div className="doc-badge badge-one">API</div>
            <div className="doc-badge badge-two">AI</div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Search Documentation</p>
            <h3>Find APIs, guides, deployment steps, and architecture details instantly</h3>
          </div>

          <div className="docs-search-panel glass-card">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documentation..."
            />
            <div className="docs-suggestions">
              {quickSuggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setSearch(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Documentation Categories</p>
            <h3>Browse the knowledge center by topic</h3>
          </div>

          <div className="docs-category-grid">
            {filteredCategories.length ? filteredCategories.map((category) => (
              <div key={category.title} className="doc-category glass-card">
                <div className="feature-icon">{category.icon}</div>
                <h4>{category.title}</h4>
                <p>{category.description}</p>
              </div>
            )) : <div className="doc-category glass-card">No matching documentation categories.</div>}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Getting Started</p>
            <h3>Start with installation, requirements, and project startup</h3>
          </div>

          <div className="docs-card-grid">
            {gettingStartedCards.map((card) => (
              <div key={card.title} className="doc-card glass-card">
                <h4>{card.title}</h4>
                <ul>
                  {card.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">User Guide</p>
            <h3>Role-based guidance for customers, analysts, and administrators</h3>
          </div>

          <div className="guide-layout">
            <div className="guide-tabs">
              {userGuides.map((guide) => (
                <button
                  key={guide.title}
                  type="button"
                  className={`guide-tab ${selectedGuide === guide.title ? 'active' : ''}`}
                  onClick={() => setSelectedGuide(guide.title)}
                >
                  {guide.title}
                </button>
              ))}
            </div>

            <div className="doc-card glass-card">
              <h4>{selectedGuideItem.title}</h4>
              <ul>
                {selectedGuideItem.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Developer Guide</p>
            <h3>Understand the core stack behind IntelSense AI</h3>
          </div>

          <div className="docs-card-grid">
            {developerGuides.map((guide) => (
              <div key={guide.title} className="doc-card glass-card">
                <h4>{guide.title}</h4>
                <ul>
                  {guide.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section" id="api-docs">
          <div className="section-heading">
            <p className="section-label">API Documentation</p>
            <h3>Explore public endpoints with example requests and responses</h3>
          </div>

          <div className="api-list">
            {filteredApis.length ? filteredApis.map((endpoint) => (
              <article key={`${endpoint.name}-${endpoint.endpoint}`} className="api-card glass-card">
                <div className="api-card-header">
                  <span className={`api-method ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                  <strong>{endpoint.endpoint}</strong>
                </div>
                <p>{endpoint.description}</p>
                <div className="api-meta">
                  <div>
                    <h5>Headers</h5>
                    <pre>{endpoint.headers.join('\n')}</pre>
                  </div>
                  <div>
                    <h5>Body</h5>
                    <pre>{endpoint.body}</pre>
                  </div>
                </div>
                <div className="api-sample">
                  <h5>Example Response</h5>
                  <pre>{endpoint.response}</pre>
                  <button type="button" onClick={() => handleCopy(endpoint.response)}>
                    {copiedEndpoint === endpoint.response ? 'Copied' : 'Copy Sample'}
                  </button>
                </div>
              </article>
            )) : <div className="doc-card glass-card">No matching API documentation.</div>}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">AI Service Documentation</p>
            <h3>Understand the intelligent pipeline behind every prediction</h3>
          </div>

          <div className="ai-doc-grid">
            <div className="doc-card glass-card">
              <h4>Pipeline Flow</h4>
              <div className="timeline-flow">
                {aiPipeline.map((step, index) => (
                  <div key={step} className="timeline-step">
                    <span>{step}</span>
                    {index < aiPipeline.length - 1 && <em>↓</em>}
                  </div>
                ))}
              </div>
            </div>

            <div className="doc-card glass-card">
              <h4>Model Information</h4>
              <ul>
                {modelInfo.map((item) => (
                  <li key={item.label}><strong>{item.label}:</strong> {item.value}</li>
                ))}
              </ul>
            </div>

            <div className="doc-card glass-card">
              <h4>AI Endpoints</h4>
              <ul>
                {aiEndpoints.map((endpoint) => (
                  <li key={endpoint}>{endpoint}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Database Documentation</p>
            <h3>Inspect the core entities powering the platform</h3>
          </div>

          <div className="db-layout">
            <div className="guide-tabs">
              {databaseTables.map((table) => (
                <button
                  key={table.name}
                  type="button"
                  className={`guide-tab ${selectedTable === table.name ? 'active' : ''}`}
                  onClick={() => setSelectedTable(table.name)}
                >
                  {table.name}
                </button>
              ))}
            </div>

            <div className="doc-card glass-card">
              <h4>{selectedTableInfo.name}</h4>
              <p>{selectedTableInfo.details}</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">System Architecture</p>
            <h3>Understand how the platform layers work together</h3>
          </div>

          <div className="architecture-doc-grid">
            <div className="guide-tabs architecture-tabs">
              {architectureComponents.map((component) => (
                <button
                  key={component.name}
                  type="button"
                  className={`guide-tab ${selectedArchitecture === component.name ? 'active' : ''}`}
                  onClick={() => setSelectedArchitecture(component.name)}
                >
                  {component.name}
                </button>
              ))}
            </div>

            <div className="doc-card glass-card">
              <h4>{selectedArchitectureInfo.name}</h4>
              <p>{selectedArchitectureInfo.purpose}</p>
              <ul>
                {selectedArchitectureInfo.tech.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Deployment Guide</p>
            <h3>Choose the right deployment path for your environment</h3>
          </div>

          <div className="docs-card-grid">
            {deploymentModes.map((mode) => (
              <div key={mode.title} className="doc-card glass-card">
                <h4>{mode.title}</h4>
                <ul>
                  {mode.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">FAQ</p>
            <h3>Common questions answered clearly</h3>
          </div>

          <div className="faq-stack">
            {faqs.map((item, index) => (
              <div key={item.q} className={`faq-item glass-card ${openFaq === index ? 'open' : ''}`}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{item.q}</span>
                  <strong>{openFaq === index ? '−' : '+'}</strong>
                </button>
                {openFaq === index && <p>{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Support Center</p>
            <h3>Get help from documentation, community, and support channels</h3>
          </div>

          <div className="docs-card-grid">
            {supportItems.map((item) => (
              <div key={item} className="doc-card glass-card">
                <h4>{item}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready to explore more?</p>
              <h3>Jump into the API guide, the AI model docs, or the deployment playbooks.</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/enterprise">Explore Enterprise</Link>
              <a className="ghost-btn" href="#api-docs">View API Docs</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>IntelSense AI</h4>
            <a href="/features">Features</a>
            <a href="/enterprise">Enterprise</a>
            <a href="/documentation">Docs</a>
          </div>
          <div>
            <h4>Developers</h4>
            <a href="#api-docs">API Reference</a>
            <Link to="/about">Version History</Link>
            <Link to="/documentation">Download Center</Link>
          </div>
          <div>
            <h4>Support</h4>
            <a href="mailto:support@intelsense.ai">Support</a>
            <Link to="/contact">Community</Link>
            <Link to="/contact">Report Issue</Link>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI</p>
      </footer>
    </div>
  );
}
