<script setup lang="ts">
import { computed } from 'vue';
import { polar } from '../_charts/scale';
import type {
  ConnectionGraphEdgeInteractionPayload,
  ConnectionGraphNodeInteractionPayload,
  ConnectionGraphProps,
} from './variants';

const props = withDefaults(defineProps<ConnectionGraphProps>(), {
  width: 480,
  height: 360,
  showLabels: true,
});

const emit = defineEmits<{
  (e: 'node-enter', payload: ConnectionGraphNodeInteractionPayload): void;
  (e: 'node-leave', payload: ConnectionGraphNodeInteractionPayload): void;
  (e: 'edge-enter', payload: ConnectionGraphEdgeInteractionPayload): void;
  (e: 'edge-leave', payload: ConnectionGraphEdgeInteractionPayload): void;
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
function onEdgeEnter(i: number, ev: PointerEvent) {
  const edge = props.edges?.[i];
  if (!edge) return;
  emit('edge-enter', { edge, edgeIndex: i, nativeEvent: ev });
}
function onEdgeLeave(i: number, ev: PointerEvent) {
  const edge = props.edges?.[i];
  if (!edge) return;
  emit('edge-leave', { edge, edgeIndex: i, nativeEvent: ev });
}

const layout = computed(() => {
  const nodes = props.nodes ?? [];
  const edges = props.edges ?? [];
  if (!nodes.length) return null;

  const cx = props.width / 2;
  const cy = props.height / 2;
  const r = Math.min(props.width, props.height) / 2 - 24;

  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((n, i) => {
    if (typeof n.x === 'number' && typeof n.y === 'number') {
      positions.set(n.id, { x: n.x, y: n.y });
    } else {
      const a = (i / nodes.length) * 360;
      positions.set(n.id, polar(cx, cy, r, a));
    }
  });

  const edgePaths = edges
    .map((e, i) => {
      const a = positions.get(e.source);
      const b = positions.get(e.target);
      if (!a || !b) return null;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - 20;
      return {
        d: `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`,
        weight: e.weight ?? 1,
        colorIndex: e.colorIndex ?? i % 8,
        edgeIndex: i,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  const nodePoints = nodes.map((n, i) => {
    const p = positions.get(n.id)!;
    return {
      id: n.id,
      x: p.x,
      y: p.y,
      label: n.label,
      colorIndex: n.colorIndex ?? i % 8,
      size: n.size ?? 8,
    };
  });

  return { nodePoints, edgePaths };
});
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '关系图'"
  >
    <template v-if="layout">
      <path
        v-for="(e, i) in layout.edgePaths"
        :key="`e${i}`"
        :class="`cf-chart__bar--${e.colorIndex}`"
        :d="e.d"
        :stroke-width="e.weight"
        stroke="currentColor"
        fill="none"
        opacity="0.4"
        @pointerenter="(ev: PointerEvent) => onEdgeEnter(e.edgeIndex, ev)"
        @pointerleave="(ev: PointerEvent) => onEdgeLeave(e.edgeIndex, ev)"
      />
      <g
        v-for="n in layout.nodePoints"
        :key="n.id"
        @pointerenter="(ev: PointerEvent) => onNodeEnter(n.id, ev)"
        @pointerleave="(ev: PointerEvent) => onNodeLeave(n.id, ev)"
      >
        <circle
          :class="`cf-chart__bar--${n.colorIndex}`"
          :cx="n.x"
          :cy="n.y"
          :r="n.size"
          stroke="var(--bg-1)"
          stroke-width="2"
        />
        <text
          v-if="showLabels"
          :x="n.x"
          :y="n.y + n.size + 12"
          text-anchor="middle"
        >{{ n.label }}</text>
      </g>
    </template>
  </svg>
</template>
