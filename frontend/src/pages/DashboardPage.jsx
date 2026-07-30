import { useEffect, useState } from 'react';
import api from '../api/client';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/health');
        setSummary(res.data);
      } catch {
        setSummary({ status: 'backend offline' });
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    { label: 'Total Reviews', value: '21,420', detail: 'Collected this month' },
    { label: 'Positive Reviews', value: '16,800', detail: '78% of total' },
    { label: 'Negative Reviews', value: '4,620', detail: '22% of total' },
    { label: 'Customer Sat.', value: '91%', detail: 'Target: 90%' },
    { label: 'AI Confidence', value: '95%', detail: 'Model confidence average' }
  ];

  const activity = [
    'New review batch imported from support portal',
    'Sentiment drift alert on delivery experience',
    'Report generation completed for product team'
  ];

  return (
    <div className="dashboard-grid">
      <div className="hero-card dashboard-hero">
        <div>
          <h2>Customer intelligence at a glance</h2>
          <p>Instantly understand customer sentiment, product feedback, and operational issues with AI-backed analytics.</p>
          <p className="muted">{loading ? 'Checking backend and MySQL connection...' : `Backend status: ${summary?.status || 'unknown'}`}</p>
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
        <h3>Product satisfaction trend</h3>
        <div className="chart-placeholder">Line chart showing trend for the last 30 days</div>
      </div>
      <div className="chart-card">
        <h3>Sentiment distribution</h3>
        <div className="chart-placeholder">Positive / neutral / negative</div>
      </div>
      <div className="panel activity-panel">
        <h3>Recent activity</h3>
        <ul>
          {activity.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="chart-card">
        <h3>Focus areas</h3>
        <div className="chart-placeholder">Top issues and actions</div>
      </div>
    </div>
  );
}
