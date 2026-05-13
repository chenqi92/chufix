import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type {
  SankeyDiagramProps,
  SankeyNode,
} from './variants';

interface PlacedEntry {
  x: number;
  baseY: number;
  h: number;
  node: SankeyNode;
  layer: number;
}

export function SankeyDiagram(props: SankeyDiagramProps) {
  const {
    nodes,
    links,
    width = 480,
    height = 280,
    nodeWidth = 12,
    ariaLabel = 'Sankey 流向图',
    draggable = true,
    className,
    onNodeEnter,
    onNodeLeave,
    onLinkEnter,
    onLinkLeave,
    onNodeDrag,
  } = props;

  const [yOverrides, setYOverrides] = useState<Record<string, number>>({});

  const baseLayout = useMemo(() => {
    if (!nodes?.length || !links?.length) return null;
    const layerMax = nodes.reduce((m, n) => Math.max(m, n.layer ?? 0), 0);
    const byLayer: Record<number, SankeyNode[]> = {};
    nodes.forEach((n) => {
      const l = n.layer ?? 0;
      (byLayer[l] = byLayer[l] || []).push(n);
    });
    const layerSpacing = layerMax > 0 ? (width - nodeWidth) / layerMax : 0;
    const placed = new Map<string, PlacedEntry>();
    const innerH = height - 16;

    Object.entries(byLayer).forEach(([layerStr, group]) => {
      const layer = Number(layerStr);
      const x = layer * layerSpacing;
      const totalValue = group.reduce((s, n) => {
        const inflow = links.filter((l) => l.target === n.id).reduce((a, l) => a + l.value, 0);
        const outflow = links.filter((l) => l.source === n.id).reduce((a, l) => a + l.value, 0);
        return s + Math.max(inflow, outflow);
      }, 0);
      const valuePx = innerH / Math.max(1, totalValue);
      let y = 8;
      for (const n of group) {
        const inflow = links.filter((l) => l.target === n.id).reduce((a, l) => a + l.value, 0);
        const outflow = links.filter((l) => l.source === n.id).reduce((a, l) => a + l.value, 0);
        const h = Math.max(8, Math.max(inflow, outflow) * valuePx);
        placed.set(n.id, { x, baseY: y, h, node: n, layer });
        y += h + 6;
      }
    });
    return placed;
  }, [nodes, links, width, height, nodeWidth]);

  const layout = useMemo(() => {
    if (!baseLayout) return null;
    const positions = new Map<string, { x: number; y: number; h: number; baseY: number; node: SankeyNode }>();
    baseLayout.forEach((entry, id) => {
      const override = yOverrides[id] ?? 0;
      const y = Math.max(0, Math.min(height - entry.h, entry.baseY + override));
      positions.set(id, { x: entry.x, y, h: entry.h, baseY: entry.baseY, node: entry.node });
    });

    const linkPaths = links
      .map((l, i) => {
        const sNode = positions.get(l.source);
        const tNode = positions.get(l.target);
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

    const nodeRects = Array.from(positions.entries()).map(([id, r]) => ({
      id,
      x: r.x,
      y: r.y,
      h: r.h,
      baseY: r.baseY,
      name: r.node.name,
      colorIndex: r.node.colorIndex ?? 0,
    }));

    return { linkPaths, nodeRects };
  }, [baseLayout, yOverrides, nodeWidth, height, links]);

  /* Drag handling */
  const dragRef = useRef<{ id: string; startY: number; startOverride: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onNodePointerDown = useCallback(
    (e: ReactPointerEvent, id: string) => {
      if (!draggable) return;
      e.preventDefault();
      dragRef.current = {
        id,
        startY: e.clientY,
        startOverride: yOverrides[id] ?? 0,
      };
      setDraggingId(id);
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    },
    [draggable, yOverrides],
  );
  const onNodePointerMove = useCallback((e: ReactPointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const delta = e.clientY - d.startY;
    setYOverrides((prev) => ({ ...prev, [d.id]: d.startOverride + delta }));
  }, []);
  const onNodePointerUp = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    const node = nodes.find((n) => n.id === d.id);
    const rect = layout?.nodeRects.find((r) => r.id === d.id);
    dragRef.current = null;
    setDraggingId(null);
    if (node && rect) {
      onNodeDrag?.({ node, y: rect.y, deltaY: rect.y - rect.baseY });
    }
  }, [layout, nodes, onNodeDrag]);

  return (
    <svg
      className={['cf-chart cf-sankey', draggable ? 'is-draggable' : '', className].filter(Boolean).join(' ')}
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
            if (link) onLinkEnter?.({ link, linkIndex: p.linkIndex, nativeEvent: e.nativeEvent });
          }}
          onPointerLeave={(e) => {
            const link = links?.[p.linkIndex];
            if (link) onLinkLeave?.({ link, linkIndex: p.linkIndex, nativeEvent: e.nativeEvent });
          }}
        />
      ))}
      {layout?.nodeRects.map((r) => (
        <g
          key={r.id}
          className={'cf-sankey__node' + (draggingId === r.id ? ' is-dragging' : '')}
          onPointerEnter={(e) => {
            const node = nodes?.find((n) => n.id === r.id);
            if (node) onNodeEnter?.({ node, nativeEvent: e.nativeEvent });
          }}
          onPointerLeave={(e) => {
            const node = nodes?.find((n) => n.id === r.id);
            if (node) onNodeLeave?.({ node, nativeEvent: e.nativeEvent });
          }}
          onPointerDown={(e) => onNodePointerDown(e, r.id)}
          onPointerMove={onNodePointerMove}
          onPointerUp={onNodePointerUp}
          onPointerCancel={onNodePointerUp}
        >
          <rect
            className={`cf-chart__bar--${r.colorIndex}`}
            x={r.x}
            y={r.y}
            width={nodeWidth}
            height={r.h}
          />
          <text x={r.x + nodeWidth + 4} y={r.y + r.h / 2} dominantBaseline="central">
            {r.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
