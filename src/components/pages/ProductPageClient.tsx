'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ViewTransition } from 'react';
import Image from 'next/image';
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
import { useCarousel } from '@/hooks/useCarousel';
import IconButton from '@/components/ui/IconButton';

export interface ProductPageProduct {
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

interface ProductPageClientProps {
  product: ProductPageProduct;
  whatsapp: string;
  locale: string;
  /** Drives the WhatsApp inquiry message copy — "printer" vs "equipment". */
  itemType: 'printer' | 'equipment';
}

const INQUIRY_TEXT: Record<'printer' | 'equipment', { ar: (name: string) => string; en: (name: string) => string }> = {
  printer: {
    ar: (name) => `مرحباً، أود الاستفسار عن طابعة: ${name}`,
    en: (name) => `Hello, I'd like to inquire about the printer: ${name}`,
  },
  equipment: {
    ar: (name) => `مرحباً، أود الاستفسار عن طابعة/جهاز: ${name}`,
    en: (name) => `Hello, I'd like to inquire about the equipment: ${name}`,
  },
};

export default function ProductPageClient({ product, whatsapp, locale, itemType }: ProductPageClientProps) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const { current: currentImage, goTo: setCurrentImage, next: nextImage, prev: prevImage } = useCarousel({
    length: product.images.length,
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const setZoomOriginFromPoint = (clientX: number, clientY: number, target: HTMLElement) => {
    const { left, top, width, height } = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    setZoomOriginFromPoint(e.clientX, e.clientY, e.currentTarget);
  };

  // Touch has no hover/mousemove, so tapping to zoom used to leave the zoom
  // origin at its stale default (0,0) — always the top-left corner, with no
  // way to pan. Seed the origin on touchstart and let touchmove drag it.
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) setZoomOriginFromPoint(touch.clientX, touch.clientY, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const touch = e.touches[0];
    if (touch) setZoomOriginFromPoint(touch.clientX, touch.clientY, e.currentTarget);
  };

  const inquiryText = isAr ? INQUIRY_TEXT[itemType].ar(product.name) : INQUIRY_TEXT[itemType].en(product.name);
  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(inquiryText)}`;

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
              color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              flexDirection: isAr ? 'row-reverse' : 'row'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F4EF'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {isAr ? 'العودة' : 'Back'}
          </button>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <Link href={`/${locale}`} transitionTypes={['nav-back']} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>{isAr ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <span style={{ fontWeight: 500 }}>{product.name}</span>
          </nav>
        </div>

        <div className="product-grid" style={{
          display: 'grid', gridTemplateColumns: isAr ? '1fr 1.2fr' : '1.2fr 1fr', gap: 'clamp(24px, 5vw, 64px)', alignItems: 'start',
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          {/* Left Column: Image Gallery */}
          <div className="gallery-column" style={{ order: isAr ? 2 : 1 }}>
            {/* The other half of the catalog card's morph — same name, so the
                card's image container animates into this one on the way in and
                back out again on the way out. */}
            <ViewTransition name={`product-image-${product.id}`} share="morph">
            <div
              className="main-image-container"
              style={{
                background: 'white', borderRadius: '32px', border: '1px solid #E0E7DE',
                position: 'relative', overflow: 'hidden', height: 'clamp(400px, 50vh, 600px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                touchAction: isZoomed ? 'none' : 'pan-y'
              }}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={product.images[currentImage] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 90vw, 45vw"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.srcset = ''; e.currentTarget.src = '/placeholder.png'; }}
                  style={{
                    objectFit: 'contain',
                    transition: isZoomed ? 'none' : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    transform: isZoomed ? `scale(2)` : 'scale(1)',
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                  }}
                />
              </div>

              {!isZoomed && (
                <div style={{
                  position: 'absolute', bottom: '24px', [isAr ? 'left' : 'right']: '24px',
                  background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%',
                  color: 'var(--accent)', backdropFilter: 'blur(4px)'
                }}>
                  <Maximize2 size={20} />
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && !isZoomed && (
                <>
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    label={isAr ? 'الصورة السابقة' : 'Previous image'}
                    icon={<ChevronLeft size={24} />}
                    size={48}
                    background="white"
                    color="var(--primary)"
                    style={{ position: 'absolute', left: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    label={isAr ? 'الصورة التالية' : 'Next image'}
                    icon={<ChevronRight size={24} />}
                    size={48}
                    background="white"
                    color="var(--primary)"
                    style={{ position: 'absolute', right: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </>
              )}
            </div>
            </ViewTransition>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{
                display: 'flex', gap: '12px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px',
                flexDirection: isAr ? 'row-reverse' : 'row'
              }}>
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    aria-label={`${product.name} — ${isAr ? 'صورة' : 'image'} ${idx + 1}`}
                    aria-current={currentImage === idx}
                    style={{
                      position: 'relative',
                      width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden',
                      border: currentImage === idx ? '2px solid var(--accent)' : '1px solid #E0E7DE',
                      background: 'white', cursor: 'pointer', transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="80px"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.srcset = ''; e.currentTarget.src = '/placeholder.png'; }}
                      style={{ objectFit: 'contain', padding: '8px' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="info-column" style={{ position: 'sticky', top: '120px', order: isAr ? 1 : 2, textAlign: isAr ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: product.available === false ? 'rgba(107, 114, 128, 0.1)' : 'rgba(141, 184, 51, 0.1)',
              color: product.available === false ? '#6B7280' : 'var(--accent)',
              padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem',
              marginBottom: '20px', textTransform: 'uppercase',
              flexDirection: isAr ? 'row-reverse' : 'row'
            }}>
              {product.available === false ? <XCircle size={16} /> : <ShieldCheck size={16} />}
              {product.available === false
                ? (isAr ? 'نفدت الكمية' : 'Out of Stock')
                : (isAr ? 'مُجددة معتمدة' : 'Certified Refurbished')
              }
            </div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--primary)',
              marginBottom: '16px', lineHeight: 1.2,
              opacity: product.available === false ? 0.6 : 1
            }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', opacity: product.available === false ? 0.6 : 1 }}>
              {isAr ? product.descAr : product.descEn}
            </p>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px', opacity: product.available === false ? 0.5 : 1 }}>
              {(isAr ? product.featuresAr : product.featuresEn).map((f: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(141, 184, 51, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={14} color="var(--accent)" />
                  </div>
                  <span style={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              <a
                href={product.available === false ? '#' : whatsappLink}
                target={product.available === false ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  background: product.available === false ? '#9CA3AF' : '#25D366', color: 'white', border: 'none',
                  padding: '18px 32px', fontSize: '1.1rem', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  textDecoration: 'none', transition: 'all 0.3s',
                  flexDirection: isAr ? 'row-reverse' : 'row',
                  cursor: product.available === false ? 'not-allowed' : 'pointer',
                  pointerEvents: product.available === false ? 'none' : 'auto'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <MessageCircle size={22} />
                {product.available === false
                  ? (isAr ? 'غير متوفر حالياً' : 'Currently Unavailable')
                  : (isAr ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp')
                }
              </a>

              <Link
                href={product.available === false ? '#' : `/${locale}/contact`}
                style={{
                  background: 'white', color: 'var(--primary)', border: '1px solid #E0E7DE',
                  padding: '18px 32px', fontSize: '1.1rem', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s',
                  flexDirection: isAr ? 'row-reverse' : 'row',
                  opacity: product.available === false ? 0.5 : 1,
                  pointerEvents: product.available === false ? 'none' : 'auto'
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
              <h3 style={{ marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <Zap size={20} color="var(--accent)" />
                {isAr ? 'المواصفات الفنية' : 'Technical Specifications'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(isAr ? product.specsAr : product.specsEn).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F0F4EF', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{key}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textAlign: isAr ? 'left' : 'right' }}>{value as string}</span>
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
