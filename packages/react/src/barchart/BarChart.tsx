import { useMemo, useState, type FocusEvent, type MouseEvent } from 'react';
import { domainOf, linearScale, ticks } from '../_charts/scale';
import type { BarChartInteractionPayload, BarChartProps } from './variants';

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;

export function BarChart(props: BarChartProps) {
  const {
    data,
    labels,
    width = 480,
    height = 240,
    colorIndex = 0,
    orientation = 'vertical',
    showGrid = true,
    showLabels = true,
    showTooltip = true,
    valueFormatter,
    tooltipFormatter,
    onItemEnter,
    onItemLeave,
    ariaLabel = '柱状图',
    className,
  } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const layout = useMemo(() => {
    if (!data?.length) return null;
    const dom = domainOf([0, ...data]);
    const axisTicks = ticks(dom, 5);

    if (orientation === 'horizontal') {
      const left = 72;
      const sx = linearScale(dom, { start: left, end: width - padRight });
      const innerH = height - padTop - padBottom;
      const slot = innerH / data.length;
      const barH = Math.max(2, slot * 0.62);
      const bars = data.map((v, i) => {
        const cy = padTop + slot * (i + 0.5);
        const x0 = sx(0);
        const x1 = sx(v);
        return {
          x: Math.min(x0, x1),
          y: cy - barH / 2,
          width: Math.abs(x1 - x0),
          height: barH,
          label: labels?.[i] ?? '',
          value: v,
          index: i,
          cx: x1,
          cy,
        };
      });
      return { orientation: 'horizontal' as const, scale: sx, ticks: axisTicks, bars, padLeft: left };
    }

    const sy = linearScale(dom, { start: height - padBottom, end: padTop });
    const innerW = width - padLeft - padRight;
    const slot = innerW / data.length;
    const barW = Math.max(2, slot * 0.7);
    const bars = data.map((v, i) => {
      const cx = padLeft + slot * (i + 0.5);
      const y0 = sy(0);
      const y1 = sy(v);
      return {
        x: cx - barW / 2,
        y: Math.min(y0, y1),
        width: barW,
        height: Math.abs(y1 - y0),
        label: labels?.[i] ?? '',
        value: v,
        index: i,
        cx,
        cy: Math.min(y0, y1) + Math.abs(y1 - y0) / 2,
      };
    });
    return { orientation: 'vertical' as const, scale: sy, ticks: axisTicks, bars, padLeft };
  }, [data, labels, width, height, orientation]);

  const activePayload = useMemo<BarChartInteractionPayload | null>(() => {
    if (!layout || activeIndex == null) return null;
    const bar = layout.bars[activeIndex];
    if (!bar) return null;
    return {
      label: bar.label || `${activeIndex}`,
      value: bar.value,
      dataIndex: activeIndex,
      colorIndex,
    };
  }, [layout, activeIndex, colorIndex]);

  const tooltip = useMemo(() => {
    if (!layout || !activePayload) return null;
    const bar = layout.bars[activePayload.dataIndex];
    const value = valueFormatter
      ? valueFormatter(activePayload.value, activePayload)
      : `${activePayload.value}`;
    const text = tooltipFormatter?.(activePayload) ?? `${activePayload.label}: ${value}`;
    const boxWidth = Math.max(88, text.length * 7 + 20);
    const boxHeight = 28;
    const x = Math.min(Math.max(bar.cx + 10, 4), width - boxWidth - 4);
    const y = Math.min(Math.max(bar.y - boxHeight - 8, 4), height - boxHeight - 4);
    return { x, y, width: boxWidth, height: boxHeight, text };
  }, [layout, activePayload, valueFormatter, tooltipFormatter, width, height]);

  const payloadFor = (
    index: number,
    nativeEvent: MouseEvent<SVGRectElement> | FocusEvent<SVGRectElement>,
  ): BarChartInteractionPayload | null => {
    if (!layout) return null;
    const bar = layout.bars[index];
    if (!bar) return null;
    return {
      label: bar.label || `${index}`,
      value: bar.value,
      dataIndex: index,
      colorIndex,
      nativeEvent,
    };
  };

  const setActive = (
    index: number,
    event: MouseEvent<SVGRectElement> | FocusEvent<SVGRectElement>,
  ) => {
    setActiveIndex(index);
    const payload = payloadFor(index, event);
    if (payload) onItemEnter?.(payload);
  };

  const clearActive = (event: MouseEvent<SVGRectElement> | FocusEvent<SVGRectElement>) => {
    if (activeIndex != null) {
      const payload = payloadFor(activeIndex, event);
      if (payload) onItemLeave?.(payload);
    }
    setActiveIndex(null);
  };

  return (
    <svg
      className={['cf-chart', `cf-chart__series-${colorIndex}`, className]
        .filter(Boolean)
        .join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout ? (
        <>
          {showGrid
            ? layout.ticks.map((t, i) => (
                <line
                  key={`g${i}`}
                  className="cf-chart__grid"
                  x1={layout.orientation === 'horizontal' ? layout.scale(t) : layout.padLeft}
                  x2={layout.orientation === 'horizontal' ? layout.scale(t) : width - padRight}
                  y1={layout.orientation === 'horizontal' ? padTop : layout.scale(t)}
                  y2={layout.orientation === 'horizontal' ? height - padBottom : layout.scale(t)}
                />
              ))
            : null}
          {showLabels
            ? layout.ticks.map((t, i) => (
                <text
                  key={`yl${i}`}
                  x={layout.orientation === 'horizontal' ? layout.scale(t) : layout.padLeft - 4}
                  y={layout.orientation === 'horizontal' ? height - 6 : layout.scale(t) + 4}
                  textAnchor={layout.orientation === 'horizontal' ? 'middle' : 'end'}
                >
                  {Math.round(t)}
                </text>
              ))
            : null}
          {showLabels && layout.bars.length <= 24
            ? layout.bars.map((b, i) => (
                <text
                  key={`xl${i}`}
                  x={layout.orientation === 'horizontal' ? layout.padLeft - 8 : b.cx}
                  y={layout.orientation === 'horizontal' ? b.cy + 4 : height - 6}
                  textAnchor={layout.orientation === 'horizontal' ? 'end' : 'middle'}
                >
                  {b.label}
                </text>
              ))
            : null}
          {layout.bars.map((b, i) => (
            <rect
              key={i}
              className={['cf-chart__bar', activeIndex === i && 'is-active'].filter(Boolean).join(' ')}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={1.5}
              tabIndex={0}
              onMouseEnter={(event) => setActive(i, event)}
              onMouseMove={(event) => setActive(i, event)}
              onMouseLeave={clearActive}
              onFocus={(event) => setActive(i, event)}
              onBlur={clearActive}
            />
          ))}
          {showTooltip && tooltip ? (
            <g className="cf-chart-tooltip" transform={`translate(${tooltip.x} ${tooltip.y})`} pointerEvents="none">
              <rect width={tooltip.width} height={tooltip.height} rx={4} />
              <text x={8} y={18}>{tooltip.text}</text>
            </g>
          ) : null}
        </>
      ) : null}
    </svg>
  );
}
