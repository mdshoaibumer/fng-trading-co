'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  Phone,
  Maximize2
} from 'lucide-react';

interface PrinterType {
  id: string;
  name: string;
  descEn: string | null;
  descAr: string | null;
  images: string[];
  featuresEn: string[];
  featuresAr: string[];
  specsEn: Record<string, string>;
  specsAr: Record<string, string>;
  available: boolean;
}

interface PrinterProductPageClientProps {
  printer: PrinterType;
  whatsapp: string;
  locale: string;
}

export default function PrinterProductPageClient({ printer, whatsapp, locale }: PrinterProductPageClientProps) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setMousePos({ x, y });
  };

  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    isAr 
      ? `مرحباً، أود الاستفسار عن طابعة: ${printer.name}` 
      : `Hello, I'd like to inquire about the printer: ${printer.name}`
  )}`;

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF7', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Breadcrumbs & Back Button */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
          <button 
            onClick={() => router.back()}
            style={{ 
              background: 'white', border: '1px solid #E0E7DE', borderRadius: '12px', 
              padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
              color: '#1A3D2B', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              flexDirection: isAr ? 'row-reverse' : 'row'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F4EF'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {isAr ? 'العودة' : 'Back'}
          </button>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <Link href={`/${locale}`} style={{ color: '#8DB833', textDecoration: 'none', fontWeight: 600 }}>{isAr ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <span style={{ fontWeight: 500 }}>{printer.name}</span>
          </nav>
        </div>

        <div className="product-grid" style={{
          display: 'grid', gridTemplateColumns: isAr ? '1fr 1.2fr' : '1.2fr 1fr', gap: 'clamp(24px, 5vw, 64px)', alignItems: 'start',
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          {/* Left Column: Image Gallery */}
          <div className="gallery-column" style={{ order: isAr ? 2 : 1 }}>
            <div 
              className="main-image-container"
              style={{
                background: 'white', borderRadius: '32px', border: '1px solid #E0E7DE',
                position: 'relative', overflow: 'hidden', height: 'clamp(400px, 50vh, 600px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
              }}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img 
                src={printer.images[currentImage]} 
                alt={printer.name}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  transition: isZoomed ? 'none' : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  transform: isZoomed ? `scale(2)` : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                }}
              />
              
              {!isZoomed && (
                <div style={{
                  position: 'absolute', bottom: '24px', [isAr ? 'left' : 'right']: '24px',
                  background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%',
                  color: '#8DB833', backdropFilter: 'blur(4px)'
                }}>
                  <Maximize2 size={20} />
                </div>
              )}

              {/* Navigation Arrows */}
              {printer.images.length > 1 && !isZoomed && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => (prev - 1 + printer.images.length) % printer.images.length); }}
                    style={{
                      position: 'absolute', left: '20px', background: 'white', border: 'none',
                      borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#1A3D2B'
                    }}
                  ><ChevronLeft size={24} /></button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => (prev + 1) % printer.images.length); }}
                    style={{
                      position: 'absolute', right: '20px', background: 'white', border: 'none',
                      borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#1A3D2B'
                    }}
                  ><ChevronRight size={24} /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {printer.images.length > 1 && (
              <div style={{ 
                display: 'flex', gap: '12px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px',
                flexDirection: isAr ? 'row-reverse' : 'row'
              }}>
                {printer.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    aria-label={`${printer.name} — ${isAr ? 'صورة' : 'image'} ${idx + 1}`}
                    aria-current={currentImage === idx}
                    style={{
                      width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden',
                      border: currentImage === idx ? '2px solid #8DB833' : '1px solid #E0E7DE',
                      padding: '8px', background: 'white', cursor: 'pointer', transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="info-column" style={{ position: 'sticky', top: '120px', order: isAr ? 1 : 2, textAlign: isAr ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: printer.available === false ? 'rgba(107, 114, 128, 0.1)' : 'rgba(141, 184, 51, 0.1)', 
              color: printer.available === false ? '#6B7280' : '#8DB833',
              padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem',
              marginBottom: '20px', textTransform: 'uppercase',
              flexDirection: isAr ? 'row-reverse' : 'row'
            }}>
              {printer.available === false ? <XCircle size={16} /> : <ShieldCheck size={16} />}
              {printer.available === false 
                ? (isAr ? 'نفدت الكمية' : 'Out of Stock')
                : (isAr ? 'مُجددة معتمدة' : 'Certified Refurbished')
              }
            </div>

            <h1 style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#1A3D2B', 
              marginBottom: '16px', lineHeight: 1.2,
              opacity: printer.available === false ? 0.6 : 1
            }}>
              {printer.name}
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6, marginBottom: '32px', opacity: printer.available === false ? 0.6 : 1 }}>
              {isAr ? printer.descAr : printer.descEn}
            </p>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px', opacity: printer.available === false ? 0.5 : 1 }}>
              {(isAr ? printer.featuresAr : printer.featuresEn).map((f: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(141, 184, 51, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={14} color="#8DB833" />
                  </div>
                  <span style={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              <a 
                href={printer.available === false ? '#' : whatsappLink}
                target={printer.available === false ? '_self' : '_blank'} 
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ 
                  background: printer.available === false ? '#9CA3AF' : '#25D366', color: 'white', border: 'none',
                  padding: '18px 32px', fontSize: '1.1rem', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  textDecoration: 'none', transition: 'all 0.3s',
                  flexDirection: isAr ? 'row-reverse' : 'row',
                  cursor: printer.available === false ? 'not-allowed' : 'pointer',
                  pointerEvents: printer.available === false ? 'none' : 'auto'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <MessageCircle size={22} />
                {printer.available === false 
                  ? (isAr ? 'غير متوفر حالياً' : 'Currently Unavailable')
                  : (isAr ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp')
                }
              </a>
              
              <Link 
                href={printer.available === false ? '#' : `/${locale}/contact`}
                style={{ 
                  background: 'white', color: '#1A3D2B', border: '1px solid #E0E7DE',
                  padding: '18px 32px', fontSize: '1.1rem', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s',
                  flexDirection: isAr ? 'row-reverse' : 'row',
                  opacity: printer.available === false ? 0.5 : 1,
                  pointerEvents: printer.available === false ? 'none' : 'auto'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAF7'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <Phone size={20} />
                {isAr ? 'طلب عرض سعر' : 'Request a Quote'}
              </Link>
            </div>

            {/* Specifications */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E0E7DE' }}>
              <h3 style={{ marginBottom: '20px', color: '#1A3D2B', display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <Zap size={20} color="#8DB833" />
                {isAr ? 'المواصفات الفنية' : 'Technical Specifications'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(isAr ? printer.specsAr : printer.specsEn).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F0F4EF', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{key}</span>
                    <span style={{ color: '#1A3D2B', fontWeight: 600, fontSize: '0.9rem', textAlign: isAr ? 'left' : 'right' }}>{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
          .info-column {
            position: static !important;
          }
        }
      `}</style>
    </main>
  );
}
