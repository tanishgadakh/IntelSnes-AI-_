export default function ReportsPage() {
  return (
    <div className="reports-page">
      <div className="hero-card">
        <h2>Reports & exports</h2>
        <p>Generate professional reports for stakeholders within seconds.</p>
      </div>
      <div className="panel report-actions">
        <button className="primary-btn">Generate report</button>
        <div className="report-metrics">
          <div className="metric-card"><p>PDF</p><h3>Ready</h3></div>
          <div className="metric-card"><p>CSV</p><h3>Ready</h3></div>
          <div className="metric-card"><p>Dashboard pack</p><h3>Ready</h3></div>
        </div>
      </div>
      <div className="panel report-preview">
        <h3>Last generated report</h3>
        <p>Customer satisfaction trend report • Generated 12 minutes ago</p>
        <button className="ghost-btn">Download report</button>
      </div>
    </div>
  );
}
