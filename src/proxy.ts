import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { defaultLocale } from '@/i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(publicUrl(`/${defaultLocale}`, request));
  }

  // 1. Handle Admin Security
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Exclude auth endpoints and login page
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
    }

    // Allow public GET access to catalogs
    if ((pathname === '/api/admin/printers' || pathname === '/api/admin/equipment') && request.method === 'GET') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('fng_session');

    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(publicUrl('/admin/login', request));
    }
    
    // Allowed admin access
    return NextResponse.next();
  }

  // 2. Handle Internationalization for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Internationalization routes
    '/', '/(ar|en)/:path*',
    // Admin routes
    '/admin/:path*', '/api/admin/:path*'
  ],
};
