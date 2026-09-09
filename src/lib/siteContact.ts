// Fallback/default for the business's public-facing contact email.
//
// The address actually shown to visitors (footer, contact page) and embedded in
// the JSON-LD structured data is the one an admin sets under Settings → Contact
// Information (settings.contact.email); this constant is used only when that
// value is empty. So the live email is editable from the admin panel — this is
// just the seed default.
//
// NOTE: this is NOT the lead-notification recipient. Where the "New Lead" email
// is delivered is configured on the Web3Forms account tied to the
// WEB3FORMS_ACCESS_KEY env var — see src/app/api/contact/route.ts.
export const SITE_EMAIL = 'support@fngtradingco.com';

// Canonical public origin, used for canonical URLs, hreflang alternates,
// JSON-LD `url`/`image` fields, the sitemap, and robots. Single source of
// truth — previously this literal was copy-pasted into ~16 files. No trailing
// slash; callers build paths as `${SITE_URL}/...`.
export const SITE_URL = 'https://fngtradingco.com';
