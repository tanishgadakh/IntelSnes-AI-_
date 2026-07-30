export default function HistoryPage() {
  return (
    <div className="panel">
      <h2>Recent predictions</h2>
      <table>
        <thead>
          <tr><th>Review</th><th>Sentiment</th><th>Date</th></tr>
        </thead>
        <tbody>
          <tr><td>Great experience with delivery.</td><td>Positive</td><td>Today</td></tr>
          <tr><td>Customer support was slow.</td><td>Negative</td><td>Yesterday</td></tr>
        </tbody>
      </table>
    </div>
  );
}
