import { useState } from 'react';
import { Sparkline } from '../sparkline/Sparkline';
import type { MetricCardProps, MetricSeriesItem } from './variants';

export function MetricCard(props: MetricCardProps) {
  const {
    label,
    value,
    prefix,
    suffix,
    unit,
    hint,
    delta,
    trend,
    deltaFn,
    ariaLabel,
    className,
    series,
    expandable = true,
    defaultExpanded = false,
    expanded,
    onExpandedChange,
  } = props;

  const [internal, setInternal] = useState(defaultExpanded);
  const isExpanded = expanded != null ? expanded : internal;

  const hasSeries = !!(series && series.length);
  const canExpand = expandable && hasSeries;

  function toggle() {
    if (!canExpand) return;
    const next = !isExpanded;
    setInternal(next);
    onExpandedChange?.(next);
  }

  const deltaText = (() => {
    if (delta == null) return '';
    if (deltaFn) return deltaFn(delta);
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}%`;
  })();

  const deltaTone =
    delta == null ? 'neutral' : delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';

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

  function seriesDeltaText(it: MetricSeriesItem) {
    if (it.delta == null) return '';
    const sign = it.delta > 0 ? '+' : '';
    return `${sign}${it.delta.toFixed(1)}%`;
  }
  function seriesDeltaTone(it: MetricSeriesItem) {
    if (it.delta == null) return 'neutral';
    if (it.delta > 0) return 'positive';
    if (it.delta < 0) return 'negative';
    return 'neutral';
  }

  return (
    <article
      className={
        ['cf-metric', canExpand ? 'cf-metric--expandable' : '', isExpanded ? 'is-expanded' : '', className]
          .filter(Boolean)
          .join(' ')
      }
      role="figure"
      aria-label={ariaLabel ?? label}
      aria-expanded={canExpand ? isExpanded : undefined}
    >
      <header className="cf-metric__head">
        <span className="cf-metric__label">{label}</span>
        {delta != null ? (
          <span className={`cf-metric__delta cf-metric__delta--${deltaTone}`}>{deltaText}</span>
        ) : null}
        {canExpand && (
          <button
            type="button"
            className="cf-metric__toggle"
            aria-label={isExpanded ? '收起明细' : '展开明细'}
            aria-expanded={isExpanded}
            onClick={toggle}
          >
            <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </header>
      <div className="cf-metric__value">
        {prefix ? <span className="cf-metric__prefix">{prefix}</span> : null}
        <span className="cf-metric__num">{value}</span>
        {unitText ? <span className="cf-metric__unit">{unitText}</span> : null}
      </div>
      {hint ? <p className="cf-metric__hint">{hint}</p> : null}
      {trendData.length ? (
        <Sparkline data={trendData} width={120} height={32} filled smooth className="cf-metric__trend" />
      ) : null}

      {canExpand && isExpanded && (
        <ul className="cf-metric__series" role="list">
          {series!.map((it, i) => (
            <li key={i} className="cf-metric__series-item">
              <span className="cf-metric__series-swatch" style={it.color ? { background: it.color } : undefined} />
              <span className="cf-metric__series-label">{it.label}</span>
              <span className="cf-metric__series-value">
                {it.prefix ? <span className="cf-metric__series-prefix">{it.prefix}</span> : null}
                {it.value}
                {it.suffix ? <span className="cf-metric__series-suffix">{it.suffix}</span> : null}
              </span>
              {it.delta != null && (
                <span className={`cf-metric__series-delta cf-metric__delta--${seriesDeltaTone(it)}`}>
                  {seriesDeltaText(it)}
                </span>
              )}
              {it.trend && it.trend.length ? (
                <Sparkline data={it.trend} width={64} height={18} smooth className="cf-metric__series-trend" />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
