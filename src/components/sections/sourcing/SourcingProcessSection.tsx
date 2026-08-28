'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const STEP_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'] as const;

export default function SourcingProcessSection() {
  const t = useTranslations('sourcingProcess');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <section id="sourcing-process" className="section" style={{ background: '#F7F8F5' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: '#555', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(16px, 2.5vw, 24px)' }}>
          {STEP_KEYS.map((key) => (
            <div key={key} style={{
              padding: 'clamp(18px, 3vw, 24px) clamp(16px, 2.5vw, 20px)', borderRadius: '16px', background: '#fff',
              border: '1px solid #EEEEEE', borderTop: '3px solid #8DB833',
              textAlign: isAr ? 'right' : 'left',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8DB833', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '10px' }}>
                {t(`steps.${key}.number`)}
              </div>
              <h3 style={{ color: '#1A3D2B', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{t(`steps.${key}.title`)}</h3>
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
