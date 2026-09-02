import { ViewTransition } from 'react';
import LoadingState from '@/components/ui/LoadingState';

// Streaming fallback for the dynamic locale routes (home, contact, product
// pages) while their server-side Supabase data resolves.
//
// Wrapped so the handoff from skeleton to content is animated rather than a
// hard swap: this slides down and out, the page's own PageTransition brings
// the real content in. A Suspense reveal fires as its own transition with no
// transition type attached, which is why this uses a plain string prop rather
// than the type map PageTransition uses for navigation.
export default function Loading() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingState size={48} padding="120px" />
      </main>
    </ViewTransition>
  );
}
