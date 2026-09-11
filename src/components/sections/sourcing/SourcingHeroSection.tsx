'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';

const STAT_KEYS = ['moq', 'lead', 'factories', 'compliance'] as const;

const VIDEO_DESKTOP = '/sourcing-hero/hero-desktop.mp4';
const VIDEO_MOBILE = '/sourcing-hero/hero-mobile.mp4';
const POSTER = '/sourcing-hero/poster.jpg';

// Seconds of overlap between the end of one pass and the start of the next.
// The ship keeps moving toward the camera, so a hard `loop` would visibly jump
// it back to its start position; crossfading two copies hides that seam.
const CROSSFADE_S = 0.8;

/**
 * Full-bleed port footage behind the hero. Two stacked copies of the same clip
 * take turns: as the visible one nears its end, the hidden one restarts from 0
 * and fades in over it. Visitors who prefer reduced motion get the poster only.
 */
function LoopingVideoBackground() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = a;
    let idle = b;
    let fading = false;
    let raf = 0;

    const tick = () => {
      const { duration, currentTime } = active;
      if (!fading && duration && currentTime >= duration - CROSSFADE_S) {
        fading = true;
        idle.currentTime = 0;
        idle.play().catch(() => {});
        idle.style.opacity = '1';
        active.style.opacity = '0';
        const finished = active;
        window.setTimeout(() => {
          finished.pause();
          fading = false;
        }, CROSSFADE_S * 1000);
        [active, idle] = [idle, active];
      }
      raf = requestAnimationFrame(tick);
    };

    a.style.opacity = '1';
    a.play().then(() => { raf = requestAnimationFrame(tick); }).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      a.pause();
      b.pause();
    };
  }, []);

  const sources = (
    <>
      <source src={VIDEO_MOBILE} type="video/mp4" media="(max-width: 768px)" />
      <source src={VIDEO_DESKTOP} type="video/mp4" />
    </>
  );

  return (
    <div className="sourcing-hero-media" aria-hidden="true">
      <video ref={aRef} className="sourcing-hero-video" muted playsInline preload="auto" poster={POSTER} tabIndex={-1} style={{ opacity: 1 }}>
        {sources}
      </video>
      <video ref={bRef} className="sourcing-hero-video" muted playsInline preload="auto" poster={POSTER} tabIndex={-1} style={{ opacity: 0 }}>
        {sources}
      </video>
    </div>
  );
}

export default function SourcingHeroSection() {
  const t = useTranslations('sourcingHero');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';

  return (
    <section id="sourcing-hero" className={`sourcing-hero ${isAr ? 'is-rtl' : ''}`}>
      <LoopingVideoBackground />
      <div className="sourcing-hero-scrim" aria-hidden="true" />

      <div className="container sourcing-hero-inner">
        <div className="sourcing-hero-copy" style={{ textAlign: isAr ? 'right' : 'left' }}>
          <span className="section-tag section-tag--on-dark">{t('kicker')}</span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, color: '#fff', marginBottom: '20px',
            fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
            textWrap: 'balance',
          }}>
            {t('headline')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.86)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '600px' }}>
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

        <div className="sourcing-stats-grid">
          {STAT_KEYS.map((key, i) => (
            <Reveal key={key} delay={200 + i * 110} style={{ textAlign: isAr ? 'right' : 'left' }}>
              <CountUp
                value={t(`stats.${key}.value`)}
                style={{ display: 'block', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: '8px', fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              />
              <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.03em', maxWidth: '18ch' }}>
                {t(`stats.${key}.label`)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Layout rules live in globals.css ("SOURCING HERO") so they can never
          be missing while the page transitions in. */}
    </section>
  );
}
