import React, { useState, useEffect, useRef } from 'react';
import headerLogo from './assets/geantIcon.png';

const PRIMARY = "#810947";
const USER_BG = "#ffd9e9";
const BOT_TEXT = "#464646";

const API_URL = "https://rag-api-772832583543.europe-west1.run.app";

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
const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋 I am the GÉANT chatbot, your AI helper.', sender: 'bot' },
    { id: '2', text: 'How can I help you today?', sender: 'bot' }
    { id: '1', text: 'Hello! 👋 I am the GÉANT chatbot.', sender: 'bot' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateId = () => Math.random().toString(36).slice(2);
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

  const addUserMessage = (text: string) =>
    setMessages(prev => [...prev, { id: generateId(), text, sender: 'user' }]);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user'
    };

  const addBotMessage = (text: string, sources?: Message['sources']) =>
    setMessages(prev => [...prev, { id: generateId(), text, sender: 'bot', sources }]);

  const restartChat = () => {
    setMessages([
      { id: generateId(), text: 'Hello! 👋 I am the GÉANT chatbot, your AI helper.', sender: 'bot' },
      { id: generateId(), text: 'How can I help you today?', sender: 'bot' }
    ]);
    setIsThinking(false);
    setShowButtons(true);
  };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

  const callLLM = async (question: string) => {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          session_id: 'frontend-session',
        }),
          message: userMsg.text,
          session_id: 'frontend'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      addBotMessage(data.answer, data.sources);
    } catch (err) {
      console.error(err);
      addBotMessage('❌ Sorry, I could not reach the server.');
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

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setInputValue('');
    setShowButtons(false);
    setIsThinking(true);
    callLLM(text);
  };

  const handleRecommendation = (text: string) => {
    addUserMessage(text);
    setShowButtons(false);
    setIsThinking(true);
    callLLM(text);
  };

  const recommendations = [
    "Please summarize the SURF case study for me",
    "Show me the Annual Report of 2020",
    "How many universities does GEANT collaborate with?"
  ];

  if (!isOpen) return null;

  return (
    <div>
      {/* UI unchanged — your JSX below is fine */}
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
                background: m.sender === 'user' ? USER_BG : '#f4f4f4',
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

export default GeantChatbot;
