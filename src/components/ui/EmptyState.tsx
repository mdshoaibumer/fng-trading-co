import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  /** ARIA role — pass "alert" for error-flavored usage. */
  role?: string;
  background?: string;
  border?: string;
  titleColor?: string;
  descriptionColor?: string;
  maxWidth?: string;
}

/**
 * Centered card for "nothing to show" states — an empty list/catalog, or
 * (via ErrorState, which wraps this with error colors) a failed fetch.
 * Consolidates several near-identical ad-hoc empty-state cards.
 */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  role,
  background = 'var(--bg-secondary)',
  border = '#E0E7DE',
  titleColor = 'var(--primary)',
  descriptionColor = '#555',
  maxWidth = '480px',
}: EmptyStateProps) {
  return (
    <div
      role={role}
      style={{
        textAlign: 'center',
        padding: 'clamp(32px, 6vw, 64px) 24px',
        maxWidth,
        margin: '0 auto',
        background,
        border: `1px solid ${border}`,
        borderRadius: '16px',
      }}
    >
      {icon && <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{icon}</div>}
      <p style={{ color: titleColor, fontSize: '1.05rem', fontWeight: 600, marginBottom: description ? '8px' : 0 }}>
        {title}
      </p>
      {description && (
        <p style={{ color: descriptionColor, fontSize: '0.9rem', marginBottom: action ? '20px' : 0 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
