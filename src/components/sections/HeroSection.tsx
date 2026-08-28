'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const TOTAL_FRAMES = 10;
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `/video-frames/${num}.png`;
});

export default function HeroSection() {
  const t = useTranslations('hero');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
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
    const imgAspect = img.width / img.height;
    const canvasAspect = displayWidth / displayHeight;
    let drawWidth, drawHeight, startX, startY;
    if (canvasAspect > imgAspect) {
      drawHeight = displayHeight;
      drawWidth = img.width * (displayHeight / img.height);
      startX = (displayWidth - drawWidth) / 2;
      startY = 0;
    } else {
      drawWidth = displayWidth;
      drawHeight = img.height * (displayWidth / img.width);
      startX = 0;
      startY = (displayHeight - drawHeight) / 2;
    }
    ctx.drawImage(img, startX, startY, drawWidth, drawHeight);
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
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    FRAME_PATHS.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) { setImagesLoaded(true); drawFrame(0, images); }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setImagesLoaded(true);
      };
      images[index] = img;
    });
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeadlineVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => drawFrame(currentFrameRef.current), { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distanceToCenter = Math.abs(scrollProgress - 0.5);
  const ecoGlow = Math.max(0, 1 - (distanceToCenter / 0.25));

  const getPhaseLabel = (): string => {
    if (scrollProgress < 0.1) return isAr ? 'الهيكل الخارجي' : 'Exterior Shell';
    if (scrollProgress < 0.25) return isAr ? 'فتح الغطاء العلوي' : 'Opening Top Cover';
    if (scrollProgress < 0.4) return isAr ? 'الأجزاء الداخلية' : 'Internal Components';
    if (scrollProgress < 0.6) return isAr ? 'وحدة الحبر البيئي' : 'Eco Ink Unit';
    return isAr ? 'إعادة التجميع' : 'Reassembly';
  };

  return (
    <section id="hero" ref={sectionRef} className="hero-section" style={{ height: isMobile ? '300vh' : '500vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden',
        backgroundImage: `linear-gradient(135deg, #0F2A1C 0%, #1A3D2B ${30 + ecoGlow * 20}%, ${ecoGlow > 0.5 ? '#2A4F1E' : '#0F2A1C'} 100%)`,
        backgroundSize: '200% 200%', animation: 'slowPan 15s ease-in-out infinite', transition: 'background-image 800ms ease',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)',
          width: isMobile ? 'clamp(250px, 80vw, 400px)' : 'clamp(400px, 60vw, 900px)',
          height: isMobile ? 'clamp(250px, 80vw, 400px)' : 'clamp(400px, 60vw, 900px)',
          background: `radial-gradient(circle, rgba(141, 184, 51, ${0.06 + ecoGlow * 0.12}) 0%, transparent 70%)`,
          pointerEvents: 'none', transition: 'all 800ms ease', animation: 'pulseGlow 6s ease-in-out infinite',
        }} />

        {/* Main content */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%',
          padding: isMobile ? '80px 16px 32px' : '90px 24px 32px',
          position: 'relative', zIndex: 2,
        }}>
          {/* Canvas */}
          <div style={{
            position: 'relative', marginBottom: isMobile ? '8px' : '12px', width: '100%',
            maxWidth: isMobile ? '100%' : '600px', flex: '1 1 auto', minHeight: '100px', maxHeight: isMobile ? '25vh' : '35vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: scrollProgress < 0.85 ? 1 : 1 - (scrollProgress - 0.85) / 0.15,
            transform: `scale(${1 + scrollProgress * 0.05})`, transition: 'transform 100ms linear, opacity 300ms ease',
          }}>
            {!imagesLoaded && (
              <div style={{
                width: '100%', aspectRatio: '16 / 10', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)', borderRadius: '16px', border: '1px solid rgba(141,184,51,0.15)',
              }}>
                <div style={{
                  width: '40px', height: '40px', border: '3px solid rgba(141,184,51,0.2)', borderTopColor: '#8DB833',
                  borderRadius: '50%', animation: 'spin 800ms linear infinite',
                }} />
              </div>
            )}
            <canvas ref={canvasRef} style={{
              width: '100%', aspectRatio: '16 / 10', display: imagesLoaded ? 'block' : 'none',
              filter: `drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4)) drop-shadow(0 8px 24px rgba(141, 184, 51, ${0.1 + ecoGlow * 0.2}))`,
            }} />

            {/* Scanline */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(141, 184, 51, 0.15) 50%, transparent 100%)',
              height: '15%', width: '100%', animation: 'scanline 4s linear infinite',
              pointerEvents: 'none', zIndex: 10, opacity: scrollProgress < 0.8 ? 1 : 0, mixBlendMode: 'overlay',
            }} />

            {/* Part Labels — hidden on mobile */}
            {!isMobile && (
              <>
                <div style={{
                  position: 'absolute', top: '15%', [isAr ? 'right' : 'left']: '-5%',
                  opacity: scrollProgress >= 0.1 && scrollProgress < 0.25 ? 1 : 0,
                  transform: `translateX(${scrollProgress >= 0.1 && scrollProgress < 0.25 ? '0' : (isAr ? '-20px' : '20px')})`,
                  transition: 'all 400ms ease', display: 'flex', alignItems: 'center', gap: '12px',
                  pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: 'floatLabel 3s ease-in-out infinite', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <span style={{ color: '#8DB833', fontWeight: 600, fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {isAr ? 'الغطاء العلوي' : 'Top Cover Unit'}
                    </span>
                    <div style={{ width: 'clamp(40px, 8vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, #8DB833, transparent)` }} />
                  </div>
                </div>
                <div style={{
                  position: 'absolute', top: '40%', [isAr ? 'left' : 'right']: '-10%',
                  opacity: scrollProgress >= 0.25 && scrollProgress < 0.4 ? 1 : 0,
                  transform: `translateX(${scrollProgress >= 0.25 && scrollProgress < 0.4 ? '0' : (isAr ? '20px' : '-20px')})`,
                  transition: 'all 400ms ease', display: 'flex', alignItems: 'center', gap: '12px',
                  pointerEvents: 'none', flexDirection: isAr ? 'row' : 'row-reverse',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: 'floatLabel 3.5s ease-in-out infinite', flexDirection: isAr ? 'row' : 'row-reverse' }}>
                    <span style={{ color: '#8DB833', fontWeight: 600, fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {isAr ? 'لوحة التحكم والمحرك' : 'Mainboard & Engine'}
                    </span>
                    <div style={{ width: 'clamp(40px, 8vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '90deg' : '270deg'}, #8DB833, transparent)` }} />
                  </div>
                </div>
                <div style={{
                  position: 'absolute', bottom: '25%', [isAr ? 'right' : 'left']: '-15%',
                  opacity: scrollProgress >= 0.4 && scrollProgress < 0.6 ? 1 : 0,
                  transform: `translateX(${scrollProgress >= 0.4 && scrollProgress < 0.6 ? '0' : (isAr ? '-20px' : '20px')})`,
                  transition: 'all 400ms ease', display: 'flex', alignItems: 'center', gap: '12px',
                  pointerEvents: 'none', flexDirection: isAr ? 'row-reverse' : 'row',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: 'floatLabel 4s ease-in-out infinite', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <span style={{ color: '#8DB833', fontWeight: 600, fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {isAr ? 'وحدة الحبر الصديق للبيئة' : 'Eco Toner Cartridge'}
                    </span>
                    <div style={{ width: 'clamp(40px, 8vw, 80px)', height: '2px', background: `linear-gradient(${isAr ? '270deg' : '90deg'}, #8DB833, transparent)` }} />
                  </div>
                </div>
              </>
            )}

            {/* Phase label */}
            {scrollProgress > 0.05 && (
              <div style={{
                position: 'absolute', bottom: isMobile ? '-30px' : '-40px', left: '50%', transform: 'translateX(-50%)',
                opacity: Math.min(1, scrollProgress * 5), transition: 'opacity 300ms ease', pointerEvents: 'none',
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(141,184,51,0.25)', borderRadius: '12px',
                  padding: isMobile ? '4px 12px' : '6px 16px', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '8px', animation: 'pulseBorder 3s infinite',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8DB833', boxShadow: '0 0 8px rgba(141,184,51,0.6)' }} />
                  <span style={{
                    color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: 600,
                    fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
                    letterSpacing: isAr ? '0' : '0.05em',
                  }}>{getPhaseLabel()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Headline */}
          <div style={{
            textAlign: 'center', opacity: headlineVisible ? 1 : 0,
            transform: headlineVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            marginTop: isMobile ? '12px' : '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: isMobile ? '10px' : '12px', padding: isMobile ? '0 8px' : '0',
            flexShrink: 0,
          }}>
            {/* Eco tag */}
            <div style={{
              opacity: ecoGlow > 0.3 ? ecoGlow : 0, transform: ecoGlow > 0.3 ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 600ms ease', pointerEvents: ecoGlow > 0.3 ? 'auto' : 'none',
              background: 'rgba(141,184,51,0.1)', border: '1px solid rgba(141,184,51,0.3)',
              borderRadius: '16px', padding: isMobile ? '6px 16px' : '8px 24px', backdropFilter: 'blur(12px)',
              animation: ecoGlow > 0.3 ? 'pulseBorder 2s infinite' : 'none',
            }}>
              <span style={{
                color: '#8DB833', fontSize: isMobile ? 'clamp(0.7rem, 3vw, 0.85rem)' : 'clamp(0.85rem, 1.5vw, 1.1rem)',
                fontWeight: 600, display: 'inline-block',
                animation: ecoGlow > 0.3 ? 'floatLabel 3s ease-in-out infinite' : 'none',
              }}>
                {isAr ? '◈ حبر صديق للبيئة — Ink Engineered for Earth' : '◈ Ink Engineered for Earth'}
              </span>
            </div>

            <h1 style={{
              fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2.5rem)' : 'clamp(2.2rem, 6vw, 5rem)',
              fontWeight: 800, color: 'transparent',
              backgroundImage: 'linear-gradient(to right, #FFFFFF, #E8F5D6, #FFFFFF)',
              backgroundSize: '200% auto', backgroundClip: 'text', WebkitBackgroundClip: 'text',
              lineHeight: 1.1, letterSpacing: isAr ? '0' : '-2px',
              fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
              margin: 0, animation: headlineVisible ? 'textReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards, gradientText 6s linear infinite, letterSpacingIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'none',
              opacity: 0, transform: `translateY(${scrollProgress * -50}px)`, transition: 'transform 0.1s linear',
            }}>
              {t('headline')}
            </h1>
            <p style={{
              fontSize: isMobile ? 'clamp(0.85rem, 3.5vw, 1rem)' : 'clamp(1rem, 2vw, 1.35rem)',
              color: 'rgba(255,255,255,0.6)', maxWidth: isMobile ? '100%' : '600px', margin: '0 auto', lineHeight: 1.6,
              animation: headlineVisible ? 'textReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards' : 'none',
              opacity: 0, transform: `translateY(${scrollProgress * -80}px)`, transition: 'transform 0.1s linear',
            }}>
              {t('subtitle')}
            </p>
            <a href={`/${locale}#contact`} className="btn-primary hero-cta" style={{
              fontSize: isMobile ? '0.95rem' : '1.05rem',
              padding: isMobile ? '14px 28px' : '16px 40px',
              height: 'auto', marginTop: isMobile ? '8px' : '10px',
              animation: headlineVisible ? 'textReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards, borderGlow 3s infinite 1.4s' : 'none',
              opacity: 0, position: 'relative', overflow: 'hidden',
              transform: `translateY(${scrollProgress * -110}px)`, transition: 'transform 0.1s linear',
              boxShadow: '0 8px 32px rgba(141, 184, 51, 0.2)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)', maxWidth: isMobile ? '280px' : 'none',
            }}>
              <span style={{ position: 'relative', zIndex: 1 }}>{t('cta')}</span>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%', animation: 'shimmer 2.5s infinite', zIndex: 0,
              }} />
            </a>
          </div>

          {/* Scroll indicator */}
          {scrollProgress < 0.1 && (
            <div style={{
              position: 'absolute', bottom: isMobile ? '32px' : '48px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'pulse 3s ease-in-out infinite',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: isMobile ? '0.65rem' : '0.75rem', letterSpacing: '0.1em' }}>
                {t('scrollHint')}
              </span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8DB833', animation: 'float 2s ease-in-out infinite' }} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slowPan { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.6; transform: translate(-50%, -55%) scale(1); filter: blur(40px); } 50% { opacity: 1; transform: translate(-50%, -55%) scale(1.1); filter: blur(60px); } }
        @keyframes floatLabel { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulseBorder { 0%, 100% { border-color: rgba(141,184,51,0.25); box-shadow: 0 0 0 rgba(141,184,51,0); } 50% { border-color: rgba(141,184,51,0.6); box-shadow: 0 0 15px rgba(141,184,51,0.3); } }
        @keyframes textReveal { 0% { opacity: 0; transform: translateY(20px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes borderGlow { 0%, 100% { box-shadow: 0 0 10px rgba(141,184,51,0.2); } 50% { box-shadow: 0 0 25px rgba(141,184,51,0.6); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes scanline { 0% { transform: translateY(-500%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(1000%); opacity: 0; } }
        @keyframes gradientText { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes letterSpacingIn { 0% { letter-spacing: 0.2em; filter: blur(4px); opacity: 0; } 100% { letter-spacing: ${isAr ? '0' : '-2px'}; filter: blur(0); opacity: 1; } }
        @media (max-width: 768px) {
          .hero-cta { width: 100% !important; max-width: 280px !important; justify-content: center !important; }
        }
      `}</style>
    </section>
  );
}
