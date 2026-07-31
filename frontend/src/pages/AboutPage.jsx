import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="public-page-shell">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>About</p>
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
            <p className="section-label">About IntelSense AI</p>
            <h3>Bringing AI-driven customer intelligence to modern enterprises</h3>
          </div>

          <div className="doc-card glass-card">
            <p>
              IntelSense AI is a modern AI platform that helps organizations understand customer feedback, surface trends,
              detect emotion, and make faster decisions using explainable analytics and role-based dashboards.
            </p>
            <p>
              The platform combines a React marketing and portal experience, a Spring Boot business backend, and a FastAPI
              AI service that supports sentiment analysis, keyword extraction, and operational reporting.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
