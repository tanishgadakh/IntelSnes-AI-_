import { useState } from 'react';
import api from '../api/client';
import { parseJwt } from '../utils/jwt';

const steps = [
  'Cleaning text',
  'Detecting language',
  'Running sentiment model',
  'Detecting emotions',
  'Extracting keywords',
  'Generating summary',
  'Building recommendations'
];

const HISTORY_KEY = 'intelsense-history';

function saveHistoryEntry(result, reviewText) {
  const previousEntries = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const nextEntry = {
    review: reviewText,
    sentiment: result?.sentiment || null,
    summary: result?.summary || 'No summary available.',
    recommendations: result?.recommendations || []
  };

  const updatedEntries = [nextEntry, ...previousEntries].slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedEntries));
}

export default function PredictionPage({ token }) {
  const [text, setText] = useState('The product quality is amazing but delivery was delayed.');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tokenPayload = parseJwt(token);
  const currentRole = String(tokenPayload?.role || 'GUEST').toUpperCase();
  const requiredRoles = [ 'ADMIN', 'MANAGER', 'ANALYST' ];

  const analyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post(
        '/api/feedback',
        { text, source: 'web' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseData = res.data || {};
      const payload = responseData.result || responseData;
      setResult(payload);
      saveHistoryEntry(payload, text);
    } catch {
      setError('Prediction failed. Check that the backend and AI service are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="hero-card">
        <h2>AI analysis experience</h2>
        <p>Paste customer feedback and watch the assistant break down sentiment, emotion, aspects, and recommendations.</p>
        <div className="assistant-access-note">
          <p><strong>Your role:</strong> {currentRole}</p>
          <p>Prediction access is enabled for: {requiredRoles.join(', ')}.</p>
        </div>
      </div>
      <div className="card-grid">
        <div className="panel analysis-panel">
          <label>Customer feedback</label>
          <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={analyze} disabled={loading} className="primary-btn">
            {loading ? 'Analyzing review...' : 'Analyze review'}
          </button>
          <div className="analysis-steps">
            {steps.map((step) => (
              <div key={step} className={`step-item ${loading ? 'active' : 'idle'}`}>
                <span className="step-bullet">✓</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="panel result-panel">
          <h3>Analysis result</h3>
          {result ? (
            <div>
              <p><strong>Sentiment:</strong> {result.sentiment?.label || 'n/a'} ({result.sentiment?.score ?? 'n/a'})</p>
              <p><strong>Summary:</strong> {result.summary || 'No summary available.'}</p>
              <p><strong>Recommendations:</strong></p>
              <ul>
                {(result.recommendations || []).map((rec, index) => <li key={index}>{rec}</li>)}
              </ul>
            </div>
          ) : (
            <p className="muted">Analysis details will appear here once complete.</p>
          )}
        </div>
      </div>
    </div>
  );
}
