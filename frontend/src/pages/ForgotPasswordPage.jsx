import { useState } from 'react';
import { Link } from 'react-router-dom';
import aiClient from '../api/aiClient';
import Toast from '../components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await aiClient.post('/auth/password-reset', { email });
      setSuccess(true);
      setMessage('✓ Reset link sent! Check your email. Link is valid for 5 minutes.');
    } catch (err) {
      // silently succeed even if user doesn't exist (security best practice)
      setSuccess(true);
      setMessage('✓ If an account exists for this email, a reset link has been sent.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-shell premium-auth">
        <div className="auth-card auth-card-glass forgot-card">
          <div className="brand-block">
            <div className="brand-mark">✓</div>
            <div>
              <h1>Check Your Email</h1>
              <p>We've sent a password reset link.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ color: '#4caf50', marginBottom: '1.5rem' }}>
              {message}
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Didn't receive the email? Check your spam folder or try again with a different email.
            </p>
            <Link to="/login" className="primary-btn">Return to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-card auth-card-glass forgot-card">
        <div className="brand-block">
          <div className="brand-mark">🔑</div>
          <div>
            <h1>Forgot Password</h1>
            <p>Enter your email and we'll send a secure reset link (valid for 5 minutes).</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@company.com"
            disabled={loading}
          />
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {error && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>}
          <p className="auth-link">Remembered your password? <Link to="/login">Return to login</Link></p>
        </form>
      </div>
    </div>
  );
}
