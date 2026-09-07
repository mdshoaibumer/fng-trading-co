'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // One auto-dismiss timer per toast, so hover/focus can pause them and a
  // manual dismiss can cancel them. Errors get no timer — they persist until
  // dismissed, since a failure the operator missed is worse than clutter.
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const AUTO_MS = 5000;

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const arm = useCallback((id: number, type: ToastType) => {
    if (type === 'error') return; // errors persist
    timers.current.set(id, setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timers.current.delete(id);
    }, AUTO_MS));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    arm(id, type);
  }, [arm]);

  const dismiss = (id: number) => remove(id);

  // Pause every running timer while the stack is hovered or focused, and
  // re-arm the auto-dismissing ones on leave — so a reader is never raced by a
  // toast vanishing mid-read (WCAG 2.2.1 timing-adjustable).
  const pauseAll = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current.clear();
  };
  const resumeAll = () => {
    toasts.forEach(t => { if (t.type !== 'error' && !timers.current.has(t.id)) arm(t.id, t.type); });
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  const colors = {
    success: { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', icon: '#10B981' },
    error: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: '#EF4444' },
    info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', icon: '#3B82F6' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container — a labelled region; each toast carries its own
          role (alert for errors = assertive, status otherwise = polite) so
          screen readers announce every write's outcome. */}
      <div
        role="region"
        aria-label="Notifications"
        onMouseEnter={pauseAll}
        onMouseLeave={resumeAll}
        onFocus={pauseAll}
        onBlur={resumeAll}
        style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}>
        {toasts.map(toast => {
          const c = colors[toast.type];
          return (
            <div
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
              aria-atomic="true"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                color: c.text,
                fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-inter), sans-serif',
                animation: 'toastSlideIn 0.3s ease-out',
                minWidth: '300px',
                maxWidth: '460px',
              }}
            >
              <span style={{ color: c.icon, flexShrink: 0 }}>{icons[toast.type]}</span>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: c.text,
                  opacity: 0.5,
                  flexShrink: 0,
                  padding: '2px',
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
