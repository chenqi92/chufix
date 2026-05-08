import { type ProgressProps, progressClass, clamp } from './variants';

export function Progress(props: ProgressProps) {
  const {
    value = 0,
    variant = 'line',
    tone = 'primary',
    size = 'md',
    indeterminate = false,
    showLabel = false,
    strokeWidth,
  } = props;

  const v = clamp(value);
  const cls = progressClass({ variant, tone, size, indeterminate });

  if (variant === 'line') {
    return (
      <div
        className={cls}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="cf-progress__track">
          <div
            className="cf-progress__fill"
            style={indeterminate ? undefined : { width: `${v}%` }}
          />
        </div>
        {showLabel && <span className="cf-progress__label">{v}%</span>}
      </div>
    );
  }

  /* circle */
  const circleSize = size === 'sm' ? 48 : size === 'lg' ? 96 : 64;
  const stroke = strokeWidth ?? (size === 'sm' ? 4 : size === 'lg' ? 8 : 6);
  const r = (circleSize - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - v / 100);

  return (
    <div
      className={cls}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : v}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: circleSize, height: circleSize }}
    >
      <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
        <circle
          className="cf-progress__circle-track"
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="cf-progress__circle-fill"
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={indeterminate ? c * 0.75 : dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
        />
      </svg>
      {showLabel && <span className="cf-progress__circle-label">{v}%</span>}
    </div>
  );
}
