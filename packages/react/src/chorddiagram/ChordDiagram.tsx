import { useMemo } from 'react';
import { polar } from '../_charts/scale';
import type { ChordDiagramProps } from './variants';

export function ChordDiagram(props: ChordDiagramProps) {
  const {
    matrix,
    labels,
    width = 460,
    height = 460,
    padAngle = 2,
    innerRadius = 0,
    outerRadius = 0,
    ariaLabel = '弦图',
    className,
    onRibbonEnter,
    onRibbonLeave,
  } = props;

  const layout = useMemo(() => {
    const m = matrix ?? [];
    const n = m.length;
    if (!n) return null;
    const totals = m.map(
      (row, i) =>
        row.reduce((a, b) => a + b, 0) +
        m.reduce((a, r) => a + (r[i] ?? 0), 0) -
        (m[i][i] ?? 0),
    );
    const sum = totals.reduce((a, b) => a + b, 0) || 1;
    const cx = width / 2;
    const cy = height / 2;
    const baseR = Math.min(cx, cy) - 24;
    const rOuter = outerRadius || baseR;
    const rInner = innerRadius || baseR - 14;
    const totalPad = padAngle * n;
    const usable = 360 - totalPad;
    const arcs: { start: number; end: number; label?: string }[] = [];
    let cursor = 0;
    for (let i = 0; i < n; i++) {
      const a = (totals[i] / sum) * usable;
      arcs.push({ start: cursor, end: cursor + a, label: labels?.[i] });
      cursor += a + padAngle;
    }
    const subStarts: number[][] = arcs.map(() => []);
    const subEnds: number[][] = arcs.map(() => []);
    for (let i = 0; i < n; i++) {
      let c = arcs[i].start;
      for (let j = 0; j < n; j++) {
        const span = ((m[i][j] ?? 0) / sum) * usable;
        subStarts[i][j] = c;
        subEnds[i][j] = c + span;
        c += span;
      }
    }
    const annulus = (a: { start: number; end: number }) => {
      const o1 = polar(cx, cy, rOuter, a.start);
      const o2 = polar(cx, cy, rOuter, a.end);
      const i2 = polar(cx, cy, rInner, a.end);
      const i1 = polar(cx, cy, rInner, a.start);
      const large = a.end - a.start > 180 ? 1 : 0;
      return [
        `M ${o1.x} ${o1.y}`,
        `A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y}`,
        `L ${i2.x} ${i2.y}`,
        `A ${rInner} ${rInner} 0 ${large} 0 ${i1.x} ${i1.y}`,
        'Z',
      ].join(' ');
    };
    const ribbonD = (i: number, j: number) => {
      const aStart = subStarts[i][j];
      const aEnd = subEnds[i][j];
      const bStart = subStarts[j][i];
      const bEnd = subEnds[j][i];
      const p1 = polar(cx, cy, rInner, aStart);
      const p2 = polar(cx, cy, rInner, aEnd);
      const p3 = polar(cx, cy, rInner, bStart);
      const p4 = polar(cx, cy, rInner, bEnd);
      const largeA = aEnd - aStart > 180 ? 1 : 0;
      const largeB = bEnd - bStart > 180 ? 1 : 0;
      return [
        `M ${p1.x} ${p1.y}`,
        `A ${rInner} ${rInner} 0 ${largeA} 1 ${p2.x} ${p2.y}`,
        `Q ${cx} ${cy} ${p3.x} ${p3.y}`,
        `A ${rInner} ${rInner} 0 ${largeB} 1 ${p4.x} ${p4.y}`,
        `Q ${cx} ${cy} ${p1.x} ${p1.y}`,
        'Z',
      ].join(' ');
    };
    const ribbons: { d: string; source: number; target: number; value: number }[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const v = (m[i][j] ?? 0) + (i === j ? 0 : m[j][i] ?? 0);
        if (v <= 0) continue;
        ribbons.push({ d: ribbonD(i, j), source: i, target: j, value: v });
      }
    }
    const nodes = arcs.map((a, i) => {
      const mid = (a.start + a.end) / 2;
      const p = polar(cx, cy, rOuter + 12, mid);
      const flip = mid > 90 && mid < 270;
      return {
        annulus: annulus(a),
        label: a.label ?? `#${i}`,
        labelX: p.x,
        labelY: p.y,
        anchor: flip ? 'end' : 'start',
      };
    });
    return { nodes, ribbons };
  }, [matrix, labels, width, height, padAngle, innerRadius, outerRadius]);

  return (
    <svg
      className={['cf-chart cf-chord', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout && (
        <>
          <g className="cf-chord__ribbons">
            {layout.ribbons.map((r, k) => (
              <path
                key={`r${k}`}
                className={`cf-chart__series-${r.source % 8} cf-chord__ribbon`}
                d={r.d}
                fill="currentColor"
                fillOpacity={0.45}
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeWidth={0.5}
                onPointerEnter={(e) => onRibbonEnter?.({ ...r, nativeEvent: e })}
                onPointerLeave={(e) => onRibbonLeave?.({ ...r, nativeEvent: e })}
              />
            ))}
          </g>
          <g className="cf-chord__nodes">
            {layout.nodes.map((node, i) => (
              <g key={`n${i}`} className={`cf-chart__series-${i % 8}`}>
                <path
                  d={node.annulus}
                  className="cf-chord__node-arc"
                  fill="currentColor"
                  fillOpacity={0.9}
                />
                <text
                  x={node.labelX}
                  y={node.labelY}
                  textAnchor={node.anchor as 'start' | 'end'}
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>
        </>
      )}
    </svg>
  );
}
