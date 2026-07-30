export default function NotificationsPage() {
  return (
    <div className="panel">
      <h2>Notifications</h2>
      <p>Stay informed about new predictions, model updates, and report readiness.</p>
      <div className="report-grid">
        <div className="metric-card"><p>New predictions</p><h3>12</h3></div>
        <div className="metric-card"><p>Reports ready</p><h3>3</h3></div>
        <div className="metric-card"><p>System alerts</p><h3>1</h3></div>
      </div>
    </div>
  );
}
