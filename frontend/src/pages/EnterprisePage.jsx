import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const enterpriseReasons = [
  { icon: '⚙️', title: 'AI Automation', description: 'Analyze thousands of reviews automatically and turn raw feedback into clear operational insight.' },
  { icon: '🔒', title: 'Enterprise Security', description: 'JWT, RBAC, encryption, and audit logs help protect every step of the intelligence workflow.' },
  { icon: '📊', title: 'Real-Time Analytics', description: 'Move from static reports to live dashboards that surface trend shifts and performance signals in seconds.' },
  { icon: '🔌', title: 'Easy Integration', description: 'Expose powerful REST APIs and integrate with modern business systems through Spring Boot and FastAPI.' },
  { icon: '☁️', title: 'Cloud Ready', description: 'Deploy on AWS, Azure, Docker, or Kubernetes with flexible architecture and enterprise scale.' },
  { icon: '🛡️', title: 'High Availability', description: 'Designed for reliable service, fast recovery, and resilient operational continuity.' }
];

const industries = [
  { name: 'Retail', description: 'Customer reviews, product ratings, delivery feedback, and shopping experience insights.', useCases: ['Customer Reviews', 'Product Ratings', 'Delivery Feedback', 'Shopping Experience'] },
  { name: 'Healthcare', description: 'Patient sentiment, care quality, support experience, and operational improvements.', useCases: ['Patient Feedback', 'Care Quality', 'Support Experience', 'Operations'] },
  { name: 'Education', description: 'Learner sentiment, service quality, experience monitoring, and satisfaction trends.', useCases: ['Student Experience', 'Course Feedback', 'Support Quality', 'Retention'] },
  { name: 'Finance', description: 'Trust, service quality, onboarding friction, and customer sentiment benchmarks.', useCases: ['Service Quality', 'Trust Signals', 'Client Feedback', 'Risk Monitoring'] },
  { name: 'Insurance', description: 'Claims sentiment, service interactions, satisfaction monitoring, and churn prevention.', useCases: ['Claims Experience', 'Policy Feedback', 'Support Quality', 'Risk Forecasting'] },
  { name: 'Manufacturing', description: 'Field service quality, product reliability, and customer support sentiment analysis.', useCases: ['Product Quality', 'Field Support', 'Operations', 'Reliability'] },
  { name: 'Hospitality', description: 'Guest satisfaction, service sentiment, delivery quality, and operational insights.', useCases: ['Guest Reviews', 'Service Quality', 'Amenities', 'Retention'] },
  { name: 'Government', description: 'Service quality, satisfaction monitoring, and public support sentiment intelligence.', useCases: ['Citizen Experience', 'Service Delivery', 'Public Sentiment', 'Trust'] },
  { name: 'E-Commerce', description: 'Checkout sentiment, support quality, product issues, and buyer experience insights.', useCases: ['Checkout', 'Shipping', 'Support', 'Product Quality'] },
  { name: 'Telecommunications', description: 'Customer churn signals, support sentiment, service quality, and retention analytics.', useCases: ['Service Quality', 'Churn Risks', 'Support', 'Network Experience'] }
];

const businessBenefits = [
  { value: '80%', label: 'Reduction in Manual Analysis' },
  { value: '5×', label: 'Faster Business Decisions' },
  { value: '99.2%', label: 'AI Accuracy' },
  { value: '120ms', label: 'Prediction Speed' }
];

const architectureLayers = [
  { name: 'Employees', detail: 'Operational teams manage dashboards and review AI recommendations for daily decisions.' },
  { name: 'Customers', detail: 'Customer signals flow into the system through tickets, reviews, and feedback channels.' },
  { name: 'Managers', detail: 'Leadership tracks trends, capacity, and service sentiment across business units.' },
  { name: 'React Web Application', detail: 'Modern UI layer for dashboards, reports, and cross-functional workspaces.' },
  { name: 'Spring Boot API Gateway', detail: 'Handles orchestration, routing, authentication, and secure business logic.' },
  { name: 'JWT Authentication', detail: 'Verifies users and authorizes access by role and permission.' },
  { name: 'FastAPI AI Engine', detail: 'Runs AI classification and business processing workloads behind secure endpoints.' },
  { name: 'RoBERTa Model', detail: 'Applies context-aware sentiment and language analysis across feedback records.' },
  { name: 'MySQL Database', detail: 'Stores analytics data, prediction results, logs, and operational metadata.' },
  { name: 'Reports & Dashboards', detail: 'Presents measurable insights, trend lines, and executive-ready reports.' }
];

const securityDomains = [
  { title: 'Authentication', items: ['JWT', 'Refresh Tokens', 'Session Management'] },
  { title: 'Authorization', items: ['Admin', 'Analyst', 'Customer'] },
  { title: 'Data Protection', items: ['BCrypt', 'HTTPS', 'Encrypted APIs', 'Input Validation'] },
  { title: 'Audit', items: ['Activity Logs', 'Login History', 'AI Usage', 'System Events'] }
];

const scalabilitySteps = ['100 Users', '1,000 Users', '10,000 Users', '100,000 Users', '1 Million Reviews'];

const integrations = ['React', 'Spring Boot', 'FastAPI', 'MySQL', 'Python', 'Docker', 'AWS', 'Azure', 'GitHub', 'REST API'];

const deploymentModes = [
  { name: 'Local Deployment', details: 'Windows, Linux, Mac', features: ['Desktop friendly', 'Controlled demo setup', 'Private testing'] },
  { name: 'Docker Deployment', details: 'Docker Compose, Containers, Microservices', features: ['Scalable containers', 'Easy orchestration', 'Fast deployment'] },
  { name: 'Cloud Deployment', details: 'AWS, Azure, Google Cloud', features: ['Enterprise-grade scale', 'Global availability', 'Production ready'] }
];

const supportItems = ['24×7 Support', 'Technical Documentation', 'Training', 'Dedicated Deployment', 'Software Updates', 'Priority Assistance'];

const defaultMetrics = {
  organizations: 250,
  activeUsers: 50000,
  aiAccuracy: 99.2,
  uptime: 99.9
};

const defaultIndustries = [
  { name: 'Retail', description: 'Customer reviews and purchase sentiment monitoring.', useCases: ['Customer Reviews', 'Product Ratings', 'Delivery Feedback'] },
  { name: 'Healthcare', description: 'Patient feedback and support experience analysis.', useCases: ['Patient Feedback', 'Care Quality', 'Support Experience'] },
  { name: 'Finance', description: 'Service quality and trust monitoring for customer journeys.', useCases: ['Trust Signals', 'Service Quality', 'Client Feedback'] }
];

const defaultDeployments = [
  { name: 'Local Deployment', details: 'Windows, Linux, Mac', features: ['Desktop friendly', 'Controlled demo setup'] },
  { name: 'Docker Deployment', details: 'Docker Compose, Containers, Microservices', features: ['Scalable containers', 'Fast deployment'] },
  { name: 'Cloud Deployment', details: 'AWS, Azure, Google Cloud', features: ['Enterprise scale', 'Production ready'] }
];

function EnterprisePage() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [industriesData, setIndustriesData] = useState(defaultIndustries);
  const [deploymentOptions, setDeploymentOptions] = useState(defaultDeployments);
  const [selectedIndustry, setSelectedIndustry] = useState('Retail');
  const [activeLayer, setActiveLayer] = useState(architectureLayers[0].name);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [metricsResponse, industriesResponse, deploymentResponse] = await Promise.all([
          api.get('/api/public/enterprise-metrics'),
          api.get('/api/public/industries'),
          api.get('/api/public/deployment-options')
        ]);

        if (metricsResponse?.data) setMetrics(metricsResponse.data);
        if (industriesResponse?.data?.length) setIndustriesData(industriesResponse.data);
        if (deploymentResponse?.data?.length) setDeploymentOptions(deploymentResponse.data);
      } catch (error) {
        console.error('Enterprise data unavailable, using default content.', error);
      }
    };

    fetchPublicData();
  }, []);

  const selectedIndustryInfo = useMemo(
    () => industriesData.find((industry) => industry.name === selectedIndustry) || industriesData[0],
    [selectedIndustry, industriesData]
  );

  const activeLayerDetail = useMemo(
    () => architectureLayers.find((layer) => layer.name === activeLayer) || architectureLayers[0],
    [activeLayer]
  );

  return (
    <div className="enterprise-page">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Enterprise Platform</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/ai-technology">AI Technology</Link>
          <Link to="/dashboard-preview">Dashboard</Link>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Schedule Demo</Link>
        </div>
      </header>

      <main>
        <section className="enterprise-hero">
          <div className="enterprise-hero-copy">
            <span className="eyebrow-pill">Enterprise AI Platform</span>
            <h2>Helping organizations turn millions of customer feedback records into business intelligence.</h2>
            <div className="feature-list-inline">
              <span>✔ Secure</span>
              <span>✔ Scalable</span>
              <span>✔ AI Powered</span>
              <span>✔ Cloud Ready</span>
            </div>
            <div className="hero-buttons">
              <Link className="button-link" to="/register">Schedule Demo</Link>
              <a className="ghost-btn" href="#contact">Contact Sales</a>
            </div>
          </div>

          <div className="enterprise-visual" aria-label="Enterprise network illustration">
            <div className="network-orb orb-one" />
            <div className="network-orb orb-two" />
            <div className="enterprise-cloud glass-card">
              <div className="cloud-header">
                <span>IntelSense AI</span>
                <strong>Enterprise Cloud</strong>
              </div>
              <div className="cloud-grid">
                <div className="cloud-building">🏢</div>
                <div className="cloud-building">🏢</div>
                <div className="cloud-building">🏢</div>
              </div>
              <div className="cloud-dashboards">
                <div className="mini-panel"><span>Users</span><strong>{metrics.activeUsers.toLocaleString()}</strong></div>
                <div className="mini-panel"><span>Uptime</span><strong>{metrics.uptime}%</strong></div>
              </div>
            </div>
            <div className="floating-info info-one">99.9% uptime</div>
            <div className="floating-info info-two">AI analytics</div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Why Enterprises Choose IntelSense AI</p>
            <h3>Built for secure, scalable, AI-driven operational decisions</h3>
          </div>

          <div className="enterprise-grid">
            {enterpriseReasons.map((item) => (
              <article key={item.title} className="enter-reason glass-card">
                <div className="feature-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Industries We Serve</p>
            <h3>Purpose-built intelligence for complex business environments</h3>
          </div>

          <div className="industry-selector">
            {industriesData.map((industry) => (
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

          <div className="industry-detail glass-card">
            <div>
              <p className="section-label">Selected Industry</p>
              <h4>{selectedIndustryInfo.name}</h4>
              <p>{selectedIndustryInfo.description}</p>
            </div>
            <ul>
              {selectedIndustryInfo.useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Business Benefits</p>
            <h3>Operational efficiency that scales with your business</h3>
          </div>

          <div className="benefit-grid">
            {businessBenefits.map((item) => (
              <div key={item.label} className="benefit-card glass-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Enterprise Architecture</p>
            <h3>Secure, modular architecture for mission-critical AI operations</h3>
          </div>

          <div className="architecture-layout">
            <div className="architecture-stream">
              {architectureLayers.map((layer) => (
                <button
                  key={layer.name}
                  type="button"
                  className={`architecture-layer ${activeLayer === layer.name ? 'active' : ''}`}
                  onClick={() => setActiveLayer(layer.name)}
                >
                  <span>{layer.name}</span>
                </button>
              ))}
            </div>

            <div className="architecture-detail glass-card">
              <p className="section-label">Layer Details</p>
              <h4>{activeLayerDetail.name}</h4>
              <p>{activeLayerDetail.detail}</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Security & Compliance</p>
            <h3>Built to support enterprise trust and governance</h3>
          </div>

          <div className="security-grid">
            {securityDomains.map((area) => (
              <div key={area.title} className="security-card glass-card">
                <h4>{area.title}</h4>
                <div className="security-items">
                  {area.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Scalability & Performance</p>
            <h3>Designed to grow from small teams to enterprise scale</h3>
          </div>

          <div className="scalability-flow">
            {scalabilitySteps.map((step, index) => (
              <div key={step} className="scale-step glass-card">
                <span>{step}</span>
                {index < scalabilitySteps.length - 1 && <em>↓</em>}
              </div>
            ))}
          </div>

          <div className="scale-summary glass-card">
            <p className="section-label">Scaling Stack</p>
            <p>Horizontal Scaling • Docker • Load Balancer • Cloud Deployment</p>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Integration Ecosystem</p>
            <h3>Connect IntelSense AI to the systems your organization already uses</h3>
          </div>

          <div className="integration-grid">
            {integrations.map((item) => (
              <div key={item} className="integration-pill glass-card" title={`${item} integration ready`}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Deployment Options</p>
            <h3>Choose the deployment shape that matches your operational needs</h3>
          </div>

          <div className="deployment-grid">
            {deploymentOptions.map((option) => (
              <div key={option.name} className="deployment-card glass-card">
                <span className="deployment-name">{option.name}</span>
                <p>{option.details}</p>
                <ul>
                  {option.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Enterprise Support</p>
            <h3>Support that keeps your business moving</h3>
          </div>

          <div className="support-grid">
            {supportItems.map((item) => (
              <div key={item} className="support-card glass-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Customer Success Metrics</p>
            <h3>Reliable business outcomes for real enterprise teams</h3>
          </div>

          <div className="success-grid">
            <div className="success-card glass-card">
              <span>Customer Satisfaction</span>
              <strong>↑ 92%</strong>
            </div>
            <div className="success-card glass-card">
              <span>AI Accuracy</span>
              <strong>99.2%</strong>
            </div>
            <div className="success-card glass-card">
              <span>Prediction Time</span>
              <strong>120ms</strong>
            </div>
            <div className="success-card glass-card">
              <span>Enterprise Clients</span>
              <strong>250+</strong>
            </div>
          </div>
        </section>

        <section className="cta-section" id="contact">
          <div className="cta-panel glass-card">
            <div>
              <p className="section-label">Ready for Enterprise AI?</p>
              <h3>Bring AI-powered customer intelligence to your organization.</h3>
            </div>
            <div className="hero-buttons cta-buttons">
              <Link className="button-link" to="/register">Schedule a Live Demo</Link>
              <a className="ghost-btn" href="mailto:sales@intelsense.ai">Contact Sales</a>
              <a className="ghost-btn" href="/download">Download Brochure</a>
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
            <a href="/dashboard-preview">Dashboard</a>
          </div>
          <div>
            <h4>Enterprise</h4>
            <a href="#">Security</a>
            <a href="#">Deployment</a>
            <a href="#">Support</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="mailto:sales@intelsense.ai">Sales</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 IntelSense AI</p>
      </footer>
    </div>
  );
}

export default EnterprisePage;
