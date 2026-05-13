import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  MarimekkoColumn,
  MarimekkoHoverPayload,
  MarimekkoProps as BaseProps,
  MarimekkoSegment,
} from './variants';

export type MarimekkoChartProps = BaseProps & {
  onHover?: (p: MarimekkoHoverPayload | null) => void;
  onSelect?: (p: MarimekkoHoverPayload) => void;
};

const DEFAULT_PALETTE = [
  'var(--viz-1, oklch(64% 0.16 263))',
  'var(--viz-2, oklch(70% 0.13 175))',
  'var(--viz-3, oklch(74% 0.16 80))',
  'var(--viz-4, oklch(64% 0.18 30))',
  'var(--viz-5, oklch(68% 0.18 320))',
  'var(--viz-6, oklch(72% 0.14 220))',
  'var(--viz-7, oklch(70% 0.13 140))',
  'var(--viz-8, oklch(68% 0.18 0))',
];

const PAD_L = 12;
const PAD_R = 12;
const PAD_T = 24;
const PAD_B = 28;

interface Cell {
  ci: number;
  si: number;
  column: MarimekkoColumn;
  segment: MarimekkoSegment;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  columnShare: number;
  segmentShare: number;
  cellShare: number;
}

export function MarimekkoChart(props: MarimekkoChartProps) {
  const {
    columns,
    height = 320,
    showColumnLabels = true,
    showSegmentLabels = true,
    format,
    palette = DEFAULT_PALETTE,
    ariaLabel,
    size = 'md',
    onHover,
    onSelect,
  } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [innerW, setInnerW] = useState(560);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerW(Math.max(280, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const columnTotals = useMemo(
    () => columns.map((c) => c.segments.reduce((s, x) => s + x.value, 0)),
    [columns],
  );
  const grandTotal = columnTotals.reduce((a, b) => a + b, 0);
  const chartW = innerW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;

  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = [];
    let x = PAD_L;
    columns.forEach((col, ci) => {
      const colT = columnTotals[ci] || 1;
      const colShare = grandTotal ? colT / grandTotal : 0;
      const w = chartW * colShare;
      let y = PAD_T;
      col.segments.forEach((seg, si) => {
        const segShare = seg.value / colT;
        const h = chartH * segShare;
        out.push({
          ci,
          si,
          column: col,
          segment: seg,
          x,
          y,
          w,
          h,
          color: seg.color ?? palette[si % palette.length],
          columnShare: colShare,
          segmentShare: segShare,
          cellShare: grandTotal ? seg.value / grandTotal : 0,
        });
        y += h;
      });
      x += w;
    });
    return out;
  }, [columns, columnTotals, grandTotal, chartW, chartH, palette]);

  function colCenterX(ci: number): number {
    let x = PAD_L;
    for (let i = 0; i < ci; i++) {
      const t = columnTotals[i] || 1;
      x += chartW * (grandTotal ? t / grandTotal : 0);
    }
    const t = columnTotals[ci] || 1;
    return x + (chartW * (grandTotal ? t / grandTotal : 0)) / 2;
  }

  const [hovered, setHovered] = useState<{ ci: number; si: number } | null>(null);
  const payload = (c: Cell): MarimekkoHoverPayload => ({
    column: c.column,
    segment: c.segment,
    columnShare: c.columnShare,
    segmentShare: c.segmentShare,
    cellShare: c.cellShare,
  });
  const fmt = (c: Cell) => (format ? format(c.segment.value, c.segment, c.column) : c.segment.value.toLocaleString());
  const isDim = (c: Cell) => hovered !== null && (hovered.ci !== c.ci || hovered.si !== c.si);
  const focusedCell = hovered ? cells.find((c) => c.ci === hovered.ci && c.si === hovered.si) : undefined;

  return (
    <figure className={`cf-marimekko cf-marimekko--${size}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${height}`}
        preserveAspectRatio="none"
        height={height}
        aria-label={ariaLabel ?? '马赛克图'}
        role="img"
      >
        <g className="cf-marimekko__cells">
          {cells.map((c) => (
            <g
              key={`${c.ci}-${c.si}`}
              className={'cf-marimekko__cell' + (isDim(c) ? ' is-dim' : '')}
              onMouseEnter={() => {
                setHovered({ ci: c.ci, si: c.si });
                onHover?.(payload(c));
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.(payload(c))}
            >
              <rect
                x={c.x}
                y={c.y}
                width={Math.max(0, c.w - 1)}
                height={Math.max(0, c.h - 1)}
                fill={c.color}
                tabIndex={0}
                aria-label={`${c.column.label} · ${c.segment.label}: ${fmt(c)}`}
              />
              {showSegmentLabels && c.w > 56 && c.h > 22 && (
                <text x={c.x + c.w / 2} y={c.y + c.h / 2} className="cf-marimekko__seg-label" textAnchor="middle" dominantBaseline="middle">
                  {c.segment.label}
                </text>
              )}
            </g>
          ))}
        </g>

        {showColumnLabels && (
          <g className="cf-marimekko__col-labels">
            {columns.map((col, ci) => (
              <text key={ci} x={colCenterX(ci)} y={PAD_T - 8} className="cf-marimekko__col-label" textAnchor="middle">
                {col.label}
              </text>
            ))}
            {columns.map((_, ci) => (
              <text key={`pct-${ci}`} x={colCenterX(ci)} y={height - PAD_B + 16} className="cf-marimekko__col-pct" textAnchor="middle">
                {Math.round((grandTotal ? columnTotals[ci] / grandTotal : 0) * 100)}%
              </text>
            ))}
          </g>
        )}
      </svg>
      {focusedCell && (
        <figcaption className="cf-marimekko__tip">
          <span className="cf-marimekko__tip-cat">{focusedCell.column.label} · {focusedCell.segment.label}</span>
          <span className="cf-marimekko__tip-row">{fmt(focusedCell)}</span>
          <span className="cf-marimekko__tip-row cf-marimekko__tip-row--muted">
            占该列 {Math.round(focusedCell.segmentShare * 100)}% · 占总体 {Math.round(focusedCell.cellShare * 100)}%
          </span>
        </figcaption>
      )}
    </figure>
  );
}
