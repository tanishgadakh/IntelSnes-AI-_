import { useEffect, useState } from 'react';
import aiClient from '../api/aiClient';
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
  const [activeStep, setActiveStep] = useState(0);

  const tokenPayload = parseJwt(token);
  const currentRole = String(tokenPayload?.role || 'GUEST').toUpperCase();
  const requiredRoles = [ 'ADMIN', 'MANAGER', 'ANALYST', 'CUSTOMER' ];

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 700);

    return () => clearInterval(interval);
  }, [loading]);

  const analyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setActiveStep(0);
    try {
      const res = await aiClient.post('/predict', { text, source: 'web' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseData = res.data || {};
      const payload = responseData.result
        ? {
            ...responseData.result,
            language: responseData.language ?? responseData.result.language ?? 'unknown',
            confidence: responseData.confidence ?? responseData.result.confidence ?? 0,
            summary: responseData.result.summary || responseData.summary || text,
            recommendations: responseData.result.recommendations || responseData.recommendations || [],
          }
        : {
            ...responseData,
            summary: responseData.summary || responseData.response || text,
            recommendations: responseData.recommendations || [],
          };

      setResult(payload);
      saveHistoryEntry(payload, text);
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || 'Prediction failed. Check that the AI service is running.';
      setError(message);
    } finally {
      setLoading(false);
      setActiveStep(0);
    }
  };

  const emotionEntries = result && typeof result.emotions === 'object' ? Object.entries(result.emotions) : [];

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
          <div className="analysis-steps" aria-live="polite">
            {steps.map((step, index) => (
              <div key={step} className={`model-step-row ${loading && index === activeStep ? 'active' : ''} ${!loading && index <= activeStep ? 'done' : ''}`}>
                <span className="model-step-dot">{loading && index === activeStep ? '•' : '✓'}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="panel result-panel">
          <div className="ai-result-card">
            <div className="ai-result-header">
              <div>
                <span className="mini-label">Live analysis</span>
                <h3>AI result</h3>
              </div>
              {result?.sentiment?.label && (
                <span className={`sentiment-badge ${String(result.sentiment.label).toLowerCase()}`}>
                  {String(result.sentiment.label).toUpperCase()}
                </span>
              )}
            </div>

            {result ? (
              <div className="ai-result-body">
                <div className="ai-metric-strip">
                  <div className="ai-metric-box">
                    <span>Sentiment</span>
                    <strong>{result.sentiment?.label || 'n/a'}</strong>
                  </div>
                  <div className="ai-metric-box">
                    <span>Score</span>
                    <strong>{result.sentiment?.score != null ? `${Math.round((result.sentiment.score || 0) * 100)}%` : 'n/a'}</strong>
                  </div>
                  <div className="ai-metric-box">
                    <span>Confidence</span>
                    <strong>{result.confidence != null ? `${Math.round((result.confidence || 0) * 100)}%` : 'n/a'}</strong>
                  </div>
                </div>

                <div className="ai-summary-block">
                  <h4>Summary</h4>
                  <p>{result.summary || 'No summary available.'}</p>
                </div>

                {emotionEntries.length > 0 && (
                  <div className="ai-chip-section">
                    <h4>Emotions</h4>
                    <div className="ai-chip-row">
                      {emotionEntries.map(([name, value]) => (
                        <span key={name} className="ai-chip emotion-chip">
                          {name}: {Number(value).toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(result.keywords) && result.keywords.length > 0 && (
                  <div className="ai-chip-section">
                    <h4>Keywords</h4>
                    <div className="ai-chip-row">
                      {result.keywords.map((keyword, index) => (
                        <span key={`${keyword}-${index}`} className="ai-chip keyword-chip">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
                  <div className="ai-recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                      {result.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="ai-empty-state">
                <p className="muted">Analysis details will appear here once complete.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
