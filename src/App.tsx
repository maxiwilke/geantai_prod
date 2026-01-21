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
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      addBotMessage(data.answer, data.sources);
    } catch (error) {
      console.error('Error calling LLM:', error);
      addBotMessage('Sorry, I encountered an error processing your request. Please make sure the backend server is running.');
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
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        .dot-left {
          animation: bounce 1s infinite;
          animation-delay: 0.001s;
        }
        .dot-middle {
          animation: bounce 1s infinite;
          animation-delay: 0.18s;
        }
        .dot-right {
          animation: bounce 1s infinite;
          animation-delay: 0.36s;
        }
      `}</style>
      <div style={{ width: '100%', maxWidth: '600px', height: '85vh', minHeight: '800px', background: '#fff', borderRadius: '18px', boxShadow: '0 14px 40px rgba(0,0,0,0.12)', overflow: 'hidden', border: '1px solid rgba(70,70,70,0.25)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '2px solid #f9fafb' }}>
          <button
            onClick={restartChat}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              color: PRIMARY,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: 1,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            title="Restart chat"
          >
            ↻
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={headerLogo} alt="GÉANT AI" style={{ height: '48px' }} />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              color: PRIMARY,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: 1,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            title="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
<div style={{ overflowY: 'auto', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
  {messages.map((msg: Message) => (
    <div key={msg.id}>
      <div
        style={{
          display: 'flex',
          marginBottom: '12px',
          justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            padding: '10px 14px',
            borderRadius: '18px',
            fontSize: '18px',
            lineHeight: '1.35',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            background: msg.sender === 'user' ? USER_BG : '#fff',
            color: msg.sender === 'user' ? PRIMARY : BOT_TEXT,
            border: msg.sender === 'bot' ? '1px solid rgba(70,70,70,0.12)' : 'none'
          }}
        >
          {msg.text}
        </div>
      </div>

      {/* Sources */}
      {msg.sources && msg.sources.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', maxWidth: '600px', justifyContent: 'flex-start' }}>
          {msg.sources.slice(0, 5).map((source, idx) => {
            const displayName = source.name.length > 30 ? source.name.slice(0, 30) + "..." : source.name;

            return source.url ? (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: `2px solid ${PRIMARY}`,
                  background: USER_BG,
                  color: PRIMARY,
                  fontSize: '16px',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'opacity 0.2s',
                  opacity: 1,
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                title={`Open: ${source.url}`}
              >
                {displayName}
              </a>
            ) : (
              <button
                key={idx}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: `2px solid ${PRIMARY}`,
                  background: USER_BG,
                  color: PRIMARY,
                  fontSize: '16px',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'default',
                  fontWeight: 500,
                  opacity: 0.6
                }}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  ))}  {/* <-- THIS closes messages.map */}

  {isThinking && (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px', marginTop: '12px' }}>
      <div style={{ padding: '14px', borderRadius: '18px', background: USER_BG, border: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span className="dot-left" style={{ width: '10px', height: '10px', borderRadius: '999px', background: PRIMARY, display: 'inline-block' }} />
        <span className="dot-middle" style={{ width: '10px', height: '10px', borderRadius: '999px', background: PRIMARY, display: 'inline-block' }} />
        <span className="dot-right" style={{ width: '10px', height: '10px', borderRadius: '999px', background: PRIMARY, display: 'inline-block' }} />
      </div>
    </div>
  )}

  <div ref={messagesEndRef} />
</div>

{/* Recommendation Buttons */}
{showButtons && !isThinking && (
  <div style={{ padding: '16px', paddingTop: '0' }}>
    {recommendations.map((rec: string, i: number) => (
      <button
        key={i}
        onClick={() => handleRecommendation(rec)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '12px 18px',
          marginBottom: '8px',
          borderRadius: '999px',
          border: `2px solid ${PRIMARY}`,
          background: USER_BG,
          color: PRIMARY,
          fontWeight: 700,
          fontSize: '16px',
          cursor: 'pointer',
          opacity: 1,
          transition: 'opacity 0.2s',
          display: 'inline-block',
          maxWidth: 'fit-content'
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {rec}
      </button>
    ))}
  </div>
)}


        {/* Input */}
        <div style={{ padding: '16px', borderTop: '2px solid #f9fafb', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                }
              }}
              placeholder="Ask anything ..."
              disabled={isThinking}
              style={{
                flex: 1,
                padding: '14px 22px',
                borderRadius: '999px',
                border: `2px solid ${PRIMARY}`,
                fontSize: '18px',
                outline: 'none',
                color: BOT_TEXT,
                opacity: isThinking ? 0.6 : 1
              }}
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isThinking}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: PRIMARY,
                border: 'none',
                cursor: isThinking ? 'not-allowed' : 'pointer',
                opacity: isThinking ? 0.6 : 1,
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => !isThinking && (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => !isThinking && (e.currentTarget.style.opacity = '1')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ transform: 'rotate(+45deg)' }}>
                <line x1="22" y1="2" x2="11" y2="13" />
                <polyline points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeantChatbot;
