import { useEffect, useState } from 'react';
import api from '../api/client';

export default function DashboardPage({ user }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/health');
        setSummary({ online: true, message: res.data });
      } catch {
        setSummary({ online: false, message: 'backend offline' });
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    { label: 'Authenticated user', value: user?.username || 'Guest', detail: 'Signed in with backend credentials' },
    { label: 'Access level', value: user?.role || 'GUEST', detail: 'Permissions are enforced for this session' },
    { label: 'Backend status', value: summary?.online ? 'Online' : 'Offline', detail: summary?.message || 'Checking API health' },
    { label: 'Session token', value: user?.token ? 'Active' : 'Missing', detail: user?.token ? 'JWT is present for API calls' : 'Please sign in again' }
  ];

  const activity = [
    `Live health check: ${summary?.message || 'pending'}`,
    `Role-based access is active for ${user?.role || 'guest'} users`,
    'Recent analysis results are stored in the workspace history'
  ];

  return (
    <div className="dashboard-grid">
      <div className="hero-card dashboard-hero">
        <div>
          <h2>Customer intelligence at a glance</h2>
          <p>Live authentication state and backend health now appear directly in the workspace.</p>
          <p className="muted">{loading ? 'Checking backend and MySQL connection...' : `Backend status: ${summary?.message || 'unknown'}`}</p>
        </div>
        <div className="hero-badge">Live insights</div>
      </div>
      {stats.map((stat) => (
        <div key={stat.label} className="metric-card">
          <p>{stat.label}</p>
          <h3>{stat.value}</h3>
          <span>{stat.detail}</span>
        </div>
      ))}
      <div className="chart-card wide">
        <h3>Workspace status</h3>
        <div className="chart-placeholder">Authentication, permissions, and backend availability are now visible in the UI.</div>
      </div>
      <div className="panel activity-panel">
        <h3>Recent activity</h3>
        <ul>
          {activity.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
