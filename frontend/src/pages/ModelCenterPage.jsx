export default function ModelCenterPage() {
  return (
    <div className="panel">
      <h2>AI model center</h2>
      <p>Review current model selection, accuracy, latency, and readiness for production workflows.</p>
      <div className="report-grid">
        <div className="metric-card"><p>Current model</p><h3>RoBERTa</h3></div>
        <div className="metric-card"><p>Accuracy</p><h3>94%</h3></div>
        <div className="metric-card"><p>Latency</p><h3>180ms</h3></div>
      </div>
    </div>
  );
}
