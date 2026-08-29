import { revalidatePath } from 'next/cache';

/**
 * Invalidates the localized layout and every static page beneath it so that
 * admin edits (translations via the content editor, contact/settings values,
 * and catalogue data) surface on the prerendered marketing pages without a
 * full redeploy. Call from admin write route handlers after a successful save.
 *
 * The dynamic `[locale]` segment with type 'layout' covers all locales and all
 * nested routes in one call; regeneration happens on each page's next visit.
 * Dynamic pages (home, contact, product pages) already read fresh data per
 * request — this is what keeps the static pages in sync too.
 */
export function revalidatePublicSite(): void {
  revalidatePath('/[locale]', 'layout');
}
