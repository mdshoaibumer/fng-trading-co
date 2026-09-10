'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { usePrinterCinematic, CINEMATIC_PHASES } from '@/lib/usePrinterCinematic';
import MagneticButton from '@/components/ui/MagneticButton';

// Frame counts come from public/printer-hero/manifest.json, written by
// scripts/build-printer-frames.mjs from assets-source/printer-story/hero-sequence.json.
const DESKTOP_TOTAL_FRAMES = 781;
const MOBILE_TOTAL_FRAMES = 391;
const heroFramePath = (dir: string) => (index: number) => `/printer-hero/${dir}/${String(index + 1).padStart(4, '0')}.webp`;
const desktopFramePath = heroFramePath('desktop');
const mobileFramePath = heroFramePath('mobile');

const FEATURES: { key: 'warranty' | 'inspection' | 'sustainable'; icon: ReactNode }[] = [
  {
    key: 'warranty',
    icon: <><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
  },
  {
    key: 'inspection',
    icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  },
  {
    key: 'sustainable',
    icon: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>,
  },
];

export default function HeroSection() {
  const t = useTranslations('hero');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const fontFamily = isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif';

  const { sectionRef, canvasRef, scrollProgress, firstFrameReady, isMobile, prefersReducedMotion, phase } =
    usePrinterCinematic({
      desktopTotalFrames: DESKTOP_TOTAL_FRAMES,
      mobileTotalFrames: MOBILE_TOTAL_FRAMES,
      desktopFramePath,
      mobileFramePath,
    });

  // The copy column stays put while the section is pinned — it's the value
  // proposition, not an intro to fade away. Only the printer column scrubs,
  // and the step readout + segmented rail under it give the long pin a
  // visible sense of progress. Reduced motion drops the pin entirely: the hook
  // holds the assembled frame, so there's nothing to scroll through.
  const pinned = !prefersReducedMotion;
  const stepIndex = Math.max(0, CINEMATIC_PHASES.findIndex((p) => p.key === phase.key));
  const phaseLabel = isAr ? phase.ar : phase.en;
  const phaseDesc = isAr ? phase.descAr : phase.descEn;
  const pad2 = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-section"
      style={{ position: 'relative', height: pinned ? (isMobile ? '300vh' : '340vh') : 'auto' }}
    >
      <div className="hero-viewport" style={{
        position: pinned ? 'sticky' : 'relative', top: 0, height: '100svh', minHeight: '560px', overflow: 'hidden',
        background: 'linear-gradient(160deg, var(--bg-darker) 0%, var(--primary) 58%, #12301F 100%)',
      }}>
        <div className="container hero-grid">
          {/* Entrance is a CSS animation, not JS state: the headline is the LCP
              element, so it must paint straight from the server HTML rather
              than wait for hydration to flip an opacity. No manual column/flex
              flipping for Arabic anywhere below — the document is dir="rtl",
              which already mirrors grid and flex flow. */}
          <div className="hero-copy" style={{ textAlign: 'start' }}>
            <span className="section-tag section-tag--on-dark hero-eyebrow">{t('eyebrow')}</span>
            <h1 className="hero-title" style={{ fontFamily, letterSpacing: isAr ? '0' : '-0.02em' }}>
              {t('headlineLine1')}
              <br />
              {t('headlineLine2')}
            </h1>
            <p className="hero-lede">{t('lede')}</p>

            <div className="hero-ctas">
              <MagneticButton magneticPull={10}>
                <a href={`/${locale}#contact`} className="btn-primary hero-cta">{t('ctaQuote')}</a>
              </MagneticButton>
              <MagneticButton magneticPull={8}>
                <a href={`/${locale}/printers`} className="btn-secondary">{t('ctaExplore')}</a>
              </MagneticButton>
            </div>

            <ul className="hero-features">
              {FEATURES.map(({ key, icon }) => (
                <li key={key}>
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icon}
                  </svg>
                  <div className="hero-feature-title">{t(`features.${key}.title`)}</div>
                  <div className="hero-feature-desc">{t(`features.${key}.desc`)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-stage">
            <div className="hero-canvas-box">
              {/* Studio integration for the alpha-cut frames: a soft key-light
                  pool behind the printer and a contact shadow under it. The
                  background remover strips the original floor shadow, so
                  without this the printer reads as pasted on. */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: '6% 4% 10%', pointerEvents: 'none',
                background: 'radial-gradient(closest-side, rgba(141,184,51,0.14), rgba(141,184,51,0.04) 60%, transparent)',
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute', left: '20%', right: '20%', bottom: '3%', height: '9%', pointerEvents: 'none',
                background: 'radial-gradient(closest-side, rgba(0,0,0,0.5), transparent)', filter: 'blur(4px)',
              }} />
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={t('stageAlt')}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  opacity: firstFrameReady ? 1 : 0, transition: 'opacity 600ms var(--ease-ink)',
                  // The explode shot lifts the scanner past the top of the source
                  // frame; feather that edge so the cut never reads as a hard line.
                  maskImage: 'linear-gradient(to bottom, transparent 0, #000 7%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 7%)',
                }}
              />
            </div>

            <div className="hero-stage-footer">
              <div aria-live="polite" style={{ textAlign: 'start', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>
                    {pad2(stepIndex + 1)}<span style={{ color: 'rgba(255,255,255,0.4)' }}> / {pad2(CINEMATIC_PHASES.length)}</span>
                  </span>
                  <span key={phase.key} style={{
                    color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700, fontFamily,
                    letterSpacing: isAr ? '0' : '0.08em', textTransform: isAr ? 'none' : 'uppercase',
                    animation: prefersReducedMotion ? 'none' : 'heroStepIn 350ms var(--ease-ink)',
                  }}>
                    {phaseLabel}
                  </span>
                </div>
                <div className="hero-step-desc">{phaseDesc}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                {pinned && (
                  <span style={{
                    color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-2xs)', letterSpacing: isAr ? '0' : '0.08em', fontWeight: 500,
                    opacity: scrollProgress < 0.03 ? 1 : 0, transition: 'opacity 300ms ease',
                  }}>
                    {t('stageHint')}
                  </span>
                )}
                <div aria-hidden="true" className="hero-rail">
                  {CINEMATIC_PHASES.map((p) => {
                    const fill = Math.max(0, Math.min(1, (scrollProgress - p.start) / (p.end - p.start)));
                    return (
                      <span key={p.key} className="hero-rail-seg">
                        <span style={{
                          position: 'absolute', inset: 0, background: 'var(--accent)', transformOrigin: isAr ? 'right' : 'left',
                          transform: `scaleX(${fill})`,
                        }} />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          align-items: center;
          gap: clamp(24px, 4vw, 64px);
          padding-top: clamp(96px, 13vh, 132px);
          padding-bottom: clamp(24px, 5vh, 56px);
        }
        .hero-copy { animation: heroCopyIn 700ms var(--ease-ink) both; }
        @keyframes heroCopyIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hero-copy { animation: none; } }
        .hero-eyebrow { margin-bottom: 20px; }
        .hero-title {
          font-size: clamp(2.1rem, 4.4vw, 3.9rem);
          font-weight: 800;
          line-height: 1.06;
          color: #fff;
          margin: 0 0 20px;
          text-wrap: balance;
        }
        .hero-lede {
          color: rgba(255,255,255,0.72);
          font-size: clamp(1rem, 1.35vw, 1.2rem);
          line-height: 1.6;
          max-width: 34rem;
          margin: 0 0 32px;
        }
        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-features {
          list-style: none;
          padding: 0;
          margin: clamp(32px, 6vh, 56px) 0 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          max-width: 36rem;
          color: var(--accent);
        }
        .hero-feature-title { color: #fff; font-weight: 700; font-size: var(--text-sm); margin-top: 12px; }
        .hero-feature-desc { color: rgba(255,255,255,0.6); font-size: var(--text-xs); margin-top: 2px; }
        .hero-stage {
          height: min(76vh, 720px);
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .hero-canvas-box { position: relative; flex: 1 1 auto; min-height: 0; }
        .hero-stage-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .hero-step-desc {
          color: rgba(255,255,255,0.6);
          font-size: var(--text-xs);
          line-height: 1.45;
          margin-top: 4px;
          min-height: 1.45em;
        }
        .hero-rail { display: flex; gap: 4px; }
        .hero-rail-seg {
          position: relative;
          width: 26px;
          height: 2px;
          overflow: hidden;
          border-radius: 1px;
          background: rgba(255,255,255,0.16);
        }
        @keyframes heroStepIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto minmax(0, 1fr);
            align-items: stretch;
            gap: 12px;
            padding-top: 96px;
            padding-bottom: 16px;
          }
          .hero-eyebrow { margin-bottom: 10px; }
          .hero-title { font-size: clamp(1.7rem, 7vw, 2.4rem); margin-bottom: 10px; }
          .hero-lede { font-size: var(--text-sm); margin-bottom: 16px; }
          .hero-features { display: none; }
          .hero-stage { height: auto; }
          .hero-rail-seg { width: 18px; }
        }
        @media (max-width: 480px) {
          .hero-ctas > * { flex: 1 1 0; }
          .hero-ctas a { width: 100%; padding-inline: 16px; }
        }
      `}</style>
    </section>
  );
}
