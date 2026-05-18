import { useMemo } from 'react';
import type { PyramidChartProps } from './variants';

export function PyramidChart(props: PyramidChartProps) {
  const {
    data,
    width = 520,
    height = 320,
    leftLabel = '左侧',
    rightLabel = '右侧',
    gap = 72,
    ariaLabel = '金字塔图',
    format,
    className,
    onBarEnter,
    onBarLeave,
  } = props;
  const fmt = format ?? ((v: number) => String(Math.round(v)));

  const layout = useMemo(() => {
    if (!data?.length) return null;
    const peak = Math.max(1, ...data.flatMap((r) => [r.left, r.right]));
    const halfW = (width - gap) / 2 - 16;
    const cx = width / 2;
    const leftAnchor = cx - gap / 2;
    const rightAnchor = cx + gap / 2;
    const top = 24;
    const bottom = height - 24;
    const slot = (bottom - top) / data.length;
    const barH = Math.max(6, slot - 4);
    return data.map((r, i) => {
      const y = top + slot * (i + 0.5) - barH / 2;
      const lw = (r.left / peak) * halfW;
      const rw = (r.right / peak) * halfW;
      return {
        row: r,
        i,
        y,
        barH,
        lx: leftAnchor - lw,
        lw,
        rx: rightAnchor,
        rw,
        midY: y + barH / 2,
        labelLeft: fmt(r.left),
        labelRight: fmt(r.right),
      };
    });
  }, [data, width, height, gap, fmt]);

  return (
    <svg
      className={['cf-chart cf-pyramid', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      <text
        x={(width - gap) / 4 + 16}
        y={14}
        textAnchor="middle"
        className="cf-pyramid__legend"
      >
        {leftLabel}
      </text>
      <text
        x={width - (width - gap) / 4 - 16}
        y={14}
        textAnchor="middle"
        className="cf-pyramid__legend"
      >
        {rightLabel}
      </text>
      {layout?.map((b) => (
        <g key={b.i}>
          <rect
            className="cf-chart__bar cf-pyramid__left"
            x={b.lx}
            y={b.y}
            width={b.lw}
            height={b.barH}
            onPointerEnter={(e) =>
              onBarEnter?.({ row: b.row, side: 'left', dataIndex: b.i, nativeEvent: e })
            }
            onPointerLeave={(e) =>
              onBarLeave?.({ row: b.row, side: 'left', dataIndex: b.i, nativeEvent: e })
            }
          />
          <rect
            className="cf-chart__bar cf-pyramid__right"
            x={b.rx}
            y={b.y}
            width={b.rw}
            height={b.barH}
            onPointerEnter={(e) =>
              onBarEnter?.({ row: b.row, side: 'right', dataIndex: b.i, nativeEvent: e })
            }
            onPointerLeave={(e) =>
              onBarLeave?.({ row: b.row, side: 'right', dataIndex: b.i, nativeEvent: e })
            }
          />
          <text
            x={b.lx - 4}
            y={b.midY + 4}
            textAnchor="end"
            className="cf-pyramid__value"
          >
            {b.labelLeft}
          </text>
          <text
            x={b.rx + b.rw + 4}
            y={b.midY + 4}
            textAnchor="start"
            className="cf-pyramid__value"
          >
            {b.labelRight}
          </text>
          <text
            x={width / 2}
            y={b.midY + 4}
            textAnchor="middle"
            className="cf-pyramid__axis"
          >
            {b.row.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
