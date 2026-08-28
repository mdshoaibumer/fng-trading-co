'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function PrinterCard({ printer, isAr, locale }: { printer: any, isAr: boolean, locale: string }) {
  const [currentImage, setCurrentImage] = useState(0);
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setCurrentImage((prev) => (prev + 1) % printer.images.length); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setCurrentImage((prev) => (prev - 1 + printer.images.length) % printer.images.length); };

  const productUrl = `/${locale}/printers/${printer.id}`;

  return (
    <div className="glass printer-card" style={{
      display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(141, 184, 51, 0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}>
      {/* Image Slider */}
      <Link href={productUrl} style={{ display: 'block', position: 'relative', width: '100%', height: '320px', pointerEvents: printer.available === false ? 'none' : 'auto' }}>
        <div className="printer-img-area" style={{
          position: 'relative', width: '100%', height: '100%',
          background: 'radial-gradient(circle, rgba(141, 184, 51, 0.05) 0%, transparent 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          filter: printer.available === false ? 'grayscale(1) opacity(0.6)' : 'none'
        }}>
          {printer.images.map((img: string, idx: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={idx} src={img} alt={`${printer.name} - View ${idx + 1}`}
              style={{
                position: 'absolute', width: '80%', height: '80%', objectFit: 'contain',
                opacity: currentImage === idx ? 1 : 0,
                transform: currentImage === idx ? 'scale(1) translateX(0)' : 'scale(0.9) translateX(20px)',
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.1))',
              }}
            />
          ))}
          {printer.images.length > 1 && printer.available !== false && (
            <>
              <button onClick={prevImage} className="slider-btn" style={{
                position: 'absolute', left: '12px', background: 'rgba(255,255,255,0.8)', border: 'none',
                borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: '#1A3D2B', zIndex: 2,
              }}><ChevronLeft size={20} /></button>
              <button onClick={nextImage} className="slider-btn" style={{
                position: 'absolute', right: '12px', background: 'rgba(255,255,255,0.8)', border: 'none',
                borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: '#1A3D2B', zIndex: 2,
              }}><ChevronRight size={20} /></button>
              <div style={{ position: 'absolute', bottom: '16px', display: 'flex', gap: '6px' }}>
                {printer.images.map((_: string, idx: number) => (
                  <div key={idx} onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCurrentImage(idx); }} style={{
                    width: currentImage === idx ? '20px' : '8px', height: '8px', borderRadius: '4px',
                    background: currentImage === idx ? '#8DB833' : 'rgba(141, 184, 51, 0.3)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                  }} />
                ))}
              </div>
            </>
          )}
          <div style={{
            position: 'absolute', top: '16px', right: isAr ? '16px' : 'auto', left: isAr ? 'auto' : '16px',
            background: printer.available === false ? '#6B7280' : 'linear-gradient(135deg, #8DB833, #6B7C3F)', color: 'white',
            padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem',
            boxShadow: printer.available === false ? 'none' : '0 4px 12px rgba(141, 184, 51, 0.4)', zIndex: 2,
          }}>
            {printer.available === false 
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
        opacity: printer.available === false ? 0.7 : 1
      }}>
        <Link href={productUrl} style={{ textDecoration: 'none', pointerEvents: printer.available === false ? 'none' : 'auto' }}>
          <h3 style={{ 
            color: '#1A3D2B', 
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', 
            fontWeight: 800, 
            marginBottom: '12px', 
            lineHeight: 1.3,
            direction: isAr ? 'rtl' : 'ltr'
          }}>
            {printer.name}
          </h3>
        </Link>
        <p style={{ 
          color: '#555', 
          fontSize: '0.9rem', 
          lineHeight: 1.6, 
          marginBottom: '20px', 
          flex: 1,
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          {isAr ? printer.descAr : printer.descEn}
        </p>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          marginBottom: '24px',
          alignItems: isAr ? 'flex-end' : 'flex-start'
        }}>
          {(isAr ? printer.featuresAr : printer.featuresEn).map((feature: string, idx: number) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              flexDirection: isAr ? 'row-reverse' : 'row'
            }}>
              <CheckCircle2 size={16} color="#8DB833" style={{ flexShrink: 0 }} />
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
            background: printer.available === false ? '#E5E7EB' : '#8DB833',
            color: printer.available === false ? '#9CA3AF' : '#FFFFFF',
            cursor: printer.available === false ? 'not-allowed' : 'pointer',
            pointerEvents: printer.available === false ? 'none' : 'auto'
          }}>
          {printer.available === false 
            ? (isAr ? 'نفدت الكمية' : 'Sold Out')
            : (isAr ? 'عرض التفاصيل' : 'View Details')
          }
        </Link>
      </div>
    </div>
  );
}

export default function FreePrintersCatalogSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [printers, setPrinters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/printers')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setPrinters(data);
        } else {
          console.error('Failed to load printers:', data);
          setPrinters([]);
        }
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error(err);
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="catalog-section" style={{
      padding: 'clamp(60px, 10vw, 120px) 0', background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F7F2 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(141,184,51,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
          <span style={{
            display: 'inline-block', color: '#8DB833', background: 'rgba(141, 184, 51, 0.1)',
            padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700,
            marginBottom: '16px', textTransform: 'uppercase', letterSpacing: isAr ? '0' : '1px',
          }}>
            {isAr ? 'طابعاتنا المُجددة' : 'Refurbished Printers'}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 5vw, 4rem)', fontWeight: 800, color: '#1A3D2B', marginBottom: '24px',
            fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
            letterSpacing: isAr ? '0' : '-1px',
          }}>
            {isAr ? 'طابعات HP مُجددة باحترافية' : 'Professionally Refurbished HP Printers'}
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', color: '#555', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {isAr
              ? 'كل طابعة يتم فحصها وتنظيفها وتجديدها باحترافية واختبارها لتعمل بمعايير المصنع. جودة HP بجزء بسيط من تكلفة الجديدة.'
              : 'Every printer is professionally inspected, cleaned, refurbished, and tested to factory standards. HP quality at a fraction of the new price.'}
          </p>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #8DB833', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="catalog-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 3vw, 32px)', alignItems: 'stretch',
          }}>
            {printers.map(printer => (
              <PrinterCard key={printer.id} printer={printer} isAr={isAr} locale={locale} />
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}
