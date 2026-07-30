import { useState } from 'react';
import api from '../api/client';

export default function PredictionPage({ token }) {
  const [text, setText] = useState('I love the product but support was slow.');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(
        '/api/feedback',
        { text, source: 'web' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch {
      setError('Prediction failed. Check that the backend and AI service are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="hero-card">
        <h2>AI prediction workspace</h2>
        <p>Submit a customer review and inspect the structured result returned by the backend and AI service.</p>
      </div>
      <div className="card-grid">
        <div className="panel">
          <label>Customer feedback</label>
          <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={analyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Feedback'}</button>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="panel">
          <h3>Analysis result</h3>
          {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : <p className="muted">Results will appear here after analysis.</p>}
        </div>
      </div>
    </div>
  );
}
