import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  TornadoHoverPayload,
  TornadoItem,
  TornadoProps as BaseProps,
} from './variants';

export type TornadoChartProps = BaseProps & {
  onHover?: (p: TornadoHoverPayload | null) => void;
  onSelect?: (p: TornadoHoverPayload) => void;
};

const PAD_L = 100;
const PAD_R = 100;
const PAD_T = 36;
const PAD_B = 12;
const LABEL_W = 100;

export function TornadoChart(props: TornadoChartProps) {
  const {
    items,
    leftLabel = '左',
    rightLabel = '右',
    leftColor,
    rightColor,
    rowHeight = 24,
    sortByMagnitude = true,
    showValues = true,
    format,
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
    const ro = new ResizeObserver(() => setInnerW(Math.max(360, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ordered = useMemo<TornadoItem[]>(() => {
    if (!sortByMagnitude) return items;
    return [...items].sort(
      (a, b) => Math.abs(b.left) + Math.abs(b.right) - (Math.abs(a.left) + Math.abs(a.right)),
    );
  }, [items, sortByMagnitude]);

  const max = useMemo(() => {
    let m = 0;
    for (const it of ordered) m = Math.max(m, Math.abs(it.left), Math.abs(it.right));
    return m || 1;
  }, [ordered]);

  const halfWidth = (innerW - PAD_L - PAD_R) / 2;
  const centerX = PAD_L + halfWidth;
  const totalHeight = PAD_T + PAD_B + ordered.length * rowHeight;

  const scale = (v: number) => halfWidth * (Math.abs(v) / max);
  const rowY = (i: number) => PAD_T + i * rowHeight + rowHeight / 2;

  const [hovered, setHovered] = useState<{ index: number; side: 'left' | 'right' } | null>(null);

  const fmt = (v: number) => (format ? format(v) : Math.abs(v).toLocaleString());
  const leftFill = leftColor ?? 'var(--accent-1)';
  const rightFill = rightColor ?? 'var(--status-warning)';

  return (
    <figure className={`cf-tornado cf-tornado--${size}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${totalHeight}`}
        preserveAspectRatio="none"
        height={totalHeight}
        aria-label={ariaLabel ?? `${leftLabel} 与 ${rightLabel} 对比`}
        role="img"
      >
        <text x={PAD_L + halfWidth / 2} y={20} className="cf-tornado__header" textAnchor="middle">{leftLabel}</text>
        <text x={centerX + halfWidth / 2} y={20} className="cf-tornado__header" textAnchor="middle">{rightLabel}</text>
        <line x1={centerX} x2={centerX} y1={PAD_T - 4} y2={totalHeight - PAD_B + 4} className="cf-tornado__axis" />

        {ordered.map((it, i) => (
          <g key={i} className="cf-tornado__row">
            <text x={centerX} y={rowY(i) + 4} className="cf-tornado__row-label" textAnchor="middle">{it.label}</text>
            <rect
              x={centerX - LABEL_W / 2 - scale(it.left)}
              y={rowY(i) - rowHeight / 2 + 4}
              width={scale(it.left)}
              height={rowHeight - 8}
              fill={it.leftColor ?? leftFill}
              opacity={hovered === null || (hovered.index === i && hovered.side === 'left') ? 1 : 0.45}
              className="cf-tornado__bar cf-tornado__bar--left"
              tabIndex={0}
              aria-label={`${it.label} · ${leftLabel}: ${fmt(it.left)}`}
              onMouseEnter={() => {
                setHovered({ index: i, side: 'left' });
                onHover?.({ index: i, item: it, side: 'left' });
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.({ index: i, item: it, side: 'left' })}
            />
            {showValues && (
              <text x={centerX - LABEL_W / 2 - scale(it.left) - 4} y={rowY(i) + 4} className="cf-tornado__value cf-tornado__value--left" textAnchor="end">
                {fmt(it.left)}
              </text>
            )}
            <rect
              x={centerX + LABEL_W / 2}
              y={rowY(i) - rowHeight / 2 + 4}
              width={scale(it.right)}
              height={rowHeight - 8}
              fill={it.rightColor ?? rightFill}
              opacity={hovered === null || (hovered.index === i && hovered.side === 'right') ? 1 : 0.45}
              className="cf-tornado__bar cf-tornado__bar--right"
              tabIndex={0}
              aria-label={`${it.label} · ${rightLabel}: ${fmt(it.right)}`}
              onMouseEnter={() => {
                setHovered({ index: i, side: 'right' });
                onHover?.({ index: i, item: it, side: 'right' });
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.({ index: i, item: it, side: 'right' })}
            />
            {showValues && (
              <text x={centerX + LABEL_W / 2 + scale(it.right) + 4} y={rowY(i) + 4} className="cf-tornado__value cf-tornado__value--right" textAnchor="start">
                {fmt(it.right)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </figure>
  );
}
