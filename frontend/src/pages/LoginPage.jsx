import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
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
      localStorage.setItem('intelsense-token', token);
      onLogin(token);
      navigate('/dashboard');
    } catch {
      setError('Unable to sign in. Please verify your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>IntelSense AI</h1>
            <p>Enterprise Customer Intelligence Platform</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <p className="auth-link">New here? <Link to="/register">Create an account</Link></p>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
