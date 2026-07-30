import { Link } from 'react-router-dom';

const features = [
  'Enterprise-grade sentiment and emotion analysis',
  'Actionable summaries with intelligent recommendations',
  'Live dashboards, history, and assistant insights'
];

export default function LandingPage() {
  return (
    <div className="landing-shell premium-landing">
      <header className="landing-header">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>IntelSense AI</h1>
            <p>AI-driven customer intelligence for product and support teams</p>
          </div>
        </div>
        <div className="landing-actions">
          <Link className="ghost-btn" to="/login">Sign in</Link>
          <Link className="button-link" to="/register">Create account</Link>
        </div>
      </header>

      <section className="hero-card landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Powered by artificial intelligence</p>
          <h2>From raw feedback to executive-ready insights.</h2>
          <p className="hero-description">IntelSense AI combines sentiment, emotion, aspect, and recommendation analysis into one polished experience for teams that need actionable intelligence fast.</p>
          <div className="landing-actions hero-actions">
            <Link className="button-link" to="/register">Start your trial</Link>
            <Link className="ghost-btn" to="/dashboard">Explore dashboard</Link>
          </div>
          <div className="hero-badges">
            <span>Modern analytics</span>
            <span>Secure enterprise auth</span>
            <span>Live assistant support</span>
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
        <div className="panel feature-card">
          <h3>AI-powered analysis</h3>
          <p>Extract sentiment, identify emotions, detect key topics, and recommend next steps automatically.</p>
        </div>
        <div className="panel feature-card">
          <h3>Real-time analytics</h3>
          <p>See how customer satisfaction changes over time with easy filters for product, team, and timeframe.</p>
        </div>
        <div className="panel feature-card">
          <h3>Trusted workflow</h3>
          <p>All insights are saved, searchable, and exportable so teams can move from analysis to action quickly.</p>
        </div>
      </section>
    </div>
  );
}
