<script setup lang="ts">
import { computed } from 'vue';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
} from '../_charts/scale';
import type { SparklineClickPayload, SparklineProps } from './variants';

const props = withDefaults(defineProps<SparklineProps>(), {
  width: 80,
  height: 24,
  filled: false,
  smooth: false,
  colorIndex: 0,
  showDot: true,
});

const emit = defineEmits<{
  (e: 'click', payload: SparklineClickPayload): void;
}>();

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
  };
});

function onClick(ev: PointerEvent) {
  const data = props.data ?? [];
  if (!data.length) return;
  const target = ev.currentTarget as SVGSVGElement | null;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const ratio = rect.width ? (ev.clientX - rect.left) / rect.width : 0;
  const dataIndex = Math.max(
    0,
    Math.min(data.length - 1, Math.round(ratio * (data.length - 1))),
  );
  emit('click', { dataIndex, value: data[dataIndex], nativeEvent: ev });
}

const cls = computed(() => [
  'cf-sparkline',
  `cf-chart__series-${props.colorIndex}`,
]);
</script>

<template>
  <svg
    :class="cls"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '走势缩略图'"
    @click="onClick"
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
    </template>
  </svg>
</template>
