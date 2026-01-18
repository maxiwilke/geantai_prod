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
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋 I am the GÉANT chatbot, your AI helper.', sender: 'bot' },
    { id: '2', text: 'How can I help you today?', sender: 'bot' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const generateId = () => Math.random().toString(36).slice(2);

  const addUserMessage = (text: string) =>
    setMessages(prev => [...prev, { id: generateId(), text, sender: 'user' }]);

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

  const callLLM = async (question: string) => {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          session_id: 'frontend-session',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      addBotMessage(data.answer, data.sources);
    } catch (err) {
      console.error(err);
      addBotMessage('❌ Sorry, I could not reach the server.');
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
    </div>
  );
};

export default GeantChatbot;
