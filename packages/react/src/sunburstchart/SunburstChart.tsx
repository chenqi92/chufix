import { useMemo } from 'react';
import { buildLayout, pathTo, sumValue } from './layout';
import type { SunburstChartProps } from './variants';

export function SunburstChart(props: SunburstChartProps) {
  const {
    root,
    size = 240,
    innerRadiusRatio = 0.2,
    showLabels = true,
    labelMinAngle = 12,
    ariaLabel = '旭日图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(
    () => buildLayout(root, { size, innerRadiusRatio }),
    [root, size, innerRadiusRatio],
  );

  function labelXY(seg: { midAngle: number; midRadius: number }) {
    const a = ((seg.midAngle - 90) * Math.PI) / 180;
    const cx = size / 2;
    const cy = size / 2;
    return {
      x: cx + seg.midRadius * Math.cos(a),
      y: cy + seg.midRadius * Math.sin(a),
    };
  }

  return (
    <svg
      className={['cf-chart cf-sunburst', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={ariaLabel}
    >
      <g>
        {layout.segments.map((seg, i) => (
          <path
            key={i}
            className={`cf-sunburst__segment cf-chart__bar--${seg.colorIndex}`}
            d={seg.path}
            onPointerEnter={(e) =>
              onItemEnter?.({
                node: seg.node,
                depth: seg.depth,
                pathNames: pathTo(root, seg.node),
                totalValue: sumValue(seg.node),
                nativeEvent: e,
              })
            }
            onPointerLeave={(e) =>
              onItemLeave?.({
                node: seg.node,
                depth: seg.depth,
                pathNames: pathTo(root, seg.node),
                totalValue: sumValue(seg.node),
                nativeEvent: e,
              })
            }
          >
            <title>{seg.node.name}</title>
          </path>
        ))}
        {showLabels
          ? layout.segments
              .filter((s) => s.endAngle - s.startAngle >= labelMinAngle)
              .map((seg, i) => {
                const p = labelXY(seg);
                return (
                  <text
                    key={`l${i}`}
                    className="cf-sunburst__label"
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {seg.node.name}
                  </text>
                );
              })
          : null}
      </g>
    </svg>
  );
}
