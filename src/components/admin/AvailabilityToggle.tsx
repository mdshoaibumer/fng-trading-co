import { CheckCircle2, XCircle } from 'lucide-react';

interface AvailabilityToggleProps {
  available: boolean;
  onToggle: () => void;
  availableLabel?: string;
  unavailableLabel?: string;
  toggleLabel?: string;
  className?: string;
  /** Matches the printers page's slightly denser sizing vs. equipment's. */
  size?: 'md' | 'sm';
}

/**
 * The "AVAILABLE / OUT OF STOCK" pill + toggle button repeated identically
 * on every printer/equipment row in the admin catalogs.
 */
export default function AvailabilityToggle({
  available,
  onToggle,
  availableLabel = 'AVAILABLE',
  unavailableLabel = 'OUT OF STOCK',
  toggleLabel = 'Toggle',
  className,
  size = 'md',
}: AvailabilityToggleProps) {
  const iconSize = size === 'sm' ? 15 : 16;
  const gap = size === 'sm' ? '10px' : '12px';
  const padding = size === 'sm' ? '8px 14px' : '8px 16px';
  const fontSize = size === 'sm' ? '0.8rem' : '0.85rem';

  return (
    <div
      className={className}
      style={{
        display: 'flex', alignItems: 'center', gap,
        padding, background: available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderRadius: '99px', flexShrink: size === 'sm' ? 0 : undefined,
      }}
    >
      {available ? <CheckCircle2 size={iconSize} color="#10B981" /> : <XCircle size={iconSize} color="#EF4444" />}
      <span style={{ fontSize, fontWeight: 700, color: available ? '#10B981' : '#EF4444' }}>
        {available ? availableLabel : unavailableLabel}
      </span>
      <button
        onClick={onToggle}
        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'underline', flexShrink: size === 'sm' ? 0 : undefined }}
      >
        {toggleLabel}
      </button>
    </div>
  );
}
