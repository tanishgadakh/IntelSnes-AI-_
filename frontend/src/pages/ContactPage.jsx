import { Link } from 'react-router-dom';

export default function ContactPage() {
  return (
    <div className="public-page-shell">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Contact</p>
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
            <p className="section-label">Contact IntelSense AI</p>
            <h3>Talk to our team about product discovery, demos, or enterprise deployment</h3>
          </div>

          <div className="doc-card glass-card">
            <p>Email: support@intelsense.ai</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Bengaluru, India</p>
            <Link className="button-link" to="/register">Book a Demo</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
