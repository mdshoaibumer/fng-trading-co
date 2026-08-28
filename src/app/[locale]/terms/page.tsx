import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { buildAlternates } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.terms' });

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/terms'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'termsPage' });
  const isAr = locale === 'ar';
  const websiteUrl = 'https://fngtradingco.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': isAr ? 'الرئيسية' : 'Home',
        'item': `${websiteUrl}/${locale}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': t('title'),
        'item': `${websiteUrl}/${locale}/terms`
      }
    ]
  };

  return (
    <main style={{ background: '#F7F8F5', minHeight: '100vh', paddingTop: 'clamp(120px, 15vh, 160px)', paddingBottom: '80px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', textAlign: isAr ? 'right' : 'left' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '48px', borderBottom: '1px solid #E5E7EB', paddingBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#1A3D2B', marginBottom: '16px' }}>
            {t('title')}
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Content */}
        <div style={{ color: '#374151', lineHeight: 1.8, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <p style={{ fontSize: '1.1rem' }}>
            {t('introduction')}
          </p>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>
              {t('section1Title')}
            </h2>
            <p>{t('section1Desc')}</p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>
              {t('section2Title')}
            </h2>
            <p>{t('section2Desc')}</p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>
              {t('section3Title')}
            </h2>
            <p>{t('section3Desc')}</p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>
              {t('section4Title')}
            </h2>
            <p>{t('section4Desc')}</p>
          </div>
        </div>

      </div>
    </main>
  );
}
