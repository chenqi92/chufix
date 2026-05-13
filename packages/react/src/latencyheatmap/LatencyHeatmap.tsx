import { useMemo, type CSSProperties } from 'react';
import { ratioColor, type LatencyHeatmapProps } from './variants';

export function LatencyHeatmap(props: LatencyHeatmapProps) {
  const {
    data,
    rowLabels,
    colLabels,
    width = 480,
    height = 240,
    min,
    max,
    ariaLabel = '延迟热力图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(() => {
    if (!data?.length || !data[0]?.length) return null;
    const rows = data.length;
    const cols = data[0].length;
    const all = data.flat();
    const lo = min ?? Math.min(...all);
    const hi = max ?? Math.max(...all);
    const padLeft = rowLabels ? 64 : 4;
    const padTop = colLabels ? 18 : 4;
    const cellW = (width - padLeft - 4) / cols;
    const cellH = (height - padTop - 4) / rows;
    const cells: {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      row: number;
      col: number;
      value: number;
    }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = data[r][c];
        const ratio = hi === lo ? 0.5 : (v - lo) / (hi - lo);
        cells.push({
          x: padLeft + c * cellW,
          y: padTop + r * cellH,
          w: cellW,
          h: cellH,
          color: ratioColor(ratio),
          row: r,
          col: c,
          value: v,
        });
      }
    }
    return { cells, padLeft, padTop, cellW, cellH };
  }, [data, rowLabels, colLabels, width, height, min, max]);

  return (
    <svg
      className={['cf-chart', 'cf-latencyheatmap', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ '--cf-latencyheatmap-width': `${width}px` } as CSSProperties}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.cells.map((c, i) => (
        <rect
          key={i}
          className="cf-latencyheatmap__cell"
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
              nativeEvent: e,
            })
          }
        />
      ))}
      {rowLabels?.map((label, i) => (
        <text
          key={`r${i}`}
          x={(layout?.padLeft ?? 0) - 6}
          y={(layout?.padTop ?? 0) + i * (layout?.cellH ?? 0) + (layout?.cellH ?? 0) / 2}
          textAnchor="end"
          dominantBaseline="central"
        >
          {label}
        </text>
      ))}
      {colLabels?.map((label, i) => (
        <text
          key={`c${i}`}
          x={(layout?.padLeft ?? 0) + i * (layout?.cellW ?? 0) + (layout?.cellW ?? 0) / 2}
          y={12}
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
