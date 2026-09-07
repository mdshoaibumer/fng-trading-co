// Records that the visitor has already answered the entry gate's "what are you
// looking for?". Written by the gate on the client, read server-side in
// src/app/[locale]/page.tsx, which then skips rendering the gate entirely — so
// returning to the landing page (via the Navbar's Home link, the logo, or the
// back button) shows the page itself rather than putting the chooser back in
// the way. A session cookie deliberately: the gate should greet a genuinely
// new visit, not every navigation. Deciding this on the server rather than
// from sessionStorage means the gate is never briefly painted and torn away.
//
// This lives in its own module rather than in EntryGate.tsx because that file
// is 'use client' — a Server Component importing from it gets a client
// reference proxy, not the string, and the cookie lookup silently misses.
export const GATE_COOKIE = 'fng_gate_seen';

// Marks the chooser as answered from the client. Called by the gate itself on
// dismiss and by the Home links in the Navbar/Footer, so heading "home" from
// any page renders the page straight away instead of the chooser. Client-only
// (touches document); server code imports only GATE_COOKIE from this module.
export function markGateSeen(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${GATE_COOKIE}=1; path=/; SameSite=Lax`;
}
