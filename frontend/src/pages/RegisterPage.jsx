import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function RegisterPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/api/auth/register', { username, password });
      setMessage('Account created. You can now sign in.');
      setTimeout(() => navigate('/login'), 900);
    } catch {
      setMessage('Registration failed. Check the backend connection.');
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
            <h1>Create account</h1>
            <p>Join the IntelSense AI workspace</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
          <p className="auth-link"><Link to="/login">Already have an account?</Link></p>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
