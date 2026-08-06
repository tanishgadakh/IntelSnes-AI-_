import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ProfilePage({ user }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    department: '',
    jobTitle: '',
    experience: '',
    reasonForAccess: '',
    currentPassword: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/api/auth/profile', { headers: { Authorization: `Bearer ${user?.token}` } });
        const data = res.data || {};
        setForm((prev) => ({ ...prev, ...data, currentPassword: '', password: '' }));
      } catch {
        setMessage('Unable to load profile right now.');
      }
    };

    if (user?.token) {
      loadProfile();
    }
  }, [user?.token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');
    try {
      // Require current password when changing password
      if (form.password && !form.currentPassword) {
        setMessage('Current password is required to change your password.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }
      if (!payload.currentPassword) {
        delete payload.currentPassword;
      }
      if (!payload.password && payload.currentPassword) {
        delete payload.currentPassword;
      }
      const res = await api.put('/api/auth/profile', payload, { headers: { Authorization: `Bearer ${user?.token}` } });
      setForm((prev) => ({ ...prev, ...res.data, currentPassword: '', password: '' }));
      setMessage('Profile updated successfully.');
      setMessageType('success');
    } catch (err) {
      let errMsg = 'Profile update failed. Please try again.';
      if (err && err.response && err.response.data) {
        errMsg = err.response.data.message || err.response.data.detail || JSON.stringify(err.response.data) || errMsg;
      } else if (err && err.message) {
        errMsg = err.message;
      }
      setMessage(errMsg);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Profile</h2>
      <p>Manage profile information and account details.</p>
      <form onSubmit={handleSubmit} className="stacked-form">
        <div className="report-grid">
          <div className="metric-card"><p>Username</p><h3>{user?.username || 'Guest User'}</h3></div>
          <div className="metric-card"><p>Role</p><h3>{user?.role || 'GUEST'}</h3></div>
          <div className="metric-card"><p>Session</p><h3>{user?.token ? 'Authenticated' : 'Not signed in'}</h3></div>
        </div>
        <div className="report-grid">
          <label>First name<input name="firstName" value={form.firstName || ''} onChange={handleChange} /></label>
          <label>Last name<input name="lastName" value={form.lastName || ''} onChange={handleChange} /></label>
          <label>Email<input name="email" type="email" value={form.email || ''} onChange={handleChange} /></label>
          <label>Phone<input name="phone" value={form.phone || ''} onChange={handleChange} /></label>
          <label>Company<input name="company" value={form.company || ''} onChange={handleChange} /></label>
          <label>Department<input name="department" value={form.department || ''} onChange={handleChange} /></label>
          <label>Job title<input name="jobTitle" value={form.jobTitle || ''} onChange={handleChange} /></label>
          <label>Experience<input name="experience" value={form.experience || ''} onChange={handleChange} /></label>
          <label>Access reason<input name="reasonForAccess" value={form.reasonForAccess || ''} onChange={handleChange} /></label>
          <label>Current password<input name="currentPassword" type="password" value={form.currentPassword || ''} onChange={handleChange} placeholder="Required only when changing password" /></label>
          <label>New password<input name="password" type="password" value={form.password || ''} onChange={handleChange} placeholder="Leave blank to keep current password" /></label>
        </div>
        <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
        {message && (
          <p className={messageType === 'success' ? 'success-banner' : 'error-banner'}>{message}</p>
        )}
      </form>
    </div>
  );
}
