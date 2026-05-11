import { useMemo, useState, type MouseEvent } from 'react';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
  ticks,
} from '../_charts/scale';
import type { AreaChartInteractionPayload, AreaChartProps, AreaChartTooltipItem } from './variants';

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;
const legendHeight = 24;

export function AreaChart(props: AreaChartProps) {
  const {
    series,
    width = 480,
    height = 240,
    smooth = false,
    stacked = false,
    showGrid = true,
    showLabels = true,
    showLegend = true,
    showTooltip = true,
    valueFormatter,
    tooltipFormatter,
    onItemEnter,
    onItemLeave,
    onLegendToggle,
    ariaLabel = '面积图',
    className,
  } = props;
  const [hiddenSeries, setHiddenSeries] = useState<Set<number>>(() => new Set());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const layout = useMemo(() => {
    if (!series?.length) return null;
    const chartTop = showLegend && series.length > 1 ? padTop + legendHeight : padTop;
    const visible = series.map((_, i) => !hiddenSeries.has(i));
    const visibleSeries = series.filter((_, i) => visible[i]);
    const domainSeries = visibleSeries.length ? visibleSeries : series;
    const maxLen = Math.max(...series.map((s) => s.data.length), 1);

    let stackedData: number[][];
    if (stacked) {
      stackedData = series.map(() => new Array(maxLen).fill(0));
      for (let i = 0; i < maxLen; i++) {
        let acc = 0;
        for (let s = 0; s < series.length; s++) {
          if (visible[s]) acc += series[s].data[i] ?? 0;
          stackedData[s][i] = acc;
        }
      }
    } else {
      stackedData = series.map((s) => s.data.slice());
    }

    const domainData = stacked ? stackedData.flat() : domainSeries.flatMap((s) => s.data);
    const allValues = domainData.length ? domainData : stackedData.flat();
    const dom = domainOf(stacked ? [0, ...allValues] : allValues);
    const sx = linearScale(
      { min: 0, max: Math.max(1, maxLen - 1) },
      { start: padLeft, end: width - padRight },
    );
    const sy = linearScale(dom, { start: height - padBottom, end: chartTop });
    const baselineY = sy(dom.min);
    const yTicks = ticks(dom, 5);
    const lbls = props.labels ?? Array.from({ length: maxLen }, (_, i) => `${i}`);

    const areas = stackedData.map((data, idx) => {
      const pts = data.map((v, i) => ({ x: sx(i), y: sy(v) }));
      return {
        idx,
        name: series[idx].name,
        data: series[idx].data,
        hidden: !visible[idx],
        points: pts,
        area: areaPath(pts, baselineY),
        line: linePath(pts, smooth),
      };
    });
    const legend = series.map((s, idx) => ({
      idx,
      name: s.name ?? `Series ${idx + 1}`,
      hidden: !visible[idx],
      x: padLeft + (idx % 4) * 104,
      y: 10 + Math.floor(idx / 4) * 16,
    }));
    return { sx, sy, areas, yTicks, labels: lbls, legend, chartTop };
  }, [series, props.labels, width, height, smooth, stacked, showLegend, hiddenSeries]);

  const formatValue = (value: number, item: AreaChartTooltipItem) =>
    valueFormatter ? valueFormatter(value, item) : value.toFixed(0);

  const activePayload = useMemo<AreaChartInteractionPayload | null>(() => {
    if (!layout || activeIndex == null) return null;
    const items = layout.areas
      .filter((area) => !area.hidden && area.data[activeIndex] != null)
      .map((area) => ({
        name: area.name,
        value: area.data[activeIndex],
        colorIndex: area.idx % 8,
        seriesIndex: area.idx,
        dataIndex: activeIndex,
      }));
    return { label: layout.labels[activeIndex] ?? `${activeIndex}`, dataIndex: activeIndex, items };
  }, [layout, activeIndex]);

  const tooltip = useMemo(() => {
    if (!layout || !activePayload?.items.length) return null;
    const custom = tooltipFormatter?.(activePayload);
    const rows = custom
      ? [{ text: custom, colorIndex: activePayload.items[0].colorIndex }]
      : activePayload.items.map((item) => ({
          text: `${item.name ?? `Series ${item.seriesIndex + 1}`}: ${formatValue(item.value, item)}`,
          colorIndex: item.colorIndex,
        }));
    const boxWidth = Math.max(96, activePayload.label.length * 7 + 20, ...rows.map((row) => row.text.length * 7 + 28));
    const boxHeight = 24 + rows.length * 18;
    const anchorX = layout.sx(activePayload.dataIndex);
    const pointYs = layout.areas
      .filter((area) => !area.hidden)
      .map((area) => area.points[activePayload.dataIndex]?.y)
      .filter((y): y is number => typeof y === 'number');
    const anchorY = pointYs.length ? Math.min(...pointYs) : layout.chartTop;
    const x = Math.min(Math.max(anchorX + 10, 4), width - boxWidth - 4);
    const y = Math.min(Math.max(anchorY - boxHeight - 8, 4), height - boxHeight - 4);
    return { x, y, width: boxWidth, height: boxHeight, anchorX, rows, title: activePayload.label };
  }, [layout, activePayload, tooltipFormatter, width, height]);

  const payloadFor = (index: number, nativeEvent: MouseEvent<SVGRectElement>): AreaChartInteractionPayload | null => {
    if (!layout) return null;
    const items = layout.areas
      .filter((area) => !area.hidden && area.data[index] != null)
      .map((area) => ({
        name: area.name,
        value: area.data[index],
        colorIndex: area.idx % 8,
        seriesIndex: area.idx,
        dataIndex: index,
      }));
    return { label: layout.labels[index] ?? `${index}`, dataIndex: index, items, nativeEvent };
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

  const toggleSeries = (index: number) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      onLegendToggle?.(index, next.has(index));
      return next;
    });
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
      {layout ? (
        <>
          {showLegend && layout.legend.length > 1 ? (
            <g className="cf-chart-legend">
              {layout.legend.map((item) => (
                <g
                  key={item.idx}
                  className={['cf-chart-legend__item', item.hidden && 'is-hidden'].filter(Boolean).join(' ')}
                  transform={`translate(${item.x} ${item.y})`}
                  tabIndex={0}
                  role="button"
                  onClick={() => toggleSeries(item.idx)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleSeries(item.idx);
                    }
                  }}
                >
                  <circle className={`cf-chart__bar--${item.idx % 8}`} cx={4} cy={4} r={4} />
                  <text x={14} y={8}>{item.name}</text>
                </g>
              ))}
            </g>
          ) : null}
          {showGrid
            ? layout.yTicks.map((t, i) => (
                <line
                  key={`g${i}`}
                  className="cf-chart__grid"
                  x1={padLeft}
                  x2={width - padRight}
                  y1={layout.sy(t)}
                  y2={layout.sy(t)}
                />
              ))
            : null}
          {showLabels
            ? layout.yTicks.map((t, i) => (
                <text key={`yl${i}`} x={padLeft - 4} y={layout.sy(t) + 4} textAnchor="end">
                  {t.toFixed(0)}
                </text>
              ))
            : null}
          {showLabels && layout.labels.length <= 12
            ? layout.labels.map((label, i) => (
                <text key={`xl${i}`} x={layout.sx(i)} y={height - 6} textAnchor="middle">
                  {label}
                </text>
              ))
            : null}
          {layout.areas.map((a) => (
            <g
              key={a.idx}
              className={`cf-chart__series-${a.idx}`}
              style={{ display: a.hidden ? 'none' : undefined }}
            >
              <path className="cf-chart__area" d={a.area} />
              <path className="cf-chart__line" d={a.line} />
            </g>
          ))}
          <g className="cf-chart-hitarea">
            {layout.labels.map((_, i) => {
              const half = Math.max(8, (layout.sx(1) - layout.sx(0)) / 2);
              const x = i === 0 ? padLeft : layout.sx(i - 0.5);
              const hitWidth =
                i === 0 || i === layout.labels.length - 1
                  ? half
                  : Math.max(8, layout.sx(i + 0.5) - layout.sx(i - 0.5));
              return (
                <rect
                  key={`hit${i}`}
                  fill="transparent"
                  x={x}
                  y={layout.chartTop}
                  width={hitWidth}
                  height={height - padBottom - layout.chartTop}
                  pointerEvents="all"
                  onMouseEnter={(event) => setActive(i, event)}
                  onMouseMove={(event) => setActive(i, event)}
                  onMouseLeave={clearActive}
                />
              );
            })}
          </g>
          {showTooltip && tooltip ? (
            <g className="cf-crosshair" pointerEvents="none">
              <line className="cf-crosshair__line" x1={tooltip.anchorX} x2={tooltip.anchorX} y1={layout.chartTop} y2={height - padBottom} />
              <g className="cf-chart-tooltip" transform={`translate(${tooltip.x} ${tooltip.y})`}>
                <rect width={tooltip.width} height={tooltip.height} rx={4} />
                <text className="cf-chart-tooltip__title" x={8} y={15}>{tooltip.title}</text>
                {tooltip.rows.map((row, i) => (
                  <g key={i} transform={`translate(8 ${28 + i * 18})`}>
                    <circle className={`cf-chart__bar--${row.colorIndex}`} cx={4} cy={-4} r={3.5} />
                    <text x={14} y={0}>{row.text}</text>
                  </g>
                ))}
              </g>
            </g>
          ) : null}
        </>
      ) : null}
    </svg>
  );
}
