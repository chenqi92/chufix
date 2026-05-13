<script setup lang="ts">
import { computed } from 'vue';
import { arcPath } from '../_charts/scale';
import type {
  DonutChartInteractionPayload,
  DonutChartProps,
} from './variants';

const props = withDefaults(defineProps<DonutChartProps>(), {
  size: 180,
  thickness: 24,
  showLegend: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: DonutChartInteractionPayload): void;
  (e: 'item-leave', payload: DonutChartInteractionPayload): void;
}>();

function onEnter(i: number, pct: number, ev: PointerEvent) {
  const segment = props.segments?.[i];
  if (!segment) return;
  emit('item-enter', { segment, dataIndex: i, pct, nativeEvent: ev });
}
function onLeave(i: number, pct: number, ev: PointerEvent) {
  const segment = props.segments?.[i];
  if (!segment) return;
  emit('item-leave', { segment, dataIndex: i, pct, nativeEvent: ev });
}

const layout = computed(() => {
  const segs = props.segments ?? [];
  const total = segs.reduce((s, x) => s + x.value, 0) || 1;
  const cx = props.size / 2;
  const cy = props.size / 2;
  const rOuter = props.size / 2 - 2;
  const rInner = rOuter - props.thickness;
  let acc = 0;
  return segs.map((s, i) => {
    const start = (acc / total) * 360;
    acc += s.value;
    const end = (acc / total) * 360;
    return {
      ...s,
      colorIndex: s.colorIndex ?? i % 8,
      d: arcPath(cx, cy, rOuter, rInner, start, end),
      pct: ((end - start) / 360) * 100,
    };
  });
});
</script>

<template>
  <div class="cf-donut" role="img" :aria-label="ariaLabel ?? '环形图'">
    <svg
      class="cf-chart"
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
    >
      <path
        v-for="(s, i) in layout"
        :key="i"
        :class="`cf-chart__bar--${s.colorIndex}`"
        :d="s.d"
        @pointerenter="(e: PointerEvent) => onEnter(i, s.pct, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, s.pct, e)"
      />
      <text
        v-if="centerValue != null"
        :x="size / 2"
        :y="size / 2 - 4"
        text-anchor="middle"
        class="cf-donut__value"
      >{{ centerValue }}</text>
      <text
        v-if="centerLabel"
        :x="size / 2"
        :y="size / 2 + 14"
        text-anchor="middle"
        class="cf-donut__label"
      >{{ centerLabel }}</text>
    </svg>
    <ul v-if="showLegend" class="cf-donut__legend">
      <li v-for="(s, i) in layout" :key="i">
        <span :class="['cf-donut__dot', `cf-chart__bar--${s.colorIndex}`]" />
        {{ s.name }}
        <span class="cf-donut__pct">{{ s.pct.toFixed(1) }}%</span>
      </li>
    </ul>
  </div>
</template>
