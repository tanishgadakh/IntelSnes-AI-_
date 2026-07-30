import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-shell premium-auth">
      <div className="auth-card auth-card-glass">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Forgot password</h1>
            <p>Enter your email to receive password recovery instructions.</p>
          </div>
        </div>
        <form>
          <label>Email address</label>
          <input type="email" placeholder="you@example.com" />
          <button type="submit" className="primary-btn">Send recovery email</button>
          <p className="auth-link">Remembered your password? <Link to="/login">Return to login</Link></p>
        </form>
      </div>
    </div>
  );
}
