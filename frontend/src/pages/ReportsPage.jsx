import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const HISTORY_KEY = 'intelsense-history';

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = headers.map((h) => {
      const v = r[h] ?? '';
      const esc = typeof v === 'string' ? v.replace(/"/g, '""') : String(v);
      return `"${esc}"`;
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

export default function ReportsPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('intelsense-token') || '';
        const resp = await api.get('/api/feedback', { headers: { Authorization: `Bearer ${token}` } });
        setHistory(Array.isArray(resp.data) ? resp.data : []);
        setError('');
      } catch {
        const stored = localStorage.getItem(HISTORY_KEY);
        try {
          setHistory(stored ? JSON.parse(stored) : []);
        } catch {
          setHistory([]);
        }
        setError('Live export data is unavailable; using the latest stored history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const summaryCards = useMemo(() => [
    { label: 'PDF', value: history.length > 0 ? 'Ready' : 'Pending' },
    { label: 'CSV', value: history.length > 0 ? 'Ready' : 'Pending' },
    { label: 'Dashboard pack', value: history.length > 0 ? 'Ready' : 'Pending' }
  ], [history.length]);

  const exportCsv = async () => {
    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const resp = await api.get('/api/reports', { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });

      // Get filename from content-disposition if present
      const cd = resp.headers && resp.headers['content-disposition'];
      let filename = 'intelsense_history.csv';
      if (cd) {
        const m = cd.match(/filename=\"?(.*)\"?/);
        if (m && m[1]) filename = decodeURIComponent(m[1]);
      }

      const blob = new Blob([resp.data], { type: resp.data.type || 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('CSV download started');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      // fallback to client-side export if server fails
      try {
        const raw = localStorage.getItem(HISTORY_KEY) || '[]';
        const rows = JSON.parse(raw);
        if (!rows || rows.length === 0) {
          setMessage('No historical predictions to export.');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
        const csv = toCSV(rows.map((r) => ({ review: r.review, sentiment: r.sentiment?.label || '', summary: r.summary || '', recommendations: (r.recommendations || []).join(' | ') })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'intelsense_history.csv';
        a.click();
        URL.revokeObjectURL(url);
        setMessage('CSV export started (local fallback)');
        setTimeout(() => setMessage(''), 2000);
      } catch (err) {
        setMessage('Unable to export CSV.');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="reports-page">
      <div className="hero-card">
        <h2>Reports & exports</h2>
        <p>Generate professional reports for stakeholders within seconds.</p>
      </div>
      <div className="panel report-actions">
        <button className="primary-btn" onClick={exportCsv}>Generate report</button>
        <button className="primary-btn" onClick={exportCsv} style={{ marginLeft: 12 }}>Export CSV (history)</button>
        <div className="report-metrics">
          {summaryCards.map((card) => (
            <div key={card.label} className="metric-card"><p>{card.label}</p><h3>{card.value}</h3></div>
          ))}
        </div>
      </div>
      <div className="panel report-preview">
        <h3>Last generated report</h3>
        {loading ? <p>Loading report data…</p> : (
          <>
            <p>{history.length > 0 ? `Customer satisfaction trend report • ${history.length} stored records available` : 'No saved predictions yet. Run an analysis to generate a report.'}</p>
            {error && <p className="message">{error}</p>}
            {message && <p className="message">{message}</p>}
          </>
        )}
        <button className="ghost-btn" onClick={exportCsv}>Download report</button>
      </div>
    </div>
  );
}
