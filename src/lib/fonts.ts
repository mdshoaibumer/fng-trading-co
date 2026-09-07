import { Inter, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google';

// Self-hosted, build-time-fetched replacements for the Google Fonts CSS
// `@import` that used to live in globals.css — that import blocked rendering
// on an extra DNS+connection round trip to fonts.googleapis.com before the
// CSS itself could even start downloading, then a second hop to
// fonts.gstatic.com for the actual files, and requested Inter's *entire*
// variable weight range (100-900) in both italic and normal. Only the
// weights actually used in the app are requested here.

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-inter',
});

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-arabic',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});
