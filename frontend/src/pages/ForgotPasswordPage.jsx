import { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Please enter your email address to continue.');
      return;
    }
    setMessage('If an account exists for this email, a reset link has been sent.');
  };

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-card auth-card-glass forgot-card">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Forgot Password</h1>
            <p>Enter your email and we will send a reset link.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          <button type="submit" className="primary-btn">Send Reset Link</button>
          <p className="auth-link">Remembered your password? <Link to="/login">Return to login</Link></p>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
