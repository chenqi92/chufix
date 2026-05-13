<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
} from '../_charts/scale';
import type {
  SparklineClickPayload,
  SparklineHoverPayload,
  SparklineProps,
} from './variants';

const props = withDefaults(defineProps<SparklineProps>(), {
  width: 80,
  height: 24,
  filled: false,
  smooth: false,
  colorIndex: 0,
  showDot: true,
  interactive: false,
});

const emit = defineEmits<{
  (e: 'click', payload: SparklineClickPayload): void;
  (e: 'hover', payload: SparklineHoverPayload | null): void;
}>();

const svgEl = ref<SVGSVGElement | null>(null);
const hoverIndex = ref<number | null>(null);

const svg = computed(() => {
  const w = props.width;
  const h = props.height;
  const data = props.data ?? [];
  if (!data.length) return null;
  const dom = domainOf(data);
  const sx = linearScale({ min: 0, max: Math.max(1, data.length - 1) }, { start: 1, end: w - 1 });
  const sy = linearScale(dom, { start: h - 1, end: 1 });
  const points = data.map((v, i) => ({ x: sx(i), y: sy(v) }));
  return {
    line: linePath(points, props.smooth),
    area: areaPath(points, h - 1),
    last: points[points.length - 1],
    points,
  };
});

function nearestIndex(clientX: number, target: SVGSVGElement | null): number {
  const data = props.data ?? [];
  if (!data.length || !target) return 0;
  const rect = target.getBoundingClientRect();
  const ratio = rect.width ? (clientX - rect.left) / rect.width : 0;
  return Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1))));
}

function fmt(value: number, index: number): string {
  if (props.format) return props.format(value, index);
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function onClick(ev: PointerEvent) {
  const data = props.data ?? [];
  if (!data.length) return;
  const dataIndex = nearestIndex(ev.clientX, ev.currentTarget as SVGSVGElement | null);
  emit('click', { dataIndex, value: data[dataIndex], nativeEvent: ev });
}

function onPointerMove(ev: PointerEvent) {
  if (!props.interactive) return;
  const data = props.data ?? [];
  if (!data.length) return;
  const dataIndex = nearestIndex(ev.clientX, ev.currentTarget as SVGSVGElement | null);
  hoverIndex.value = dataIndex;
  emit('hover', {
    dataIndex,
    value: data[dataIndex],
    label: props.labels?.[dataIndex],
    nativeEvent: ev,
  });
}

function onPointerLeave() {
  if (!props.interactive) return;
  hoverIndex.value = null;
  emit('hover', null);
}

const cls = computed(() => [
  'cf-sparkline',
  `cf-chart__series-${props.colorIndex}`,
  props.interactive && 'is-interactive',
]);

const hoverPoint = computed(() => {
  if (!props.interactive || hoverIndex.value == null || !svg.value) return null;
  return svg.value.points[hoverIndex.value];
});

const hoverLabel = computed(() => {
  if (hoverIndex.value == null) return '';
  const data = props.data ?? [];
  const v = data[hoverIndex.value];
  const label = props.labels?.[hoverIndex.value];
  return label ? `${label} · ${fmt(v, hoverIndex.value)}` : fmt(v, hoverIndex.value);
});

/* Anchor the tooltip to the hover point but clamp inside the SVG. */
const tooltipStyle = computed(() => {
  if (!hoverPoint.value) return { display: 'none' };
  const x = hoverPoint.value.x;
  const half = props.width / 2;
  /* Switch anchor side near the edges so the bubble doesn't clip. */
  const isLeftHalf = x < half;
  const left = isLeftHalf ? `${x + 6}px` : 'auto';
  const right = isLeftHalf ? 'auto' : `${props.width - x + 6}px`;
  return { left, right, top: '0px' };
});
</script>

<template>
  <span class="cf-sparkline-wrap">
    <svg
      ref="svgEl"
      :class="cls"
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      role="img"
      :aria-label="ariaLabel ?? '走势缩略图'"
      @click="onClick"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <template v-if="svg">
        <path v-if="filled" class="cf-chart__area" :d="svg.area" />
        <path class="cf-chart__line" :d="svg.line" />
        <circle
          v-if="showDot"
          class="cf-chart__dot"
          :cx="svg.last.x"
          :cy="svg.last.y"
          r="2"
        />
        <template v-if="hoverPoint">
          <line
            class="cf-sparkline__crosshair"
            :x1="hoverPoint.x"
            :x2="hoverPoint.x"
            :y1="1"
            :y2="height - 1"
          />
          <circle
            class="cf-sparkline__hover-dot"
            :cx="hoverPoint.x"
            :cy="hoverPoint.y"
            r="3"
          />
        </template>
      </template>
    </svg>
    <span
      v-if="interactive && hoverPoint"
      class="cf-sparkline__tooltip"
      :style="tooltipStyle"
      role="status"
      aria-live="polite"
    >{{ hoverLabel }}</span>
  </span>
</template>
