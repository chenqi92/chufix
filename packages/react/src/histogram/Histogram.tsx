import { useMemo, useState, type MouseEvent } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { HistogramInteractionPayload, HistogramProps } from './variants';

export function Histogram(props: HistogramProps) {
  const {
    bins,
    width = 480,
    height = 200,
    colorIndex = 0,
    showLabels = true,
    showTooltip = true,
    tooltipFormatter,
    onItemEnter,
    onItemLeave,
    ariaLabel = '直方图',
    className,
  } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const padBottom = 24;
  const padLeft = 24;
  const padRight = 12;
  const padTop = 8;

  const bars = useMemo(() => {
    const data = bins ?? [];
    if (!data.length) return [];
    const counts = data.map((b) => b.count);
    const dom = domainOf([0, ...counts]);
    const sy = linearScale(dom, { start: height - padBottom, end: padTop });
    const innerW = width - padLeft - padRight;
    const slot = innerW / data.length;
    const barW = Math.max(1, slot - 1);
    return data.map((b, i) => ({
      x: padLeft + slot * i + (slot - barW) / 2,
      y: sy(b.count),
      width: barW,
      height: Math.abs(sy(0) - sy(b.count)),
      label: b.label,
      count: b.count,
      cx: padLeft + slot * (i + 0.5),
    }));
  }, [bins, width, height]);

  const activePayload = useMemo<HistogramInteractionPayload | null>(() => {
    if (activeIndex == null) return null;
    const bar = bars[activeIndex];
    if (!bar) return null;
    return { label: bar.label, count: bar.count, dataIndex: activeIndex };
  }, [bars, activeIndex]);

  const tooltip = useMemo(() => {
    if (!activePayload) return null;
    const bar = bars[activePayload.dataIndex];
    const text = tooltipFormatter?.(activePayload) ?? `${activePayload.label}: ${activePayload.count}`;
    const boxWidth = Math.max(88, text.length * 7 + 20);
    const boxHeight = 28;
    const x = Math.min(Math.max(bar.cx + 10, 4), width - boxWidth - 4);
    const y = Math.min(Math.max(bar.y - boxHeight - 8, 4), height - boxHeight - 4);
    return { x, y, width: boxWidth, height: boxHeight, text };
  }, [bars, activePayload, tooltipFormatter, width, height]);

  const payloadFor = (index: number, nativeEvent: MouseEvent<SVGRectElement>): HistogramInteractionPayload | null => {
    const bar = bars[index];
    if (!bar) return null;
    return { label: bar.label, count: bar.count, dataIndex: index, nativeEvent };
  };

  const setActive = (index: number, event: MouseEvent<SVGRectElement>) => {
    setActiveIndex(index);
    const payload = payloadFor(index, event);
    if (payload) onItemEnter?.(payload);
  };

  const clearActive = (event: MouseEvent<SVGRectElement>) => {
    if (activeIndex != null) {
      const payload = payloadFor(activeIndex, event);
      if (payload) onItemLeave?.(payload);
    }
    setActiveIndex(null);
  };

  return (
    <svg
      className={[
        'cf-chart',
        `cf-chart__series-${colorIndex}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          className={['cf-chart__bar', activeIndex === i && 'is-active'].filter(Boolean).join(' ')}
          x={b.x}
          y={b.y}
          width={b.width}
          height={b.height}
          tabIndex={0}
          onMouseEnter={(event) => setActive(i, event)}
          onMouseMove={(event) => setActive(i, event)}
          onMouseLeave={clearActive}
        />
      ))}
      {showLabels && bars.length <= 16
        ? bars.map((b, i) => (
            <text
              key={`l${i}`}
              x={b.x + b.width / 2}
              y={height - 6}
              textAnchor="middle"
            >
              {b.label}
            </text>
          ))
        : null}
      {showTooltip && tooltip ? (
        <g className="cf-chart-tooltip" transform={`translate(${tooltip.x} ${tooltip.y})`} pointerEvents="none">
          <rect width={tooltip.width} height={tooltip.height} rx={4} />
          <text x={8} y={18}>{tooltip.text}</text>
        </g>
      ) : null}
    </svg>
  );
}
