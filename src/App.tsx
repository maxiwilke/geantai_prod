import React, { useState, useEffect, useRef } from 'react';
import headerLogo from './assets/geantIcon.png';

const PRIMARY = "#810947";
const USER_BG = "#ffd9e9";
const BOT_TEXT = "#464646";

// ✅ Your existing backend
const API_URL = "https://rag-api-772832583543.europe-west1.run.app/api/chat";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: Array<{ name: string; url?: string }>;
}

const GeantChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋 I am the GÉANT chatbot.', sender: 'bot' },
    { id: '2', text: 'How can I help you today?', sender: 'bot' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const generateId = () => crypto.randomUUID();

  const restartChat = () => {
    setMessages([
      { id: generateId(), text: 'Hello! 👋 I am the GÉANT chatbot.', sender: 'bot' },
      { id: generateId(), text: 'How can I help you today?', sender: 'bot' }
    ]);
    setShowButtons(true);
    setIsThinking(false);
  };

  const callBackend = async (question: string) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          session_id: 'frontend'
        })
      });

      if (!res.ok) throw new Error('Backend error');

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          text: data.answer,
          sender: 'bot',
          sources: data.sources
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          text: '❌ Backend not reachable.',
          sender: 'bot'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [
      ...prev,
      { id: generateId(), text, sender: 'user' }
    ]);

    setInputValue('');
    setIsThinking(true);
    setShowButtons(false);
    callBackend(text);
  };

  const recommendations = [
    "Please summarize the SURF case study for me",
    "Show me the Annual Report of 2020",
    "How many universities does GEANT collaborate with?"
  ];

  if (!isOpen) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <button onClick={() => setIsOpen(true)}>Reopen Chat</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <button onClick={restartChat}>↻</button>
        <img src={headerLogo} alt="GÉANT" style={{ height: 40 }} />
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, minHeight: 400 }}>
        {messages.map(m => (
          <div key={m.id} style={{ textAlign: m.sender === 'user' ? 'right' : 'left', marginBottom: 10 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '10px 14px',
                borderRadius: 18,
                maxWidth: '70%',
                background: m.sender === 'user' ? USER_BG : '#f4f4f4',
                color: m.sender === 'user' ? PRIMARY : BOT_TEXT
              }}
            >
              {m.text}
            </span>

            {/* Sources */}
            {m.sources && (
              <div style={{ marginTop: 6 }}>
                {m.sources.slice(0, 3).map((s, i) =>
                  s.url ? (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer">
                      Source: {s.name}
                    </a>
                  ) : (
                    <span key={i}>Source: {s.name}</span>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: PRIMARY,
                  animation: `bounce 1s ${i * 0.15}s infinite`
                }}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommendations */}
      {showButtons && !isThinking && (
        <div style={{ marginTop: 12 }}>
          {recommendations.map(r => (
            <button
              key={r}
              onClick={() => sendMessage(r)}
              style={{ display: 'block', marginBottom: 8 }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', marginTop: 12 }}>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(inputValue)}
          style={{ flex: 1, padding: 10 }}
          placeholder="Ask something…"
          disabled={isThinking}
        />
        <button onClick={() => sendMessage(inputValue)} disabled={isThinking}>
          Send
        </button>
      </div>
    </div>
  );
};

export default GeantChatbot;
