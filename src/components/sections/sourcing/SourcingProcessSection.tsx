'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import SpotlightCard from '@/components/ui/SpotlightCard';

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
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(16px, 2.5vw, 24px)' }}>
          {STEP_KEYS.map((key, i) => (
            <Reveal key={key} delay={(i % 4) * 90} threshold={0.1}
              // 7 items in 4 columns leaves row 2 at 3 of 4 filled — span the
              // last card across the remaining two columns instead of leaving
              // an empty trailing cell. On the 2-col tablet grid this also
              // resolves to a full-width row (2 of 2), and is a no-op on the
              // 1-col mobile grid.
              style={i === STEP_KEYS.length - 1 ? { gridColumn: 'span 2' } : undefined}>
            {/* Deliberately no borderColor change on hover: these cards carry
                a green top rule as their identity, and setting borderColor
                would repaint all four sides and wipe it out. The lift itself
                is the shared .card-lift class rather than the pair of
                onMouseEnter/onMouseLeave handlers it used to be — those also
                fired on a touch tap and left the card stuck up. */}
            <SpotlightCard
              className="card-lift"
              spotlightColor="rgba(141, 184, 51, 0.16)"
              borderRadius="var(--radius-lg)"
              style={{
                height: '100%',
                padding: 'clamp(18px, 3vw, 24px) clamp(16px, 2.5vw, 20px)', borderRadius: 'var(--radius-lg)', background: '#fff',
                border: '1px solid var(--light-grey)', borderTop: '3px solid var(--accent)',
                textAlign: isAr ? 'right' : 'left', cursor: 'default',
                ['--lift-shadow' as string]: '0 12px 40px rgba(26,61,43,0.1)',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-text)', fontFamily: 'var(--font-ibm-plex-mono), monospace', marginBottom: '10px' }}>
                {t(`steps.${key}.number`)}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '8px' }}>{t(`steps.${key}.title`)}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.65 }}>{t(`steps.${key}.desc`)}</p>
            </SpotlightCard>
            </Reveal>
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
