'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SourcingGlobe from './SourcingGlobe';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';

const STAT_KEYS = ['moq', 'lead', 'factories', 'compliance'] as const;

export default function SourcingHeroSection() {
  const t = useTranslations('sourcingHero');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';

  return (
    <section id="sourcing-hero" className="section" style={{
      background: 'linear-gradient(160deg, var(--bg-darker) 0%, var(--primary) 55%, #12301F 100%)',
      paddingTop: 'clamp(140px, 18vw, 200px)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-15%', [isAr ? 'left' : 'right']: '-10%',
        width: 'clamp(300px, 45vw, 650px)', height: 'clamp(300px, 45vw, 650px)',
        background: 'radial-gradient(circle, rgba(141,184,51,0.14) 0%, transparent 70%)', pointerEvents: 'none',
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sourcing-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'clamp(24px, 5vw, 48px)', alignItems: 'center' }}>
          <div style={{ textAlign: isAr ? 'right' : 'left', order: isAr ? 2 : 1 }}>
            <span className="section-tag section-tag--on-dark">{t('kicker')}</span>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, color: '#fff', marginBottom: '20px',
              fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
            }}>
              {t('headline')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '640px' }}>
              {t('subtitle')}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* This page carries its own ContactSection, so the quote request
                  stays here rather than handing a sourcing lead off to the
                  printers contact page. */}
              <a href="#contact" className="btn-primary">{t('cta1')}</a>
              <a href="#sourcing-categories" className="btn-secondary">{t('cta2')}</a>
            </div>
          </div>
          <div className="sourcing-hero-globe" style={{ order: isAr ? 1 : 2 }}>
            <SourcingGlobe />
          </div>
        </div>

        <div className="sourcing-stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(16px, 3vw, 24px)',
          marginTop: 'clamp(48px, 8vw, 88px)', paddingTop: 'clamp(28px, 5vw, 40px)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}>
          {STAT_KEYS.map((key, i) => (
            <Reveal key={key} delay={200 + i * 110} style={{ textAlign: isAr ? 'right' : 'left' }}>
              <CountUp
                value={t(`stats.${key}.value`)}
                style={{ display: 'block', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: '8px', fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              />
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.03em', maxWidth: '18ch' }}>
                {t(`stats.${key}.label`)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .sourcing-hero-grid { grid-template-columns: 1fr !important; }
          .sourcing-hero-globe { order: 3 !important; max-width: 320px; margin: 0 auto; }
        }
        @media (max-width: 768px) {
          .sourcing-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
