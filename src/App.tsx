import React, { useState, useEffect, useRef } from 'react';
import headerLogo from './assets/geantIcon.png';
const PRIMARY = "
#810947";
const USER_BG = "
#ffd9e9";
const BOT_TEXT = "
#464646";
const API_URL = "https://rag-api-772832583543.europe-west1.run.app";
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}
const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋 I am the GÉANT chatbot.', sender: 'bot' }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);
    try {
      const res = await fetch${API_URL}/api/chat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          session_id: 'frontend'
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: data.answer,
          sender: 'bot'
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: '❌ Backend not reachable.',
          sender: 'bot'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <img src={headerLogo} alt="GÉANT" style={{ height: 50, marginBottom: 20 }} />
      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
        {messages.map(m => (
          <div
            key={m.id}
            style={{
              marginBottom: 10,
              textAlign: m.sender === 'user' ? 'right' : 'left',
              color: m.sender === 'user' ? PRIMARY : BOT_TEXT
            }}
          >
            <span
              style={{
                background: m.sender === 'user' ? USER_BG : '
#f4f4f4',
                padding: '8px 12px',
                borderRadius: 12,
                display: 'inline-block'
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {isThinking && <div>Thinking…</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', marginTop: 12 }}>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: 10 }}
          placeholder="Ask something…"
        />
        <button onClick={sendMessage} style={{ marginLeft: 8 }}>
          Send
        </button>
      </div>
    </div>
  );
};
export default App;
