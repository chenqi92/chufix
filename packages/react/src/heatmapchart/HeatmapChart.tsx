import { useMemo } from 'react';
import { resolveColorScale, type HeatmapChartProps } from './variants';

export function HeatmapChart(props: HeatmapChartProps) {
  const {
    data,
    rowLabels,
    colLabels,
    width = 480,
    height = 240,
    min: minProp,
    max: maxProp,
    colorScale = 'green-red',
    showValueLabels = false,
    valueDigits = 0,
    ariaLabel = '热力图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const colorFn = useMemo(() => resolveColorScale(colorScale), [colorScale]);

  const layout = useMemo(() => {
    if (!data?.length || !data[0]?.length) return null;
    const rows = data.length;
    const cols = data[0].length;
    const all = data.flat();
    const min = minProp ?? Math.min(...all);
    const max = maxProp ?? Math.max(...all);
    const padLeft = rowLabels ? 64 : 4;
    const padTop = colLabels ? 18 : 4;
    const cellW = (width - padLeft - 4) / cols;
    const cellH = (height - padTop - 4) / rows;
    const cells: {
      x: number; y: number; w: number; h: number; color: string; value: number;
      row: number; col: number; ratio: number;
    }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = data[r][c];
        const ratio = max === min ? 0.5 : (v - min) / (max - min);
        cells.push({
          x: padLeft + c * cellW,
          y: padTop + r * cellH,
          w: cellW,
          h: cellH,
          color: colorFn(ratio),
          value: v,
          row: r,
          col: c,
          ratio,
        });
      }
    }
    return { cells, padLeft, padTop, cellW, cellH };
  }, [data, rowLabels, colLabels, width, height, minProp, maxProp, colorFn]);

  return (
    <svg
      className={['cf-chart cf-heatmap', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout
        ? layout.cells.map((c, i) => (
            <rect
              key={i}
              className="cf-heatmap__cell"
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              fill={c.color}
              onPointerEnter={(e) =>
                onItemEnter?.({
                  row: c.row,
                  col: c.col,
                  value: c.value,
                  rowLabel: rowLabels?.[c.row],
                  colLabel: colLabels?.[c.col],
                  ratio: c.ratio,
                  nativeEvent: e,
                })
              }
              onPointerLeave={(e) =>
                onItemLeave?.({
                  row: c.row,
                  col: c.col,
                  value: c.value,
                  rowLabel: rowLabels?.[c.row],
                  colLabel: colLabels?.[c.col],
                  ratio: c.ratio,
                  nativeEvent: e,
                })
              }
            />
          ))
        : null}
      {layout && showValueLabels
        ? layout.cells.map((c, i) => (
            <text
              key={`v${i}`}
              className="cf-heatmap__value"
              x={c.x + c.w / 2}
              y={c.y + c.h / 2}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {c.value.toFixed(valueDigits)}
            </text>
          ))
        : null}
      {layout && rowLabels
        ? rowLabels.map((label, i) => (
            <text
              key={`r${i}`}
              x={layout.padLeft - 6}
              y={layout.padTop + i * layout.cellH + layout.cellH / 2}
              textAnchor="end"
              dominantBaseline="central"
            >
              {label}
            </text>
          ))
        : null}
      {layout && colLabels
        ? colLabels.map((label, i) => (
            <text
              key={`c${i}`}
              x={layout.padLeft + i * layout.cellW + layout.cellW / 2}
              y={12}
              textAnchor="middle"
            >
              {label}
            </text>
          ))
        : null}
    </svg>
  );
}
