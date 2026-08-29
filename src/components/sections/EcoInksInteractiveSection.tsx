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
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden',
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
              border: '1px solid rgba(141,184,51,0.1)', borderRadius: '16px',
            }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid rgba(141,184,51,0.2)',
                borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite',
              }} />
            </div>
          )}
          <canvas ref={canvasRef} style={{
            width: '100%', aspectRatio: '16 / 10', display: imagesLoaded ? 'block' : 'none',
            filter: `drop-shadow(0 20px 40px rgba(0, 0, 0, 0.08)) drop-shadow(0 0 20px rgba(141, 184, 51, ${0.1 * glowIntensity}))`,
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
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'الغلاف المعاد تدويره' : 'Recycled Cartridge Shell'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, var(--accent), transparent)` }} />
              </div>
              <div style={{
                position: 'absolute', top: '45%', [isAr ? 'left' : 'right']: '-5%',
                opacity: scrollProgress >= 0.2 && scrollProgress < 0.35 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.2 && scrollProgress < 0.35 ? '0' : (isAr ? slideDistance : -slideDistance)}px)`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row' : 'row-reverse',
              }}>
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'قلب الحبر الحيوي' : 'Bio-based Toner Core'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '90deg' : '270deg'}, var(--accent), transparent)` }} />
              </div>
              <div style={{
                position: 'absolute', bottom: '20%', [isAr ? 'right' : 'left']: '-5%',
                opacity: scrollProgress >= 0.35 && scrollProgress < 0.5 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.35 && scrollProgress < 0.5 ? '0' : (isAr ? -slideDistance : slideDistance)}px)`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'نظام منع التسرب' : 'Zero-Spill Seal System'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, var(--accent), transparent)` }} />
              </div>
            </>
          )}
        </div>

        {/* Caption */}
        <div style={{ textAlign: 'center', maxWidth: '90%', padding: '0 16px', opacity: Math.min(1, scrollProgress * 4) }}>
          <h2 style={{
            color: '#111827', fontSize: 'clamp(1.1rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '8px',
            fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
          }}>
            {isAr ? 'هندسة فائقة الدقة' : 'Precision Engineering'}
          </h2>
          <p style={{ color: '#4B5563', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)' }}>
            {isAr ? 'مصممة لتوفير أداء مثالي مع الحفاظ على البيئة' : 'Designed to deliver optimal performance while preserving the environment.'}
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
