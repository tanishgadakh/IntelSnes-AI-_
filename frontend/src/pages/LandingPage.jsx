import { Link } from 'react-router-dom';

const features = [
  'Enterprise-grade sentiment and emotion analysis',
  'Actionable summaries and recommendation insights',
  'Fast dashboarding for product, support, and leadership teams'
];

export default function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>IntelSense AI</h1>
            <p>AI customer intelligence platform</p>
          </div>
        </div>
        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Sign in</Link>
          <Link className="button-link" to="/register">Create account</Link>
        </div>
      </header>

      <section className="hero-card landing-hero">
        <div>
          <p className="eyebrow">Built for modern analytics teams</p>
          <h2>Turn raw customer feedback into executive-ready intelligence.</h2>
          <p>Unify reviews, predictions, analytics, and team workflows in a premium AI workspace designed for growth.</p>
          <div className="landing-actions">
            <Link className="button-link" to="/register">Get started</Link>
            <Link className="ghost-btn" to="/dashboard">Open demo workspace</Link>
          </div>
        </div>
        <div className="panel landing-stats">
          <h3>Platform highlights</h3>
          <ul>
            {features.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="landing-grid">
        <div className="panel">
          <h3>AI Workspace</h3>
          <p>Analyze reviews, inspect sentiment, emotion, aspects, keywords, and recommendations in a single flow.</p>
        </div>
        <div className="panel">
          <h3>Analytics</h3>
          <p>Track trends across time, product, department, and language with dashboards built for leadership.</p>
        </div>
        <div className="panel">
          <h3>Enterprise-ready</h3>
          <p>Secure auth, role-aware workflows, and polished experience for product, support, and operations teams.</p>
        </div>
      </section>
    </div>
  );
}
