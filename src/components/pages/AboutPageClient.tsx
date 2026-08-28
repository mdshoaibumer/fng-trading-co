import { getTranslations } from 'next-intl/server';
import { Target, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default async function AboutPageClient({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const tt = await getTranslations({ locale, namespace: 'trust' });
  const isAr = locale === 'ar';

  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'clamp(120px, 15vh, 160px)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{t('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('subtitle')}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          
          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #EEEEEE', textAlign: isAr ? 'right' : 'left' }}>
            <Target size={32} color="var(--accent)" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>{t('missionTitle')}</h3>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1.05rem' }}>{t('missionDesc')}</p>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #EEEEEE', textAlign: isAr ? 'right' : 'left' }}>
            <Eye size={32} color="var(--accent)" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>{t('visionTitle')}</h3>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1.05rem' }}>{t('visionDesc')}</p>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #EEEEEE', textAlign: isAr ? 'right' : 'left' }}>
            <ShieldCheck size={32} color="var(--accent)" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>{t('leadershipTitle')}</h3>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1.05rem' }}>{t('leadershipDesc')}</p>
          </div>

        </div>

        {/* Certifications Block */}
        <div style={{ background: 'linear-gradient(135deg, #1A3D2B, #0F2A1C)', padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 40px)', borderRadius: '32px', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '32px' }}>{tt('title')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
            {['ISO 14001', 'ISO 9001', 'SASO', 'Vision 2030 Partner'].map((cert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: '99px', border: '1px solid rgba(141,184,51,0.2)' }}>
                <CheckCircle2 color="var(--accent)" size={20} />
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
