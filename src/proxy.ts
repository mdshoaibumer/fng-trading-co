import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { defaultLocale } from '@/i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/adminSession';
import { ADMIN_HOME, safeAdminNext } from '@/lib/safeAdminNext';

const PUBLIC_GET_ROUTES = new Set([
  '/api/admin/printers',
  '/api/admin/equipment',
  '/api/admin/parts',
  '/api/admin/settings',
  '/api/admin/regions',
]);

const intlMiddleware = createMiddleware(routing);

function publicUrl(pathname: string, request: NextRequest) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return new URL(pathname, configuredSiteUrl);
  }

  // Fall back to the request's own resolved origin rather than trusting a
  // client-supplied X-Forwarded-Host, which could otherwise steer these
  // redirects to an attacker host. Production should always set
  // NEXT_PUBLIC_SITE_URL (above) to make the target explicit.
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  return url;
}

// Redirect to an admin destination that has already been through
// safeAdminNext. publicUrl only takes a pathname (and clears the query), so the
// validated search string is re-applied on the result.
function redirectToAdminPath(target: string, request: NextRequest) {
  const parsed = new URL(safeAdminNext(target), 'http://admin-next.invalid');
  const url = publicUrl(parsed.pathname, request);
  url.search = parsed.search;
  return NextResponse.redirect(url);
}

// Same-origin check for state-changing admin API requests. Browsers always
// send Origin on cross-origin POST/PATCH/DELETE; combined with the session
// cookie's SameSite=Lax, this is defense-in-depth against CSRF.
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try {
    const originUrl = new URL(origin);
    if (originUrl.host === host) return true;
    // Behind a reverse proxy that rewrites Host (e.g. to localhost:3000)
    // without forwarding the original, the browser's Origin is still the
    // public site — accept that too, so the admin can't be locked out by
    // proxy configuration alone.
    const configured = process.env.NEXT_PUBLIC_SITE_URL;
    if (configured) {
      try {
        if (originUrl.origin === new URL(configured).origin) return true;
      } catch { /* malformed NEXT_PUBLIC_SITE_URL — ignore */ }
    }
    return false;
  } catch {
    return false;
  }
}

// The Content-Security-Policy is set in next.config.ts, not here. It used to
// be minted per request with a nonce, but a nonce only reaches the HTML of
// pages Next.js renders per request — the statically prerendered public routes
// could never carry one, and 'strict-dynamic' then blocked every bundle they
// loaded. See the comment in next.config.ts for the full reasoning.
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The bare root is the front door: someone typing the domain gets the
  // chooser, every time. Carrying ?gate=1 is what asks the landing page for it
  // (see src/app/[locale]/page.tsx) — without it the page falls back to "has
  // this visitor answered before?", and anyone with the cookie set was sent
  // straight past the chooser into the printers side.
  //
  // Deliberately only the bare root. A bookmark or a link to /en or /ar is a
  // request for that track's home page, and those still go straight through
  // rather than making a returning visitor re-answer the question.
  //
  // publicUrl clears the query (it refuses to carry anything client-supplied
  // into a redirect target), so the parameter is set on the result.
  if (pathname === '/') {
    const url = publicUrl(`/${defaultLocale}`, request);
    url.search = '?gate=1';
    return NextResponse.redirect(url);
  }

  // 1. Handle Admin Security
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // CSRF defense-in-depth: any state-changing admin API request (including
    // login) must originate from our own site.
    if (
      pathname.startsWith('/api/admin') &&
      request.method !== 'GET' &&
      request.method !== 'HEAD' &&
      !isSameOrigin(request)
    ) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    // The login page is public — but an admin who is already signed in has no
    // use for the form, so send them on to where they were going (`?next=`,
    // validated) or the dashboard.
    if (pathname === '/admin/login') {
      const session = request.cookies.get('fng_session')?.value;
      if (
        (request.method === 'GET' || request.method === 'HEAD') &&
        session &&
        (await verifySessionToken(session))
      ) {
        return redirectToAdminPath(request.nextUrl.searchParams.get('next') ?? ADMIN_HOME, request);
      }
      return NextResponse.next();
    }

    // Auth endpoints (login/logout) are reachable without a session.
    if (pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
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
      // Carry the requested admin page through login as `?next=` so the admin
      // lands back on it. publicUrl clears the query, so the parameters are
      // set on the result; the value is re-validated on the way out (login
      // page and the signed-in bounce above), never trusted as-is.
      const url = publicUrl('/admin/login', request);
      const next = safeAdminNext(`${pathname}${request.nextUrl.search}`);
      if (next !== ADMIN_HOME) url.searchParams.set('next', next);
      // A cookie that no longer verifies means the session lapsed (or was
      // invalidated) rather than never existing — say so on the login page.
      if (sessionCookie?.value) url.searchParams.set('expired', '1');
      return NextResponse.redirect(url);
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
