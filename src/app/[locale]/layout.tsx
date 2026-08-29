
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
import { getSettings } from '@/lib/supabase';
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
  themeColor: 'var(--primary)',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${ibmPlexSansArabic.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer email={settings.contact?.email} />
          <WhatsAppButton whatsapp={settings.contact?.whatsapp} />
          <ChatWidgetLoader welcomeMessage={settings.ai_settings?.welcome_message} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
