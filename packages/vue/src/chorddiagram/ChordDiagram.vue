<script setup lang="ts">
import { computed } from 'vue';
import { polar } from '../_charts/scale';
import type { ChordDiagramProps, ChordInteractionPayload } from './variants';

const props = withDefaults(defineProps<ChordDiagramProps>(), {
  width: 460,
  height: 460,
  padAngle: 2,
  innerRadius: 0,
  outerRadius: 0,
});

const emit = defineEmits<{
  (e: 'ribbon-enter', payload: ChordInteractionPayload): void;
  (e: 'ribbon-leave', payload: ChordInteractionPayload): void;
}>();

const layout = computed(() => {
  const m = props.matrix ?? [];
  const n = m.length;
  if (!n) return null;
  const totals = m.map((row, i) => row.reduce((a, b, j) => a + b, 0) + m.reduce((a, r) => a + (r[i] ?? 0), 0) - (m[i][i] ?? 0));
  const sum = totals.reduce((a, b) => a + b, 0) || 1;
  const cx = props.width / 2;
  const cy = props.height / 2;
  const baseR = Math.min(cx, cy) - 24;
  const rOuter = props.outerRadius || baseR;
  const rInner = props.innerRadius || baseR - 14;
  const pad = props.padAngle ?? 2;
  const totalPad = pad * n;
  const usable = 360 - totalPad;
  const arcs: { start: number; end: number; label?: string }[] = [];
  let cursor = 0;
  for (let i = 0; i < n; i++) {
    const a = (totals[i] / sum) * usable;
    arcs.push({ start: cursor, end: cursor + a, label: props.labels?.[i] });
    cursor += a + pad;
  }
  /* allocate sub-arcs within each node arc for each ribbon. */
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
  function arcPathD(a: { start: number; end: number }, r: number): string {
    const p1 = polar(cx, cy, r, a.start);
    const p2 = polar(cx, cy, r, a.end);
    const large = a.end - a.start > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
  }
  function annulusPathD(a: { start: number; end: number }): string {
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
  }
  function ribbonD(i: number, j: number): string {
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
  }
  const ribbons: {
    d: string;
    source: number;
    target: number;
    value: number;
  }[] = [];
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
      annulus: annulusPathD(a),
      arc: arcPathD(a, rOuter + 18),
      label: a.label ?? `#${i}`,
      labelX: p.x,
      labelY: p.y,
      anchor: flip ? 'end' : 'start',
      mid,
      total: totals[i],
    };
  });
  return { nodes, ribbons };
});

function onEnter(r: { source: number; target: number; value: number }, e: PointerEvent) {
  emit('ribbon-enter', { ...r, nativeEvent: e });
}
function onLeave(r: { source: number; target: number; value: number }, e: PointerEvent) {
  emit('ribbon-leave', { ...r, nativeEvent: e });
}
</script>

<template>
  <svg
    class="cf-chart cf-chord"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '弦图'"
  >
    <template v-if="layout">
      <g class="cf-chord__ribbons">
        <path
          v-for="(r, k) in layout.ribbons"
          :key="`r${k}`"
          :class="`cf-chart__series-${r.source % 8} cf-chord__ribbon`"
          :d="r.d"
          fill="currentColor"
          fill-opacity="0.45"
          stroke="currentColor"
          stroke-opacity="0.6"
          stroke-width="0.5"
          @pointerenter="(e: PointerEvent) => onEnter(r, e)"
          @pointerleave="(e: PointerEvent) => onLeave(r, e)"
        />
      </g>
      <g class="cf-chord__nodes">
        <g
          v-for="(node, i) in layout.nodes"
          :key="`n${i}`"
          :class="`cf-chart__series-${i % 8}`"
        >
          <path
            :d="node.annulus"
            class="cf-chord__node-arc"
            fill="currentColor"
            fill-opacity="0.9"
          />
          <text
            :x="node.labelX"
            :y="node.labelY"
            :text-anchor="node.anchor"
            dominant-baseline="middle"
          >{{ node.label }}</text>
        </g>
      </g>
    </template>
  </svg>
</template>
