<script setup lang="ts">
import { computed } from 'vue';
import { linearScale } from '../_charts/scale';
import type { TimingBarProps } from './variants';

const props = withDefaults(defineProps<TimingBarProps>(), {
  width: 480,
  height: 28,
  showAxis: true,
  labelMode: 'auto',
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
  let lastLabelEnd = -Infinity;
  return phases.map((p, i) => {
    const x = sx(p.start);
    const width = Math.max(1, sx(p.end) - sx(p.start));
    const duration = p.end - p.start;
    const text = `${p.label} ${duration}ms`;
    const estimatedTextWidth = text.length * 7 + 10;
    const autoVisible = width >= estimatedTextWidth && x >= lastLabelEnd + 8;
    const labelVisible =
      props.labelMode === 'all' || (props.labelMode === 'auto' && autoVisible);
    if (labelVisible) lastLabelEnd = x + estimatedTextWidth;
    return {
      label: p.label,
      text,
      x,
      width,
      colorIndex: p.colorIndex ?? i % 8,
      duration,
      labelVisible,
    };
  });
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
      >
        <title>{{ p.label }}: {{ p.duration }}ms</title>
      </rect>
      <template v-if="showAxis">
        <text
          v-for="(p, i) in layout.filter((item) => labelMode !== 'none' && item.labelVisible)"
          :key="`l${i}`"
          :x="p.x + 4"
          :y="height + 12"
        >{{ p.text }}</text>
      </template>
    </template>
  </svg>
</template>
