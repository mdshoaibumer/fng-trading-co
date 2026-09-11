/**
 * Validates the `?next=` destination carried through the admin login flow
 * (the proxy's redirect to /admin/login, the post-login navigation, and the
 * signed-in bounce away from /admin/login).
 *
 * `next` is attacker-controllable — anyone can hand an admin a link to
 * `/admin/login?next=...` — so this only ever returns a same-site path inside
 * the admin area, and falls back to the dashboard for anything else:
 *
 * - absolute URLs (`https://evil.com`), protocol-relative `//evil.com`, and
 *   backslash tricks (`/\evil.com`, which some browsers treat as `//`);
 * - anything outside `/admin` — including look-alikes such as `/administrator`
 *   and paths that only reach `/admin` via `..` segments or percent-encoding,
 *   because the check runs on the URL-normalized pathname;
 * - `/admin/login` itself, which would otherwise bounce back to the login page.
 *
 * Framework-free so it runs in the proxy (Edge), Client Components and tests.
 */
export const ADMIN_HOME = '/admin';

const PLACEHOLDER_ORIGIN = 'http://admin-next.invalid';

// Backslashes, whitespace and control characters have no business in an admin
// path and are the usual ingredients of parser-differential redirects.
function hasForbiddenChars(value: string): boolean {
  if (/\s/.test(value) || value.includes('\\')) return true;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

export function safeAdminNext(raw: unknown): string {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 2048) return ADMIN_HOME;
  // Must look like an admin path before any parsing: rejects absolute and
  // protocol-relative URLs, and look-alikes like "/administrator".
  if (!/^\/admin(?:[/?#]|$)/.test(raw)) return ADMIN_HOME;
  if (hasForbiddenChars(raw)) return ADMIN_HOME;

  let url: URL;
  try {
    url = new URL(raw, PLACEHOLDER_ORIGIN);
  } catch {
    return ADMIN_HOME;
  }
  if (url.origin !== PLACEHOLDER_ORIGIN) return ADMIN_HOME;
  // Re-check after normalization ("/admin/../en" resolves to "/en").
  if (!/^\/admin(?:\/|$)/.test(url.pathname)) return ADMIN_HOME;
  if (/^\/admin\/login(?:\/|$)/.test(url.pathname)) return ADMIN_HOME;

  return `${url.pathname}${url.search}${url.hash}`;
}
