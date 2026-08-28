'use client';

import { useRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const TOTAL_FRAMES = 10;
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `/eco-inks-frames/${num}.png`;
});

export default function EcoInksInteractiveSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // This section sits below the fold on /eco-inks — defer the ~4.3MB frame
  // sequence until it's actually about to scroll into view instead of
  // loading it eagerly the moment the page mounts.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); observer.disconnect(); } },
      { rootMargin: '600px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const drawFrame = (frameIndex: number, images?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgs = images || imagesRef.current;
    const img = imgs[frameIndex];
    if (!img || !img.complete) return;
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
  };

  const handleScroll = () => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrolled = -rect.top;
    const totalScroll = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
    setScrollProgress(progress);
    const totalSteps = TOTAL_FRAMES * 2 - 2;
    const step = Math.min(totalSteps, Math.floor(progress * (totalSteps + 1)));
    const frameIndex = step < TOTAL_FRAMES ? step : totalSteps - step;
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  };

  useEffect(() => {
    if (!shouldLoad) return;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    FRAME_PATHS.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => { loadedCount++; if (loadedCount === TOTAL_FRAMES) { setImagesLoaded(true); drawFrame(0, images); } };
      img.onerror = () => { loadedCount++; if (loadedCount === TOTAL_FRAMES) setImagesLoaded(true); };
      images[index] = img;
    });
    imagesRef.current = images;
  }, [shouldLoad]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => drawFrame(currentFrameRef.current), { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distanceToCenter = Math.abs(scrollProgress - 0.5);
  const glowIntensity = Math.max(0, 1 - (distanceToCenter / 0.3));

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
                borderTopColor: '#8DB833', borderRadius: '50%', animation: 'spin 1s linear infinite',
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
                transform: `translateX(${scrollProgress >= 0.05 && scrollProgress < 0.2 ? '0' : (isAr ? '-10px' : '10px')})`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'الغلاف المعاد تدويره' : 'Recycled Cartridge Shell'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, #8DB833, transparent)` }} />
              </div>
              <div style={{
                position: 'absolute', top: '45%', [isAr ? 'left' : 'right']: '-5%',
                opacity: scrollProgress >= 0.2 && scrollProgress < 0.35 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.2 && scrollProgress < 0.35 ? '0' : (isAr ? '10px' : '-10px')})`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row' : 'row-reverse',
              }}>
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'قلب الحبر الحيوي' : 'Bio-based Toner Core'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '90deg' : '270deg'}, #8DB833, transparent)` }} />
              </div>
              <div style={{
                position: 'absolute', bottom: '20%', [isAr ? 'right' : 'left']: '-5%',
                opacity: scrollProgress >= 0.35 && scrollProgress < 0.5 ? 1 : 0,
                transform: `translateX(${scrollProgress >= 0.35 && scrollProgress < 0.5 ? '0' : (isAr ? '-10px' : '10px')})`,
                transition: 'all 150ms ease-out', display: 'flex', alignItems: 'center', gap: '8px',
                pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  {isAr ? 'نظام منع التسرب' : 'Zero-Spill Seal System'}
                </span>
                <div style={{ width: 'clamp(20px, 5vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, #8DB833, transparent)` }} />
              </div>
            </>
          )}
        </div>

        {/* Caption */}
        <div style={{ textAlign: 'center', maxWidth: '90%', padding: '0 16px', opacity: Math.min(1, scrollProgress * 4) }}>
          <h2 style={{
            color: '#111827', fontSize: 'clamp(1.1rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '8px',
            fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
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
