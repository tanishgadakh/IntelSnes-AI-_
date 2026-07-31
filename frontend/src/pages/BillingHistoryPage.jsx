import { useEffect, useState } from 'react';
import api from '../api/client';

export default function BillingHistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const token = localStorage.getItem('intelsense-token') || '';
        const resp = await api.get('/api/feedback', { headers: { Authorization: `Bearer ${token}` } });
        setRecords(Array.isArray(resp.data) ? resp.data : []);
        setError('');
      } catch (err) {
        setRecords([]);
        setError('Unable to load billing history right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, []);

  return (
    <div className="billing-history-page">
      <div className="hero-card">
        <h2>Billing history</h2>
        <p>Review your recent invoice activity and usage-related history in one place.</p>
      </div>
      <div className="panel history-table">
        {loading ? (
          <p>Loading billing history…</p>
        ) : (
          <>
            {error && <p className="error">{error}</p>}
            {records.length === 0 ? (
              <p className="muted">No billing activity found yet. Submit feedback or generate reports to populate your history.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((entry) => (
                    <tr key={entry.id || entry.createdAt || Math.random()}>
                      <td>{entry.id || 'N/A'}</td>
                      <td>{entry.source || 'Feedback'}</td>
                      <td>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Unknown'}</td>
                      <td style={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.text || 'No details available'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
