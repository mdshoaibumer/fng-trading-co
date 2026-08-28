'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Clock, Wrench, MessageCircle } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function MaintenanceTeaser() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const t = useTranslations('maintenanceTeaser');
  const [whatsapp, setWhatsapp] = useState('966593380390');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contact?.whatsapp) {
          setWhatsapp(data.contact.whatsapp.replace(/\s/g, '').replace('+', ''));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{
      padding: 'clamp(48px, 8vw, 80px) 0',
      background: '#FFFFFF',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          background: 'linear-gradient(135deg, #0F2A1C 0%, #1A3D2B 100%)',
          borderRadius: '24px', padding: 'clamp(32px, 5vw, 56px)',
          position: 'relative', overflow: 'hidden',
          textAlign: 'center',
        }}>
          {/* Decorative grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(141,184,51,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(141,184,51,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px', pointerEvents: 'none',
          }} />

          {/* Pulsing badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(141,184,51,0.15)', color: '#8DB833',
            padding: '8px 20px', borderRadius: '20px',
            fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: isAr ? '0' : '1.5px',
            marginBottom: '20px', border: '1px solid rgba(141,184,51,0.25)',
            position: 'relative', zIndex: 2,
          }}>
            <Clock size={14} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            {t('tag')}
          </div>

          {/* Title */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(141,184,51,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', border: '1px solid rgba(141,184,51,0.2)',
            }}>
              <Wrench size={28} color="#8DB833" strokeWidth={1.5} />
            </div>

            <h3 style={{
              color: '#FFFFFF', fontSize: 'clamp(1.3rem, 3vw, 2rem)',
              fontWeight: 800, marginBottom: '14px',
              fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
            }}>
              {t('title')}
            </h3>

            <p style={{
              color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 28px',
            }}>
              {t('desc')}
            </p>

            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                isAr ? 'مرحباً، أريد التسجيل لخدمة الصيانة عند توفرها' : 'Hello, I want to register my interest in maintenance services'
              )}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', borderRadius: '14px',
                background: 'rgba(141,184,51,0.15)', color: '#8DB833',
                fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', border: '1px solid rgba(141,184,51,0.3)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(141,184,51,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(141,184,51,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={18} />
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
