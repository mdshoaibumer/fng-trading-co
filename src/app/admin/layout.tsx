import React from 'react';
import AdminShell from './AdminShell';
import { inter } from '@/lib/fonts';
import './admin.css';

// The admin section is session-gated and reads live data on every visit, so
// there is nothing worth prerendering here. (This also used to be required to
// make the old nonce-based CSP work; that CSP is now static — see
// next.config.ts — but dynamic rendering is still the right default.)
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>Future Next Gen Super Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <React.Suspense fallback={<div style={{ padding: '24px' }}>Loading admin...</div>}>
          <AdminShell>{children}</AdminShell>
        </React.Suspense>
      </body>
    </html>
  );
}
