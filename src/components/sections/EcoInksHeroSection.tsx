'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function EcoInksHeroSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const headline = isAr ? 'مستقبل الطباعة الأخضر' : 'The Future of Printing is Green';
  const subtitle = isAr
    ? 'اكتشف تقنية الحبر الصديق للبيئة، حيث يلتقي الأداء الفائق مع الاستدامة التامة.'
    : 'Discover our Eco-friendly toner technology, where premium performance meets absolute sustainability.';

  return (
    <section style={{
      position: 'relative', width: '100%', height: '100vh', minHeight: '500px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#FFFFFF',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', zIndex: 1 }} />
      <div className="container" style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 500ms cubic-bezier(0.22, 1, 0.36, 1)',
        padding: '0 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(16px, 4vw, 32px)' }}>
          <Image src="/eco-inks-logo.png" alt="Eco Inks Logo" width={800} height={260}
            style={{ objectFit: 'contain', height: 'clamp(100px, 20vw, 300px)', width: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
            priority
          />
        </div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 6vw, 5.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.1,
          marginBottom: 'clamp(12px, 3vw, 24px)', letterSpacing: isAr ? '0' : '-2px',
          fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
        }}>
          {headline}
        </h1>
        <p style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.4rem)', color: '#4B5563',
          maxWidth: '800px', margin: '0 auto', lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
        <div style={{
          marginTop: 'clamp(32px, 6vw, 64px)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px', animation: 'pulse 3s ease-in-out infinite',
        }}>
          <div style={{ width: '2px', height: '32px', background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
