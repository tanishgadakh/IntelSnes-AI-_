import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';

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
  usePerformanceMonitoring('ReportsPage');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const { paginatedData, currentPage, totalPages, goToPage } = usePagination(filteredData, 10);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('intelsense-token') || '';
        const resp = await api.get('/api/feedback', { headers: { Authorization: `Bearer ${token}` } });
        const data = Array.isArray(resp.data) ? resp.data : [];
        setHistory(data);
        setFilteredData(data);
        setError('');
      } catch {
        const stored = localStorage.getItem(HISTORY_KEY);
        try {
          const data = stored ? JSON.parse(stored) : [];
          setHistory(data);
          setFilteredData(data);
        } catch {
          setHistory([]);
          setFilteredData([]);
        }
        setError('Live export data is unavailable; using the latest stored history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const summaryCards = useMemo(() => [
    { label: 'Total Records', value: history.length },
    { label: 'Filtered Results', value: filteredData.length },
    { label: 'Current Page', value: `${currentPage} / ${totalPages}` }
  ], [history.length, filteredData.length, currentPage, totalPages]);

  const exportCsv = async () => {
    const rowsToExport = filteredData.length > 0 ? filteredData : history;
    try {
      const token = localStorage.getItem('intelsense-token') || '';
      const resp = await api.get('/api/reports', { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });

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
      try {
        const raw = localStorage.getItem(HISTORY_KEY) || '[]';
        const rows = JSON.parse(raw);
        const exportRows = rowsToExport.length > 0 ? rowsToExport : rows;
        if (!exportRows || exportRows.length === 0) {
          setMessage('No historical predictions to export.');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
        const csv = toCSV(exportRows.map((r) => ({ review: r.review || r.text, sentiment: r.sentiment?.label || r.aiResult || '', summary: r.summary || '', recommendations: (r.recommendations || []).join(' | ') })));
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
        <h2>Reports & Exports</h2>
        <p>Generate professional reports for stakeholders within seconds with advanced filtering and pagination.</p>
      </div>

      <div className="panel report-actions">
        <div className="action-buttons">
          <button className="primary-btn" onClick={exportCsv} aria-label="Generate report">
            📄 Generate Report
          </button>
          <button className="primary-btn" onClick={exportCsv} aria-label="Export CSV">
            📊 Export CSV
          </button>
        </div>

        <div className="report-metrics">
          {summaryCards.map((card) => (
            <div key={card.label} className="metric-card" role="region" aria-label={`${card.label}: ${card.value}`}>
              <p>{card.label}</p>
              <h3>{card.value}</h3>
            </div>
          ))}
        </div>
      </div>

      <AdvancedFilterPanel data={history} onFilter={setFilteredData} />

      <div className="panel report-preview">
        <h3>Report Data</h3>
        {loading ? (
          <p className="loading">Loading report data…</p>
        ) : (
          <>
            {error && <p className="message error">{error}</p>}
            {message && <p className="message success">{message}</p>}

            {filteredData.length === 0 ? (
              <p>No records match your filters. Try adjusting your search criteria.</p>
            ) : (
              <>
                <div className="report-table-container">
                  <table className="report-table" role="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Text</th>
                        <th>Sentiment</th>
                        <th>Result</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{new Date(item.createdAt || item.created_at).toLocaleDateString()}</td>
                          <td>{item.text?.substring(0, 50)}...</td>
                          <td>
                            <span className={`sentiment-badge ${(item.sentiment?.label || 'neutral').toLowerCase()}`}>
                              {item.sentiment?.label || 'Neutral'}
                            </span>
                          </td>
                          <td>{item.aiResult?.substring(0, 50)}...</td>
                          <td>{item.source || 'Direct'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
