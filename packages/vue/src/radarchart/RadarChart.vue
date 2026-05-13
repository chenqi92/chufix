<script setup lang="ts">
import { computed } from 'vue';
import { polar } from '../_charts/scale';
import type {
  RadarChartInteractionPayload,
  RadarChartProps,
} from './variants';

const props = withDefaults(defineProps<RadarChartProps>(), {
  size: 240,
  showLegend: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: RadarChartInteractionPayload): void;
  (e: 'item-leave', payload: RadarChartInteractionPayload): void;
}>();

function onEnter(i: number, ev: PointerEvent) {
  const series = props.series?.[i];
  if (!series) return;
  emit('item-enter', { series, seriesIndex: i, nativeEvent: ev });
}
function onLeave(i: number, ev: PointerEvent) {
  const series = props.series?.[i];
  if (!series) return;
  emit('item-leave', { series, seriesIndex: i, nativeEvent: ev });
}

const layout = computed(() => {
  const axes = props.axes ?? [];
  const series = props.series ?? [];
  if (!axes.length || !series.length) return null;
  const cx = props.size / 2;
  const cy = props.size / 2;
  const r = props.size / 2 - 24;
  const max =
    props.max ?? Math.max(...series.flatMap((s) => s.values), 1);
  const angleStep = 360 / axes.length;

  const axisPoints = axes.map((_, i) => polar(cx, cy, r, i * angleStep));
  const grid = [0.25, 0.5, 0.75, 1].map((scale) =>
    axes.map((_, i) => polar(cx, cy, r * scale, i * angleStep)),
  );
  const polygons = series.map((s, idx) => {
    const points = s.values.map((v, i) =>
      polar(cx, cy, r * (v / max), i * angleStep),
    );
    const d =
      'M ' +
      points.map((p) => `${p.x} ${p.y}`).join(' L ') +
      ' Z';
    return { idx: s.colorIndex ?? idx % 8, name: s.name, d };
  });

  return { cx, cy, r, axisPoints, grid, polygons };
});
</script>

<template>
  <div class="cf-radar" role="img" :aria-label="ariaLabel ?? '雷达图'">
    <svg
      class="cf-chart"
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
    >
      <template v-if="layout">
        <polygon
          v-for="(ring, i) in layout.grid"
          :key="`g${i}`"
          :points="ring.map((p) => `${p.x},${p.y}`).join(' ')"
          fill="none"
          class="cf-chart__grid"
        />
        <line
          v-for="(p, i) in layout.axisPoints"
          :key="`ax${i}`"
          class="cf-chart__axis"
          :x1="layout.cx"
          :y1="layout.cy"
          :x2="p.x"
          :y2="p.y"
        />
        <text
          v-for="(p, i) in layout.axisPoints"
          :key="`tx${i}`"
          :x="p.x"
          :y="p.y - 6"
          text-anchor="middle"
        >{{ axes[i] }}</text>
        <path
          v-for="(p, i) in layout.polygons"
          :key="`p${i}`"
          :d="p.d"
          :class="`cf-chart__bar--${p.idx}`"
          fill-opacity="0.2"
          stroke-width="2"
          @pointerenter="(e: PointerEvent) => onEnter(i, e)"
          @pointerleave="(e: PointerEvent) => onLeave(i, e)"
        />
      </template>
    </svg>
    <ul v-if="showLegend && layout" class="cf-radar__legend">
      <li v-for="p in layout.polygons" :key="p.name">
        <span :class="['cf-radar__dot', `cf-chart__bar--${p.idx}`]" />
        {{ p.name }}
      </li>
    </ul>
  </div>
</template>
