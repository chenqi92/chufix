<script setup lang="ts">
import { computed } from 'vue';
import { polar } from '../_charts/scale';
import type { GaugeProps } from './variants';

const props = withDefaults(defineProps<GaugeProps>(), {
  min: 0,
  max: 100,
  size: 160,
  thickness: 10,
  sweep: 270,
  tone: 'accent',
});

const layout = computed(() => {
  const cx = props.size / 2;
  const cy = props.size / 2;
  const r = props.size / 2 - props.thickness / 2 - 2;
  const startAngle = -props.sweep / 2;
  const endAngle = props.sweep / 2;
  const ratio = Math.max(
    0,
    Math.min(1, (props.value - props.min) / (props.max - props.min)),
  );

  const trackStart = polar(cx, cy, r, startAngle);
  const trackEnd = polar(cx, cy, r, endAngle);
  const valueAngle = startAngle + ratio * props.sweep;
  const valueEnd = polar(cx, cy, r, valueAngle);
  const largeTrack = props.sweep > 180 ? 1 : 0;
  const largeValue = ratio * props.sweep > 180 ? 1 : 0;

  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeTrack} 1 ${trackEnd.x} ${trackEnd.y}`;
  const valuePath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeValue} 1 ${valueEnd.x} ${valueEnd.y}`;

  return { cx, cy, r, trackPath, valuePath, ratio };
});

const toneColor = computed(() => {
  switch (props.tone) {
    case 'success':
      return 'var(--status-success)';
    case 'warning':
      return 'var(--status-warning)';
    case 'error':
      return 'var(--status-error)';
    default:
      return 'var(--accent-1)';
  }
});
</script>

<template>
  <svg
    class="cf-chart cf-gauge"
    :viewBox="`0 0 ${size} ${size}`"
    :width="size"
    :height="size"
    role="img"
    :aria-label="ariaLabel ?? label ?? '仪表盘'"
  >
    <path class="cf-gauge__track" :d="layout.trackPath" :stroke-width="thickness" />
    <path
      class="cf-gauge__fill"
      :d="layout.valuePath"
      :stroke="toneColor"
      :stroke-width="thickness"
    />
    <text
      class="cf-gauge__label"
      :x="layout.cx"
      :y="layout.cy"
    >
      {{ Math.round(value) }}<tspan v-if="unit" class="cf-gauge__unit">{{ unit }}</tspan>
    </text>
    <text
      v-if="label"
      :x="layout.cx"
      :y="layout.cy + 24"
      text-anchor="middle"
      class="cf-gauge__caption"
    >{{ label }}</text>
  </svg>
</template>
