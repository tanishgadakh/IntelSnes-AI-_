export default function ReportsPage() {
  return (
    <div className="panel">
      <h2>Reports</h2>
      <p>Generate PDF, CSV, and Excel reports for customer insights and historical predictions.</p>
      <div className="report-grid">
        <div className="metric-card"><p>PDF</p><h3>Export</h3></div>
        <div className="metric-card"><p>CSV</p><h3>Download</h3></div>
        <div className="metric-card"><p>Excel</p><h3>Share</h3></div>
      </div>
    </div>
  );
}
