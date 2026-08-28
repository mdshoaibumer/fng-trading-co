'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function FaqPageClient() {
  const t = useTranslations('faqPage');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') }
  ];

  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'clamp(120px, 15vh, 160px)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{t('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('subtitle')}
        </p>
      </div>

      {/* Accordion */}
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                background: '#fff', 
                borderRadius: '20px', 
                border: '1px solid #EEEEEE',
                overflow: 'hidden',
                boxShadow: openIndex === i ? '0 10px 30px rgba(0,0,0,0.03)' : 'none',
                transition: 'all 300ms ease'
              }}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(16px, 4vw, 24px) clamp(20px, 4vw, 32px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: isAr ? 'right' : 'left'
                }}
              >
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {faq.q}
                </span>
                <div style={{ 
                  transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 300ms ease',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: openIndex === i ? 'var(--accent)' : 'rgba(141,184,51,0.1)',
                  color: openIndex === i ? '#fff' : 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <div style={{ 
                maxHeight: openIndex === i ? '500px' : '0',
                opacity: openIndex === i ? 1 : 0,
                transition: 'all 300ms ease',
                padding: openIndex === i ? '0 clamp(20px, 4vw, 32px) clamp(20px, 4vw, 32px) clamp(20px, 4vw, 32px)' : '0 clamp(20px, 4vw, 32px)'
              }}>
                <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1.05rem', margin: 0, textAlign: isAr ? 'right' : 'left' }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
