import { useMemo } from 'react';
import type { StackedBar100Props } from './variants';

export function StackedBar100(props: StackedBar100Props) {
  const {
    segments,
    height = 24,
    showLegend = true,
    ariaLabel = '占比柱',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(() => {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let acc = 0;
    return segments.map((s, i) => {
      const start = (acc / total) * 100;
      acc += s.value;
      const end = (acc / total) * 100;
      return {
        ...s,
        colorIndex: s.colorIndex ?? i % 8,
        pct: end - start,
        start,
      };
    });
  }, [segments]);

  return (
    <div
      className={['cf-stacked100', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className="cf-stacked100__bar"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {layout.map((seg, i) => (
          <span
            key={i}
            className={`cf-stacked100__seg cf-chart__bar--${seg.colorIndex}`}
            style={{ width: `${seg.pct}%` }}
            title={`${seg.name}: ${seg.value}`}
            onPointerEnter={(e) => {
              const s = segments?.[i];
              if (s) onItemEnter?.({ segment: s, dataIndex: i, pct: seg.pct, nativeEvent: e });
            }}
            onPointerLeave={(e) => {
              const s = segments?.[i];
              if (s) onItemLeave?.({ segment: s, dataIndex: i, pct: seg.pct, nativeEvent: e });
            }}
          />
        ))}
      </div>
      {showLegend ? (
        <ul className="cf-stacked100__legend">
          {layout.map((seg, i) => (
            <li key={i}>
              <span
                className={`cf-stacked100__dot cf-chart__bar--${seg.colorIndex}`}
              />
              {seg.name}
              <span className="cf-stacked100__pct">{seg.pct.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
