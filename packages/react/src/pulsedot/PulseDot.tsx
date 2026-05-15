export interface PulseDotProps {
  tone?: 'success' | 'warning' | 'error' | 'info' | 'accent' | 'default';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  label?: string;
  className?: string;
}

export function PulseDot({
  tone = 'success',
  size = 'md',
  pulse = true,
  label,
  className,
}: PulseDotProps) {
  return (
    <span
      className={[
        'cf-pulse',
        `cf-pulse--${tone}`,
        `cf-pulse--${size}`,
        pulse && 'is-pulse',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="cf-pulse__dot" />
      {pulse && <span className="cf-pulse__ring" />}
      {label && <span className="cf-pulse__label">{label}</span>}
    </span>
  );
}
