import EmptyState from './EmptyState';

interface ErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry?: () => void;
  /** Use when retry navigates via a plain link instead of a client handler. */
  retryHref?: string;
}

/**
 * Centered "couldn't load this" card with a retry action. Standardizes the
 * error palette that had drifted slightly between call sites (two different
 * near-identical reds) into one consistent look.
 */
export default function ErrorState({ title, description, retryLabel, onRetry, retryHref }: ErrorStateProps) {
  const action = retryHref ? (
    <a href={retryHref} className="btn-primary" style={{ display: 'inline-flex' }}>
      {retryLabel}
    </a>
  ) : (
    <button
      onClick={onRetry}
      style={{
        padding: '10px 24px',
        borderRadius: '10px',
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {retryLabel}
    </button>
  );

  return (
    <EmptyState
      role="alert"
      title={title}
      description={description}
      action={action}
      background="#FFF5F5"
      border="#FCA5A5"
      titleColor="#991B1B"
      descriptionColor="#7F1D1D"
    />
  );
}
