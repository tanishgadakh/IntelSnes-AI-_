import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('intelsense-history');
      setEntries(stored ? JSON.parse(stored) : []);
    } catch {
      setEntries([]);
    }
  }, []);

  return (
    <div className="history-page">
      <div className="hero-card">
        <h2>Saved analysis history</h2>
        <p>Recent predictions are stored locally from your authenticated sessions.</p>
      </div>
      <div className="panel history-table">
        {entries.length === 0 ? (
          <p className="muted">No saved analysis yet. Run a prediction to create history.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Review</th><th>Sentiment</th><th>Summary</th><th>Status</th></tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={`${entry.review}-${index}`}>
                  <td>{entry.review}</td>
                  <td>{entry.sentiment?.label || 'n/a'}</td>
                  <td>{entry.summary || 'No summary available.'}</td>
                  <td>Stored</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
