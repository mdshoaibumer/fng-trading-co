'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function TrustSection() {
  const t = useTranslations('trust');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const certs = ['ISO 14001','ISO 9001','SASO','Vision 2030 Partner'];

  return (
    <section id="trust" className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
        </div>
        <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(16px, 3vw, 24px)', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px)', borderRadius: '20px', background: '#fff',
              border: '1px solid var(--light-grey)', borderBottom: '3px solid var(--primary)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'all 300ms ease',
              textAlign: isAr ? 'right' : 'left'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,61,43,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ fontSize: '1.8rem', color: 'rgba(141,184,51,0.3)', marginBottom: '12px', lineHeight: 1 }}>❝</div>
              <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                {t(`testimonials.${i}.quote`)}
              </p>
              <div style={{ borderTop: '1px solid #EEE', paddingTop: '12px' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{t(`testimonials.${i}.name`)}</div>
                <div style={{ color: '#6B7C3F', fontSize: '0.75rem' }}>
                  {t(`testimonials.${i}.role`)} — {t(`testimonials.${i}.company`)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {certs.map(c => (
            <div key={c} style={{
              padding: '8px 16px', borderRadius: '999px',
              background: 'var(--bg-secondary)', border: '1px solid rgba(74,144,217,0.2)',
              color: '#4A90D9', fontSize: '0.75rem', fontWeight: 600,
              fontFamily: 'var(--font-ibm-plex-mono), monospace', letterSpacing: '0.05em',
            }}>
              {c}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
