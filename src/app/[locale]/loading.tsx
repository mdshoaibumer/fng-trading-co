import LoadingState from '@/components/ui/LoadingState';

// Streaming fallback for the dynamic locale routes (home, contact, product
// pages) while their server-side Supabase data resolves.
export default function Loading() {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingState size={48} padding="120px" />
    </main>
  );
}
