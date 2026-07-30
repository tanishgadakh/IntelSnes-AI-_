export default function AnalyticsPage() {
  const filters = ['Today', 'Last 7 Days', 'Last Month'];
  const activeFilters = ['Last 7 Days'];

  return (
    <div className="dashboard-grid analytics-page">
      <div className="hero-card analytics-hero">
        <div>
          <h2>Analytics storytelling</h2>
          <p>Instant answers for customer trends, issue drivers, and satisfaction shifts.</p>
        </div>
        <div className="filter-row">
          {filters.map((filter) => (
            <button key={filter} className={activeFilters.includes(filter) ? 'chip chip-active' : 'chip'}>{filter}</button>
          ))}
        </div>
      </div>
      <div className="metric-card"><p>Customer satisfaction</p><h3>91%</h3><span>Up 5% vs. last month</span></div>
      <div className="metric-card"><p>Delivery complaints</p><h3>+18%</h3><span>Top emerging issue</span></div>
      <div className="metric-card"><p>Most common emotion</p><h3>Trust</h3><span>Score 82%</span></div>
      <div className="metric-card"><p>Issues trending</p><h3>Delivery, Support</h3><span>2 categories</span></div>
      <div className="chart-card wide"><h3>Satisfaction over time</h3><div className="chart-placeholder">Interactive line chart</div></div>
      <div className="chart-card"><h3>Top complaint themes</h3><div className="chart-placeholder">Bar chart</div></div>
    </div>
  );
}
