import { ViewTransition } from 'react';

/**
 * Route-change animation wrapper. One per page component — deliberately NOT in
 * the layout: a layout persists across navigations, so its enter/exit would
 * only ever fire on the very first mount, and a layout-level ViewTransition
 * additionally stops the pages nested inside it from firing their own.
 *
 * Direction comes from the `transitionTypes` a <Link> carries:
 *
 *   nav-forward  going deeper — a catalog card into its product page
 *   nav-back     coming back out of it
 *   nav-lateral  between sibling marketing pages, which express no hierarchy,
 *                so they cross-fade rather than slide
 *
 * `default: 'none'` on every map, and on the component, is load-bearing — and
 * it is why the lateral fade needs a type of its own rather than riding on the
 * default. Anything left on the default fires on every untyped transition,
 * which includes each Suspense resolve and each background revalidation: the
 * page would then fade underneath the loading skeleton's own reveal animation,
 * with the two competing.
 *
 * The CSS lives in globals.css under VIEW TRANSITIONS. Browsers without the
 * View Transitions API simply navigate, with no animation and no error.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', 'nav-lateral': 'fade-in', default: 'none' }}
      exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', 'nav-lateral': 'fade-out', default: 'none' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
