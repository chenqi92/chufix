<script setup lang="ts">
import { computed } from 'vue';
import type { PyramidChartProps, PyramidInteractionPayload } from './variants';

const props = withDefaults(defineProps<PyramidChartProps>(), {
  width: 520,
  height: 320,
  leftLabel: '左侧',
  rightLabel: '右侧',
  gap: 72,
});

const emit = defineEmits<{
  (e: 'bar-enter', payload: PyramidInteractionPayload): void;
  (e: 'bar-leave', payload: PyramidInteractionPayload): void;
}>();

const layout = computed(() => {
  const data = props.data ?? [];
  if (!data.length) return null;
  const peak = Math.max(
    1,
    ...data.flatMap((r) => [r.left, r.right]),
  );
  const halfW = (props.width - props.gap) / 2 - 16;
  const cx = props.width / 2;
  const leftAnchor = cx - props.gap / 2;
  const rightAnchor = cx + props.gap / 2;
  const top = 24;
  const bottom = props.height - 24;
  const slot = (bottom - top) / data.length;
  const barH = Math.max(6, slot - 4);
  const fmt = props.format ?? ((v: number) => String(Math.round(v)));
  return data.map((r, i) => {
    const y = top + slot * (i + 0.5) - barH / 2;
    const lw = (r.left / peak) * halfW;
    const rw = (r.right / peak) * halfW;
    return {
      row: r,
      i,
      y,
      barH,
      lx: leftAnchor - lw,
      lw,
      rx: rightAnchor,
      rw,
      midY: y + barH / 2,
      labelLeft: fmt(r.left),
      labelRight: fmt(r.right),
    };
  });
});
</script>

<template>
  <svg
    class="cf-chart cf-pyramid"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '金字塔图'"
  >
    <text :x="(width - gap) / 4 + 16" y="14" text-anchor="middle" class="cf-pyramid__legend">
      {{ leftLabel }}
    </text>
    <text :x="width - (width - gap) / 4 - 16" y="14" text-anchor="middle" class="cf-pyramid__legend">
      {{ rightLabel }}
    </text>
    <template v-if="layout">
      <g v-for="b in layout" :key="b.i">
        <rect
          class="cf-chart__bar cf-pyramid__left"
          :x="b.lx"
          :y="b.y"
          :width="b.lw"
          :height="b.barH"
          @pointerenter="
            (e: PointerEvent) =>
              emit('bar-enter', { row: b.row, side: 'left', dataIndex: b.i, nativeEvent: e })
          "
          @pointerleave="
            (e: PointerEvent) =>
              emit('bar-leave', { row: b.row, side: 'left', dataIndex: b.i, nativeEvent: e })
          "
        />
        <rect
          class="cf-chart__bar cf-pyramid__right"
          :x="b.rx"
          :y="b.y"
          :width="b.rw"
          :height="b.barH"
          @pointerenter="
            (e: PointerEvent) =>
              emit('bar-enter', { row: b.row, side: 'right', dataIndex: b.i, nativeEvent: e })
          "
          @pointerleave="
            (e: PointerEvent) =>
              emit('bar-leave', { row: b.row, side: 'right', dataIndex: b.i, nativeEvent: e })
          "
        />
        <text
          :x="b.lx - 4"
          :y="b.midY + 4"
          text-anchor="end"
          class="cf-pyramid__value"
        >{{ b.labelLeft }}</text>
        <text
          :x="b.rx + b.rw + 4"
          :y="b.midY + 4"
          text-anchor="start"
          class="cf-pyramid__value"
        >{{ b.labelRight }}</text>
        <text
          :x="width / 2"
          :y="b.midY + 4"
          text-anchor="middle"
          class="cf-pyramid__axis"
        >{{ b.row.label }}</text>
      </g>
    </template>
  </svg>
</template>
