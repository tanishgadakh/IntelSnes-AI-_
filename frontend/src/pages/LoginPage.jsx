import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { parseJwt } from '../utils/jwt';
import Toast from '../components/Toast';

function normalizeRole(role) {
  return String(role || '').toUpperCase();
}

function getDashboardPath(role) {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'ANALYST':
      return '/analyst/dashboard';
    case 'CUSTOMER':
      return '/customer/dashboard';
    default:
      return '/dashboard';
  }
}

const stageMessages = [
  'Login successful',
  'Loading your workspace...',
  'Checking permissions...',
  'Preparing AI services...',
  'Fetching analytics...'
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('demo@company.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stageIndex, setStageIndex] = useState(-1);
  const [loginComplete, setLoginComplete] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loginComplete && stageIndex === stageMessages.length - 1) {
      const timer = setTimeout(() => {
        setStageIndex(-1);
        setLoginComplete(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loginComplete, stageIndex]);

  const startLoginSequence = (authPayload) => {
    setLoginComplete(true);
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((current) => {
        if (current >= stageMessages.length - 1) {
          clearInterval(interval);
          onLogin(authPayload);
          navigate(getDashboardPath(authPayload.role));
          return current;
        }
        return current + 1;
      });
    }, 850);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { username: email, password });
      const token = res.data?.token || '';
      const role = normalizeRole(res.data?.role || parseJwt(token)?.role || 'ANALYST');
      const authPayload = { token, role, username: res.data?.username || email };

      if (rememberMe) {
        localStorage.setItem('intelsense-token', token);
        localStorage.setItem('intelsense-role', role);
        localStorage.setItem('intelsense-username', authPayload.username);
      } else {
        localStorage.removeItem('intelsense-token');
        localStorage.removeItem('intelsense-role');
        localStorage.removeItem('intelsense-username');
      }

      startLoginSequence(authPayload);
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.detail || 'Unable to sign in. Please verify your backend is running.';
      setErrorMessage(message);
      setToastMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider) => {
    setToastMessage(`Social login with ${provider} is not enabled in this demo.`);
  };

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-grid">
        <section className="auth-left">
          <div className="auth-hero">
            <span className="eyebrow-pill">IntelSense AI</span>
            <h1>Welcome Back</h1>
            <p>Sign in to your Enterprise Workspace</p>
          </div>
          <div className="auth-decor">
            <div className="node-grid">
              <span className="node node-large" />
              <span className="node node-small" />
              <span className="node node-glow" />
            </div>
            <div className="floating-card glass-card">
              <p>Live analytics</p>
              <strong>92%</strong>
            </div>
            <div className="floating-card glass-card" style={{ top: '14rem', left: '12rem' }}>
              <p>AI predictions</p>
              <strong>Enabled</strong>
            </div>
          </div>
          <div className="auth-left-footer">
            <p>Dark glassmorphism, animated nodes, floating insights, and enterprise-grade styling create a premium sign-in experience.</p>
          </div>
        </section>

        <section className="auth-right auth-card auth-card-glass">
          <div className="brand-block">
            <div className="brand-mark">✦</div>
            <div>
              <h1>Sign in</h1>
              <p>Access your role-based AI workspace.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
            <label>Password</label>
            <div className="password-row">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me
              </label>
              <Link className="link-muted" to="/forgot-password">Forgot Password?</Link>
            </div>
            <button type="submit" className="primary-btn" disabled={loading || loginComplete}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="auth-divider">OR</div>
            <div className="social-login-grid">
              <button type="button" className="social-button google" onClick={() => handleSocialClick('Google')}>Continue with Google</button>
              <button type="button" className="social-button microsoft" onClick={() => handleSocialClick('Microsoft')}>Continue with Microsoft</button>
            </div>
            <p className="auth-link">Don't have an account? <Link to="/register">Create Account</Link></p>
          </form>

          {loginComplete && (
            <div className="stage-card">
              <h4>✔ Login Successful</h4>
              <div className="stage-list">
                {stageMessages.map((message, index) => (
                  <div key={message} className={`stage-item ${stageIndex >= index ? 'active' : ''}`}>
                    <span>{message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorMessage && <p className="error">{errorMessage}</p>}
        </section>
      </div>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} duration={3200} />
    </div>
  );
}
