'use client';

import { useEffect } from 'react';

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the whole document, so it must render its own <html>/<body> and cannot rely
// on globals.css — styles are inlined.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, Arial, sans-serif', background: '#F7F8F5', color: '#0D0D0D' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            gap: '16px',
          }}
        >
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1A3D2B', margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#555555', maxWidth: '440px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              background: '#8DB833',
              color: '#1A3D2B',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
