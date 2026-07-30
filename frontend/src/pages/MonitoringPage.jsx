export default function MonitoringPage() {
  return (
    <div className="panel">
      <h2>System monitoring</h2>
      <p>Operational health for backend, AI services, database, and API responsiveness.</p>
      <div className="report-grid">
        <div className="metric-card"><p>Backend</p><h3>Healthy</h3></div>
        <div className="metric-card"><p>AI Service</p><h3>Healthy</h3></div>
        <div className="metric-card"><p>Database</p><h3>Connected</h3></div>
      </div>
    </div>
  );
}
