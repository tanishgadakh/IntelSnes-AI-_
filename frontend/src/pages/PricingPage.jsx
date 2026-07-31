import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Ideal for pilots and academic teams exploring the platform.',
    features: ['Basic dashboard', 'Core AI insights', 'Community support']
  },
  {
    name: 'Professional',
    price: '₹999/month',
    description: 'For growing companies needing analytics, reporting, and faster workflows.',
    features: ['Advanced analytics', 'Rich reports', 'Priority support', 'Team collaboration'],
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For scaled organizations that need secure deployment and integrations.',
    features: ['Unlimited users', 'Dedicated support', 'Cloud deployment', 'Custom integrations']
  }
];

export default function PricingPage() {
  return (
    <div className="public-page-shell">
      <header className="landing-header features-header">
        <div className="brand-block nav-brand">
          <div className="brand-mark nav-mark">🧠</div>
          <div className="brand-copy">
            <h1>IntelSense AI</h1>
            <p>Pricing</p>
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
            <p className="section-label">Pricing</p>
            <h3>Flexible plans for pilots, teams, and enterprise organizations</h3>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className={`pricing-card glass-card ${plan.featured ? 'featured' : ''}`}>
                <span className="pricing-badge">{plan.name}</span>
                <h4>{plan.price}</h4>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link className="button-link" to="/register">Choose Plan</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
