// Single source of truth for the business's public-facing contact email.
//
// This is the address shown to visitors (footer, contact page) and embedded in
// the JSON-LD structured data. Change it here and every display updates.
//
// NOTE: this is NOT the lead-notification recipient. Where the "New Lead" email
// is delivered is configured on the Web3Forms account tied to the
// WEB3FORMS_ACCESS_KEY env var — see src/app/api/contact/route.ts.
//
// src/lib/config.json carries the same address as a plain string (JSON can't
// import this constant); keep the two in sync if it ever changes.
export const SITE_EMAIL = 'Support@fngtradingco.com';
