'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget({ welcomeMessage }: { welcomeMessage?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeMessage?.trim() || 'Hi! I am Nexia, your FNG Assistant. How can I help you find the right printer or eco-ink today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();
      
      if (res.ok && data.choices && data.choices[0]) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }]);
      } else {
        console.error('Chat error data:', data);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I am having trouble connecting right now. Please try again later or contact us on WhatsApp!' 
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered a network error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button - Moved to left to avoid WhatsApp overlap */}
      <motion.button
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-xl z-50 hover:bg-[#7aa02a] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 20 : 0 }}
        style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
        aria-label="Open chat"
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-100"
            style={{ 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'
            }}
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between" style={{ padding: '16px' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  {/* Changed to div to prevent globals.css h3 overriding the size */}
                  <div className="font-bold text-white m-0 leading-tight" style={{ fontSize: '16px' }}>Nexia</div>
                  <p className="text-xs text-slate-400 m-0">FNG AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area - Added explicit inline padding to override any CSS issues */}
            <div className="flex-1 overflow-y-auto bg-slate-50" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-2xl break-words shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--accent)] text-white rounded-tr-sm' 
                      : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
                  }`} style={{ padding: '12px', fontSize: '14px', maxWidth: '85%' }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-2" style={{ padding: '12px' }}>
                    <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                    <span className="text-xs text-slate-500 m-0">Nexia is typing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="bg-white border-t border-slate-100" style={{ padding: '12px' }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] text-slate-800 transition-all"
                  style={{ padding: '12px 48px 12px 16px', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[var(--accent)] text-white rounded-full hover:bg-[#7aa02a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} style={{ marginLeft: '2px' }} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
