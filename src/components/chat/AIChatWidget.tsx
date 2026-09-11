'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget({ welcomeMessage, welcomeMessageAr }: { welcomeMessage?: string; welcomeMessageAr?: string }) {
  const params = useParams();
  const isAr = params?.locale === 'ar';
  const copy = {
    open: isAr ? 'افتح المحادثة' : 'Open chat',
    close: isAr ? 'إغلاق المحادثة' : 'Close chat',
    assistant: isAr ? 'مساعد FNG الذكي' : 'FNG AI Assistant',
    typing: isAr ? 'نيكسيا تكتب...' : 'Nexia is typing...',
    placeholder: isAr ? 'اكتب رسالة...' : 'Type a message...',
    send: isAr ? 'إرسال' : 'Send message',
    welcomeDefault: isAr
      ? 'مرحباً! أنا نيكسيا، مساعد FNG. كيف يمكنني مساعدتك في اختيار الطابعة أو الحبر المناسب اليوم؟'
      : 'Hi! I am Nexia, your FNG Assistant. How can I help you find the right printer or eco-ink today?',
    connError: isAr
      ? 'عذراً، أواجه مشكلة في الاتصال حالياً. حاول مرة أخرى لاحقاً أو تواصل معنا عبر واتساب!'
      : 'Sorry, I am having trouble connecting right now. Please try again later or contact us on WhatsApp!',
    netError: isAr ? 'حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.' : 'I encountered a network error. Please try again.',
  };

  // Each locale has its own admin-editable greeting, falling back to that
  // locale's built-in default — never the other language's (DEF-003). Derived
  // at render rather than frozen into state so a locale switch updates it.
  const greeting: Message = {
    role: 'assistant',
    content: (isAr ? welcomeMessageAr : welcomeMessage)?.trim() || copy.welcomeDefault,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const messages: Message[] = [greeting, ...conversation];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Close and hand focus back to the toggle it came from (rAF so the button
  // has re-rendered focusable before we call focus on it).
  const close = () => { setIsOpen(false); requestAnimationFrame(() => toggleRef.current?.focus()); };
  // Only the latest assistant reply is announced — the transcript itself is
  // not a live region, so a screen-reader user no longer hears their own
  // just-typed message read back to them.
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')?.content ?? '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isLoading]);

  // Move focus into the panel on open, and close on Escape (non-modal dialog
  // semantics — the rest of the page stays interactive).
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newConversation: Message[] = [...conversation, { role: 'user', content: userMsg }];
    setConversation(newConversation);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [greeting, ...newConversation] })
      });

      const data = await res.json();

      if (res.ok && typeof data.content === 'string') {
        setConversation(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        console.error('Chat error data:', data);
        setConversation(prev => [...prev, { role: 'assistant', content: copy.connError }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setConversation(prev => [...prev, { role: 'assistant', content: copy.netError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Floating Toggle Button - Moved to left to avoid WhatsApp overlap.
          Dark icon on the lime FAB clears contrast (white was ~2.3:1). */}
      <motion.button
        ref={toggleRef}
        id="chat-launcher"
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--deep-forest)] flex items-center justify-center shadow-xl z-50 hover:bg-[#7aa02a] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 20 : 0 }}
        style={{ pointerEvents: isOpen ? 'none' : 'auto', bottom: 'calc(1.5rem + env(safe-area-inset-bottom))', left: 'calc(1.5rem + env(safe-area-inset-left))' }}
        aria-label={copy.open}
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
            id="chat-panel"
            className="fixed bottom-6 left-6 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100dvh-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-100"
            role="dialog"
            aria-modal="false"
            aria-label="Nexia — FNG AI Assistant"
            dir={isAr ? 'rtl' : 'ltr'}
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
              bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
              left: 'calc(1.5rem + env(safe-area-inset-left))'
            }}
          >
            {/* Header */}
            <div className="text-white p-4 flex items-center justify-between" style={{ padding: '16px', background: 'var(--header-bg)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <Bot size={18} className="text-[var(--deep-forest)]" />
                </div>
                <div>
                  {/* Changed to div to prevent globals.css h3 overriding the size */}
                  <div className="font-bold text-white m-0 leading-tight" style={{ fontSize: '16px' }}>Nexia</div>
                  <p className="text-xs text-slate-400 m-0">{copy.assistant}</p>
                </div>
              </div>
              <button
                onClick={close}
                aria-label={copy.close}
                className="text-slate-300 hover:text-white transition-colors flex items-center justify-center w-11 h-11 -mr-2 rtl:-ml-2 rtl:mr-0 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Assistant replies are announced here, not on the transcript
                container — so the user's own messages aren't read back. */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{lastAssistant}</div>
            {/* Messages Area */}
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
                      ? 'bg-[var(--accent)] text-[var(--deep-forest)] rounded-tr-sm'
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
                    <span className="text-xs text-slate-500 m-0">{copy.typing}</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="bg-white border-t border-slate-100" style={{ padding: '12px' }}>
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={copy.placeholder}
                  aria-label={copy.placeholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] text-slate-800 transition-all"
                  style={{ paddingBlock: '12px', paddingInlineStart: '16px', paddingInlineEnd: '52px', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label={copy.send}
                  className="absolute end-1.5 w-10 h-10 flex items-center justify-center bg-[var(--accent)] text-[var(--deep-forest)] rounded-full hover:bg-[#7aa02a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} className="rtl:-scale-x-100" style={{ marginInlineStart: '2px' }} />
                </button>
              </div>
              <p className="text-center" style={{ fontSize: '11px', margin: '8px 0 0', color: 'var(--text-tertiary)' }}>
                {isAr ? 'قد يقدم المساعد الذكي معلومات غير دقيقة — يُرجى تأكيد التفاصيل معنا.' : 'Nexia is AI and may be inaccurate — please confirm details with us.'}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
