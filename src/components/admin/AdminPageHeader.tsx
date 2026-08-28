import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

/**
 * Title + subtitle + right-aligned action buttons — the same header layout
 * repeated at the top of every admin list/settings page.
 */
export default function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{title}</h1>
        <p style={{ color: '#64748B', margin: 0 }}>{subtitle}</p>
      </div>
      {actions && <div className="page-header-actions" style={{ display: 'flex', gap: '12px' }}>{actions}</div>}
    </div>
  );
}
