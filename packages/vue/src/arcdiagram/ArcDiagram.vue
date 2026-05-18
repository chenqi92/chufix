<script setup lang="ts">
import { computed } from 'vue';
import type { ArcDiagramProps, ArcEdge, ArcInteractionPayload } from './variants';

const props = withDefaults(defineProps<ArcDiagramProps>(), {
  width: 640,
  height: 280,
  arcSide: 'top',
});

const emit = defineEmits<{
  (e: 'edge-enter', payload: ArcInteractionPayload): void;
  (e: 'edge-leave', payload: ArcInteractionPayload): void;
}>();

const layout = computed(() => {
  const nodes = props.nodes ?? [];
  const edges = props.edges ?? [];
  if (!nodes.length) return null;
  const pad = 36;
  const baselineY = props.arcSide === 'top' ? props.height - 56 : 56;
  const innerW = props.width - pad * 2;
  const slot = nodes.length > 1 ? innerW / (nodes.length - 1) : 0;
  const indexOf = new Map<string, number>();
  nodes.forEach((n, i) => indexOf.set(n.id, i));
  const groups = Array.from(new Set(nodes.map((n) => n.group ?? 'default')));
  const groupColor = (g: string | number | undefined) => {
    const idx = groups.indexOf(g ?? 'default');
    return `var(--viz-${(idx % 8) + 1})`;
  };
  const placed = nodes.map((n, i) => ({
    node: n,
    cx: pad + slot * i,
    cy: baselineY,
    r: Math.max(4, Math.min(14, (n.size ?? 1) * 5)),
    color: groupColor(n.group),
  }));
  const peak = Math.max(1, ...edges.map((e) => e.weight ?? 1));
  const arcs: { d: string; edge: ArcEdge; opacity: number; stroke: string }[] = [];
  for (const e of edges) {
    const i = indexOf.get(e.source);
    const j = indexOf.get(e.target);
    if (i === undefined || j === undefined) continue;
    const lo = Math.min(i, j);
    const hi = Math.max(i, j);
    const x1 = placed[lo].cx;
    const x2 = placed[hi].cx;
    const cy = baselineY;
    const arcH = (x2 - x1) / 2;
    const sweep = props.arcSide === 'top' ? 1 : 0;
    arcs.push({
      d: `M ${x1} ${cy} A ${arcH} ${arcH} 0 0 ${sweep} ${x2} ${cy}`,
      edge: e,
      opacity: 0.25 + 0.6 * ((e.weight ?? 1) / peak),
      stroke: groupColor(placed[lo].node.group),
    });
  }
  return { placed, arcs, baselineY };
});
</script>

<template>
  <svg
    class="cf-chart cf-arcdiagram"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '弧线图'"
  >
    <template v-if="layout">
      <line
        class="cf-chart__axis"
        x1="24"
        :x2="width - 24"
        :y1="layout.baselineY"
        :y2="layout.baselineY"
        opacity="0.35"
      />
      <g class="cf-arcdiagram__arcs">
        <path
          v-for="(a, i) in layout.arcs"
          :key="`a${i}`"
          class="cf-arcdiagram__arc"
          :d="a.d"
          :stroke="a.stroke"
          :style="{ opacity: a.opacity }"
          @pointerenter="(e: PointerEvent) => emit('edge-enter', { edge: a.edge, nativeEvent: e })"
          @pointerleave="(e: PointerEvent) => emit('edge-leave', { edge: a.edge, nativeEvent: e })"
        />
      </g>
      <g class="cf-arcdiagram__nodes">
        <g v-for="(p, i) in layout.placed" :key="`n${i}`">
          <circle :cx="p.cx" :cy="p.cy" :r="p.r" :fill="p.color" class="cf-arcdiagram__node" />
          <text
            :x="p.cx"
            :y="arcSide === 'top' ? p.cy + 22 : p.cy - 14"
            text-anchor="middle"
            class="cf-arcdiagram__label"
          >{{ p.node.label ?? p.node.id }}</text>
        </g>
      </g>
    </template>
  </svg>
</template>
