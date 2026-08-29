'use client';

import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/supabase';
import { useCarousel } from '@/hooks/useCarousel';

export default function ProductCard({ product, isAr, productUrl }: { product: Product; isAr: boolean; productUrl: string }) {
  const images = product.images.length > 0 ? product.images : ['/placeholder.png'];
  // Every card image used to mount (and fetch) eagerly on load, all stacked
  // for the crossfade — a product with 9 photos fired 9 full-resolution
  // requests immediately. Only the images actually visited get mounted now.
  const { current: currentImage, goTo: goToImage, next, prev, isLoaded } = useCarousel({
    length: images.length,
    lazyMount: true,
  });
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); next(); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); prev(); };

  return (
    <div className="glass item-card" style={{
      display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(141, 184, 51, 0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}>
      {/* Image Slider */}
      <Link href={productUrl} style={{ display: 'block', position: 'relative', width: '100%', height: '320px', pointerEvents: product.available === false ? 'none' : 'auto' }}>
        <div className="item-img-area" style={{
          position: 'relative', width: '100%', height: '100%',
          background: 'radial-gradient(circle, rgba(141, 184, 51, 0.05) 0%, transparent 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          filter: product.available === false ? 'grayscale(1) opacity(0.6)' : 'none'
        }}>
          {images.map((img: string, idx: number) => isLoaded(idx) && (
            <div key={idx} style={{
              position: 'absolute', width: '80%', height: '80%',
              opacity: currentImage === idx ? 1 : 0,
              transform: currentImage === idx ? 'scale(1) translateX(0)' : 'scale(0.9) translateX(20px)',
              transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: 'none',
            }}>
              <Image
                src={img}
                alt={`${product.name} - View ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 90vw, 400px"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.png'; }}
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.1))' }}
              />
            </div>
          ))}
          {product.images.length > 1 && product.available !== false && (
            <>
              <button onClick={prevImage} className="slider-btn" aria-label={isAr ? 'الصورة السابقة' : 'Previous image'} style={{
                position: 'absolute', left: '12px', background: 'rgba(255,255,255,0.8)', border: 'none',
                borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: 'var(--primary)', zIndex: 2,
              }}><ChevronLeft size={20} /></button>
              <button onClick={nextImage} className="slider-btn" aria-label={isAr ? 'الصورة التالية' : 'Next image'} style={{
                position: 'absolute', right: '12px', background: 'rgba(255,255,255,0.8)', border: 'none',
                borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: 'var(--primary)', zIndex: 2,
              }}><ChevronRight size={20} /></button>
              <div style={{ position: 'absolute', bottom: '16px', display: 'flex', gap: '6px' }}>
                {images.map((_: string, idx: number) => (
                  <button key={idx}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); goToImage(idx); }}
                    aria-label={isAr ? `عرض الصورة ${idx + 1}` : `View image ${idx + 1}`}
                    aria-current={currentImage === idx}
                    style={{
                      width: currentImage === idx ? '20px' : '8px', height: '8px', borderRadius: '4px',
                      background: currentImage === idx ? 'var(--accent)' : 'rgba(141, 184, 51, 0.3)',
                      transition: 'all 0.3s ease', cursor: 'pointer', border: 'none', padding: 0,
                    }} />
                ))}
              </div>
            </>
          )}
          <div style={{
            position: 'absolute', top: '16px', right: isAr ? '16px' : 'auto', left: isAr ? 'auto' : '16px',
            background: product.available === false ? '#6B7280' : 'linear-gradient(135deg, var(--accent), #6B7C3F)', color: 'white',
            padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem',
            boxShadow: product.available === false ? 'none' : '0 4px 12px rgba(141, 184, 51, 0.4)', zIndex: 2,
          }}>
            {product.available === false
              ? (isAr ? 'غير متوفر' : 'OUT OF STOCK')
              : (isAr ? 'مُجددة معتمدة' : 'CERTIFIED REFURBISHED')
            }
          </div>
        </div>
      </Link>
      {/* Content */}
      <div style={{
        padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 24px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        textAlign: isAr ? 'right' : 'left',
        opacity: product.available === false ? 0.7 : 1
      }}>
        <Link href={productUrl} style={{ textDecoration: 'none', pointerEvents: product.available === false ? 'none' : 'auto' }}>
          <h3 style={{
            color: 'var(--primary)',
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            fontWeight: 800,
            marginBottom: '12px',
            lineHeight: 1.3,
            direction: isAr ? 'rtl' : 'ltr'
          }}>
            {product.name}
          </h3>
        </Link>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          marginBottom: '20px',
          flex: 1,
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          {isAr ? product.descAr : product.descEn}
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '24px',
          alignItems: isAr ? 'flex-end' : 'flex-start'
        }}>
          {(isAr ? product.featuresAr : product.featuresEn).map((feature: string, idx: number) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexDirection: isAr ? 'row-reverse' : 'row'
            }}>
              <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <span style={{
                color: '#333',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: isAr ? 'right' : 'left'
              }}>{feature}</span>
            </div>
          ))}
        </div>
        <Link
          href={productUrl}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            minHeight: '48px',
            textDecoration: 'none',
            background: product.available === false ? '#E5E7EB' : 'var(--accent)',
            color: product.available === false ? '#9CA3AF' : '#FFFFFF',
            cursor: product.available === false ? 'not-allowed' : 'pointer',
            pointerEvents: product.available === false ? 'none' : 'auto'
          }}>
          {product.available === false
            ? (isAr ? 'نفدت الكمية' : 'Sold Out')
            : (isAr ? 'عرض التفاصيل' : 'View Details')
          }
        </Link>
      </div>
    </div>
  );
}
