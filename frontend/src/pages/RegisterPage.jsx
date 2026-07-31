import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Toast from '../components/Toast';

const roleOptions = [
  {
    value: 'CUSTOMER',
    title: 'Customer',
    icon: '👤',
    details: ['Submit feedback', 'Track AI insights', 'Instant access']
  },
  {
    value: 'ANALYST',
    title: 'Analyst',
    icon: '📊',
    details: ['Analyze feedback', 'Generate reports', 'Admin approval']
  }
];

const featureItems = [
  'AI Sentiment Analysis',
  'Role-Based Dashboards',
  'Secure JWT Authentication',
  'Enterprise Feedback Intelligence'
];

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [reasonForAccess, setReasonForAccess] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [registeredRole, setRegisteredRole] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length >= 12) score += 1;
    return score;
  }, [password]);

  const passwordStrength = useMemo(() => {
    if (passwordScore <= 2) return 'Weak';
    if (passwordScore <= 4) return 'Medium';
    return 'Strong';
  }, [passwordScore]);

  const strengthBars = useMemo(() => Array.from({ length: 5 }, (_, index) => index < passwordScore), [passwordScore]);

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasLength = password.length >= 8;
  const hasLongLength = password.length >= 12;

  const isAnalyst = selectedRole === 'ANALYST';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setToastMessage('Please complete all required fields.');
      return;
    }
    if (isAnalyst && (!company || !department || !jobTitle || !experience || !reasonForAccess)) {
      setToastMessage('Please complete all analyst registration fields.');
      return;
    }
    if (password !== confirmPassword) {
      setToastMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setToastMessage('Please agree to the terms and privacy policy.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        username: email,
        email,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone || undefined,
        company: isAnalyst ? company : undefined,
        department: isAnalyst ? department : undefined,
        jobTitle: isAnalyst ? jobTitle : undefined,
        experience: isAnalyst ? experience : undefined,
        reasonForAccess: isAnalyst ? reasonForAccess : undefined,
        password,
        role: selectedRole
      });

      const userRole = response.data.role || selectedRole;
      const userStatus = response.data.status || 'PENDING';
      setRegisteredRole(userRole);
      setRegistrationStatus(userStatus);

      if (userStatus === 'ACTIVE' && onRegister) {
        onRegister({ token: response.data.token || '', role: userRole, username: response.data.username || email });
        navigate(userRole === 'CUSTOMER' ? '/customer/dashboard' : '/dashboard');
        return;
      }

      setRegistrationComplete(true);
      setToastMessage('');
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.detail || 'Registration failed. Please try again.';
      setToastMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const submitLabel = loading
    ? 'Processing...'
    : isAnalyst
      ? 'Submit Analyst Request'
      : 'Create Customer Account';

  if (registrationComplete) {
    const isActive = registrationStatus === 'ACTIVE';
    const title = isActive ? 'Registration Successful!' : 'Registration Request Submitted!';
    const body = isActive
      ? 'Welcome to IntelSense AI. Your customer account is ready to use.'
      : 'Your analyst request has been sent to the administrator for review.';
    const subtext = isActive
      ? 'You can now sign in and begin using your enterprise intelligence workspace.'
      : 'Status: 🟡 Pending Approval — estimated review time 24-48 hours. You will receive an email once approved.';

    return (
      <div className="auth-shell premium-auth">
        <div className="auth-card auth-card-glass verify-card">
          <div className="brand-block">
            <div className="brand-mark">✦</div>
            <div>
              <h1>{title}</h1>
              <p>{body}</p>
            </div>
          </div>
          <div className="verify-body">
            <div className="verify-envelope">{isActive ? '✅' : '⏳'}</div>
            <p>{subtext}</p>
            {isActive ? (
              <div className="button-group">
                <Link className="button-link" to="/customer/dashboard">Continue to dashboard</Link>
                <Link className="ghost-btn" to="/login">Continue to login</Link>
              </div>
            ) : (
              <Link className="button-link" to="/login">Continue to login</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell premium-auth">
      <div className="auth-grid">
        <aside className="auth-left">
          <div className="auth-hero">
            <p className="eyebrow">IntelSense AI</p>
            <h1>Transform customer feedback into enterprise intelligence.</h1>
            <p className="hero-copy">Join the AI-powered customer sentiment platform built for secure, role-based enterprise workflows.</p>
          </div>

          <div className="feature-grid">
            {featureItems.map((item) => (
              <div key={item} className="feature-item">✔ {item}</div>
            ))}
          </div>

          <div className="auth-decor">
            <div className="node-grid">
              <span className="node node-large"></span>
              <span className="node node-small"></span>
              <span className="node node-small"></span>
            </div>
            <div className="floating-card">
              <strong>Enterprise AI</strong>
              <p>Powered by fast analytics, secure auth, and enterprise-ready workflows.</p>
            </div>
            <div className="floating-card" style={{ top: '46%', left: '45%' }}>
              <strong>Secure Access</strong>
              <p>JWT authentication and permissions-based dashboards.</p>
            </div>
          </div>

          <div className="auth-left-footer">
            <p>Powered by</p>
            <p>Spring Boot • React • JWT • AI Analytics</p>
          </div>
        </aside>

        <section className="auth-right">
          <div className="auth-card auth-card-glass register-card">
            <div className="brand-block">
              <div className="brand-mark">✦</div>
              <div>
                <p className="eyebrow">Enterprise registration</p>
                <h2>Secure your IntelSense AI account</h2>
                <p className="hero-copy">Choose the right role and complete the workflow with confidence.</p>
              </div>
            </div>

            <div className="role-section">
              <p className="section-label">Choose your role</p>
              <div className="role-grid role-grid-compact">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`role-card${selectedRole === option.value ? ' selected' : ''}`}
                    onClick={() => setSelectedRole(option.value)}
                  >
                    <div className="role-card-icon">{option.icon}</div>
                    <h4>{option.title}</h4>
                    <ul>
                      {option.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid two-column">
                <div>
                  <label>First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                </div>
                <div>
                  <label>Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                </div>
              </div>

              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />

              {isAnalyst && (
                <div className="info-panel">
                  <p>ℹ Analyst accounts require administrator approval.</p>
                  <p>Estimated approval time: <strong>24-48 Hours</strong></p>
                  <p>You will receive an email once your request is reviewed.</p>
                </div>
              )}

              {isAnalyst && (
                <>
                  <label>Company</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />

                  <label>Department</label>
                  <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" />

                  <label>Job Title</label>
                  <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job title" />

                  <div className="form-grid two-column">
                    <div>
                      <label>Experience</label>
                      <input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years" />
                    </div>
                    <div>
                      <label>Phone (optional)</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
                    </div>
                  </div>

                  <label>Reason for Analyst Access</label>
                  <textarea value={reasonForAccess} onChange={(e) => setReasonForAccess(e.target.value)} placeholder="Why do you need analyst access?" />
                </>
              )}

              <div className="form-grid two-column">
                <div>
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" />
                </div>
                <div>
                  <label>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                </div>
              </div>

              <div className="password-card">
                <div className="password-card-title">
                  <span>Password Strength</span>
                  <strong>{passwordStrength}</strong>
                </div>
                <div className="password-strength-bars">
                  {strengthBars.map((filled, index) => (
                    <span key={index} className={`password-strength-bar${filled ? ' filled' : ''}`} />
                  ))}
                </div>
                <ul className="password-checklist">
                  <li className={hasLength ? 'passed' : ''}>At least 8 characters</li>
                  <li className={hasUppercase ? 'passed' : ''}>Uppercase letter</li>
                  <li className={hasNumber ? 'passed' : ''}>Number</li>
                  <li className={hasSymbol ? 'passed' : ''}>Symbol</li>
                </ul>
              </div>

              <label className="checkbox-label">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                I agree to the IntelSense AI terms and privacy policy.
              </label>

              <button className="primary-btn" type="submit" disabled={loading}>{submitLabel}</button>

              <div className="security-footer">
                <p>Protected by JWT authentication • 256-bit enterprise security • AI-powered insights</p>
              </div>

              <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
            </form>
          </div>
        </section>
      </div>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} duration={3000} />
    </div>
  );
}
