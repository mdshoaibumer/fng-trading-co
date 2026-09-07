'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DEFAULT_WHATSAPP_NUMBER, sanitizeWhatsappNumber } from '@/lib/whatsapp';

export default function WhatsAppButton({ whatsapp }: { whatsapp?: string }) {
  const t = useTranslations('contact');
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 900);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!visible) return null;

  const showLabel = hovered && !isMobile;
  const size = isMobile ? 48 : 56;

  return (
    <a
      href={`https://wa.me/${sanitizeWhatsappNumber(whatsapp || DEFAULT_WHATSAPP_NUMBER)}`}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-btn"
      aria-label={t('whatsapp')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        // Add the device safe-area inset so the FAB clears the home indicator /
        // rounded corners on notched phones.
        bottom: isMobile ? 'calc(16px + env(safe-area-inset-bottom))' : 'calc(24px + env(safe-area-inset-bottom))',
        right: isMobile ? 'calc(16px + env(safe-area-inset-right))' : 'calc(24px + env(safe-area-inset-right))',
        zIndex: 900,
        // Held out of the page's view-transition snapshot, like the nav — a
        // floating action button sliding away with the content it floats over
        // looks like a bug. See globals.css.
        viewTransitionName: 'persistent-whatsapp',
        width: showLabel ? 'auto' : `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-pill)',
        background: '#25D366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? '10px' : '0',
        padding: showLabel ? '0 20px 0 16px' : '0',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        textDecoration: 'none',
        // Hover-triggered only (not scroll/frame-driven), so the residual
        // width/padding layout cost here is negligible — narrowed from `all`
        // to the properties that actually change.
        transition: 'width 300ms var(--ease-spring), padding 300ms var(--ease-spring), gap 300ms var(--ease-spring), transform 300ms var(--ease-spring)',
        animation: 'fadeInUp 600ms var(--ease-ink)',
        transform: hovered && !isMobile ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <svg width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {showLabel && (
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          animation: 'fadeIn 200ms ease',
        }}>
          {t('whatsapp')}
        </span>
      )}
    </a>
  );
}
