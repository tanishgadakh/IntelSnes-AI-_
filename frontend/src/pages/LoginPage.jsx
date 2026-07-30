import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { username, password });
      const token = res.data.token || '';
      if (rememberMe) {
        localStorage.setItem('intelsense-token', token);
      }
      onLogin(token);
      navigate('/dashboard');
    } catch {
      setError('Unable to sign in. Please verify your backend and MySQL are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-card auth-card-glass">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>IntelSense AI</h1>
            <p>Secure analytics and AI-assisted insights</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          <label>Password</label>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <Link className="link-muted" to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? <span className="button-spinner">Signing in...</span> : 'Login'}
          </button>
          <p className="auth-link">New here? <Link to="/register">Create an account</Link></p>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
