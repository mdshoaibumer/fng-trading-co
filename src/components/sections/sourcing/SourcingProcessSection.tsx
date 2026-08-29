'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const STEP_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'] as const;

export default function SourcingProcessSection() {
  const t = useTranslations('sourcingProcess');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <section id="sourcing-process" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: '#555', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(16px, 2.5vw, 24px)' }}>
          {STEP_KEYS.map((key) => (
            <div key={key} style={{
              padding: 'clamp(18px, 3vw, 24px) clamp(16px, 2.5vw, 20px)', borderRadius: '16px', background: '#fff',
              border: '1px solid #EEEEEE', borderTop: '3px solid #8DB833',
              textAlign: isAr ? 'right' : 'left',
              transition: 'all 350ms cubic-bezier(0.34,1.56,0.64,1)', cursor: 'default',
            }}
              // Deliberately no borderColor change here: these cards carry a
              // green top rule as their identity, and setting borderColor would
              // repaint all four sides and wipe it out.
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,61,43,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-ibm-plex-mono), monospace', marginBottom: '10px' }}>

                {t(`steps.${key}.number`)}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{t(`steps.${key}.title`)}</h3>
              <p style={{ color: '#555', fontSize: '0.82rem', lineHeight: 1.65 }}>{t(`steps.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 1024px) {
          .sp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .sp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
