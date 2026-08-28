import React from 'react';
import AdminShell from './AdminShell';
import { inter } from '@/lib/fonts';
import './admin.css';

// Required for the nonce-based CSP in src/proxy.ts to work: a nonce is
// generated fresh per request, but a statically prerendered page (the
// default here, since every admin page is 'use client') bakes its script
// tags in once at build time and can never carry a per-request value.
// Forcing dynamic rendering is what makes the admin section's scripts
// actually match the CSP header sent with each response.
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>Future Next Gen Super Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
