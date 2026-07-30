import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

const starterMessages = [
  'Summarize the latest customer feedback trends.',
  'What are the biggest pain points in support reviews?',
  'Suggest three actions to improve satisfaction.'
];

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'I can help summarize reviews, identify themes, and suggest next actions for your team.' }
  ]);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: draft }, { role: 'assistant', text: 'I’m generating a concise insight for that request based on your current dashboard context.' }]);
    setDraft('');
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
          <div className="chat-input-row">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask the assistant..." />
            <button className="send-btn" onClick={send}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
