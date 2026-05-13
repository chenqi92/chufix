import { useMemo } from 'react';
import { polar } from '../_charts/scale';
import type { RadarChartProps } from './variants';

export function RadarChart(props: RadarChartProps) {
  const {
    axes,
    series,
    size = 240,
    max,
    showLegend = true,
    showPoints = true,
    ariaLabel = '雷达图',
    className,
    onItemEnter,
    onItemLeave,
    onVertexEnter,
    onVertexLeave,
    onAxisEnter,
    onAxisLeave,
  } = props;

  const layout = useMemo(() => {
    if (!axes?.length || !series?.length) return null;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 24;
    const m = max ?? Math.max(...series.flatMap((s) => s.values), 1);
    const angleStep = 360 / axes.length;
    const axisPoints = axes.map((_, i) => polar(cx, cy, r, i * angleStep));
    const grid = [0.25, 0.5, 0.75, 1].map((scale) =>
      axes.map((_, i) => polar(cx, cy, r * scale, i * angleStep)),
    );
    const polygons = series.map((s, idx) => {
      const points = s.values.map((v, i) =>
        polar(cx, cy, r * (v / m), i * angleStep),
      );
      const d = 'M ' + points.map((p) => `${p.x} ${p.y}`).join(' L ') + ' Z';
      return { idx: s.colorIndex ?? idx % 8, name: s.name, d, points };
    });
    return { cx, cy, r, axisPoints, grid, polygons };
  }, [axes, series, size, max]);

  return (
    <div
      className={['cf-radar', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        className="cf-chart"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
      >
        {layout?.grid.map((ring, i) => (
          <polygon
            key={`g${i}`}
            points={ring.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            className="cf-chart__grid"
          />
        ))}
        {layout?.axisPoints.map((p, i) => (
          <line
            key={`ax${i}`}
            className="cf-chart__axis cf-radar__axis-line"
            x1={layout.cx}
            y1={layout.cy}
            x2={p.x}
            y2={p.y}
            onPointerEnter={(e) =>
              onAxisEnter?.({
                axisIndex: i,
                axisLabel: axes[i],
                values: series.map((s) => s.values[i] ?? 0),
                nativeEvent: e,
              })
            }
            onPointerLeave={(e) =>
              onAxisLeave?.({
                axisIndex: i,
                axisLabel: axes[i],
                values: series.map((s) => s.values[i] ?? 0),
                nativeEvent: e,
              })
            }
          />
        ))}
        {layout?.axisPoints.map((p, i) => (
          <text
            key={`tx${i}`}
            x={p.x}
            y={p.y - 6}
            textAnchor="middle"
            className="cf-radar__axis-label"
            onPointerEnter={(e) =>
              onAxisEnter?.({
                axisIndex: i,
                axisLabel: axes[i],
                values: series.map((s) => s.values[i] ?? 0),
                nativeEvent: e,
              })
            }
            onPointerLeave={(e) =>
              onAxisLeave?.({
                axisIndex: i,
                axisLabel: axes[i],
                values: series.map((s) => s.values[i] ?? 0),
                nativeEvent: e,
              })
            }
          >
            {axes[i]}
          </text>
        ))}
        {layout?.polygons.map((p, i) => (
          <path
            key={`p${i}`}
            d={p.d}
            className={`cf-chart__bar--${p.idx} cf-radar__polygon`}
            fillOpacity={0.2}
            strokeWidth={2}
            onPointerEnter={(e) => {
              const s = series?.[i];
              if (s) onItemEnter?.({ series: s, seriesIndex: i, nativeEvent: e });
            }}
            onPointerLeave={(e) => {
              const s = series?.[i];
              if (s) onItemLeave?.({ series: s, seriesIndex: i, nativeEvent: e });
            }}
          />
        ))}
        {showPoints
          ? layout?.polygons.flatMap((p, si) =>
              p.points.map((pt, ai) => (
                <circle
                  key={`pt-${si}-${ai}`}
                  className={`cf-chart__bar--${p.idx} cf-radar__vertex`}
                  cx={pt.x}
                  cy={pt.y}
                  r={3}
                  onPointerEnter={(e) =>
                    onVertexEnter?.({
                      series: series[si],
                      seriesIndex: si,
                      axisIndex: ai,
                      axisLabel: axes[ai],
                      value: series[si].values[ai],
                      nativeEvent: e,
                    })
                  }
                  onPointerLeave={(e) =>
                    onVertexLeave?.({
                      series: series[si],
                      seriesIndex: si,
                      axisIndex: ai,
                      axisLabel: axes[ai],
                      value: series[si].values[ai],
                      nativeEvent: e,
                    })
                  }
                >
                  <title>
                    {p.name} · {axes[ai]}: {series[si].values[ai]}
                  </title>
                </circle>
              )),
            )
          : null}
      </svg>
      {showLegend && layout ? (
        <ul className="cf-radar__legend">
          {layout.polygons.map((p) => (
            <li key={p.name}>
              <span className={`cf-radar__dot cf-chart__bar--${p.idx}`} />
              {p.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
