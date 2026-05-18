import { useMemo } from 'react';
import type { CorrelationMatrixProps } from './variants';

export function CorrelationMatrix(props: CorrelationMatrixProps) {
  const {
    matrix,
    labels,
    width = 480,
    height = 480,
    cellGap = 2,
    showText = true,
    ariaLabel = '相关性矩阵',
    className,
    onCellEnter,
    onCellLeave,
  } = props;

  const layout = useMemo(() => {
    const m = matrix ?? [];
    const lbls = labels ?? [];
    const n = m.length;
    if (!n) return null;
    const padLeft = 72;
    const padTop = 56;
    const padRight = 12;
    const padBottom = 12;
    const cellW = Math.max(8, (width - padLeft - padRight - cellGap * (n - 1)) / n);
    const cellH = Math.max(8, (height - padTop - padBottom - cellGap * (n - 1)) / n);
    const cells: {
      r: number;
      c: number;
      x: number;
      y: number;
      w: number;
      h: number;
      value: number;
      rowLabel: string;
      colLabel: string;
      color: string;
      text: string;
      textColor: string;
    }[] = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const v = Math.max(-1, Math.min(1, m[r]?.[c] ?? 0));
        const x = padLeft + c * (cellW + cellGap);
        const y = padTop + r * (cellH + cellGap);
        const intensity = Math.abs(v);
        const hue = v >= 0 ? 263 : 28;
        const lightness = 96 - intensity * 38;
        const color = `oklch(${lightness}% ${0.04 + intensity * 0.16} ${hue})`;
        const textColor = intensity > 0.55 ? 'oklch(98% 0.01 260)' : 'oklch(20% 0.01 260)';
        cells.push({
          r,
          c,
          x,
          y,
          w: cellW,
          h: cellH,
          value: v,
          rowLabel: lbls[r] ?? `${r}`,
          colLabel: lbls[c] ?? `${c}`,
          color,
          text: v.toFixed(2),
          textColor,
        });
      }
    }
    return {
      cells,
      rowLabels: lbls.map((l, r) => ({
        label: l,
        x: padLeft - 8,
        y: padTop + r * (cellH + cellGap) + cellH / 2 + 4,
      })),
      colLabels: lbls.map((l, c) => ({
        label: l,
        cx: padLeft + c * (cellW + cellGap) + cellW / 2,
        cy: padTop - 8,
      })),
    };
  }, [matrix, labels, width, height, cellGap]);

  return (
    <svg
      className={['cf-chart cf-corrmatrix', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout && (
        <>
          <g className="cf-corrmatrix__row-labels">
            {layout.rowLabels.map((l, i) => (
              <text key={`r${i}`} x={l.x} y={l.y} textAnchor="end">
                {l.label}
              </text>
            ))}
          </g>
          <g className="cf-corrmatrix__col-labels">
            {layout.colLabels.map((l, i) => (
              <text key={`c${i}`} x={l.cx} y={l.cy} textAnchor="middle">
                {l.label}
              </text>
            ))}
          </g>
          <g className="cf-corrmatrix__cells">
            {layout.cells.map((c, i) => (
              <g key={i}>
                <rect
                  x={c.x}
                  y={c.y}
                  width={c.w}
                  height={c.h}
                  fill={c.color}
                  className="cf-corrmatrix__cell"
                  rx={2}
                  onPointerEnter={(e) =>
                    onCellEnter?.({
                      row: c.r,
                      col: c.c,
                      value: c.value,
                      rowLabel: c.rowLabel,
                      colLabel: c.colLabel,
                      nativeEvent: e,
                    })
                  }
                  onPointerLeave={(e) =>
                    onCellLeave?.({
                      row: c.r,
                      col: c.c,
                      value: c.value,
                      rowLabel: c.rowLabel,
                      colLabel: c.colLabel,
                      nativeEvent: e,
                    })
                  }
                />
                {showText && c.w >= 24 && c.h >= 14 && (
                  <text
                    x={c.x + c.w / 2}
                    y={c.y + c.h / 2 + 4}
                    textAnchor="middle"
                    fill={c.textColor}
                    className="cf-corrmatrix__text"
                  >
                    {c.text}
                  </text>
                )}
              </g>
            ))}
          </g>
        </>
      )}
    </svg>
  );
}
