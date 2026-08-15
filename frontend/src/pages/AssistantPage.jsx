import { useState, useEffect } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import aiClient from '../api/aiClient';
import { parseJwt } from '../utils/jwt';

const starterMessages = [
  'Summarize the latest customer feedback trends.',
  'What are the biggest pain points in support reviews?',
  'Suggest three actions to improve satisfaction.'
];

const ALLOWED_ROLES = [ 'ADMIN', 'MANAGER', 'ANALYST', 'CUSTOMER' ];

export default function AssistantPage({ token }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'I can help summarize reviews, identify themes, and suggest next actions for your team.' }
  ]);
  const [assistantDetails, setAssistantDetails] = useState(null);
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tokenPayload = parseJwt(token);
  const currentRole = String(tokenPayload?.role || 'GUEST').toUpperCase();
  const roleMessage = ALLOWED_ROLES.includes(currentRole)
    ? `${currentRole} users can use the assistant to generate insights and summaries.`
    : `Only ${ALLOWED_ROLES.join(', ')} accounts can access the assistant.`;

  const send = async () => {
    if (!draft.trim()) return;
    setError('');
    const prompt = draft.trim();
    setMessages((prev) => [...prev, { role: 'user', text: prompt }, { role: 'assistant', text: 'Thinking...' }]);
    setAssistantDetails(null);
    setDraft('');
    setLoading(true);

    try {
      const res = await aiClient.post('/assistant', { prompt }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data || {};
      const responseText = data.response || data.summary || data.assistant_message || 'No response received from the AI service.';
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', text: responseText }]);
      setAssistantDetails({
        summary: data.summary || data.response || data.assistant_message,
        sentiment: data.sentiment,
        emotions: data.emotions,
        aspects: data.aspects,
        keywords: data.keywords,
        topics: data.topics,
        recommendations: data.recommendations || data.actionableRecommendations,
        actionableRecommendations: data.actionableRecommendations || data.recommendations,
        explainability: data.explainability,
        language: data.language,
        confidence: data.confidence,
      });
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || 'Unable to generate a response. Please try again later.';
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', text: message }]);
      setError('Assistant service failed. Check that the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  // fetch simple analytics overview for trends/alerts
  const fetchAnalytics = async () => {
    try {
      const resp = await aiClient.get('/analytics/overview', { headers: { Authorization: `Bearer ${token}` } });
      setAnalyticsOverview(resp.data || null);
    } catch (e) {
      setAnalyticsOverview(null);
    }
  };

  // load analytics on mount and when assistant details update
  useEffect(() => {
    fetchAnalytics();
  }, [assistantDetails]);

  return (
    <div className="assistant-page">
      <div className="hero-card assistant-card">
        <div className="assistant-title">
          <div className="icon-badge"><Bot size={18} /></div>
          <div>
            <h2>IntelSense AI Assistant</h2>
            <p>Ask for summaries, insights, and recommended actions.</p>
          </div>
        </div>
        <div className="assistant-access-note">
          <p><strong>Your role:</strong> {currentRole}</p>
          <p>{roleMessage}</p>
        </div>
      </div>
      <div className="assistant-grid">
        <div className="panel assistant-list">
          <h3>Suggested prompts</h3>
          {starterMessages.map((item) => (
            <button key={item} className="ghost-btn" onClick={() => setDraft(item)}>{item}</button>
          ))}
        </div>
        <div className="panel chat-panel">
          <div className="chat-window">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble ${message.role}`}>
                {message.role === 'assistant' && <Sparkles size={16} />} {message.text}
              </div>
            ))}
          </div>
          {assistantDetails && (
            <div className="assistant-details">
              <div className="assistant-summary">
                <h4>Summary</h4>
                <p>{assistantDetails.summary || 'No summary available.'}</p>
              </div>
              <div className="assistant-meta-grid">
                {assistantDetails.sentiment && (
                  <div>
                    <h5>Sentiment</h5>
                    <p>{
                      typeof assistantDetails.sentiment === 'string'
                        ? assistantDetails.sentiment
                        : `${assistantDetails.sentiment.label || 'unknown'} (${assistantDetails.sentiment.score != null ? `${Math.round((assistantDetails.sentiment.score || 0) * 100)}%` : 'n/a'})`
                    }</p>
                  </div>
                )}
                {assistantDetails.language && (
                  <div>
                    <h5>Language</h5>
                    <p>{assistantDetails.language.toUpperCase()}</p>
                  </div>
                )}
                {assistantDetails.confidence !== undefined && assistantDetails.confidence !== null && (
                  <div>
                    <h5>Confidence</h5>
                    <p>{Math.round((assistantDetails.confidence || 0) * 100)}%</p>
                  </div>
                )}
                {assistantDetails.keywords?.length > 0 && (
                  <div className="assistant-chip-block">
                    <h5>Keywords</h5>
                    <div className="ai-chip-row">
                      {assistantDetails.keywords.map((keyword, index) => (
                        <span key={`${keyword}-${index}`} className="ai-chip keyword-chip">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}
                {assistantDetails.topics?.length > 0 && (
                  <div className="assistant-chip-block">
                    <h5>Topics</h5>
                    <div className="ai-chip-row">
                      {assistantDetails.topics.map((topic, index) => (
                        <span key={`${topic}-${index}`} className="ai-chip topic-chip">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {assistantDetails.emotions && Object.keys(assistantDetails.emotions).length > 0 && (
                <div className="assistant-section">
                  <h5>Emotions</h5>
                  <div className="ai-chip-row">
                    {Object.entries(assistantDetails.emotions).map(([name, value]) => (
                      <span key={name} className="ai-chip emotion-chip">
                        {name}: {Number(value).toFixed(2)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {assistantDetails.aspects?.length > 0 && (
                <div className="assistant-section">
                  <h5>Aspect analysis</h5>
                  <ul>
                    {assistantDetails.aspects.map((aspect, index) => (
                      <li key={index}>{aspect.aspect}: {aspect.sentiment}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analyticsOverview && (
                <div className="assistant-section">
                  <h5>Trends & Alerts</h5>
                  <p>Total events: {analyticsOverview.total_events}</p>
                  <p>Negative: {analyticsOverview.negative} • Positive: {analyticsOverview.positive} • Neutral: {analyticsOverview.neutral}</p>
                  <p>Negative ratio: {analyticsOverview.negative_ratio_percent}%</p>
                  {analyticsOverview.negative_ratio_percent > 30 && (
                    <div className="alert bad">High negative sentiment detected</div>
                  )}
                </div>
              )}
              {assistantDetails.actionableRecommendations?.length > 0 && (
                <div className="assistant-section actionable-section">
                  <h5>Actionable recommendations</h5>
                  <ol>
                    {assistantDetails.actionableRecommendations.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}
              {assistantDetails.explainability && (
                <div className="assistant-section">
                  <h5>Explainability</h5>
                  <pre>{JSON.stringify(assistantDetails.explainability, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          <div className="chat-input-row">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask the assistant..." disabled={!ALLOWED_ROLES.includes(currentRole)} />
            <button className="send-btn" onClick={send} disabled={!ALLOWED_ROLES.includes(currentRole)}>{ALLOWED_ROLES.includes(currentRole) ? <Send size={16} /> : 'Locked'}</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
