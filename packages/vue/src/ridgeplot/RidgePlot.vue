<script setup lang="ts">
import { computed } from 'vue';
import { areaPath, linearScale, linePath } from '../_charts/scale';
import type {
  RidgePlotInteractionPayload,
  RidgePlotProps,
} from './variants';

const props = withDefaults(defineProps<RidgePlotProps>(), {
  width: 480,
  height: 240,
  overlap: 0.6,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: RidgePlotInteractionPayload): void;
  (e: 'item-leave', payload: RidgePlotInteractionPayload): void;
}>();

function onEnter(i: number, ev: PointerEvent) {
  const row = props.rows?.[i];
  if (!row) return;
  emit('item-enter', { row, rowIndex: i, nativeEvent: ev });
}
function onLeave(i: number, ev: PointerEvent) {
  const row = props.rows?.[i];
  if (!row) return;
  emit('item-leave', { row, rowIndex: i, nativeEvent: ev });
}

const rows = computed(() => {
  const data = props.rows ?? [];
  if (!data.length) return [];
  const maxDensity = Math.max(
    ...data.flatMap((r) => r.density),
    1,
  );
  const innerW = props.width - 80;
  const rowH = props.height / data.length;
  const visibleH = rowH / (1 - props.overlap);
  return data.map((r, i) => {
    const baseY = (i + 1) * rowH;
    const sx = linearScale(
      { min: 0, max: r.density.length - 1 },
      { start: 80, end: 80 + innerW },
    );
    const sy = linearScale(
      { min: 0, max: maxDensity },
      { start: baseY, end: baseY - visibleH },
    );
    const points = r.density.map((v, idx) => ({ x: sx(idx), y: sy(v) }));
    return {
      label: r.label,
      colorIndex: r.colorIndex ?? i % 8,
      area: areaPath(points, baseY),
      line: linePath(points, true),
      labelY: baseY - 4,
    };
  });
});
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '密度脊图'"
  >
    <g
      v-for="(r, i) in rows"
      :key="i"
      :class="`cf-chart__series-${r.colorIndex}`"
      @pointerenter="(e: PointerEvent) => onEnter(i, e)"
      @pointerleave="(e: PointerEvent) => onLeave(i, e)"
    >
      <path class="cf-chart__area" :d="r.area" />
      <path class="cf-chart__line" :d="r.line" />
      <text :x="6" :y="r.labelY">{{ r.label }}</text>
    </g>
  </svg>
</template>
