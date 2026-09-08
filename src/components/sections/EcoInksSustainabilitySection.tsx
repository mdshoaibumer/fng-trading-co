'use client';

import { useTranslations } from 'next-intl';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';

// Delegates the count-up to the shared <CountUp> (eased, reduced-motion-aware,
// SSR-safe) rather than a bespoke linear setInterval — this used to visibly
// animate at a different rate than every other stat on the site.
function StatCounter({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 800, color: 'var(--accent-text)', fontFamily: 'var(--font-inter),sans-serif', lineHeight: 1 }}>
        <CountUp value={value} />
        <span style={{ fontSize: '0.5em', marginInlineStart: '4px' }}>{unit}</span>
      </div>
      <div style={{ color: '#4B5563', fontSize: '0.8rem', marginTop: '8px', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export default function EcoInksSustainabilitySection() {
  const t = useTranslations('sustainability');
  const milestones = ['2021','2022','2023','2024','2025','2030'] as const;
  const stats = ['co2','trees','plastic'] as const;

  return (
    <section id="sustainability" className="section" style={{ background: '#F9FAFB', position: 'relative', overflow: 'hidden' }}>
      <div className="sust-accent" style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(141,184,51,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag" style={{ background: 'rgba(141,184,51,0.1)', color: 'var(--accent-text)', border: '1px solid rgba(141,184,51,0.2)' }}>{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: '#4B5563', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '550px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sust-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'clamp(16px, 4vw, 40px)', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
          {stats.map((s, i) => (
            <Reveal key={s} delay={i * 120} from="scale" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-2xl)', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 24px)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <StatCounter value={t(`stats.${s}.value`)} unit={t(`stats.${s}.unit`)} label={t(`stats.${s}.label`)} />
            </Reveal>
          ))}
        </div>
        <div className="sust-timeline" style={{ position: 'relative', padding: '40px 0' }}>
          <div className="timeline-line" style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(141,184,51,0.3),transparent)' }} />
          <div className="timeline-items" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative' }}>
            {milestones.map((yr, i) => (
              <Reveal key={yr} delay={i * 100} from="scale" style={{ textAlign: 'center', flex: '1 1 100px', minWidth: '80px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', margin: '0 auto 10px', border: '3px solid #F9FAFB', boxShadow: '0 0 0 2px rgba(141,184,51,0.3)' }} />
                <div style={{ color: 'var(--accent-text)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>{yr}</div>
                <div style={{ color: '#6B7280', fontSize: '0.7rem', lineHeight: 1.4, maxWidth: '120px', margin: '0 auto' }}>{t(`milestones.${yr}`)}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .sust-accent { display: none !important; }
          .sust-stats { grid-template-columns: 1fr !important; }
          .timeline-line { display: none !important; }
          .timeline-items {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
            /* Logical properties, not left/right — align-items: flex-start already
               follows dir="rtl" (flips to the right), so a physical padding-left/
               border-left would detach the guide line from the content it connects
               to in Arabic. */
            padding-inline-start: 24px !important;
            border-inline-start: 2px solid rgba(141,184,51,0.3) !important;
          }
        }
      `}</style>
    </section>
  );
}
