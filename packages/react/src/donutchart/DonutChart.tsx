import { useMemo } from 'react';
import { arcPath } from '../_charts/scale';
import type { DonutChartProps } from './variants';

export function DonutChart(props: DonutChartProps) {
  const {
    segments,
    size = 180,
    thickness = 24,
    showLegend = true,
    centerLabel,
    centerValue,
    ariaLabel = '环形图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(() => {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = size / 2 - 2;
    const rInner = rOuter - thickness;
    let acc = 0;
    return segments.map((s, i) => {
      const start = (acc / total) * 360;
      acc += s.value;
      const end = (acc / total) * 360;
      return {
        ...s,
        colorIndex: s.colorIndex ?? i % 8,
        d: arcPath(cx, cy, rOuter, rInner, start, end),
        pct: ((end - start) / 360) * 100,
      };
    });
  }, [segments, size, thickness]);

  return (
    <div
      className={['cf-donut', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        className="cf-chart"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
      >
        {layout.map((s, i) => (
          <path
            key={i}
            className={`cf-chart__bar--${s.colorIndex}`}
            d={s.d}
            onPointerEnter={(e) => {
              const seg = segments[i];
              if (seg) onItemEnter?.({ segment: seg, dataIndex: i, pct: s.pct, nativeEvent: e });
            }}
            onPointerLeave={(e) => {
              const seg = segments[i];
              if (seg) onItemLeave?.({ segment: seg, dataIndex: i, pct: s.pct, nativeEvent: e });
            }}
          />
        ))}
        {centerValue != null ? (
          <text
            x={size / 2}
            y={size / 2 - 4}
            textAnchor="middle"
            className="cf-donut__value"
          >
            {centerValue}
          </text>
        ) : null}
        {centerLabel ? (
          <text
            x={size / 2}
            y={size / 2 + 14}
            textAnchor="middle"
            className="cf-donut__label"
          >
            {centerLabel}
          </text>
        ) : null}
      </svg>
      {showLegend ? (
        <ul className="cf-donut__legend">
          {layout.map((s, i) => (
            <li key={i}>
              <span className={`cf-donut__dot cf-chart__bar--${s.colorIndex}`} />
              {s.name}
              <span className="cf-donut__pct">{s.pct.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
