'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useScrollFrameSequence, framePath } from '@/lib/useScrollFrameSequence';

// Nine frames, not ten: the original set had 06 and 07 byte-identical, which
// showed as a dead stop right at the turnaround of the ping-pong timeline. The
// duplicate was dropped and the rest renumbered, so every frame now advances.
const TOTAL_FRAMES = 9;
const desktopFramePath = framePath('video-frames');
const mobileFramePath = framePath('video-frames-mobile');

export default function HeroSection() {
  const t = useTranslations('hero');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [headlineVisible, setHeadlineVisible] = useState(false);

  // These four elements' transform/opacity are driven straight from scroll
  // position on every single rAF tick while scrolling. Writing them via
  // refs below (instead of through scrollProgress state -> JSX -> React's
  // reconciler) skips a render+diff pass for the whole hero subtree 60x/sec.
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotionRef = useRef(false);

  const applyScrollTransforms = useCallback((progress: number) => {
    const p = prefersReducedMotionRef.current ? 0 : progress;
    if (canvasWrapperRef.current) {
      canvasWrapperRef.current.style.opacity = progress < 0.85 ? '1' : String(1 - (progress - 0.85) / 0.15);
      canvasWrapperRef.current.style.transform = `scale(${1 + p * 0.05})`;
    }
    if (headlineRef.current) headlineRef.current.style.transform = `translateY(${p * -50}px)`;
    if (subtitleRef.current) subtitleRef.current.style.transform = `translateY(${p * -80}px)`;
    if (ctaRef.current) ctaRef.current.style.transform = `translateY(${p * -110}px)`;
  }, []);

  const { sectionRef, canvasRef, scrollProgress, imagesLoaded, isMobile, prefersReducedMotion } =
    useScrollFrameSequence({
      totalFrames: TOTAL_FRAMES, desktopFramePath, mobileFramePath, fit: 'contain',
      onProgress: applyScrollTransforms,
    });
  useEffect(() => { prefersReducedMotionRef.current = prefersReducedMotion; }, [prefersReducedMotion]);

  useEffect(() => {
    const timer = setTimeout(() => setHeadlineVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // The eco accent brightens as the teardown reaches its midpoint — the one
  // piece of motion left in the hero, and it is tied to scroll (it means
  // "you're at the eco-ink stage"), not a perpetual decorative loop.
  const distanceToCenter = Math.abs(scrollProgress - 0.5);
  const ecoGlow = Math.max(0, 1 - (distanceToCenter / 0.25));

  const getPhaseLabel = (): string => {
    if (scrollProgress < 0.1) return isAr ? 'الهيكل الخارجي' : 'Exterior Shell';
    if (scrollProgress < 0.25) return isAr ? 'فتح الغطاء العلوي' : 'Opening Top Cover';
    if (scrollProgress < 0.4) return isAr ? 'الأجزاء الداخلية' : 'Internal Components';
    if (scrollProgress < 0.6) return isAr ? 'وحدة الحبر البيئي' : 'Eco Ink Unit';
    return isAr ? 'إعادة التجميع' : 'Reassembly';
  };

  const partLabel = (topOrBottom: React.CSSProperties, active: boolean, side: 'start' | 'end', text: string) => {
    const onStart = (side === 'start') !== isAr; // logical → physical
    return (
      <div style={{
        position: 'absolute', ...topOrBottom, [onStart ? 'left' : 'right']: isMobile ? '2%' : '-5%',
        opacity: active ? 1 : 0,
        transform: `translateX(${active ? '0' : (onStart ? '-14px' : '14px')})`,
        transition: 'opacity 400ms ease, transform 400ms ease',
        display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'none',
        flexDirection: onStart ? 'row' : 'row-reverse',
      }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{text}</span>
        <div style={{ width: 'clamp(36px, 7vw, 72px)', height: '2px', background: `linear-gradient(${onStart ? '90deg' : '270deg'}, var(--accent), transparent)` }} />
      </div>
    );
  };

  return (
    <section id="hero" ref={sectionRef} className="hero-section" style={{ height: isMobile ? '220vh' : '320vh', position: 'relative' }}>
      <div className="hero-viewport" style={{
        position: 'sticky', top: 0, width: '100%', overflow: 'hidden',
        backgroundImage: `linear-gradient(135deg, var(--bg-darker) 0%, var(--primary) ${30 + ecoGlow * 20}%, ${ecoGlow > 0.5 ? '#2A4F1E' : 'var(--bg-darker)'} 100%)`,
        transition: 'background-image 400ms linear',
      }}>
        {/* Static ambient glow — brightness follows scroll (ecoGlow), no perpetual pulse. */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)',
          width: isMobile ? 'clamp(250px, 80vw, 400px)' : 'clamp(400px, 60vw, 900px)',
          height: isMobile ? 'clamp(250px, 80vw, 400px)' : 'clamp(400px, 60vw, 900px)',
          background: `radial-gradient(circle, rgba(141, 184, 51, ${0.05 + ecoGlow * 0.10}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%',
          padding: isMobile ? '80px 16px 32px' : '90px 24px 32px',
          position: 'relative', zIndex: 2,
        }}>
          {/* Canvas teardown */}
          <div ref={canvasWrapperRef} style={{
            position: 'relative', marginBottom: isMobile ? '40px' : '48px', width: '100%',
            maxWidth: isMobile ? '100%' : '600px', flex: '1 1 auto', minHeight: '100px', maxHeight: isMobile ? '25vh' : '35vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 1, transform: 'scale(1)', willChange: 'transform',
          }}>
            {!imagesLoaded && (
              <div style={{
                width: '100%', aspectRatio: '16 / 10', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(141,184,51,0.15)',
              }}>
                <div style={{
                  width: '40px', height: '40px', border: '3px solid rgba(141,184,51,0.2)', borderTopColor: 'var(--accent)',
                  borderRadius: '50%', animation: 'ui-loading-spin 800ms linear infinite',
                }} />
              </div>
            )}
            <canvas ref={canvasRef} style={{
              width: '100%', aspectRatio: '16 / 10', display: imagesLoaded ? 'block' : 'none',
              filter: `drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4)) drop-shadow(0 8px 24px rgba(141, 184, 51, ${0.1 + ecoGlow * 0.2}))`,
            }} />

            {/* Part labels — informative, hidden on the smallest screens. */}
            {!isMobile && (
              <>
                {partLabel({ top: '15%' }, scrollProgress >= 0.1 && scrollProgress < 0.25, 'start', isAr ? 'الغطاء العلوي' : 'Top Cover Unit')}
                {partLabel({ top: '40%' }, scrollProgress >= 0.25 && scrollProgress < 0.4, 'end', isAr ? 'لوحة التحكم والمحرك' : 'Mainboard & Engine')}
                {partLabel({ bottom: '25%' }, scrollProgress >= 0.4 && scrollProgress < 0.6, 'start', isAr ? 'وحدة الحبر الصديق للبيئة' : 'Eco Toner Cartridge')}
              </>
            )}

            {/* Phase label */}
            {scrollProgress > 0.05 && (
              <div style={{
                position: 'absolute', bottom: isMobile ? '-30px' : '-40px', left: '50%', transform: 'translateX(-50%)',
                opacity: Math.min(1, scrollProgress * 5), pointerEvents: 'none',
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(141,184,51,0.25)', borderRadius: 'var(--radius-md)',
                  padding: isMobile ? '4px 12px' : '6px 16px', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px rgba(141,184,51,0.6)' }} />
                  <span style={{
                    color: 'rgba(255,255,255,0.75)', fontSize: isMobile ? 'var(--text-2xs)' : 'var(--text-xs)', fontWeight: 600,
                    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
                    letterSpacing: isAr ? '0' : '0.05em',
                  }}>{getPhaseLabel()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Headline block */}
          <div style={{
            textAlign: 'center', opacity: headlineVisible ? 1 : 0,
            transform: headlineVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 700ms var(--ease-ink), transform 700ms var(--ease-ink)',
            marginTop: isMobile ? '12px' : '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: isMobile ? '12px' : '14px', padding: isMobile ? '0 8px' : '0',
            flexShrink: 0,
          }}>
            {/* Eco eyebrow — brightens with the teardown midpoint, no glyph, no loop. */}
            <div style={{
              opacity: ecoGlow > 0.25 ? Math.min(1, ecoGlow + 0.15) : 0.55,
              transition: 'opacity 300ms ease',
              background: 'rgba(141,184,51,0.10)', border: '1px solid rgba(141,184,51,0.28)',
              borderRadius: 'var(--radius-pill)', padding: isMobile ? '6px 16px' : '7px 20px',
            }}>
              <span style={{
                color: 'var(--accent)', fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                fontWeight: 600, letterSpacing: isAr ? '0' : '0.02em',
              }}>
                {isAr ? 'حبر صديق للبيئة' : 'Ink engineered for Earth'}
              </span>
            </div>

            <h1 ref={headlineRef} style={{
              fontSize: isMobile ? 'clamp(1.7rem, 7vw, 2.5rem)' : 'clamp(2.4rem, 6vw, 5rem)',
              fontWeight: 800, color: '#FFFFFF',
              lineHeight: 1.08, letterSpacing: isAr ? '0' : '-1.5px',
              fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
              margin: 0,
            }}>
              {t('headline')}
            </h1>
            <p ref={subtitleRef} style={{
              fontSize: isMobile ? 'var(--text-base)' : 'clamp(1rem, 2vw, 1.3rem)',
              color: 'rgba(255,255,255,0.72)', maxWidth: isMobile ? '100%' : '560px', margin: '0 auto', lineHeight: 1.6,
            }}>
              {t('subtitle')}
            </p>
            <a ref={ctaRef} href={`/${locale}#contact`} className="btn-primary hero-cta" style={{
              fontSize: isMobile ? 'var(--text-base)' : 'var(--text-md)',
              padding: isMobile ? '14px 28px' : '16px 40px',
              height: 'auto', marginTop: isMobile ? '8px' : '10px',
              boxShadow: 'var(--shadow-lg)', maxWidth: isMobile ? '280px' : 'none',
            }}>
              {t('cta')}
            </a>
          </div>

          {/* Scroll indicator */}
          {scrollProgress < 0.08 && (
            <div style={{
              position: 'absolute', bottom: isMobile ? '32px' : '48px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              animation: prefersReducedMotion ? 'none' : 'heroHint 2.4s ease-in-out infinite',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? 'var(--text-2xs)' : 'var(--text-xs)', letterSpacing: '0.1em' }}>
                {t('scrollHint')}
              </span>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)' }} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes heroHint { 0%, 100% { transform: translate(-50%, 0); opacity: 0.7; } 50% { transform: translate(-50%, 6px); opacity: 1; } }
      `}</style>
    </section>
  );
}
