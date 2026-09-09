'use client';

import { useParams } from 'next/navigation';
import { useScrollFrameSequence, framePath } from '@/lib/useScrollFrameSequence';

const TOTAL_FRAMES = 10;
const desktopFramePath = framePath('eco-inks-frames');
const mobileFramePath = framePath('eco-inks-frames-mobile');

export default function EcoInksInteractiveSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  // This section sits below the fold on /eco-inks — the hook defers loading the
  // frame sequence until it's actually about to scroll into view.
  const { sectionRef, canvasRef, scrollProgress, imagesLoaded, isMobile, prefersReducedMotion } =
    useScrollFrameSequence({
      totalFrames: TOTAL_FRAMES, desktopFramePath, mobileFramePath, fit: 'stretch',
      deferUntilNear: true, rootMargin: '600px 0px',
    });
  const distanceToCenter = Math.abs(scrollProgress - 0.5);
  const glowIntensity = Math.max(0, 1 - (distanceToCenter / 0.3));
  const slideDistance = prefersReducedMotion ? 0 : 10;

  return (
    <section ref={sectionRef} style={{
      height: isMobile ? '300vh' : '450vh',
      position: 'relative', background: '#FFFFFF',
    }}>
      <div className="hero-viewport" style={{
        position: 'sticky', top: 0, width: '100%', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
          width: isMobile ? 'clamp(200px, 80vw, 400px)' : 'clamp(300px, 60vw, 800px)',
          height: isMobile ? 'clamp(200px, 80vw, 400px)' : 'clamp(300px, 60vw, 800px)',
          background: `radial-gradient(circle, rgba(141, 184, 51, ${0.1 * glowIntensity}) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', width: 'clamp(280px, 95vw, 1400px)',
          marginBottom: isMobile ? '16px' : '32px', marginTop: isMobile ? '15vh' : '25vh',
        }}>
          {!imagesLoaded && (
            <div style={{
              width: '100%', aspectRatio: '16 / 10', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(141,184,51,0.1)', borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid rgba(141,184,51,0.2)',
                borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite',
              }} />
            </div>
          )}
          <canvas ref={canvasRef} aria-hidden="true" style={{
            width: '100%', aspectRatio: '16 / 10', display: imagesLoaded ? 'block' : 'none',
            // A static shadow: a filter whose value changes with scroll forces
            // the canvas to be re-filtered on every frame, which is the single
            // most expensive thing this section can do. The green glow behind
            // it (above) carries the scroll-reactive part instead.
            filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.08))',
          }} />

          {/* Labels — hidden on mobile */}
          {!isMobile && (
            <>
              <div style={{
                position: 'absolute', top: '20%', [isAr ? 'right' : 'left']: '0%',
                opacity: scrollProgress >= 0.05 && scrollProgress < 0.2 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.05 && scrollProgress < 0.2 ? '0' : (isAr ? -slideDistance : slideDistance)}px)`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'مواد نباتية المصدر' : 'Plant-Based Materials'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, var(--accent), transparent)` }} />
              </div>
              <div style={{
                position: 'absolute', top: '45%', [isAr ? 'left' : 'right']: 'clamp(0px, 2vw, 24px)',
                opacity: scrollProgress >= 0.2 && scrollProgress < 0.35 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.2 && scrollProgress < 0.35 ? '0' : (isAr ? slideDistance : -slideDistance)}px)`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row' : 'row-reverse',
              }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'نظيفة بطبيعتها' : 'Clean by Nature'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '90deg' : '270deg'}, var(--accent), transparent)` }} />
              </div>
              <div style={{
                position: 'absolute', bottom: '20%', [isAr ? 'right' : 'left']: 'clamp(0px, 2vw, 24px)',
                opacity: scrollProgress >= 0.35 && scrollProgress < 0.5 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.35 && scrollProgress < 0.5 ? '0' : (isAr ? -slideDistance : slideDistance)}px)`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'تُغلق في حلقة واحدة' : 'Closed Into a Loop'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, var(--accent), transparent)` }} />
              </div>
            </>
          )}
        </div>

        {/* Caption */}
        <div style={{ textAlign: 'center', maxWidth: '90%', padding: '0 16px', opacity: Math.min(1, scrollProgress * 4) }}>
          <h2 style={{
            color: 'var(--primary)', fontSize: 'clamp(1.1rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '8px',
            fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
          }}>
            {isAr ? 'دورة مغلقة، بالتصميم' : 'A Closed Loop, By Design'}
          </h2>
          <p style={{ color: '#4B5563', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)' }}>
            {isAr ? 'مصدرها الطبيعة، ومصمّمة لتعود إلى الدورة نفسها.' : 'Sourced from nature, engineered to go back into the cycle.'}
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
