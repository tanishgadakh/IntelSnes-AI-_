import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What does IntelSense AI do?',
    answer: 'It analyzes customer feedback, sentiment, emotion, keywords, and recommendation signals for enterprise teams.'
  },
  {
    question: 'Do I need to log in to view the product?',
    answer: 'No. The public website is available to visitors, while dashboards and advanced workflows require authentication.'
  },
  {
    question: 'Which roles are supported?',
    answer: 'Admin, Analyst, and Customer roles are supported with role-based dashboards and access control.'
  },
  {
    question: 'Can the platform be deployed in the cloud?',
    answer: 'Yes. The enterprise experience supports cloud, container, and local deployment paths.'
  }
];

export default function FaqPage() {
  return (
    <div className="public-page-shell">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>FAQ</p>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/solutions">Solutions</Link>
          <Link to="/ai-technology">AI Technology</Link>
          <Link to="/enterprise">Enterprise</Link>
          <Link to="/documentation">Docs</Link>
        </nav>

        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Login</Link>
          <Link className="button-link" to="/register">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="features-section">
          <div className="section-heading">
            <p className="section-label">Frequently Asked Questions</p>
            <h3>Common questions about the product, experience, and platform flow</h3>
          </div>

          <div className="faq-stack">
            {faqs.map((item) => (
              <div key={item.question} className="faq-item glass-card">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
