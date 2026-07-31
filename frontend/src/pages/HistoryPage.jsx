import { useEffect, useState } from 'react';
import api from '../api/client';

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('intelsense-token') || '';
        const resp = await api.get('/api/feedback', { headers: { Authorization: `Bearer ${token}` } });
        if (!cancelled) setEntries(resp.data || []);
      } catch (e) {
        try {
          const stored = localStorage.getItem('intelsense-history');
          if (!cancelled) setEntries(stored ? JSON.parse(stored) : []);
        } catch {
          if (!cancelled) setEntries([]);
        }
      }
    };
    fetchHistory();
    return () => { cancelled = true; };
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
              <tr><th>Text</th><th>Source</th><th>AI Result</th><th>Created At</th></tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.text}</td>
                  <td>{entry.source || 'n/a'}</td>
                  <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.aiResult}</td>
                  <td>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
