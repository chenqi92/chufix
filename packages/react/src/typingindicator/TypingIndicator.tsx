export interface TypingIndicatorProps {
  name?: string;
  size?: 'sm' | 'md';
  tone?: 'default' | 'accent';
  className?: string;
}

export function TypingIndicator({
  name,
  size = 'md',
  tone = 'default',
  className,
}: TypingIndicatorProps) {
  return (
    <span
      className={['cf-typing', `cf-typing--${size}`, `cf-typing--${tone}`, className]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label={name ? `${name} 正在输入` : '正在输入'}
    >
      {name && <span className="cf-typing__name">{name}</span>}
      <span className="cf-typing__dots" aria-hidden="true">
        <span className="cf-typing__dot" />
        <span className="cf-typing__dot" />
        <span className="cf-typing__dot" />
      </span>
    </span>
  );
}
