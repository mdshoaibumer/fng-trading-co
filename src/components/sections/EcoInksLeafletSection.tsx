'use client';

import { useParams } from 'next/navigation';
import { Leaf, Printer, ShieldCheck, TrendingUp } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function EcoInksLeafletSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';

  const features = [
    { title: isAr ? 'مواد قابلة للتحلل' : 'Biodegradable Materials', description: isAr ? 'أحبارنا مصنوعة من مواد عضوية متقدمة تتحلل طبيعياً ولا تترك أي أثر ضار على البيئة.' : 'Our inks are formulated from advanced organic compounds that break down naturally without harming the environment.', icon: <Leaf className="w-7 h-7" color="var(--accent)" strokeWidth={1.5} /> },
    { title: isAr ? 'جودة طباعة استثنائية' : 'Exceptional Print Quality', description: isAr ? 'لا مساومة على الجودة. تضمن تقنيتنا ألواناً زاهية ونصوصاً فائقة الدقة في كل صفحة.' : 'No compromises on quality. Our technology ensures vibrant colors and razor-sharp text on every page.', icon: <Printer className="w-7 h-7" color="var(--accent)" strokeWidth={1.5} /> },
    { title: isAr ? 'خالية من الانبعاثات السامة' : 'Zero Toxic Emissions', description: isAr ? 'بيئة عمل أكثر أماناً بفضل التركيبة الخالية تماماً من المركبات العضوية المتطايرة (VOCs).' : 'A safer workspace thanks to a formula that is 100% free of Volatile Organic Compounds (VOCs).', icon: <ShieldCheck className="w-7 h-7" color="var(--accent)" strokeWidth={1.5} /> },
    { title: isAr ? 'فعالية في التكلفة' : 'Cost Effective', description: isAr ? 'إنتاجية أعلى وتكلفة أقل للصفحة الواحدة، مما يجعل الاستدامة خياراً ذكياً لأعمالك.' : 'Higher yield and lower cost per page makes sustainability the smartest choice for your business.', icon: <TrendingUp className="w-7 h-7" color="var(--accent)" strokeWidth={1.5} /> },
  ];

  return (
    <section style={{ padding: 'clamp(48px, 10vw, 120px) 24px', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="leaflet-accent" style={{
        position: 'absolute', top: '20%', right: isAr ? 'auto' : '-10%', left: isAr ? '-10%' : 'auto',
        width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)',
        background: 'radial-gradient(circle, rgba(141,184,51,0.05) 0%, transparent 70%)', pointerEvents: 'none',
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 80px)' }}>
          <span style={{ color: 'var(--accent-text)', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', fontWeight: 600, letterSpacing: isAr ? '0' : '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
            {isAr ? 'كتيب المواصفات' : 'Product Specifications'}
          </span>
          <h2 style={{ color: '#111827', fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', fontWeight: 800, fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif', marginBottom: '20px' }}>
            {isAr ? 'لماذا تختار حبر إيكو؟' : 'Why Choose Eco Inks?'}
          </h2>
          <p style={{ color: '#4B5563', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {isAr ? 'صممت أحبار إيكو لتلبي أعلى المعايير العالمية في الجودة والاستدامة، لتوفر لك حلاً متكاملاً يجمع بين الأداء والمسؤولية البيئية.' : 'Eco Inks are engineered to meet the highest global standards in quality and sustainability, providing a seamless solution for performance and ecological responsibility.'}
          </p>
        </div>
        <div className="leaflet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(12px, 3vw, 32px)' }}>
          {features.map((feat, idx) => (
            <Reveal key={idx} delay={idx * 90} threshold={0.1}>
            <div style={{ height: '100%',
              background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)',
              transition: 'all 200ms ease-out', cursor: 'default', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(141,184,51,0.4)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(141,184,51,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(141,184,51,0.2)' }}>
                {feat.icon}
              </div>
              <h3 style={{ color: '#111827', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, marginBottom: '10px', fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif' }}>
                {feat.title}
              </h3>
              <p style={{ color: '#4B5563', lineHeight: 1.6, fontSize: '0.9rem' }}>{feat.description}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .leaflet-grid { grid-template-columns: 1fr !important; }
          .leaflet-accent { display: none !important; }
        }
      `}</style>
    </section>
  );
}
