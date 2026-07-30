export default function AdminPage() {
  const metrics = [
    { title: 'Active users', value: '128' },
    { title: 'Model status', value: 'Healthy' },
    { title: 'System alerts', value: '3' },
    { title: 'Predictions today', value: '890' }
  ];

  return (
    <div className="admin-page">
      <div className="hero-card admin-hero">
        <h2>Admin control center</h2>
        <p>Monitor platform health, users, models, and operational signals from one place.</p>
      </div>
      <div className="dashboard-grid admin-grid">
        {metrics.map((metric) => (
          <div key={metric.title} className="metric-card">
            <p>{metric.title}</p>
            <h3>{metric.value}</h3>
          </div>
        ))}
      </div>
      <div className="panel admin-table-panel">
        <h3>Recent system events</h3>
        <table>
          <thead>
            <tr><th>Event</th><th>Severity</th><th>Time</th></tr>
          </thead>
          <tbody>
            <tr><td>Model refresh completed</td><td>Info</td><td>2 min ago</td></tr>
            <tr><td>New feedback burst detected</td><td>Warning</td><td>12 min ago</td></tr>
            <tr><td>API latency spike</td><td>Critical</td><td>28 min ago</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
