import { useState } from 'react';
import api, { API_BASE_URL } from '../api/client';

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
        <button className="primary-btn">Generate report</button>
        <button className="primary-btn" onClick={exportCsv} style={{ marginLeft: 12 }}>Export CSV (history)</button>
        <div className="report-metrics">
          <div className="metric-card"><p>PDF</p><h3>Ready</h3></div>
          <div className="metric-card"><p>CSV</p><h3>Ready</h3></div>
          <div className="metric-card"><p>Dashboard pack</p><h3>Ready</h3></div>
        </div>
      </div>
      <div className="panel report-preview">
        <h3>Last generated report</h3>
        <p>Customer satisfaction trend report • Generated recently</p>
        <button className="ghost-btn">Download report</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
