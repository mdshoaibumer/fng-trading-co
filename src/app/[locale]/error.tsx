'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ErrorState from '@/components/ui/ErrorState';

// Error boundary for the localized route subtree. The dynamic pages (home,
// contact, product pages) read Supabase per request; if a call throws, this
// renders a branded, retryable card instead of Next's raw error screen.
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams();
  const isAr = params?.locale === 'ar';

  useEffect(() => {
    console.error('Route error boundary:', error);
  }, [error]);

  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <ErrorState
        title={isAr ? 'حدث خطأ ما' : 'Something went wrong'}
        description={
          isAr
            ? 'واجهنا مشكلة أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.'
            : 'We hit a problem loading this page. Please try again.'
        }
        retryLabel={isAr ? 'إعادة المحاولة' : 'Try again'}
        onRetry={reset}
      />
    </main>
  );
}
