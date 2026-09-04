'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Error boundary for the admin area. Without it, any render-time error in an
// admin page unmounts the whole shell (sidebar included) and shows the bare
// global-error screen — this keeps the shell up and offers a retry.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Admin page error:', error);
  }, [error]);

  return (
    <div className="admin-card" style={{ maxWidth: '560px', margin: '48px auto', textAlign: 'center', padding: '48px 32px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <AlertTriangle size={28} />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>This page hit an error</h2>
      <p style={{ color: '#64748B', marginBottom: '24px', lineHeight: 1.6 }}>
        The rest of the admin panel is unaffected. Try again, or refresh the page if the problem persists.
        {error.digest && <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginTop: '8px' }}>Reference: {error.digest}</span>}
      </p>
      <button onClick={reset} className="btn-admin btn-admin-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <RefreshCw size={16} /> Try again
      </button>
    </div>
  );
}
