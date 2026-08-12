import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AlertsPage() {
  const token = localStorage.getItem('intelsense-token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/alerts', { headers });
      setAlerts(res.data || []);
    } catch (e) {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAlerts(); }, []);

  return (
    <div className="panel">
      <h2>Alert history</h2>
      {loading && <p className="panel-note">Loading...</p>}
      {!loading && alerts.length === 0 && <p className="panel-note">No alerts.</p>}
      {!loading && alerts.length > 0 && (
        <table>
          <thead><tr><th>When</th><th>Level</th><th>Message</th></tr></thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td>{a.created_at}</td>
                <td>{a.level}</td>
                <td>{a.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
