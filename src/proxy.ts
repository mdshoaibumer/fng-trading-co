import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { defaultLocale } from '@/i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/adminSession';

const PUBLIC_GET_ROUTES = new Set([
  '/api/admin/printers',
  '/api/admin/equipment',
  '/api/admin/parts',
  '/api/admin/settings',
]);

const intlMiddleware = createMiddleware(routing);

function publicUrl(pathname: string, request: NextRequest) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return new URL(pathname, configuredSiteUrl);
  }

  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  url.port = '';
  url.pathname = pathname;
  url.search = '';
  return url;
}

function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

// Nonce-based CSP for HTML responses, following Next.js's documented App
// Router pattern: the nonce goes on both the request (so page rendering can
// read it via headers() and Next auto-applies it to its own inline/streaming
// scripts) and the response CSP header. style-src keeps 'unsafe-inline'
// deliberately — the app uses `style={{}}` props and `<style jsx>` blocks
// throughout, and CSS injection is a materially lower-severity risk than
// script injection, which is what strict script-src actually buys us here.
//
// Dev-only relaxations, never shipped to production: 'unsafe-eval' (React
// dev mode uses eval() for debugging — "React will never use eval() in
// production mode" per React's own warning) and ws:/wss: on connect-src
// (Turbopack's HMR WebSocket). Verified: with these omitted, dev mode
// breaks (HMR fails, eval() errors); the strict policy is what actually
// ships since NODE_ENV is 'production' for both `next build` and the
// deployed app.
function cspHeaderValue(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? ` 'unsafe-eval'` : ''}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: https://*.supabase.co`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `media-src 'self'`,
    `connect-src 'self'${isDev ? ` ws://localhost:*` : ''}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ].join('; ');
}

function withCsp(response: NextResponse, nonce: string): NextResponse {
  response.headers.set('Content-Security-Policy', cspHeaderValue(nonce));
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = generateNonce();

  // Mutated in place (not a fresh Headers passed via NextResponse.next()'s
  // `request` option) because next-intl's middleware is a black box that
  // constructs its own NextResponse internally — there's no hook to pass
  // it a header override. Setting it directly on the shared request object
  // means whatever NextResponse.next()/rewrite() call happens downstream
  // (ours or next-intl's) forwards it to page rendering, where it's read
  // back via headers() in src/app/[locale]/layout.tsx and src/app/admin/layout.tsx.
  request.headers.set('x-nonce', nonce);

  if (pathname === '/') {
    return NextResponse.redirect(publicUrl(`/${defaultLocale}`, request));
  }

  // 1. Handle Admin Security
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Exclude auth endpoints and login page
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
      return withCsp(NextResponse.next(), nonce);
    }

    // Allow public GET access to catalog/content data consumed by public pages
    if (PUBLIC_GET_ROUTES.has(pathname) && request.method === 'GET') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('fng_session');
    const isAuthenticated = await verifySessionToken(sessionCookie?.value);

    if (!isAuthenticated) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(publicUrl('/admin/login', request));
    }

    // Allowed admin access
    return withCsp(NextResponse.next({ request }), nonce);
  }

  // 2. Handle Internationalization for all other routes
  return withCsp(intlMiddleware(request), nonce);
}

export const config = {
  matcher: [
    // Internationalization routes
    '/', '/(ar|en)/:path*',
    // Admin routes
    '/admin/:path*', '/api/admin/:path*'
  ],
};
