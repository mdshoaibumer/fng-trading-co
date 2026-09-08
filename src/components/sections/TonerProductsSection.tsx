'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Leaf, Recycle, ShieldCheck, Award, Target, Sparkles, DollarSign, Zap, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '@/hooks/useCarousel';
import Reveal from '@/components/ui/Reveal';

function ImageCarousel({ images, alt, isAr }: { images: string[]; alt: string; isAr: boolean }) {
  const { current, goTo: setCurrent, next, prev, pauseHandlers } = useCarousel({ length: images.length, autoplayMs: 4000 });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} {...pauseHandlers}>
      {images.map((src, i) => (
        <Image key={src} src={src} alt={`${alt} ${i + 1}`} fill
          style={{
            objectFit: 'cover', transition: 'opacity 600ms ease',
            opacity: i === current ? 1 : 0,
          }}
          sizes="(max-width: 768px) 100vw, 500px"
          priority={i === 0}
        />
      ))}
      {images.length > 1 && (
        <>
          {/* 44x44 touch target and RTL-mirrored side/arrow direction, matching
              the same carousel pattern in ProductCard.tsx. */}
          <button onClick={prev}
            aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
            style={{
              position: 'absolute', left: isAr ? 'auto' : '8px', right: isAr ? '8px' : 'auto', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: '44px', height: '44px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {isAr ? <ChevronRight size={16} color="#333" /> : <ChevronLeft size={16} color="#333" />}
          </button>
          <button onClick={next}
            aria-label={isAr ? 'الصورة التالية' : 'Next image'}
            style={{
              position: 'absolute', right: isAr ? 'auto' : '8px', left: isAr ? '8px' : 'auto', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: '44px', height: '44px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {isAr ? <ChevronLeft size={16} color="#333" /> : <ChevronRight size={16} color="#333" />}
          </button>
          <div style={{
            position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '2px', zIndex: 3,
          }}>
            {images.map((_, i) => (
              /* 24x24 transparent hit area (WCAG 2.5.8) wrapping the small visual
                 pill, matching ProductCard.tsx's dot pattern. */
              <button key={i} onClick={() => setCurrent(i)}
                aria-label={isAr ? `عرض الصورة ${i + 1}` : `Go to image ${i + 1}`}
                aria-current={i === current}
                style={{
                  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                }}
              >
                <span style={{
                  display: 'block',
                  width: i === current ? '20px' : '8px', height: '8px',
                  borderRadius: '4px',
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 300ms ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const GREEN_IMAGES = [
  '/toners/green/green-toner-set.png',
  '/toners/green/green-toner-box.png',
  '/toners/green/green-toner-large.png',
  '/toners/green/green-toner-fanned.png',
  '/toners/green/green-toner-warehouse.png',
];

const PREMIUM_IMAGES = [
  '/toners/premium/premium-toner-set.png',
  '/toners/premium/premium-toner-box.png',
];

export default function TonerProductsSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const t = useTranslations('tonerProducts');

  const greenFeatures = [
    { icon: <Recycle size={16} color="#16A34A" />, text: t('green.features.0') },
    { icon: <Leaf size={16} color="#16A34A" />, text: t('green.features.1') },
    { icon: <ShieldCheck size={16} color="#16A34A" />, text: t('green.features.2') },
    { icon: <Award size={16} color="#16A34A" />, text: t('green.features.3') },
    { icon: <Target size={16} color="#16A34A" />, text: t('green.features.4') },
  ];

  const premiumFeatures = [
    { icon: <Sparkles size={16} color="#7C3AED" />, text: t('premium.features.0') },
    { icon: <Zap size={16} color="#7C3AED" />, text: t('premium.features.1') },
    { icon: <BarChart3 size={16} color="#7C3AED" />, text: t('premium.features.2') },
    { icon: <Award size={16} color="#7C3AED" />, text: t('premium.features.3') },
    { icon: <DollarSign size={16} color="#7C3AED" />, text: t('premium.features.4') },
  ];

  return (
    <section style={{
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: '#FFFFFF', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(141,184,51,0.03) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <Reveal as="div" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <span style={{
            display: 'inline-block', color: 'var(--accent-text)', background: 'rgba(141,184,51,0.1)',
            padding: '8px 20px', borderRadius: 'var(--radius-2xl)', fontSize: '0.85rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: isAr ? '0' : '1px',
            marginBottom: '16px', border: '1px solid rgba(141,184,51,0.2)',
          }}>
            {t('tag')}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--primary)',
            marginBottom: '16px',
            fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
          }}>
            {t('title')}
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'var(--text-secondary)',
            maxWidth: '650px', margin: '0 auto', lineHeight: 1.6,
          }}>
            {t('subtitle')}
          </p>
        </Reveal>

        {/* Two cards side by side */}
        <div className="toner-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(20px, 3vw, 32px)', maxWidth: '1000px', margin: '0 auto',
        }}>
          {/* GREEN TONER CARD */}
          <div style={{
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            border: '2px solid rgba(22, 163, 74, 0.2)',
            background: '#FFFFFF',
            transition: 'all 300ms ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(22,163,74,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)'; }}
          >
            {/* Image area */}
            <div style={{
              height: '280px', background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <ImageCarousel images={GREEN_IMAGES} alt="EcoInks Green Toner" isAr={isAr} />
              <div style={{
                position: 'absolute', top: '16px', left: isAr ? 'auto' : '16px', right: isAr ? '16px' : 'auto',
                background: 'linear-gradient(135deg, #16A34A, #15803D)', color: '#fff',
                padding: '6px 16px', borderRadius: 'var(--radius-2xl)', fontSize: 'var(--text-xs)', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '5px', zIndex: 4,
              }}>
                <Leaf size={12} /> {t('green.badge')}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#16A34A', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('green.type')}
                </span>
              </div>
              <h3 style={{
                color: 'var(--primary)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800,
                marginBottom: '12px',
                fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
              }}>
                {t('green.name')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {t('green.desc')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {greenFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <span style={{ color: '#333', fontSize: '0.85rem', fontWeight: 500 }}>{f.text}</span>
                  </div>
                ))}
              </div>
              <a href={`/${locale}/contact`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#16A34A' }}>
                {t('cta')}
              </a>
            </div>
          </div>

          {/* PREMIUM TONER CARD */}
          <div style={{
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            border: '2px solid rgba(124, 58, 237, 0.2)',
            background: '#FFFFFF',
            transition: 'all 300ms ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)'; }}
          >
            {/* Image area */}
            <div style={{
              height: '280px', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <ImageCarousel images={PREMIUM_IMAGES} alt="EcoInks Premium Toner" isAr={isAr} />
              <div style={{
                position: 'absolute', top: '16px', left: isAr ? 'auto' : '16px', right: isAr ? '16px' : 'auto',
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff',
                padding: '6px 16px', borderRadius: 'var(--radius-2xl)', fontSize: 'var(--text-xs)', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '5px', zIndex: 4,
              }}>
                <DollarSign size={12} /> {t('premium.badge')}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#7C3AED', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('premium.type')}
                </span>
              </div>
              <h3 style={{
                color: 'var(--primary)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800,
                marginBottom: '12px',
                fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
              }}>
                {t('premium.name')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {t('premium.desc')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {premiumFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <span style={{ color: '#333', fontSize: '0.85rem', fontWeight: 500 }}>{f.text}</span>
                  </div>
                ))}
              </div>
              <a href={`/${locale}/contact`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#7C3AED' }}>
                {t('cta')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .toner-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto !important; }
        }
      `}</style>
    </section>
  );
}
