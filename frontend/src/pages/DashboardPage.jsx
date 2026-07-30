import { useEffect, useState } from 'react';
import api from '../api/client';
import ChartPanel from '../components/ChartPanel';

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
    { label: 'Positive Reviews', value: '14.5K', delta: '+12%' },
    { label: 'Avg. Confidence', value: '94%', delta: '+3%' },
    { label: 'AI Predictions', value: '2.1K', delta: '+8%' },
    { label: 'Alerts', value: '7', delta: '-2%' }
  ];

  return (
    <div className="dashboard-grid">
      <div className="hero-card">
        <h2>Customer intelligence at a glance</h2>
        <p>Monitor sentiment, emotion, and review intensity through a premium analytics workspace.</p>
        <p className="muted">{loading ? 'Loading live backend status...' : `Backend status: ${summary?.status || 'unknown'}`}</p>
      </div>
      {stats.map((stat) => (
        <div key={stat.label} className="metric-card">
          <p>{stat.label}</p>
          <h3>{stat.value}</h3>
          <span>{stat.delta}</span>
        </div>
      ))}
      <ChartPanel />
      <div className="chart-card">
        <h3>Sentiment mix</h3>
        <div className="chart-placeholder">Pie / donut chart</div>
      </div>
      <div className="chart-card">
        <h3>Emotion analysis</h3>
        <div className="chart-placeholder">Bar / radial chart</div>
      </div>
    </div>
  );
}
