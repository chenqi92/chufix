<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type {
  BoxPlotInteractionPayload,
  BoxPlotProps,
} from './variants';

const props = withDefaults(defineProps<BoxPlotProps>(), {
  width: 480,
  height: 240,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: BoxPlotInteractionPayload): void;
  (e: 'item-leave', payload: BoxPlotInteractionPayload): void;
}>();

function onEnter(i: number, ev: PointerEvent) {
  const box = props.data?.[i];
  if (!box) return;
  emit('item-enter', { box, dataIndex: i, nativeEvent: ev });
}
function onLeave(i: number, ev: PointerEvent) {
  const box = props.data?.[i];
  if (!box) return;
  emit('item-leave', { box, dataIndex: i, nativeEvent: ev });
}

const layout = computed(() => {
  const data = props.data ?? [];
  if (!data.length) return null;
  const all = data.flatMap((s) => [s.min, s.q1, s.median, s.q3, s.max, ...(s.outliers ?? [])]);
  const dom = domainOf(all);
  const sy = linearScale(dom, { start: props.height - 24, end: 12 });
  const innerW = props.width - 48;
  const slot = innerW / data.length;
  const boxW = Math.max(8, slot * 0.5);
  return data.map((s, i) => {
    const cx = 36 + slot * (i + 0.5);
    return {
      cx,
      boxX: cx - boxW / 2,
      boxW,
      yMin: sy(s.min),
      yMax: sy(s.max),
      yQ1: sy(s.q1),
      yQ3: sy(s.q3),
      yMed: sy(s.median),
      label: s.label,
      outliers: (s.outliers ?? []).map((v) => sy(v)),
    };
  });
});
</script>

<template>
  <svg
    class="cf-chart cf-boxplot"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '箱线图'"
  >
    <template v-if="layout">
      <g
        v-for="(b, i) in layout"
        :key="i"
        :class="`cf-chart__series-${i % 8}`"
        @pointerenter="(e: PointerEvent) => onEnter(i, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, e)"
      >
        <line
          class="cf-chart__line"
          :x1="b.cx"
          :x2="b.cx"
          :y1="b.yMin"
          :y2="b.yMax"
        />
        <line
          class="cf-chart__line"
          :x1="b.boxX"
          :x2="b.boxX + b.boxW"
          :y1="b.yMin"
          :y2="b.yMin"
        />
        <line
          class="cf-chart__line"
          :x1="b.boxX"
          :x2="b.boxX + b.boxW"
          :y1="b.yMax"
          :y2="b.yMax"
        />
        <rect
          class="cf-chart__bar"
          :x="b.boxX"
          :y="b.yQ3"
          :width="b.boxW"
          :height="b.yQ1 - b.yQ3"
          opacity="0.4"
        />
        <line
          class="cf-chart__line"
          :x1="b.boxX"
          :x2="b.boxX + b.boxW"
          :y1="b.yMed"
          :y2="b.yMed"
          stroke-width="2"
        />
        <circle
          v-for="(oy, oi) in b.outliers"
          :key="`o${oi}`"
          class="cf-chart__dot"
          :cx="b.cx"
          :cy="oy"
          r="2"
          opacity="0.6"
        />
        <text
          :x="b.cx"
          :y="height - 6"
          text-anchor="middle"
        >{{ b.label }}</text>
      </g>
    </template>
  </svg>
</template>
