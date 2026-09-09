import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Target, Eye, ShieldCheck, CheckCircle2, Printer, Recycle, Wrench, Ship, MapPin, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import FlagIcon from '@/components/ui/FlagIcon';
import { DEFAULT_SERVICE_REGIONS } from '@/lib/serviceRegions';

export default async function AboutPageClient({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const tt = await getTranslations({ locale, namespace: 'trust' });
  const isAr = locale === 'ar';

  const pillars = [
    { icon: Printer, en: 'Refurbished HP Printers', ar: 'طابعات HP مُجددة', dEn: 'Factory-standard units, inspected, cleaned and warrantied for a year.', dAr: 'وحدات بمعايير المصنع، مفحوصة ومنظّفة ومضمونة لمدة عام.', href: 'printers' },
    { icon: Recycle, en: 'Eco Inks Toner', ar: 'حبر إيكو', dEn: 'Eco-friendly toner engineered for the Gulf climate, at a lower running cost.', dAr: 'حبر صديق للبيئة مصمم لمناخ الخليج، بتكلفة تشغيل أقل.', href: 'eco-inks' },
    { icon: Wrench, en: 'Genuine Parts', ar: 'قطع غيار أصلية', dEn: 'Fusers, rollers, drums and formatters for HP LaserJet fleets.', dAr: 'وحدات تثبيت وأسطوانات وأجزاء أصلية لطابعات HP ليزر.', href: 'printer-parts' },
    { icon: Ship, en: 'Global Sourcing', ar: 'التوريد العالمي', dEn: 'Verified electronics sourcing from China to Saudi Arabia and the Gulf.', dAr: 'توريد إلكترونيات موثّق من الصين إلى السعودية والخليج.', href: 'sourcing' },
  ];

  const offices = DEFAULT_SERVICE_REGIONS.filter(r => r.presence === 'office');
  const markets = DEFAULT_SERVICE_REGIONS.filter(r => r.presence === 'market');

  const facts = [
    { n: isAr ? '٢٠٢١' : '2021', l: isAr ? 'تأسست' : 'Founded' },
    { n: String(offices.length), l: isAr ? 'مكاتب إقليمية' : 'Regional offices' },
    { n: isAr ? '١٢ شهراً' : '12-mo', l: isAr ? 'ضمان لكل وحدة' : 'Warranty on every unit' },
    { n: `${DEFAULT_SERVICE_REGIONS.length}+`, l: isAr ? 'أسواق نخدمها' : 'Markets served' },
  ];

  const cardBase: React.CSSProperties = {
    background: '#fff', padding: 'clamp(28px, 4vw, 40px)', borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--light-grey)', textAlign: isAr ? 'right' : 'left', width: '100%',
    boxShadow: 'var(--shadow-sm)',
  };
  const iconWrap: React.CSSProperties = {
    width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, rgba(26,61,43,0.08), rgba(141,184,51,0.10))',
    border: '1px solid rgba(141,184,51,0.14)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
    marginInlineStart: 0, marginInlineEnd: 'auto',
  };

  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--page-top)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>

      {/* Page Header */}
      <Reveal as="div" className="container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{t('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          {t('subtitle')}
        </p>
      </Reveal>

      <div className="container">
        {/* Facts strip */}
        <Reveal as="div" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px,100%), 1fr))', gap: '1px',
          background: 'var(--light-grey)', border: '1px solid var(--light-grey)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', marginBottom: 'clamp(48px, 7vw, 72px)',
        }}>
          {facts.map((f, i) => (
            <div key={i} style={{ background: '#fff', padding: 'clamp(20px, 3vw, 28px)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{f.n}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '8px' }}>{f.l}</div>
            </div>
          ))}
        </Reveal>

        {/* Mission / Vision / Leadership */}
        <div className="about-mvl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: 'clamp(56px, 8vw, 88px)' }}>
          {[
            { icon: Target, title: t('missionTitle'), desc: t('missionDesc') },
            { icon: Eye, title: t('visionTitle'), desc: t('visionDesc') },
            { icon: ShieldCheck, title: t('leadershipTitle'), desc: t('leadershipDesc') },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={i} delay={i * 110} style={{ display: 'flex' }}>
                <div className="card-lift" style={cardBase}>
                  <div style={iconWrap}><Icon size={26} color="var(--accent-text)" strokeWidth={1.8} /></div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>{c.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--text-base)', margin: 0 }}>{c.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* What we do */}
        <div style={{ marginBottom: 'clamp(56px, 8vw, 88px)' }}>
          <Reveal as="div" style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 48px)' }}>
            <span className="section-tag" style={{ margin: '0 auto 12px' }}>{isAr ? 'ماذا نقدّم' : 'What we do'}</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800, color: 'var(--primary)' }}>
              {isAr ? 'أربعة مجالات، معيار واحد للجودة' : 'Four lines, one standard of quality'}
            </h2>
          </Reveal>
          <div className="about-pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={i} delay={i * 90} from="scale" style={{ display: 'flex' }}>
                  <Link href={`/${locale}/${p.href}`} className="card-lift" style={{ ...cardBase, textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={iconWrap}><Icon size={26} color="var(--accent-text)" strokeWidth={1.8} /></div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>{isAr ? p.ar : p.en}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 'var(--text-sm)', margin: '0 0 16px', flex: 1 }}>{isAr ? p.dAr : p.dEn}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-text)', fontWeight: 600, fontSize: 'var(--text-sm)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      {isAr ? 'اعرف المزيد' : 'Learn more'}
                      <ArrowRight size={16} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Where we operate */}
        <div style={{ marginBottom: 'clamp(48px, 7vw, 72px)' }}>
          <Reveal as="div" style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 48px)' }}>
            <span className="section-tag" style={{ margin: '0 auto 12px' }}>{isAr ? 'أين نعمل' : 'Where we operate'}</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
              {isAr ? 'مكاتب في أربع مدن، وتوصيل عبر المنطقة' : 'Offices in four cities, delivery across the region'}
            </h2>
          </Reveal>
          <div className="about-offices-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
            {offices.map((o, i) => (
              <Reveal key={o.code} delay={i * 80} style={{ display: 'flex' }}>
                <div className="card-lift" style={{ ...cardBase, padding: 'clamp(20px, 3vw, 28px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row', marginBottom: '10px' }}>
                    <FlagIcon code={o.code} size={28} />
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)' }}>{isAr ? o.nameAr : o.nameEn}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <MapPin size={15} color="var(--accent-text)" />
                    <span>{isAr ? o.hubAr : o.hubEn}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal as="div" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 600, alignSelf: 'center' }}>
              {isAr ? 'وأسواق نخدمها:' : 'Plus markets we serve:'}
            </span>
            {markets.map((m) => (
              <span key={m.code} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                background: '#fff', border: '1px solid var(--light-grey)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
                flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <FlagIcon code={m.code} size={18} />{isAr ? m.nameAr : m.nameEn}
              </span>
            ))}
          </Reveal>
        </div>

        {/* Certifications Block */}
        <Reveal as="div" from="scale" style={{ background: 'linear-gradient(135deg, var(--primary), var(--bg-darker))', padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 40px)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '32px' }}>{tt('title')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {['ISO 14001', 'ISO 9001', 'SASO', 'Vision 2030 Partner'].map((cert, i) => (
              <Reveal key={i} from="scale" delay={140 + i * 80}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(141,184,51,0.2)' }}>
                  <CheckCircle2 color="var(--accent)" size={20} />
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: 'var(--text-md)' }}>{cert}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
