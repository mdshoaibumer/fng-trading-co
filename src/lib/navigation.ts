// Shared "Home" link behaviour for the Navbar and Footer.
//
// Home used to point at `/{locale}?gate=1`, which re-opened the printers /
// sourcing chooser ("landing page") on every click. The client asked for
// Home to behave like a normal site: on the page you are already on it just
// scrolls back to the top; anywhere else it goes to that track's home page
// (the printers home or the sourcing page) without putting the chooser up.
// The chooser is still reachable through the logo — that stays the one way
// to switch between the two businesses.

export const homeHref = (locale: string, isSourcing: boolean) =>
  isSourcing ? `/${locale}/sourcing` : `/${locale}`;

const stripTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/** True when `href` (path part only) is the page currently on screen. */
export function isCurrentPage(pathname: string, href: string): boolean {
  const target = href.split(/[?#]/)[0];
  return stripTrailingSlash(pathname) === stripTrailingSlash(target);
}

export function scrollToTop(): void {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });
}
