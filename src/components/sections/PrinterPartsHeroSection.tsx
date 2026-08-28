'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Wrench, Cpu } from 'lucide-react';

export default function PrinterPartsHeroSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const t = useTranslations('printerPartsPage');

  return (
    <section
      id="printer-parts-hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0F2A1C 0%, #1A3D2B 40%, #0D0D0D 100%)',
        padding: 'clamp(140px, 20vh, 200px) 0 clamp(60px, 10vh, 120px)',
        minHeight: '55vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute', top: '10%', right: isAr ? 'auto' : '-5%', left: isAr ? '-5%' : 'auto',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(141,184,51,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: isAr ? 'auto' : '10%', right: isAr ? '10%' : 'auto',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(141,184,51,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Floating gear icons */}
      <div style={{
        position: 'absolute', top: '20%', right: isAr ? 'auto' : '15%', left: isAr ? '15%' : 'auto',
        opacity: 0.06, animation: 'float 6s ease-in-out infinite',
      }}>
        <Wrench size={120} color="#8DB833" strokeWidth={0.8} />
      </div>
      <div style={{
        position: 'absolute', bottom: '15%', left: isAr ? 'auto' : '8%', right: isAr ? '8%' : 'auto',
        opacity: 0.05, animation: 'float 8s ease-in-out infinite 1s',
      }}>
        <Cpu size={100} color="#8DB833" strokeWidth={0.8} />
      </div>

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(141,184,51,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(141,184,51,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="parts-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(24px, 4vw, 64px)',
          alignItems: 'center',
        }}>
          {/* Image side */}
          <div className="parts-hero-image" style={{
            order: isAr ? 2 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              animation: 'floatParts 6s ease-in-out infinite',
            }}>
              {/* Glow behind image */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%', height: '80%',
                background: 'radial-gradient(circle, rgba(141,184,51,0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }} />
              <img
                src="/printer-parts-hero.jpeg"
                alt={isAr ? 'قطع غيار طابعات HP أصلية' : 'Genuine HP Printer Parts'}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '20px',
                  position: 'relative',
                  filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
                }}
              />
            </div>
          </div>

          {/* Text side */}
          <div style={{
            order: isAr ? 1 : 2,
            textAlign: isAr ? 'right' : 'left',
          }}>
          {/* Tag */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#8DB833', background: 'rgba(141,184,51,0.1)',
            padding: '8px 20px', borderRadius: '20px',
            fontSize: '0.85rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: isAr ? '0' : '1.5px',
            marginBottom: '24px', border: '1px solid rgba(141,184,51,0.2)',
          }}>
            <Wrench size={16} />
            {t('tag')}
          </span>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '20px',
            lineHeight: 1.15,
            fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
            letterSpacing: isAr ? '0' : '-1px',
          }}>
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            maxWidth: '600px',
            marginBottom: '32px',
          }}>
            {t('subtitle')}
          </p>

          {/* HP badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '12px 24px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0096D6, #0073A8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#fff', fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
            }}>
              HP
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                {isAr ? 'متخصصون في HP' : 'HP Specialist'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
                {isAr ? 'طابعات ليزرجت — جميع الموديلات' : 'LaserJet Printers — All Models'}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatParts {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (max-width: 768px) {
          .parts-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .parts-hero-image {
            order: -1 !important;
            margin-bottom: 8px;
          }
        }
      `}</style>
    </section>
  );
}
