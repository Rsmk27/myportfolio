import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCw, Bot } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  failed?: boolean;
}

interface UsageData {
  count: number;
  date: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_URL = 'https://rsmk27-rsmk-chatbot-api.hf.space/chat';
const USAGE_KEY = 'rsmk_chat_usage';
const MAX_MESSAGES = 5;
const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm RSMK's AI assistant. Ask me anything about his projects, skills, or background 👋",
};

// ─── Rate limiting helpers ────────────────────────────────────────────────────

function getTodayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getUsage(): UsageData {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const data: UsageData = JSON.parse(raw);
      if (data.date === getTodayString()) return data;
    }
  } catch {
    // ignore parse errors
  }
  return { count: 0, date: getTodayString() };
}

function saveUsage(usage: UsageData) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

// ─── Component ────────────────────────────────────────────────────────────────

const PortfolioChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<UsageData>(getUsage);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_MESSAGES - usage.count;
  const isLimitReached = remaining <= 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string, isRetry = false, retryHistory?: ChatMessage[]) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // Check rate limit
      const currentUsage = getUsage();
      if (currentUsage.count >= MAX_MESSAGES) {
        setUsage(currentUsage);
        return;
      }

      // Build history for API from existing messages (exclude failed)
      const baseMessages = retryHistory ?? messages;
      const history = baseMessages
        .filter(m => m.id !== 'welcome' && !m.failed)
        .map(m => ({ role: m.role, content: m.content }));

      // Add user message to UI (skip if retrying)
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };

      if (!isRetry) {
        setMessages(prev => [...prev, userMsg]);
        setInput('');
      }

      setIsLoading(true);

      // Increment usage
      const newUsage = { count: currentUsage.count + 1, date: getTodayString() };
      saveUsage(newUsage);
      setUsage(newUsage);

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply ?? 'No response received.',
        };
        setMessages(prev => [...prev, assistantMsg]);
      } catch {
        const failedMsg: ChatMessage = {
          id: `f-${Date.now()}`,
          role: 'assistant',
          content: "Server is waking up... wait 20 seconds and try again!",
          failed: true,
        };
        setMessages(prev => [...prev, failedMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleRetry = (failedIndex: number) => {
    // Find the last user message before this failure
    const msgsUpToFailed = messages.slice(0, failedIndex);
    const lastUser = [...msgsUpToFailed].reverse().find(m => m.role === 'user');
    if (!lastUser) return;

    // Remove the failed assistant message
    const cleaned = messages.filter((_, i) => i !== failedIndex);
    setMessages(cleaned);

    // Rollback usage count since the message failed and we're retrying
    const currentUsage = getUsage();
    if (currentUsage.count > 0) {
      const rolledBack = { ...currentUsage, count: currentUsage.count - 1 };
      saveUsage(rolledBack);
      setUsage(rolledBack);
    }

    sendMessage(lastUser.content, true, cleaned);
  };

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="portfolio-chat-toggle"
            key="chat-button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI chat assistant"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow: '0 0 24px rgba(34,197,94,0.45), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <MessageCircle size={26} color="#fff" />
            {remaining < MAX_MESSAGES && remaining > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: '#0f172a', color: '#22c55e', border: '1.5px solid #22c55e' }}
              >
                {remaining}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            id="portfolio-chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '360px',
              height: '480px',
              zIndex: 50,
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: 'rgba(10,15,28,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 40px rgba(34,197,94,0.12), 0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(34,197,94,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={17} color="#fff" />
                </div>
                <div>
                  <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
                    RSMK AI Assistant
                  </p>
                  <p style={{ color: '#22c55e', fontSize: 11, fontFamily: 'monospace' }}>
                    {isLimitReached
                      ? '0/5 messages left'
                      : `${remaining}/${MAX_MESSAGES} left today`}
                  </p>
                </div>
              </div>
              <button
                id="portfolio-chat-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)')}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                scrollbarWidth: 'none',
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: 4,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      maxWidth: '84%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      color: msg.role === 'user' ? '#fff' : msg.failed ? '#fbbf24' : '#e2e8f0',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                          : msg.failed
                          ? 'rgba(251,191,36,0.08)'
                          : 'rgba(255,255,255,0.05)',
                      border:
                        msg.role === 'user'
                          ? 'none'
                          : msg.failed
                          ? '1px solid rgba(251,191,36,0.25)'
                          : '1px solid rgba(255,255,255,0.07)',
                      boxShadow:
                        msg.role === 'user'
                          ? '0 4px 14px rgba(34,197,94,0.3)'
                          : 'none',
                    }}
                  >
                    {msg.content}
                  </motion.div>

                  {/* Retry button on failed messages */}
                  {msg.failed && (
                    <button
                      onClick={() => handleRetry(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: 'none',
                        border: '1px solid rgba(251,191,36,0.35)',
                        borderRadius: 8,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        color: '#fbbf24',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        transition: 'background 0.2s',
                      }}
                    >
                      <RefreshCw size={12} />
                      Retry
                    </button>
                  )}
                </div>
              ))}

              {/* Thinking indicator */}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        style={{
                          display: 'block',
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: '#22c55e',
                          opacity: 0.8,
                        }}
                      />
                    ))}
                    <span style={{ color: '#64748b', fontSize: 12, marginLeft: 4 }}>Thinking...</span>
                  </div>
                </div>
              )}

              {/* Rate limit message */}
              {isLimitReached && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'rgba(34,197,94,0.06)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    color: '#86efac',
                    fontSize: 13,
                    textAlign: 'center',
                    lineHeight: 1.55,
                  }}
                >
                  You've used all 5 free messages for today! Come back tomorrow 👋
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: '12px 14px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                id="portfolio-chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading || isLimitReached}
                placeholder={
                  isLimitReached
                    ? 'No messages left today...'
                    : 'Ask me anything...'
                }
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12,
                  padding: '9px 14px',
                  color: '#e2e8f0',
                  fontSize: 13.5,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
              />
              <button
                id="portfolio-chat-send"
                type="submit"
                disabled={isLoading || isLimitReached || !input.trim()}
                aria-label="Send message"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  border: 'none',
                  background:
                    isLoading || isLimitReached || !input.trim()
                      ? 'rgba(34,197,94,0.2)'
                      : 'linear-gradient(135deg,#22c55e,#16a34a)',
                  color: '#fff',
                  cursor: isLoading || isLimitReached || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s, transform 0.1s',
                  boxShadow:
                    !isLoading && !isLimitReached && input.trim()
                      ? '0 4px 14px rgba(34,197,94,0.35)'
                      : 'none',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioChat;
