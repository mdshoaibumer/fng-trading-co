import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_URL } from '@/lib/siteContact';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { buildPageMetadata } from '@/lib/metadata';
import PageTransition from '@/components/ui/PageTransition';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.terms' });

  return buildPageMetadata({
    locale,
    path: '/terms',
    title: seo('title'),
    description: seo('description'),
  });
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
  const websiteUrl = SITE_URL;

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
    <PageTransition>
      <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--page-top)', paddingBottom: '80px' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', textAlign: isAr ? 'right' : 'left' }}>

          {/* Header */}
          <div style={{ marginBottom: '48px', borderBottom: '1px solid rgba(26,61,43,0.12)', paddingBottom: '24px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              {t('title')}
            </h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
              {t('subtitle')}
            </p>
          </div>

          {/* Content */}
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <p style={{ fontSize: '1.1rem' }}>
              {t('introduction')}
            </p>

            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                {t('section1Title')}
              </h2>
              <p>{t('section1Desc')}</p>
            </div>

            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                {t('section2Title')}
              </h2>
              <p>{t('section2Desc')}</p>
            </div>

            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                {t('section3Title')}
              </h2>
              <p>{t('section3Desc')}</p>
            </div>

            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                {t('section4Title')}
              </h2>
              <p>{t('section4Desc')}</p>
            </div>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
