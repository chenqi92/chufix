import { useMemo } from 'react';
import { linearScale } from '../_charts/scale';
import type { WaterfallChartProps } from './variants';

export function WaterfallChart(props: WaterfallChartProps) {
  const {
    steps,
    width = 480,
    height = 240,
    showGrid = true,
    showLabels = true,
    valueFormatter,
    ariaLabel = '瀑布图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(() => {
    if (!steps?.length) return null;
    const padLeft = 32;
    const padRight = 12;
    const padTop = 16;
    const padBottom = showLabels ? 24 : 12;
    const innerW = width - padLeft - padRight;
    const innerH = height - padTop - padBottom;

    let running = 0;
    const bars = steps.map((s) => {
      const isTotal = s.kind === 'total';
      const start = isTotal ? 0 : running;
      const end = isTotal ? s.value : running + s.value;
      running = end;
      return { step: s, start, end, isTotal, delta: end - start };
    });

    const all = bars.flatMap((b) => [b.start, b.end]);
    const min = Math.min(0, ...all);
    const max = Math.max(...all);
    const sy = linearScale({ min, max }, { start: padTop + innerH, end: padTop });
    const slot = innerW / bars.length;
    const barW = Math.max(4, slot * 0.65);

    const placed = bars.map((b, i) => {
      const x = padLeft + slot * (i + 0.5) - barW / 2;
      const y1 = sy(Math.max(b.start, b.end));
      const y2 = sy(Math.min(b.start, b.end));
      const tone = b.isTotal ? 'total' : b.delta >= 0 ? 'positive' : 'negative';
      return {
        ...b,
        x,
        y: y1,
        w: barW,
        h: Math.max(1, y2 - y1),
        centerX: padLeft + slot * (i + 0.5),
        tone,
        labelY: y1 - 4,
      };
    });

    const connectors = placed.slice(0, -1).map((b, i) => {
      const next = placed[i + 1];
      const yEnd = sy(b.end);
      return { x1: b.x + b.w, x2: next.x, y: yEnd };
    });

    return { placed, connectors, zeroY: sy(0), padLeft, padTop, innerW };
  }, [steps, width, height, showLabels]);

  const fmt = (v: number) => (valueFormatter ? valueFormatter(v) : v.toFixed(0));

  return (
    <svg
      className={['cf-chart cf-waterfall', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout ? (
        <>
          {showGrid ? (
            <line
              className="cf-chart__axis"
              x1={layout.padLeft}
              x2={layout.padLeft + layout.innerW}
              y1={layout.zeroY}
              y2={layout.zeroY}
            />
          ) : null}
          {layout.connectors.map((c, i) => (
            <line
              key={`c${i}`}
              className="cf-waterfall__connector"
              x1={c.x1}
              x2={c.x2}
              y1={c.y}
              y2={c.y}
            />
          ))}
          {layout.placed.map((b, i) => (
            <rect
              key={`b${i}`}
              className={`cf-waterfall__bar cf-waterfall__bar--${b.tone}`}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              onPointerEnter={(e) =>
                onItemEnter?.({
                  step: b.step,
                  dataIndex: i,
                  cumulative: b.end,
                  delta: b.delta,
                  nativeEvent: e,
                })
              }
              onPointerLeave={(e) =>
                onItemLeave?.({
                  step: b.step,
                  dataIndex: i,
                  cumulative: b.end,
                  delta: b.delta,
                  nativeEvent: e,
                })
              }
            >
              <title>
                {b.step.label}: {fmt(b.delta)}
              </title>
            </rect>
          ))}
          {showLabels ? (
            <>
              {layout.placed.map((b, i) => (
                <text
                  key={`t${i}`}
                  x={b.centerX}
                  y={b.labelY}
                  textAnchor="middle"
                  className="cf-waterfall__value"
                >
                  {fmt(b.isTotal ? b.end : b.delta)}
                </text>
              ))}
              {layout.placed.map((b, i) => (
                <text
                  key={`l${i}`}
                  x={b.centerX}
                  y={height - 6}
                  textAnchor="middle"
                  className="cf-waterfall__label"
                >
                  {b.step.label}
                </text>
              ))}
            </>
          ) : null}
        </>
      ) : null}
    </svg>
  );
}
