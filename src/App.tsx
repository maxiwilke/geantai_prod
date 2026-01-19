import React, { useState, useEffect, useRef } from 'react';
import headerLogo from './assets/geantIcon.png';

const PRIMARY = "#810947";
const USER_BG = "#ffd9e9";
const BOT_TEXT = "#464646";

// ✅ UPDATED API endpoint (only change #1)
const API_URL = 'https://rag-api-772832583543.europe-west1.run.app/api/chat';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: Array<{ name: string; url?: string }>;
}

const GeantChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋 I am the GÉANT chatbot, your AI helper.', sender: 'bot' },
    { id: '2', text: 'How can I help you today?', sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const generateId = (): string => Math.random().toString(36).substr(2, 9);

  const addUserMessage = (text: string): void => {
    setMessages((prev: Message[]) => [...prev, { id: generateId(), text, sender: 'user' }]);
  };

  const addBotMessage = (text: string, sources?: Array<{ name: string; url?: string }>): void => {
    setMessages((prev: Message[]) => [...prev, { id: generateId(), text, sender: 'bot', sources }]);
  };

  const restartChat = (): void => {
    setMessages([
      { id: generateId(), text: 'Hello! 👋 I am the GÉANT chatbot, your AI helper.', sender: 'bot' },
      { id: generateId(), text: 'How can I help you today?', sender: 'bot' }
    ]);
    setIsThinking(false);
    setShowButtons(true);
  };

  const callLLM = async (question: string): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ✅ UPDATED BODY (only change #2)
        body: JSON.stringify({
          message: question,
          session_id: 'frontend'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      addBotMessage(data.answer, data.sources);
    } catch (error) {
      console.error('Error calling LLM:', error);
      addBotMessage(
        'Sorry, I encountered an error processing your request. Please make sure the backend server is running.'
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = (text: string): void => {
    if (!text.trim()) return;
    addUserMessage(text);
    setIsThinking(true);
    setShowButtons(false);
    setInputValue('');
    callLLM(text);
  };

  const handleRecommendation = (text: string): void => {
    setShowButtons(false);
    addUserMessage(text);
    setIsThinking(true);
    callLLM(text);
  };

  if (!isOpen) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '650px', background: '#fff', borderRadius: '18px', boxShadow: '0 14px 40px rgba(0,0,0,0.12)', padding: '32px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>Chat closed</p>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '999px',
              border: `2px solid ${PRIMARY}`,
              background: USER_BG,
              color: PRIMARY,
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Reopen Chat
          </button>
        </div>
      </div>
    );
  }

  const recommendations: string[] = [
    "Please summarize the SURF case study for me",
    "Show me the Annual Report of 2020",
    "How many universities does GEANT collaborate with?"
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '16px' }}>
      {/* EVERYTHING BELOW IS UNCHANGED */}
      {/* … exactly as in your original snippet … */}
    </div>
  );
};

export default GeantChatbot;
