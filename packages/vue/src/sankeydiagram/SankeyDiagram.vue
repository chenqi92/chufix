<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  SankeyDiagramProps,
  SankeyDragPayload,
  SankeyLinkInteractionPayload,
  SankeyNode,
  SankeyNodeInteractionPayload,
} from './variants';

const props = withDefaults(defineProps<SankeyDiagramProps>(), {
  width: 480,
  height: 280,
  nodeWidth: 12,
  draggable: true,
});

const emit = defineEmits<{
  (e: 'node-enter', payload: SankeyNodeInteractionPayload): void;
  (e: 'node-leave', payload: SankeyNodeInteractionPayload): void;
  (e: 'link-enter', payload: SankeyLinkInteractionPayload): void;
  (e: 'link-leave', payload: SankeyLinkInteractionPayload): void;
  (e: 'node-drag', payload: SankeyDragPayload): void;
}>();

function onNodeEnter(id: string, ev: PointerEvent) {
  const node = props.nodes?.find((n) => n.id === id);
  if (!node) return;
  emit('node-enter', { node, nativeEvent: ev });
}
function onNodeLeave(id: string, ev: PointerEvent) {
  const node = props.nodes?.find((n) => n.id === id);
  if (!node) return;
  emit('node-leave', { node, nativeEvent: ev });
}
function onLinkEnter(i: number, ev: PointerEvent) {
  const link = props.links?.[i];
  if (!link) return;
  emit('link-enter', { link, linkIndex: i, nativeEvent: ev });
}
function onLinkLeave(i: number, ev: PointerEvent) {
  const link = props.links?.[i];
  if (!link) return;
  emit('link-leave', { link, linkIndex: i, nativeEvent: ev });
}

/* Persistent overrides — once a node is dropped, its new layer + order index
 * stick across re-renders. yOverrides only holds the transient in-flight drag
 * offset and is cleared on drop. xOverrides tracks horizontal drag during a
 * drag-in-flight for cross-layer detection. */
const yOverrides = ref<Record<string, number>>({});
const xOverrides = ref<Record<string, number>>({});
const layerOverrides = ref<Record<string, number>>({});
const orderOverrides = ref<Record<number, string[]>>({});

interface PlacedEntry {
  x: number;
  baseY: number;
  h: number;
  node: SankeyNode;
  layer: number;
}

function inflowOf(id: string): number {
  return (props.links ?? []).filter((l) => l.target === id).reduce((a, l) => a + l.value, 0);
}
function outflowOf(id: string): number {
  return (props.links ?? []).filter((l) => l.source === id).reduce((a, l) => a + l.value, 0);
}
function nodeLayer(n: SankeyNode): number {
  return layerOverrides.value[n.id] ?? n.layer ?? 0;
}

/* Auto layout — respects layer / order overrides but not the transient y
 * offset (that's applied later in `layout`). */
const baseLayout = computed(() => {
  const nodes = props.nodes ?? [];
  const links = props.links ?? [];
  if (!nodes.length || !links.length) return null;

  const byLayer: Record<number, SankeyNode[]> = {};
  for (const n of nodes) {
    const l = nodeLayer(n);
    (byLayer[l] = byLayer[l] || []).push(n);
  }

  /* Apply order overrides per layer. Unknown ids stay in original order at the end. */
  for (const layerStr of Object.keys(byLayer)) {
    const layer = Number(layerStr);
    const explicit = orderOverrides.value[layer];
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

  const layerMax = Math.max(0, ...Object.keys(byLayer).map(Number));
  const layerSpacing = layerMax > 0 ? (props.width - props.nodeWidth) / layerMax : 0;
  const placed = new Map<string, PlacedEntry>();
  const innerH = props.height - 16;

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
});

const layout = computed(() => {
  const b = baseLayout.value;
  if (!b) return null;
  const { placed } = b;
  const links = props.links ?? [];

  const positions = new Map<
    string,
    { x: number; y: number; h: number; baseY: number; node: SankeyNode; layer: number }
  >();
  placed.forEach((entry, id) => {
    const dx = xOverrides.value[id] ?? 0;
    const dy = yOverrides.value[id] ?? 0;
    const y = Math.max(0, Math.min(props.height - entry.h, entry.baseY + dy));
    positions.set(id, { x: entry.x + dx, y, h: entry.h, baseY: entry.baseY, node: entry.node, layer: entry.layer });
  });

  const linkPaths = links
    .map((l, i) => {
      const sNode = positions.get(l.source);
      const tNode = positions.get(l.target);
      if (!sNode || !tNode) return null;
      const x1 = sNode.x + props.nodeWidth;
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
});

/* Drag state */
interface DragState {
  id: string;
  startClientX: number;
  startClientY: number;
  startXOverride: number;
  startYOverride: number;
  /** Pixels in SVG-user units per CSS pixel (approximate; we treat them 1:1). */
  scaleY: number;
  scaleX: number;
}
const drag = ref<DragState | null>(null);

function onNodePointerDown(e: PointerEvent, id: string) {
  if (!props.draggable) return;
  e.preventDefault();
  drag.value = {
    id,
    startClientX: e.clientX,
    startClientY: e.clientY,
    startXOverride: xOverrides.value[id] ?? 0,
    startYOverride: yOverrides.value[id] ?? 0,
    scaleX: 1,
    scaleY: 1,
  };
  (e.currentTarget as Element).setPointerCapture(e.pointerId);
}
function onNodePointerMove(e: PointerEvent) {
  if (!drag.value) return;
  const dx = e.clientX - drag.value.startClientX;
  const dy = e.clientY - drag.value.startClientY;
  xOverrides.value = { ...xOverrides.value, [drag.value.id]: drag.value.startXOverride + dx };
  yOverrides.value = { ...yOverrides.value, [drag.value.id]: drag.value.startYOverride + dy };
}

function onNodePointerUp() {
  const d = drag.value;
  if (!d) return;
  drag.value = null;

  const b = baseLayout.value;
  const rect = layout.value?.nodeRects.find((r) => r.id === d.id);
  const node = props.nodes.find((n) => n.id === d.id);
  if (!b || !rect || !node) return;

  /* Snap horizontal position to the closest layer column. */
  const layerSpacing = b.layerSpacing || 1;
  const layerKeys = Object.keys(b.byLayer).map(Number).sort((a, b) => a - b);
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
  /* Avoid micro-jitter: only switch layer if the drop is closer to another
   * column than to its own. */
  const layerChanged = nearestLayer !== fromLayer;

  /* Build the new order for the destination layer by sorting by drop-y. */
  const destSiblings = (b.byLayer[nearestLayer] ?? []).filter((n) => n.id !== d.id);
  const withDropped = [...destSiblings, node];
  /* Compute each sibling's current center y to sort against. */
  const dropY = rect.y + rect.h / 2;
  const sorted = withDropped
    .map((n) => {
      if (n.id === d.id) return { id: n.id, y: dropY };
      const placed = b.placed.get(n.id);
      return { id: n.id, y: placed ? placed.baseY + placed.h / 2 : 0 };
    })
    .sort((a, b2) => a.y - b2.y)
    .map((x) => x.id);

  const orderIndex = sorted.indexOf(d.id);

  /* Commit overrides; reset transient drag-y/-x. */
  const nextLayerOverrides = { ...layerOverrides.value };
  if (layerChanged) nextLayerOverrides[d.id] = nearestLayer;
  layerOverrides.value = nextLayerOverrides;

  orderOverrides.value = { ...orderOverrides.value, [nearestLayer]: sorted };
  /* If the node moved to a new layer, also recompute the source layer's order
   * (it changed because the node left). */
  if (layerChanged) {
    const srcRemaining = (b.byLayer[fromLayer] ?? []).filter((n) => n.id !== d.id).map((n) => n.id);
    orderOverrides.value = { ...orderOverrides.value, [fromLayer]: srcRemaining };
  }

  const nextX = { ...xOverrides.value };
  const nextY = { ...yOverrides.value };
  delete nextX[d.id];
  delete nextY[d.id];
  xOverrides.value = nextX;
  yOverrides.value = nextY;

  emit('node-drag', {
    node,
    y: rect.y,
    deltaY: rect.y - rect.baseY,
    layer: nearestLayer,
    orderIndex,
    layerChanged,
  });
}
</script>

<template>
  <svg
    class="cf-chart cf-sankey"
    :class="{ 'is-draggable': draggable }"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? 'Sankey 流向图'"
  >
    <template v-if="layout">
      <path
        v-for="(p, i) in layout.linkPaths"
        :key="`p${i}`"
        :class="`cf-chart__bar--${p.idx}`"
        :d="p.d"
        fill="none"
        :stroke-width="p.strokeWidth"
        stroke-opacity="0.35"
        stroke="currentColor"
        @pointerenter="(e: PointerEvent) => onLinkEnter(p.linkIndex, e)"
        @pointerleave="(e: PointerEvent) => onLinkLeave(p.linkIndex, e)"
      />
      <g
        v-for="r in layout.nodeRects"
        :key="r.id"
        :class="['cf-sankey__node', drag && drag.id === r.id ? 'is-dragging' : '']"
        @pointerenter="(e: PointerEvent) => onNodeEnter(r.id, e)"
        @pointerleave="(e: PointerEvent) => onNodeLeave(r.id, e)"
        @pointerdown="(e: PointerEvent) => onNodePointerDown(e, r.id)"
        @pointermove="onNodePointerMove"
        @pointerup="onNodePointerUp"
        @pointercancel="onNodePointerUp"
      >
        <rect
          :class="`cf-chart__bar--${r.colorIndex}`"
          :x="r.x"
          :y="r.y"
          :width="nodeWidth"
          :height="r.h"
        />
        <text
          :x="r.x + nodeWidth + 4"
          :y="r.y + r.h / 2"
          dominant-baseline="central"
        >{{ r.name }}</text>
      </g>
    </template>
  </svg>
</template>
