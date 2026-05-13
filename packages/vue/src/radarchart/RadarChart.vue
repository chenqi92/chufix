<script setup lang="ts">
import { computed } from 'vue';
import { polar } from '../_charts/scale';
import type {
  RadarAxisInteractionPayload,
  RadarChartInteractionPayload,
  RadarChartProps,
  RadarVertexInteractionPayload,
} from './variants';

const props = withDefaults(defineProps<RadarChartProps>(), {
  size: 240,
  showLegend: true,
  showPoints: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: RadarChartInteractionPayload): void;
  (e: 'item-leave', payload: RadarChartInteractionPayload): void;
  (e: 'vertex-enter', payload: RadarVertexInteractionPayload): void;
  (e: 'vertex-leave', payload: RadarVertexInteractionPayload): void;
  (e: 'axis-enter', payload: RadarAxisInteractionPayload): void;
  (e: 'axis-leave', payload: RadarAxisInteractionPayload): void;
}>();

function onSeriesEnter(i: number, ev: PointerEvent) {
  const series = props.series?.[i];
  if (!series) return;
  emit('item-enter', { series, seriesIndex: i, nativeEvent: ev });
}
function onSeriesLeave(i: number, ev: PointerEvent) {
  const series = props.series?.[i];
  if (!series) return;
  emit('item-leave', { series, seriesIndex: i, nativeEvent: ev });
}

function buildVertex(
  seriesIndex: number,
  axisIndex: number,
  ev: PointerEvent,
): RadarVertexInteractionPayload | null {
  const series = props.series?.[seriesIndex];
  const axisLabel = props.axes?.[axisIndex];
  if (!series || axisLabel == null) return null;
  return {
    series,
    seriesIndex,
    axisIndex,
    axisLabel,
    value: series.values[axisIndex],
    nativeEvent: ev,
  };
}
function onVertexEnter(seriesIndex: number, axisIndex: number, ev: PointerEvent) {
  const p = buildVertex(seriesIndex, axisIndex, ev);
  if (p) emit('vertex-enter', p);
}
function onVertexLeave(seriesIndex: number, axisIndex: number, ev: PointerEvent) {
  const p = buildVertex(seriesIndex, axisIndex, ev);
  if (p) emit('vertex-leave', p);
}

function buildAxis(i: number, ev: PointerEvent): RadarAxisInteractionPayload | null {
  const axisLabel = props.axes?.[i];
  if (axisLabel == null) return null;
  return {
    axisIndex: i,
    axisLabel,
    values: (props.series ?? []).map((s) => s.values[i] ?? 0),
    nativeEvent: ev,
  };
}
function onAxisEnter(i: number, ev: PointerEvent) {
  const p = buildAxis(i, ev);
  if (p) emit('axis-enter', p);
}
function onAxisLeave(i: number, ev: PointerEvent) {
  const p = buildAxis(i, ev);
  if (p) emit('axis-leave', p);
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
    return { idx: s.colorIndex ?? idx % 8, name: s.name, d, points };
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
          class="cf-chart__axis cf-radar__axis-line"
          :x1="layout.cx"
          :y1="layout.cy"
          :x2="p.x"
          :y2="p.y"
          @pointerenter="(e: PointerEvent) => onAxisEnter(i, e)"
          @pointerleave="(e: PointerEvent) => onAxisLeave(i, e)"
        />
        <text
          v-for="(p, i) in layout.axisPoints"
          :key="`tx${i}`"
          :x="p.x"
          :y="p.y - 6"
          text-anchor="middle"
          class="cf-radar__axis-label"
          @pointerenter="(e: PointerEvent) => onAxisEnter(i, e)"
          @pointerleave="(e: PointerEvent) => onAxisLeave(i, e)"
        >{{ axes[i] }}</text>
        <path
          v-for="(p, i) in layout.polygons"
          :key="`p${i}`"
          :d="p.d"
          :class="[`cf-chart__bar--${p.idx}`, 'cf-radar__polygon']"
          fill-opacity="0.2"
          stroke-width="2"
          @pointerenter="(e: PointerEvent) => onSeriesEnter(i, e)"
          @pointerleave="(e: PointerEvent) => onSeriesLeave(i, e)"
        />
        <template v-if="showPoints">
          <template v-for="(p, si) in layout.polygons" :key="`pts-${si}`">
            <circle
              v-for="(pt, ai) in p.points"
              :key="`pt-${si}-${ai}`"
              :class="[`cf-chart__bar--${p.idx}`, 'cf-radar__vertex']"
              :cx="pt.x"
              :cy="pt.y"
              r="3"
              @pointerenter="(e: PointerEvent) => onVertexEnter(si, ai, e)"
              @pointerleave="(e: PointerEvent) => onVertexLeave(si, ai, e)"
            >
              <title>{{ p.name }} · {{ axes[ai] }}: {{ series[si].values[ai] }}</title>
            </circle>
          </template>
        </template>
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
