import { useMemo } from 'react';
import type {
  SankeyDiagramProps,
  SankeyNode,
} from './variants';

export function SankeyDiagram(props: SankeyDiagramProps) {
  const {
    nodes,
    links,
    width = 480,
    height = 280,
    nodeWidth = 12,
    ariaLabel = 'Sankey 流向图',
    className,
    onNodeEnter,
    onNodeLeave,
    onLinkEnter,
    onLinkLeave,
  } = props;

  const layout = useMemo(() => {
    if (!nodes?.length || !links?.length) return null;
    const layerMax = nodes.reduce((m, n) => Math.max(m, n.layer ?? 0), 0);
    const byLayer: Record<number, SankeyNode[]> = {};
    nodes.forEach((n) => {
      const l = n.layer ?? 0;
      (byLayer[l] = byLayer[l] || []).push(n);
    });

    const layerSpacing =
      layerMax > 0 ? (width - nodeWidth) / layerMax : 0;
    const placed = new Map<
      string,
      { x: number; y: number; h: number; node: SankeyNode }
    >();
    const innerH = height - 16;

    Object.entries(byLayer).forEach(([layerStr, group]) => {
      const layer = Number(layerStr);
      const x = layer * layerSpacing;
      const totalValue = group.reduce((s, n) => {
        const inflow = links
          .filter((l) => l.target === n.id)
          .reduce((a, l) => a + l.value, 0);
        const outflow = links
          .filter((l) => l.source === n.id)
          .reduce((a, l) => a + l.value, 0);
        return s + Math.max(inflow, outflow);
      }, 0);
      const valuePx = innerH / Math.max(1, totalValue);
      let y = 8;
      for (const n of group) {
        const inflow = links
          .filter((l) => l.target === n.id)
          .reduce((a, l) => a + l.value, 0);
        const outflow = links
          .filter((l) => l.source === n.id)
          .reduce((a, l) => a + l.value, 0);
        const h = Math.max(8, Math.max(inflow, outflow) * valuePx);
        placed.set(n.id, { x, y, h, node: n });
        y += h + 6;
      }
    });

    const linkPaths = links
      .map((l, i) => {
        const sNode = placed.get(l.source);
        const tNode = placed.get(l.target);
        if (!sNode || !tNode) return null;
        const x1 = sNode.x + nodeWidth;
        const y1 = sNode.y + sNode.h / 2;
        const x2 = tNode.x;
        const y2 = tNode.y + tNode.h / 2;
        const cx = (x1 + x2) / 2;
        const d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
        return {
          d,
          strokeWidth: Math.max(1, Math.min(sNode.h, tNode.h) * 0.6),
          idx: i % 8,
          linkIndex: i,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);

    const nodeRects = Array.from(placed.entries()).map(([id, r]) => ({
      id,
      x: r.x,
      y: r.y,
      h: r.h,
      name: r.node.name,
      colorIndex: r.node.colorIndex ?? 0,
    }));

    return { linkPaths, nodeRects };
  }, [nodes, links, width, height, nodeWidth]);

  return (
    <svg
      className={['cf-chart cf-sankey', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.linkPaths.map((p, i) => (
        <path
          key={`p${i}`}
          className={`cf-chart__bar--${p.idx}`}
          d={p.d}
          fill="none"
          strokeWidth={p.strokeWidth}
          strokeOpacity={0.35}
          stroke="currentColor"
          onPointerEnter={(e) => {
            const link = links?.[p.linkIndex];
            if (link) onLinkEnter?.({ link, linkIndex: p.linkIndex, nativeEvent: e });
          }}
          onPointerLeave={(e) => {
            const link = links?.[p.linkIndex];
            if (link) onLinkLeave?.({ link, linkIndex: p.linkIndex, nativeEvent: e });
          }}
        />
      ))}
      {layout?.nodeRects.map((r) => (
        <g
          key={r.id}
          onPointerEnter={(e) => {
            const node = nodes?.find((n) => n.id === r.id);
            if (node) onNodeEnter?.({ node, nativeEvent: e });
          }}
          onPointerLeave={(e) => {
            const node = nodes?.find((n) => n.id === r.id);
            if (node) onNodeLeave?.({ node, nativeEvent: e });
          }}
        >
          <rect
            className={`cf-chart__bar--${r.colorIndex}`}
            x={r.x}
            y={r.y}
            width={nodeWidth}
            height={r.h}
          />
          <text
            x={r.x + nodeWidth + 4}
            y={r.y + r.h / 2}
            dominantBaseline="central"
          >
            {r.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
