import { getTranslations } from 'next-intl/server';
import IndustriesSection from '@/components/sections/IndustriesSection';
import { Leaf, DollarSign, RefreshCw, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default async function IndustriesPageClient({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'industriesPage' });
  const isAr = locale === 'ar';

  // Same icon-in-chip treatment as AboutPageClient's card pattern, reused
  // here so these two adjacent top-level pages read as one level of craft
  // rather than Industries looking like an earlier draft of About.
  const iconWrap: React.CSSProperties = {
    width: '56px', height: '56px', borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, rgba(26,61,43,0.08), rgba(141,184,51,0.10))',
    border: '1px solid rgba(141,184,51,0.14)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
    marginInlineStart: 0, marginInlineEnd: 'auto',
  };

  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--page-top)' }}>

      {/* Page Header */}
      <Reveal as="div" className="container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{t('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('subtitle')}
        </p>
      </Reveal>

      {/* Core Universal Benefits Grid */}
      <div className="container" style={{ marginBottom: 'clamp(48px, 8vw, 80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { icon: <DollarSign size={28} color="var(--accent-text)" />, title: isAr ? 'صفر تكلفة للأجهزة' : 'Zero Hardware Cost', desc: isAr ? 'أنت تدفع فقط مقابل الحبر. نحن نوفر الطابعة والصيانة بالكامل.' : 'You only pay for the ink you use. We provide the printer and maintenance.' },
            { icon: <Leaf size={28} color="var(--accent-text)" />, title: isAr ? 'أحبار صديقة للبيئة' : 'Eco-Friendly Inks', desc: isAr ? 'تتوافق مع معايير الاستدامة لتقليل البصمة الكربونية لمنشأتك.' : 'Meets rigorous sustainability standards to lower your facility\'s carbon footprint.' },
            { icon: <RefreshCw size={28} color="var(--accent-text)" />, title: isAr ? 'صيانة مستمرة' : 'Continuous Maintenance', desc: isAr ? 'إصلاحات أو استبدال فوري لضمان عدم توقف العمل.' : 'Immediate repairs or replacements to ensure zero downtime.' },
            { icon: <ShieldCheck size={28} color="var(--accent-text)" />, title: isAr ? 'دعم محلي' : 'Local Support', desc: isAr ? 'دعم فني سريع داخل المملكة لخدمتك على مدار الساعة.' : 'Fast, dedicated technical support within the Kingdom.' }
          ].map((b, i) => (
            <Reveal key={i} delay={i * 90} from="scale" style={{ display: 'flex' }}>
              <div className="card-lift" style={{
                background: '#fff', padding: 'clamp(28px, 4vw, 40px)', borderRadius: 'var(--radius-xl)', width: '100%',
                border: '1px solid var(--light-grey)', boxShadow: 'var(--shadow-sm)', textAlign: isAr ? 'right' : 'left',
              }}>
                <div style={iconWrap}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{b.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Render the Industries Section (which contains the deep dive modal for each sector).
          IndustriesSection is itself a `.section`-classed component that already
          applies var(--section-pad) as its own top+bottom padding — no wrapper
          padding needed here, or the bottom padding doubles up before the footer. */}
      <IndustriesSection />

    </main>
  );
}
