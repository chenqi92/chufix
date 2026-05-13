import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
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
    minimizeCrossings = true,
    crossingIterations = 4,
    order: controlledOrder,
    layerAssign: controlledLayerAssign,
    className,
    onNodeEnter,
    onNodeLeave,
    onLinkEnter,
    onLinkLeave,
    onNodeDrag,
    onOrderChange,
    onLayerAssignChange,
  } = props;

  const [yOverrides, setYOverrides] = useState<Record<string, number>>({});
  const [xOverrides, setXOverrides] = useState<Record<string, number>>({});
  const [layerOverrides, setLayerOverrides] = useState<Record<string, number>>(() => ({
    ...(controlledLayerAssign ?? {}),
  }));
  const [orderOverrides, setOrderOverrides] = useState<Record<number, string[]>>(() => ({
    ...(controlledOrder ?? {}),
  }));

  /* Sync controlled props into local state so the layout always reads from
   * one source of truth. */
  useEffect(() => {
    if (controlledOrder != null) setOrderOverrides({ ...controlledOrder });
  }, [controlledOrder]);
  useEffect(() => {
    if (controlledLayerAssign != null) setLayerOverrides({ ...controlledLayerAssign });
  }, [controlledLayerAssign]);

  const nodeLayer = useCallback(
    (n: SankeyNode) => layerOverrides[n.id] ?? n.layer ?? 0,
    [layerOverrides],
  );
  const inflowOf = useCallback(
    (id: string) => (links ?? []).filter((l) => l.target === id).reduce((a, l) => a + l.value, 0),
    [links],
  );
  const outflowOf = useCallback(
    (id: string) => (links ?? []).filter((l) => l.source === id).reduce((a, l) => a + l.value, 0),
    [links],
  );

  const baseLayout = useMemo(() => {
    if (!nodes?.length || !links?.length) return null;
    const byLayer: Record<number, SankeyNode[]> = {};
    for (const n of nodes) {
      const l = nodeLayer(n);
      (byLayer[l] = byLayer[l] || []).push(n);
    }
    for (const layerStr of Object.keys(byLayer)) {
      const layer = Number(layerStr);
      const explicit = orderOverrides[layer];
      if (!explicit) continue;
      const idx = new Map(explicit.map((id, i) => [id, i] as const));
      byLayer[layer].sort((a, b) => {
        const ai = idx.get(a.id);
        const bi = idx.get(b.id);
        if (ai != null && bi != null) return ai - bi;
        if (ai != null) return -1;
        if (bi != null) return 1;
        return 0;
      });
    }

    /* Barycenter sweep — reduces link crossings by re-sorting each layer by the
     * mean order index of its neighbors. Layers pinned via `orderOverrides`
     * (either controlled or set by a drag) are skipped. */
    if (minimizeCrossings) {
      const layerKeys = Object.keys(byLayer).map(Number).sort((a, b) => a - b);
      const positionOf = new Map<string, number>();
      const refreshPositions = () => {
        positionOf.clear();
        for (const l of layerKeys) {
          byLayer[l].forEach((n, i) => positionOf.set(n.id, i));
        }
      };
      refreshPositions();
      const reorderLayer = (layer: number, direction: 'in' | 'out') => {
        if (orderOverrides[layer]) return;
        const group = byLayer[layer];
        if (!group?.length) return;
        const scored = group.map((n) => {
          const neighbors = direction === 'in'
            ? links.filter((l) => l.target === n.id).map((l) => positionOf.get(l.source))
            : links.filter((l) => l.source === n.id).map((l) => positionOf.get(l.target));
          const present = neighbors.filter((v): v is number => v != null);
          const bary = present.length ? present.reduce((a, b) => a + b, 0) / present.length : positionOf.get(n.id) ?? 0;
          return { node: n, bary };
        });
        scored.sort((a, b) => a.bary - b.bary);
        byLayer[layer] = scored.map((s) => s.node);
      };
      const iters = Math.max(0, crossingIterations | 0);
      for (let it = 0; it < iters; it++) {
        for (let i = 1; i < layerKeys.length; i++) reorderLayer(layerKeys[i], 'in');
        refreshPositions();
        for (let i = layerKeys.length - 2; i >= 0; i--) reorderLayer(layerKeys[i], 'out');
        refreshPositions();
      }
    }

    const layerMax = Math.max(0, ...Object.keys(byLayer).map(Number));
    const layerSpacing = layerMax > 0 ? (width - nodeWidth) / layerMax : 0;
    const placed = new Map<string, PlacedEntry>();
    const innerH = height - 16;

    Object.entries(byLayer).forEach(([layerStr, group]) => {
      const layer = Number(layerStr);
      const x = layer * layerSpacing;
      const totalValue = group.reduce((s, n) => s + Math.max(inflowOf(n.id), outflowOf(n.id)), 0);
      const valuePx = innerH / Math.max(1, totalValue);
      let y = 8;
      for (const n of group) {
        const h = Math.max(8, Math.max(inflowOf(n.id), outflowOf(n.id)) * valuePx);
        placed.set(n.id, { x, baseY: y, h, node: n, layer });
        y += h + 6;
      }
    });
    return { placed, byLayer, layerSpacing };
  }, [nodes, links, width, height, nodeWidth, nodeLayer, orderOverrides, minimizeCrossings, crossingIterations, inflowOf, outflowOf]);

  const layout = useMemo(() => {
    if (!baseLayout) return null;
    const { placed } = baseLayout;
    const positions = new Map<
      string,
      { x: number; y: number; h: number; baseY: number; node: SankeyNode; layer: number }
    >();
    placed.forEach((entry, id) => {
      const dx = xOverrides[id] ?? 0;
      const dy = yOverrides[id] ?? 0;
      const y = Math.max(0, Math.min(height - entry.h, entry.baseY + dy));
      positions.set(id, { x: entry.x + dx, y, h: entry.h, baseY: entry.baseY, node: entry.node, layer: entry.layer });
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
      layer: r.layer,
      name: r.node.name,
      colorIndex: r.node.colorIndex ?? 0,
    }));
    return { linkPaths, nodeRects };
  }, [baseLayout, yOverrides, xOverrides, height, links, nodeWidth]);

  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    startXOverride: number;
    startYOverride: number;
  } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onNodePointerDown = useCallback(
    (e: ReactPointerEvent, id: string) => {
      if (!draggable) return;
      e.preventDefault();
      dragRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        startXOverride: xOverrides[id] ?? 0,
        startYOverride: yOverrides[id] ?? 0,
      };
      setDraggingId(id);
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    },
    [draggable, xOverrides, yOverrides],
  );

  const onNodePointerMove = useCallback((e: ReactPointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    setXOverrides((prev) => ({ ...prev, [d.id]: d.startXOverride + dx }));
    setYOverrides((prev) => ({ ...prev, [d.id]: d.startYOverride + dy }));
  }, []);

  const onNodePointerUp = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setDraggingId(null);

    const b = baseLayout;
    const rect = layout?.nodeRects.find((r) => r.id === d.id);
    const node = nodes.find((n) => n.id === d.id);
    if (!b || !rect || !node) return;

    const layerSpacing = b.layerSpacing || 1;
    const layerKeys = Object.keys(b.byLayer).map(Number).sort((a, b2) => a - b2);
    const fromLayer = nodeLayer(node);
    const droppedX = rect.x;
    let nearestLayer = fromLayer;
    let nearestDist = Infinity;
    for (const l of layerKeys) {
      const layerX = l * layerSpacing;
      const dist = Math.abs(droppedX - layerX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestLayer = l;
      }
    }
    const layerChanged = nearestLayer !== fromLayer;

    const destSiblings = (b.byLayer[nearestLayer] ?? []).filter((n) => n.id !== d.id);
    const withDropped = [...destSiblings, node];
    const dropY = rect.y + rect.h / 2;
    const sorted = withDropped
      .map((n) => {
        if (n.id === d.id) return { id: n.id, y: dropY };
        const placed = b.placed.get(n.id);
        return { id: n.id, y: placed ? placed.baseY + placed.h / 2 : 0 };
      })
      .sort((a, c) => a.y - c.y)
      .map((x) => x.id);

    const orderIndex = sorted.indexOf(d.id);

    const nextLayerOverrides = { ...layerOverrides };
    if (layerChanged) nextLayerOverrides[d.id] = nearestLayer;

    const nextOrderOverrides: Record<number, string[]> = {
      ...orderOverrides,
      [nearestLayer]: sorted,
    };
    if (layerChanged) {
      const srcRemaining = (b.byLayer[fromLayer] ?? []).filter((n) => n.id !== d.id).map((n) => n.id);
      nextOrderOverrides[fromLayer] = srcRemaining;
    }

    /* Controlled? Delegate to the parent via callbacks. Otherwise update
     * internal state. Callbacks fire in both cases so consumers can mirror. */
    if (controlledOrder != null) {
      onOrderChange?.(nextOrderOverrides);
    } else {
      setOrderOverrides(nextOrderOverrides);
    }
    if (controlledLayerAssign != null) {
      onLayerAssignChange?.(nextLayerOverrides);
    } else {
      setLayerOverrides(nextLayerOverrides);
    }

    setXOverrides((prev) => {
      const next = { ...prev };
      delete next[d.id];
      return next;
    });
    setYOverrides((prev) => {
      const next = { ...prev };
      delete next[d.id];
      return next;
    });

    onNodeDrag?.({
      node,
      y: rect.y,
      deltaY: rect.y - rect.baseY,
      layer: nearestLayer,
      orderIndex,
      layerChanged,
    });
  }, [baseLayout, layout, nodes, nodeLayer, layerOverrides, orderOverrides, controlledOrder, controlledLayerAssign, onNodeDrag, onOrderChange, onLayerAssignChange]);

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
