'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useParams } from 'next/navigation';

/**
 * 21st.dev inspired Floating Back-to-Top button.
 * Appears smoothly with spring physics when the visitor has scrolled down.
 * Sits opposite the WhatsApp button so there is no layout collision.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const isAr = params?.locale === 'ar';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label={isAr ? 'العودة إلى الأعلى' : 'Back to top'}
      className="back-to-top-btn"
      style={{
        position: 'fixed',
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
        left: 'calc(24px + env(safe-area-inset-left))',
        zIndex: 890,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(141, 184, 51, 0.3)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 250ms var(--ease-spring), background 250ms ease, box-shadow 250ms ease',
        animation: 'fadeInUp 350ms var(--ease-spring)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(141, 184, 51, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
      }}
    >
      <ArrowUp size={20} strokeWidth={2.2} />
    </button>
  );
}
