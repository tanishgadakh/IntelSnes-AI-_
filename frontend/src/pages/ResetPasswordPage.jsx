import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import aiClient from '../api/aiClient';

function calculatePasswordStrength(password) {
  let score = 0;
  const feedback = [];
  
  if (password.length < 8) {
    feedback.push('At least 8 characters');
  } else {
    score += 1;
  }
  
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1; else feedback.push('Add lowercase');
  if (/[A-Z]/.test(password)) score += 1; else feedback.push('Add uppercase');
  if (/[0-9]/.test(password)) score += 1; else feedback.push('Add numbers');
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1; else feedback.push('Add special char');
  
  let strength = 'weak';
  if (score >= 4) strength = 'good';
  if (score >= 5) strength = 'strong';
  if (score >= 6) strength = 'very_strong';
  
  return { score, strength, feedback };
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const strength = calculatePasswordStrength(password);

  useEffect(() => {
    // Verify token is valid on page load
    if (!token) {
      setTokenValid(false);
      setError('No reset token provided. Please use the link from the email.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (strength.score < 4) {
      setError(`Password not strong enough: ${strength.feedback.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await aiClient.post('/auth/password-reset/confirm', {
        token,
        new_password: password
      });
      
      if (response.status === 200) {
        setMessage('✓ Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.detail || 'Failed to reset password';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-shell premium-auth">
        <div className="auth-card auth-card-glass reset-card">
          <div className="brand-block">
            <div className="brand-mark">✗</div>
            <div>
              <h1>Invalid Reset Link</h1>
              <p>This password reset link is invalid or has expired.</p>
            </div>
          </div>
          <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>Please request a new password reset from the login page.</p>
          <Link to="/login" className="primary-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-card auth-card-glass reset-card">
        <div className="brand-block">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Reset Password</h1>
            <p>Enter a new secure password for your account.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="New password"
            disabled={submitting}
          />
          
          {password && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '0.25rem',
                marginBottom: '0.5rem'
              }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: i < strength.score ? (
                        strength.strength === 'very_strong' ? '#4caf50' :
                        strength.strength === 'strong' ? '#8bc34a' :
                        strength.strength === 'good' ? '#ffc107' : '#ff9800'
                      ) : '#ddd',
                      transition: 'background-color 0.2s'
                    }}
                  />
                ))}
              </div>
              <div style={{ color: 
                strength.strength === 'very_strong' ? '#4caf50' :
                strength.strength === 'strong' ? '#8bc34a' :
                strength.strength === 'good' ? '#ffc107' : '#ff9800'
              }}>
                Strength: <strong>{strength.strength}</strong>
              </div>
              {strength.feedback.length > 0 && (
                <div style={{ color: '#999', marginTop: '0.3rem' }}>
                  {strength.feedback.join(' • ')}
                </div>
              )}
            </div>
          )}

          <label style={{ marginTop: '1.5rem' }}>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm password"
            disabled={submitting}
          />
          
          {confirmPassword && password && confirmPassword === password && (
            <div style={{ color: '#4caf50', fontSize: '0.9rem', marginTop: '0.5rem' }}>✓ Passwords match</div>
          )}
          {confirmPassword && password && confirmPassword !== password && (
            <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>✗ Passwords do not match</div>
          )}

          <button 
            type="submit" 
            className="primary-btn" 
            disabled={submitting || !tokenValid}
            style={{ marginTop: '1.5rem' }}
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
          </button>

          {error && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>}
          {message && <p style={{ color: '#4caf50', marginTop: '1rem' }}>{message}</p>}

          <p className="auth-link" style={{ marginTop: '1.5rem' }}>
            Remember your password? <Link to="/login">Return to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
