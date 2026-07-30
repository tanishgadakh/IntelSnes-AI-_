export default function HistoryPage() {
  const entries = [
    { review: 'Great experience with delivery.', sentiment: 'Positive', date: 'Today', status: 'Complete' },
    { review: 'Customer support was slow.', sentiment: 'Negative', date: 'Yesterday', status: 'Action' },
    { review: 'Product quality is excellent.', sentiment: 'Positive', date: '2 days ago', status: 'Complete' }
  ];

  return (
    <div className="history-page">
      <div className="hero-card">
        <h2>Search saved reviews</h2>
        <p>Filter, sort, and re-run analysis on every stored customer interaction.</p>
      </div>
      <div className="panel history-tools">
        <input placeholder="Search reviews..." />
        <select>
          <option>All sentiments</option>
          <option>Positive</option>
          <option>Negative</option>
          <option>Neutral</option>
        </select>
      </div>
      <div className="panel history-table">
        <table>
          <thead>
            <tr><th>Review</th><th>Sentiment</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.review}>
                <td>{entry.review}</td>
                <td>{entry.sentiment}</td>
                <td>{entry.date}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
