import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Static CSP rather than the nonce/'strict-dynamic' variant. A nonce is minted
// per request, so Next.js can only stamp it onto script tags for pages it
// renders per request — every statically prerendered route (about, faq,
// sourcing, industries, eco-inks, printer-parts, sustainability, terms,
// privacy) bakes its script tags in at build time and can never carry one.
// Under 'strict-dynamic' the 'self' allowlist is ignored, so nonce-less
// bundles are refused outright and those pages ship zero working JavaScript.
// Keeping the policy static is what lets the site stay statically generated;
// see src/proxy.ts. Going back to nonces means forcing dynamic rendering on
// every public route and giving up SSG/ISR site-wide.
//
// 'unsafe-inline' on script-src is what the App Router needs for its inline
// hydration/streaming payloads. The app's only dangerouslySetInnerHTML is
// JSON-LD, which goes through safeJsonLd().
const isDev = process.env.NODE_ENV !== 'production';

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? ` 'unsafe-eval'` : ''}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `img-src 'self' data: https://*.supabase.co`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  // Settings-managed divider videos are served from Supabase storage, same as
  // the catalog imagery img-src already allows.
  `media-src 'self' https://*.supabase.co`,
  `connect-src 'self' https://*.supabase.co${isDev ? ` ws://localhost:*` : ''}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
].join('; ');

const nextConfig: NextConfig = {
  // Self-contained server output for a small, production-only Docker image
  // (see the multi-stage Dockerfile). On Vercel (process.env.VERCEL), Vercel
  // handles native serverless bundling and standalone output causes ENOENT NFT tracing errors.
  output: process.env.VERCEL ? undefined : 'standalone',
  // Product images uploaded via the admin panel are stored in Supabase Storage
  // and served from *.supabase.co; next/image refuses remote hosts that aren't
  // allowlisted here (matches the CSP img-src). Without this, admin-uploaded
  // images fail to render on the public site.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  // Drop console.* from client bundles in production (keep warn/error).
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // includeSubDomains omitted deliberately — this only applies to
          // fngtradingco.com itself, and blanket-forcing HTTPS on every
          // subdomain isn't this app's call to make.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
