import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import api from '../api/client';
import { parseJwt } from '../utils/jwt';

const starterMessages = [
  'Summarize the latest customer feedback trends.',
  'What are the biggest pain points in support reviews?',
  'Suggest three actions to improve satisfaction.'
];

const ALLOWED_ROLES = [ 'ADMIN', 'MANAGER', 'ANALYST' ];

export default function AssistantPage({ token }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'I can help summarize reviews, identify themes, and suggest next actions for your team.' }
  ]);
  const [assistantDetails, setAssistantDetails] = useState(null);
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
      const res = await api.post('/api/assistant', { prompt }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data || {};
      const responseText = data.response || data.summary || 'No response received from the AI service.';
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', text: responseText }]);
      setAssistantDetails({
        summary: data.summary,
        sentiment: data.sentiment,
        emotions: data.emotions,
        aspects: data.aspects,
        keywords: data.keywords,
        topics: data.topics,
        recommendations: data.recommendations,
        actionableRecommendations: data.actionableRecommendations,
        explainability: data.explainability,
        language: data.language,
        confidence: data.confidence,
      });
    } catch {
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', text: 'Unable to generate a response. Please try again later.' }]);
      setError('Assistant service failed. Check that the backend and AI service are running.');
    } finally {
      setLoading(false);
    }
  };

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
                    <p>{assistantDetails.sentiment}</p>
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
                  <div>
                    <h5>Keywords</h5>
                    <p>{assistantDetails.keywords.join(', ')}</p>
                  </div>
                )}
                {assistantDetails.topics?.length > 0 && (
                  <div>
                    <h5>Topics</h5>
                    <p>{assistantDetails.topics.join(', ')}</p>
                  </div>
                )}
              </div>
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
