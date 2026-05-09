<script setup lang="ts">
import { computed } from 'vue';
import { linearScale } from '../_charts/scale';
import type { TimingBarProps } from './variants';

const props = withDefaults(defineProps<TimingBarProps>(), {
  width: 480,
  height: 28,
  showAxis: true,
});

const layout = computed(() => {
  const phases = props.phases ?? [];
  if (!phases.length) return null;
  const min = Math.min(...phases.map((p) => p.start));
  const max = Math.max(...phases.map((p) => p.end));
  const sx = linearScale(
    { min, max },
    { start: 0, end: props.width },
  );
  return phases.map((p, i) => ({
    label: p.label,
    x: sx(p.start),
    width: Math.max(1, sx(p.end) - sx(p.start)),
    colorIndex: p.colorIndex ?? i % 8,
    duration: p.end - p.start,
  }));
});
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height + (showAxis ? 14 : 0)}`"
    :width="width"
    :height="height + (showAxis ? 14 : 0)"
    role="img"
    :aria-label="ariaLabel ?? '请求瀑布图'"
  >
    <template v-if="layout">
      <rect
        v-for="(p, i) in layout"
        :key="i"
        :class="`cf-chart__bar--${p.colorIndex}`"
        :x="p.x"
        :y="0"
        :width="p.width"
        :height="height"
        :title="`${p.label}: ${p.duration}ms`"
      />
      <template v-if="showAxis">
        <text
          v-for="(p, i) in layout"
          :key="`l${i}`"
          :x="p.x + 4"
          :y="height + 12"
        >{{ p.label }} {{ p.duration }}ms</text>
      </template>
    </template>
  </svg>
</template>
