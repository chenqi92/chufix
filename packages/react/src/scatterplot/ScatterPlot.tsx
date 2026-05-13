import { useMemo, useState, type MouseEvent } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { ScatterPlotInteractionPayload, ScatterPlotProps } from './variants';

export function ScatterPlot(props: ScatterPlotProps) {
  const {
    data,
    width = 480,
    height = 240,
    showTooltip = true,
    tooltipFormatter,
    onItemEnter,
    onItemLeave,
    ariaLabel = '散点图',
    className,
  } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const points = useMemo(() => {
    if (!data?.length) return null;
    const xs = data.map((p) => p.x);
    const ys = data.map((p) => p.y);
    const dx = domainOf(xs);
    const dy = domainOf(ys);
    const sx = linearScale(dx, { start: 36, end: width - 12 });
    const sy = linearScale(dy, { start: height - 24, end: 12 });
    const groups = Array.from(new Set(data.map((p) => p.group ?? 'default')));
    return data.map((p, i) => ({
      cx: sx(p.x),
      cy: sy(p.y),
      r: p.r ?? 3,
      groupIdx: groups.indexOf(p.group ?? 'default') % 8,
      point: p,
      index: i,
    }));
  }, [data, width, height]);

  const activePayload = useMemo<ScatterPlotInteractionPayload | null>(() => {
    if (!points || activeIndex == null) return null;
    const item = points[activeIndex];
    if (!item) return null;
    return { point: item.point, dataIndex: activeIndex, groupIndex: item.groupIdx };
  }, [points, activeIndex]);

  const tooltip = useMemo(() => {
    if (!points || !activePayload) return null;
    const item = points[activePayload.dataIndex];
    const text = tooltipFormatter?.(activePayload) ?? `${activePayload.point.label ?? activePayload.point.group ?? activePayload.dataIndex}: ${activePayload.point.x}, ${activePayload.point.y}`;
    const boxWidth = Math.max(96, text.length * 7 + 20);
    const boxHeight = 28;
    const x = Math.min(Math.max(item.cx + 10, 4), width - boxWidth - 4);
    const y = Math.min(Math.max(item.cy - boxHeight - 8, 4), height - boxHeight - 4);
    return { x, y, width: boxWidth, height: boxHeight, text };
  }, [points, activePayload, tooltipFormatter, width, height]);

  const payloadFor = (index: number, nativeEvent: MouseEvent<SVGCircleElement>): ScatterPlotInteractionPayload | null => {
    if (!points) return null;
    const item = points[index];
    if (!item) return null;
    return { point: item.point, dataIndex: index, groupIndex: item.groupIdx, nativeEvent };
  };

  const setActive = (index: number, event: MouseEvent<SVGCircleElement>) => {
    setActiveIndex(index);
    const payload = payloadFor(index, event);
    if (payload) onItemEnter?.(payload);
  };

  const clearActive = (event: MouseEvent<SVGCircleElement>) => {
    if (activeIndex != null) {
      const payload = payloadFor(activeIndex, event);
      if (payload) onItemLeave?.(payload);
    }
    setActiveIndex(null);
  };

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {points?.map((p, i) => (
        <circle
          key={i}
          className={`cf-chart__bar--${p.groupIdx}`}
          cx={p.cx}
          cy={p.cy}
          r={activeIndex === i ? p.r + 1.5 : p.r}
          opacity={0.7}
          tabIndex={0}
          onMouseEnter={(event) => setActive(i, event)}
          onMouseMove={(event) => setActive(i, event)}
          onMouseLeave={clearActive}
        />
      ))}
      {showTooltip && tooltip ? (
        <g className="cf-chart-tooltip" transform={`translate(${tooltip.x} ${tooltip.y})`} pointerEvents="none">
          <rect width={tooltip.width} height={tooltip.height} rx={4} />
          <text x={8} y={18}>{tooltip.text}</text>
        </g>
      ) : null}
    </svg>
  );
}
