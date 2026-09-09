'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { usePrinterCinematic, type CinematicPhaseKey } from '@/lib/usePrinterCinematic';
import MagneticButton from '@/components/ui/MagneticButton';

const DESKTOP_TOTAL_FRAMES = 1120;
const MOBILE_TOTAL_FRAMES = 700;
const cinematicFramePath = (dir: string) => (index: number) => `/${dir}/${String(index + 1).padStart(4, '0')}.webp`;
const desktopFramePath = cinematicFramePath('printer-cinematic/desktop');
const mobileFramePath = cinematicFramePath('printer-cinematic/mobile');

// Where each serviceable assembly sits in the exploded-stack composition
// (percent of the canvas box) — the camera holds this same vertical stack
// throughout the component-descent shot, so a fixed anchor per part tracks
// it closely without per-frame vision analysis. `side` picks which canvas
// edge the leader line runs to, alternating so labels don't stack.
const CALLOUT_ANCHORS: Partial<Record<CinematicPhaseKey, { x: number; y: number; side: 'left' | 'right' }>> = {
  scanner: { x: 47, y: 15, side: 'right' },
  imaging: { x: 53, y: 34, side: 'left' },
  fuser: { x: 46, y: 45, side: 'right' },
  paperFeed: { x: 54, y: 55, side: 'left' },
  electronics: { x: 58, y: 67, side: 'right' },
  cassette: { x: 50, y: 87, side: 'left' },
};

export default function HeroSection() {
  const t = useTranslations('hero');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [headlineVisible, setHeadlineVisible] = useState(false);

  // Headline/subtitle/CTA transform+fade is driven straight from scroll
  // position on every rAF tick via refs, skipping a render+diff pass for the
  // whole hero subtree 60x/sec — the printer's own motion lives inside the
  // canvas via usePrinterCinematic.
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);

  const applyScrollTransforms = useCallback((progress: number) => {
    const p = prefersReducedMotionRef.current ? 0 : progress;
    // Fully faded out by 12% scroll — the headline stack is a hero-moment
    // intro, not something that should compete with the cinematic sequence.
    const opacity = String(Math.max(0, 1 - p / 0.12));
    if (headlineRef.current) Object.assign(headlineRef.current.style, { transform: `translateY(${p * -50}px)`, opacity });
    if (subtitleRef.current) Object.assign(subtitleRef.current.style, { transform: `translateY(${p * -80}px)`, opacity });
    if (ctaRef.current) Object.assign(ctaRef.current.style, { transform: `translateY(${p * -110}px)`, opacity });
    if (ctaContainerRef.current) Object.assign(ctaContainerRef.current.style, { transform: `translateY(${p * -110}px)`, opacity });
    if (eyebrowRef.current) eyebrowRef.current.style.opacity = opacity;
  }, []);

  const { sectionRef, canvasRef, scrollProgress, firstFrameReady, frameRect, isMobile, prefersReducedMotion, phase } =
    usePrinterCinematic({
      desktopTotalFrames: DESKTOP_TOTAL_FRAMES,
      mobileTotalFrames: MOBILE_TOTAL_FRAMES,
      desktopFramePath,
      mobileFramePath,
      onProgress: applyScrollTransforms,
    });
  useEffect(() => { prefersReducedMotionRef.current = prefersReducedMotion; }, [prefersReducedMotion]);

  useEffect(() => {
    const timer = setTimeout(() => setHeadlineVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // A soft spotlight that brightens through the engineering/examine window
  // (internal architecture through reassembly) and settles back down for the
  // hero bookends — ties the studio lighting to "you're inspecting the
  // machine now," not a perpetual decorative loop.
  const distanceToExamineCenter = Math.abs(scrollProgress - 0.55);
  const examineGlow = Math.max(0, 1 - distanceToExamineCenter / 0.45);

  const phaseLabel = isAr ? phase.ar : phase.en;
  const phaseDesc = isAr ? phase.descAr : phase.descEn;
  const framePct = !isMobile ? CALLOUT_ANCHORS[phase.key] : undefined;
  // CALLOUT_ANCHORS is calibrated against the source 16:9 frame, not the
  // canvas box — the box can be pillar/letterboxed at odd viewport sizes, so
  // remap through frameRect to keep the dot glued to the printer.
  const anchor = framePct ? {
    x: frameRect.xPct + (framePct.x / 100) * frameRect.widthPct,
    y: frameRect.yPct + (framePct.y / 100) * frameRect.heightPct,
    side: framePct.side,
  } : undefined;
  const labelX = anchor ? (anchor.side === 'right' ? 96 : 4) : 0;

  return (
    <section id="hero" ref={sectionRef} className="hero-section" style={{ height: isMobile ? '380vh' : '480vh', position: 'relative' }}>
      <div className="hero-viewport" style={{
        position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden',
        backgroundImage: `radial-gradient(120% 90% at 50% 22%, rgba(141,184,51,${0.05 + examineGlow * 0.06}) 0%, transparent 55%), linear-gradient(180deg, #0A0A0A 0%, var(--bg-darker) 55%, #060606 100%)`,
        transition: 'background-image 400ms linear',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)',
          width: isMobile ? 'clamp(250px, 80vw, 400px)' : 'clamp(400px, 60vw, 900px)',
          height: isMobile ? 'clamp(250px, 80vw, 400px)' : 'clamp(400px, 60vw, 900px)',
          background: `radial-gradient(circle, rgba(141, 184, 51, ${0.05 + examineGlow * 0.10}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%',
          padding: isMobile ? '112px 16px 28px' : '120px 24px 28px',
          position: 'relative', zIndex: 2,
        }}>
          {/* Eyebrow + compact headline — fades in on mount, then fades out early on scroll so the cinematic sequence becomes the whole scene. */}
          <div style={{
            opacity: headlineVisible ? 1 : 0, transform: headlineVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms var(--ease-ink), transform 700ms var(--ease-ink)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
          }}>
            <div ref={eyebrowRef} style={{
              marginBottom: isMobile ? '10px' : '14px',
              background: 'rgba(141,184,51,0.10)', border: '1px solid rgba(141,184,51,0.28)',
              borderRadius: 'var(--radius-pill)', padding: isMobile ? '5px 14px' : '6px 18px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  animation: prefersReducedMotion ? 'none' : 'badge-shimmer 4s ease-in-out infinite',
                  pointerEvents: 'none',
                }}
              />
              <span style={{ color: 'var(--accent)', fontSize: isMobile ? 'var(--text-2xs)' : 'var(--text-xs)', fontWeight: 600, letterSpacing: isAr ? '0' : '0.14em', textTransform: isAr ? 'none' : 'uppercase', position: 'relative', zIndex: 1 }}>
                {isAr ? 'مصممة للأداء والدقة' : 'Engineered for performance'}
              </span>
            </div>

            <h1 ref={headlineRef} style={{
              fontSize: isMobile ? 'clamp(1.4rem, 5.5vw, 1.9rem)' : 'clamp(1.9rem, 4vw, 3.2rem)',
              fontWeight: 800, color: '#FFFFFF', textAlign: 'center',
              lineHeight: 1.1, letterSpacing: isAr ? '0' : '-1px',
              fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
              margin: '0 0 8px',
            }}>
              {t('headline')}
            </h1>
            <p ref={subtitleRef} style={{
              fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
              color: 'rgba(255,255,255,0.72)', maxWidth: isMobile ? '92%' : '520px', margin: '0 auto', lineHeight: 1.5,
              textAlign: 'center',
            }}>
              {t('subtitle')}
            </p>
          </div>

          {/* Cinematic scroll sequence — occupies most of the viewport, the printer is the scene. */}
          <div style={{
            position: 'relative', margin: isMobile ? '16px 0 0' : '18px 0 0', width: '100%',
            maxWidth: isMobile ? '100%' : '1180px', flex: '1 1 auto', minHeight: '80px',
            maxHeight: isMobile ? '40vh' : '62vh', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* No aspect-ratio here on purpose — the wrapper's real height is the hard
                constraint (flex + maxHeight above), and drawFrame already letterboxes
                any source frame to fit whatever box shape the canvas actually gets. An
                aspect-ratio on the canvas would instead derive height from width and
                silently overflow the wrapper on short viewports. */}
            {!firstFrameReady && (
              <div style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(141,184,51,0.15)',
              }}>
                <div style={{
                  width: '40px', height: '40px', border: '3px solid rgba(141,184,51,0.2)', borderTopColor: 'var(--accent)',
                  borderRadius: '50%', animation: 'ui-loading-spin 800ms linear infinite',
                }} />
              </div>
            )}
            <canvas ref={canvasRef} style={{
              width: '100%', height: '100%', display: firstFrameReady ? 'block' : 'none',
              filter: `drop-shadow(0 20px 60px rgba(0, 0, 0, 0.5)) drop-shadow(0 8px 24px rgba(141, 184, 51, ${0.08 + examineGlow * 0.16}))`,
            }} />

            {/* Component leader-line callout (desktop only) — anchor dot + thin line to an edge-docked label card. */}
            {firstFrameReady && anchor && phaseLabel && (
              <>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
                  <line
                    x1={anchor.x} y1={anchor.y} x2={labelX} y2={anchor.y}
                    stroke="rgba(255,255,255,0.35)" strokeWidth={1} vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div style={{
                  position: 'absolute', left: `${anchor.x}%`, top: `${anchor.y}%`, transform: 'translate(-50%, -50%)',
                  width: '9px', height: '9px', borderRadius: '50%', background: 'var(--accent)',
                  boxShadow: '0 0 10px rgba(141,184,51,0.7)', animation: prefersReducedMotion ? 'none' : 'calloutPulse 1.8s ease-in-out infinite',
                }} />
                <div key={phase.key} style={{
                  position: 'absolute', top: `${anchor.y}%`, left: `${labelX}%`,
                  transform: `translate(${anchor.side === 'right' ? '-100%' : '0%'}, -50%)`,
                  maxWidth: isMobile ? '160px' : '230px', textAlign: anchor.side === 'right' ? 'right' : 'left',
                  background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(141,184,51,0.25)', borderRadius: 'var(--radius-md)',
                  padding: '8px 14px', animation: prefersReducedMotion ? 'none' : 'calloutIn 350ms var(--ease-ink)',
                }}>
                  <div style={{
                    color: 'var(--accent)', fontSize: 'var(--text-xs)', fontWeight: 700,
                    letterSpacing: isAr ? '0' : '0.1em', textTransform: isAr ? 'none' : 'uppercase',
                    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
                  }}>{phaseLabel}</div>
                  {phaseDesc && (
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-2xs)', lineHeight: 1.4, marginTop: '3px' }}>
                      {phaseDesc}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Broad story-beat pill (mobile always; desktop only when no component anchor is active).
                Docked just inside the box, not below it — the wrapper clips overflow (needed so a
                pillar/letterboxed frame never spills past its bounds), so a negative offset here
                would render the pill invisible instead of floating below the canvas. */}
            {firstFrameReady && phaseLabel && !anchor && (
              <div style={{
                position: 'absolute', bottom: isMobile ? '10px' : '14px', left: '50%', transform: 'translateX(-50%)',
                pointerEvents: 'none', textAlign: 'center',
              }}>
                <div key={phase.key} style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(141,184,51,0.25)', borderRadius: 'var(--radius-md)',
                  padding: isMobile ? '4px 12px' : '6px 18px', whiteSpace: 'nowrap',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  animation: prefersReducedMotion ? 'none' : 'calloutIn 350ms var(--ease-ink)',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px rgba(141,184,51,0.6)' }} />
                  <span style={{
                    color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 'var(--text-2xs)' : 'var(--text-xs)', fontWeight: 600,
                    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
                    letterSpacing: isAr ? '0' : '0.12em', textTransform: isAr ? 'none' : 'uppercase',
                  }}>{phaseLabel}</span>
                </div>
                {isMobile && phaseDesc && (
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-2xs)', marginTop: '6px', maxWidth: '260px' }}>
                    {phaseDesc}
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={ctaContainerRef} style={{
            opacity: headlineVisible ? 1 : 0, transform: headlineVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms var(--ease-ink) 150ms, transform 700ms var(--ease-ink) 150ms', flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '10px' : '14px',
            marginTop: isMobile ? '16px' : '22px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              flexDirection: isMobile ? 'column' : (isAr ? 'row-reverse' : 'row'),
              width: isMobile ? '100%' : 'auto', justifyContent: 'center',
            }}>
              <MagneticButton magneticPull={10}>
                <a ref={ctaRef} href={`/${locale}#contact`} className="btn-primary hero-cta" style={{
                  fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
                  padding: isMobile ? '12px 24px' : '14px 34px',
                  height: 'auto',
                  boxShadow: 'var(--shadow-lg)', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '280px' : 'none', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {t('cta')}
                </a>
              </MagneticButton>

              <MagneticButton magneticPull={8}>
                <a href={`/${locale}/printers`} className="btn-secondary" style={{
                  fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
                  padding: isMobile ? '11px 22px' : '13px 28px',
                  height: 'auto',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '280px' : 'none', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.25s ease',
                  flexDirection: isAr ? 'row-reverse' : 'row',
                }}>
                  {isAr ? 'استعراض أسطول الطابعات' : 'Browse Fleet Inventory'}
                  <span style={{ fontSize: '1.1em', transform: isAr ? 'rotate(180deg)' : 'none' }}>→</span>
                </a>
              </MagneticButton>
            </div>

            {/* Verified B2B trust signals strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '14px',
              color: 'rgba(255,255,255,0.68)', fontSize: isMobile ? '0.72rem' : '0.8rem',
              fontWeight: 500, flexWrap: 'wrap', justifyContent: 'center',
              letterSpacing: isAr ? '0' : '0.02em',
              flexDirection: isAr ? 'row-reverse' : 'row',
            }}>
              <span>{isAr ? '✓ ضمان FNG لمدة ١٢ شهراً' : '✓ 12-Month FNG Warranty'}</span>
              <span style={{ opacity: 0.35 }}>•</span>
              <span>{isAr ? '✓ فحص تقني من ٤٠ نقطة' : '✓ 40-Point Diagnostic'}</span>
              <span style={{ opacity: 0.35 }}>•</span>
              <span>{isAr ? '✓ تسليم مباشر في دول الخليج' : '✓ GCC Direct Delivery'}</span>
            </div>
          </div>

          {/* Scroll indicator — always occupies real flex space (never position:absolute
              pinned to the viewport bottom) so it can never overlap the CTA above it on
              shorter viewports; it only fades via opacity as the visitor starts scrolling. */}
          <div style={{
            marginTop: isMobile ? '12px' : '16px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            opacity: scrollProgress < 0.05 ? 1 : 0,
            transition: 'opacity 300ms ease',
            pointerEvents: 'none',
          }}>
            {/* Sleek 21st.dev mouse scroll wheel */}
            <div style={{
              width: '18px', height: '28px', borderRadius: '10px',
              border: '1.5px solid rgba(141, 184, 51, 0.5)',
              display: 'flex', justifyContent: 'center', padding: '3px 0',
              boxShadow: '0 0 10px rgba(141,184,51,0.15)',
            }}>
              <div style={{
                width: '3px', height: '6px', borderRadius: '2px', background: 'var(--accent)',
                animation: prefersReducedMotion ? 'none' : 'mouseScroll 1.8s ease-in-out infinite',
              }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: isMobile ? 'var(--text-2xs)' : 'var(--text-xs)', letterSpacing: isAr ? '0' : '0.08em', fontWeight: 500 }}>
              {t('scrollHint')}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mouseScroll {
          0% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(8px); opacity: 0; }
          61% { transform: translateY(0); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes heroHint { 0%, 100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(6px); opacity: 1; } }
        @keyframes calloutIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes calloutPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </section>
  );
}
