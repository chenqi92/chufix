import { type SpinnerProps, spinnerClass } from './variants';

export function Spinner({ size = 'md', tone = 'primary', label }: SpinnerProps) {
  return (
    <span className={spinnerClass({ size, tone })} role="status" aria-label={label || 'loading'}>
      <span className="cf-spinner__ring" />
      {label && <span className="cf-spinner__label">{label}</span>}
    </span>
  );
}
