import FaqPageClient from '@/components/pages/FaqPageClient';
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
  const seo = await getTranslations({ locale, namespace: 'seo.faq' });

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/faq'),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'faqPage' });

  // Structured Data (JSON-LD)
  const websiteUrl = 'https://fngtradingco.com';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': t('q1'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': t('a1')
        }
      },
      {
        '@type': 'Question',
        'name': t('q2'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': t('a2')
        }
      },
      {
        '@type': 'Question',
        'name': t('q3'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': t('a3')
        }
      },
      {
        '@type': 'Question',
        'name': t('q4'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': t('a4')
        }
      },
      {
        '@type': 'Question',
        'name': t('q5'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': t('a5')
        }
      }
    ]
  };

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
        'name': isAr ? 'الأسئلة الشائعة' : 'FAQ',
        'item': `${websiteUrl}/${locale}/faq`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <FaqPageClient />
    </>
  );
}
