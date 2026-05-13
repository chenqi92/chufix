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

/* User-supplied vertical offsets, keyed by node id. */
const yOverrides = ref<Record<string, number>>({});

/* Auto layout (before drag overrides applied). */
const baseLayout = computed(() => {
  const nodes = props.nodes ?? [];
  const links = props.links ?? [];
  if (!nodes.length || !links.length) return null;
  const layerMax = nodes.reduce((m, n) => Math.max(m, n.layer ?? 0), 0);
  const byLayer: Record<number, SankeyNode[]> = {};
  nodes.forEach((n) => {
    const l = n.layer ?? 0;
    (byLayer[l] = byLayer[l] || []).push(n);
  });
  const layerSpacing = layerMax > 0 ? (props.width - props.nodeWidth) / layerMax : 0;
  const placed = new Map<string, { x: number; baseY: number; h: number; node: SankeyNode; layer: number }>();
  const innerH = props.height - 16;

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
});

const layout = computed(() => {
  const placed = baseLayout.value;
  if (!placed) return null;
  const links = props.links ?? [];

  const positions = new Map<string, { x: number; y: number; h: number; baseY: number; node: SankeyNode }>();
  placed.forEach((entry, id) => {
    const override = yOverrides.value[id] ?? 0;
    const y = Math.max(0, Math.min(props.height - entry.h, entry.baseY + override));
    positions.set(id, { x: entry.x, y, h: entry.h, baseY: entry.baseY, node: entry.node });
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
    name: r.node.name,
    colorIndex: r.node.colorIndex ?? 0,
  }));

  return { linkPaths, nodeRects };
});

/* Drag state */
interface DragState {
  id: string;
  startClientY: number;
  startOverride: number;
}
const drag = ref<DragState | null>(null);

function onNodePointerDown(e: PointerEvent, id: string) {
  if (!props.draggable) return;
  e.preventDefault();
  drag.value = {
    id,
    startClientY: e.clientY,
    startOverride: yOverrides.value[id] ?? 0,
  };
  (e.currentTarget as Element).setPointerCapture(e.pointerId);
}
function onNodePointerMove(e: PointerEvent) {
  if (!drag.value) return;
  const delta = e.clientY - drag.value.startClientY;
  yOverrides.value = {
    ...yOverrides.value,
    [drag.value.id]: drag.value.startOverride + delta,
  };
}
function onNodePointerUp() {
  if (!drag.value) return;
  const id = drag.value.id;
  const node = props.nodes.find((n) => n.id === id);
  const rect = layout.value?.nodeRects.find((r) => r.id === id);
  drag.value = null;
  if (node && rect) {
    emit('node-drag', {
      node,
      y: rect.y,
      deltaY: rect.y - rect.baseY,
    });
  }
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
