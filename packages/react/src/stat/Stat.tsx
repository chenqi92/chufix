import { statClass, trendDirection, type StatProps } from './variants';

export function Stat(props: StatProps) {
  const {
    label,
    value,
    hint,
    prefix,
    suffix,
    variant = 'default',
    size = 'md',
    trend,
    loading = false,
    leading,
    trailing,
    footer,
    className,
  } = props;

  const dir = trendDirection(trend);

  return (
    <div className={statClass({ variant, size, loading, className })}>
      <div className="cf-stat__head">
        {leading}
        <span className="cf-stat__label">{label}</span>
        {trailing ? <span className="cf-stat__trailing">{trailing}</span> : null}
      </div>

      <div className="cf-stat__value">
        {prefix ? <span className="cf-stat__prefix">{prefix}</span> : null}
        <span className="cf-stat__number">{value}</span>
        {suffix ? <span className="cf-stat__suffix">{suffix}</span> : null}
      </div>

      {trend || hint || footer ? (
        <div className="cf-stat__foot">
          {trend ? (
            <span className={`cf-stat__trend cf-stat__trend--${dir}`}>
              {dir === 'up' ? (
                <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="cf-stat__trend-icon">
                  <path d="M2 8l4-4 4 4H2z" />
                </svg>
              ) : dir === 'down' ? (
                <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="cf-stat__trend-icon">
                  <path d="M2 4l4 4 4-4H2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="cf-stat__trend-icon">
                  <rect x="2" y="5" width="8" height="2" />
                </svg>
              )}
              <span className="cf-stat__trend-delta">{trend.delta}</span>
              {trend.label ? <span className="cf-stat__trend-label">{trend.label}</span> : null}
            </span>
          ) : null}
          {hint ? <span className="cf-stat__hint">{hint}</span> : null}
          {footer}
        </div>
      ) : null}
    </div>
  );
}
