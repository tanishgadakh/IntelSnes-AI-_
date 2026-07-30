export default function AnalyticsPage() {
  return (
    <div className="dashboard-grid">
      <div className="hero-card">
        <h2>Analytics overview</h2>
        <p>Time-based customer insights, trend views, and review summaries.</p>
      </div>
      <div className="metric-card"><p>Positive trend</p><h3>+18%</h3></div>
      <div className="metric-card"><p>Negative trend</p><h3>-5%</h3></div>
      <div className="metric-card"><p>Top aspect</p><h3>Support</h3></div>
      <div className="metric-card"><p>Avg. happiness</p><h3>82%</h3></div>
      <div className="chart-card wide"><h3>Performance over time</h3><div className="chart-placeholder">Area / line chart</div></div>
    </div>
  );
}
