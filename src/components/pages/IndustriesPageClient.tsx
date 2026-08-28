'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import IndustriesSection from '@/components/sections/IndustriesSection';
import { Leaf, DollarSign, RefreshCw, ShieldCheck } from 'lucide-react';

export default function IndustriesPageClient() {
  const t = useTranslations('industriesPage');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';

  return (
    <main style={{ background: '#F7F8F5', minHeight: '100vh', paddingTop: 'clamp(120px, 15vh, 160px)' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{t('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#1A3D2B', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('subtitle')}
        </p>
      </div>

      {/* Core Universal Benefits Grid */}
      <div className="container" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { icon: <DollarSign size={28} color="#8DB833" />, title: isAr ? 'صفر تكلفة للأجهزة' : 'Zero Hardware Cost', desc: isAr ? 'أنت تدفع فقط مقابل الحبر. نحن نوفر الطابعة والصيانة بالكامل.' : 'You only pay for the ink you use. We provide the printer and maintenance.' },
            { icon: <Leaf size={28} color="#8DB833" />, title: isAr ? 'أحبار صديقة للبيئة' : 'Eco-Friendly Inks', desc: isAr ? 'تتوافق مع معايير الاستدامة لتقليل البصمة الكربونية لمنشأتك.' : 'Meets rigorous sustainability standards to lower your facility\'s carbon footprint.' },
            { icon: <RefreshCw size={28} color="#8DB833" />, title: isAr ? 'صيانة مستمرة' : 'Continuous Maintenance', desc: isAr ? 'إصلاحات أو استبدال فوري لضمان عدم توقف العمل.' : 'Immediate repairs or replacements to ensure zero downtime.' },
            { icon: <ShieldCheck size={28} color="#8DB833" />, title: isAr ? 'دعم محلي' : 'Local Support', desc: isAr ? 'دعم فني سريع داخل المملكة لخدمتك على مدار الساعة.' : 'Fast, dedicated technical support within the Kingdom.' }
          ].map((b, i) => (
            <div key={i} style={{
              background: '#fff', padding: '32px', borderRadius: '24px',
              border: '1px solid #EEEEEE', boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {b.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>{b.title}</h3>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Render the Industries Section (which contains the deep dive modal for each sector) */}
      <div style={{ paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
        <IndustriesSection />
      </div>

    </main>
  );
}
