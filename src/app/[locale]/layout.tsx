
import { NextIntlClientProvider } from 'next-intl';
import { SITE_URL } from '@/lib/siteContact';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { isRTL } from '@/i18n/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ChatWidgetLoader from '@/components/chat/ChatWidgetLoader';
import TransitionErrorGuard from '@/components/ui/TransitionErrorGuard';
import { getSettings } from '@/lib/supabase';
import { getServiceRegions } from '@/lib/getServiceRegions';
import { ServiceRegionsProvider } from '@/components/providers/ServiceRegionsProvider';
import { inter, ibmPlexSansArabic, ibmPlexMono } from '@/lib/fonts';
import '../globals.css';

// Not force-dynamic here: only the routes that actually hit Supabase per
// request (home, contact, and the two product [id] pages) set that flag
// themselves. Setting it at this shared layout previously disabled static
// generation/ISR for every other route nested under it — FAQ, Terms, Privacy,
// About, etc. — for zero benefit, since none of them read live data.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#1A3D2B',
  width: 'device-width',
  initialScale: 1,
  // No maximumScale/userScalable cap — blocking pinch-zoom fails WCAG 1.4.4.
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      template: '%s | Future Next Gen',
      default: t('title'),
    },
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'Future Next Gen',
      images: [{ url: '/FNG_LOGO.png', width: 1200, height: 630, alt: 'Future Next Gen' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/FNG_LOGO.png'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  const messages = await getMessages();
  const settings = await getSettings();
  // Shares getSettings()'s request cache, so this is not a second round trip.
  const serviceRegions = await getServiceRegions();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${ibmPlexSansArabic.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ServiceRegionsProvider regions={serviceRegions}>
            <TransitionErrorGuard />
            <a href="#main-content" className="skip-link">
              {isRTL(locale) ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
            </a>
            <Navbar />
            {/* tabIndex=-1 so the skip link can move focus here even though a
                div is not focusable by default. */}
            <div id="main-content" tabIndex={-1} style={{ outline: 'none' }}>{children}</div>
            <Footer email={settings.contact?.email} />
            <WhatsAppButton whatsapp={settings.contact?.whatsapp} />
            <ChatWidgetLoader welcomeMessage={settings.ai_settings?.welcome_message} />
          </ServiceRegionsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
