import { Sparkline } from '../sparkline/Sparkline';
import type { MetricCardProps } from './variants';

export function MetricCard(props: MetricCardProps) {
  const { label, value, prefix, suffix, unit, hint, delta, trend, deltaFn, ariaLabel, className } =
    props;

  const deltaText = (() => {
    if (delta == null) return '';
    if (deltaFn) return deltaFn(delta);
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}%`;
  })();

  const deltaTone =
    delta == null
      ? 'neutral'
      : delta > 0
      ? 'positive'
      : delta < 0
      ? 'negative'
      : 'neutral';
  const trendData = Array.isArray(trend)
    ? trend
    : trend === 'up'
    ? [18, 22, 21, 29, 34, 36, 42]
    : trend === 'down'
    ? [42, 39, 34, 31, 26, 22, 18]
    : trend === 'flat'
    ? [28, 30, 29, 31, 30, 32, 31]
    : [];
  const unitText = suffix ?? unit;

  return (
    <article
      className={['cf-metric', className].filter(Boolean).join(' ')}
      role="figure"
      aria-label={ariaLabel ?? label}
    >
      <header className="cf-metric__head">
        <span className="cf-metric__label">{label}</span>
        {delta != null ? (
          <span className={`cf-metric__delta cf-metric__delta--${deltaTone}`}>
            {deltaText}
          </span>
        ) : null}
      </header>
      <div className="cf-metric__value">
        {prefix ? <span className="cf-metric__prefix">{prefix}</span> : null}
        <span className="cf-metric__num">{value}</span>
        {unitText ? <span className="cf-metric__unit">{unitText}</span> : null}
      </div>
      {hint ? <p className="cf-metric__hint">{hint}</p> : null}
      {trendData.length ? (
        <Sparkline
          data={trendData}
          width={120}
          height={32}
          filled
          smooth
          className="cf-metric__trend"
        />
      ) : null}
    </article>
  );
}
