import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setMessage('Please provide both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('Your password has been reset. Please sign in with your new password.');
  };

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-card auth-card-glass reset-card">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Reset Password</h1>
            <p>Enter a new password to secure your account.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
          <button type="submit" className="primary-btn">Reset Password</button>
          <p className="auth-link">Remembered your password? <Link to="/login">Return to login</Link></p>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
