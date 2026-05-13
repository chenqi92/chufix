<script setup lang="ts">
import { computed } from 'vue';
import { linearScale } from '../_charts/scale';
import type {
  TimingBarInteractionPayload,
  TimingBarProps,
} from './variants';

const props = withDefaults(defineProps<TimingBarProps>(), {
  width: 480,
  height: 28,
  showAxis: true,
  labelMode: 'auto',
});

const emit = defineEmits<{
  (e: 'item-enter', payload: TimingBarInteractionPayload): void;
  (e: 'item-leave', payload: TimingBarInteractionPayload): void;
}>();

function onEnter(i: number, ev: PointerEvent) {
  const phase = props.phases?.[i];
  if (!phase) return;
  emit('item-enter', { phase, dataIndex: i, duration: phase.end - phase.start, nativeEvent: ev });
}
function onLeave(i: number, ev: PointerEvent) {
  const phase = props.phases?.[i];
  if (!phase) return;
  emit('item-leave', { phase, dataIndex: i, duration: phase.end - phase.start, nativeEvent: ev });
}

const layout = computed(() => {
  const phases = props.phases ?? [];
  if (!phases.length) return null;
  const min = Math.min(...phases.map((p) => p.start));
  const max = Math.max(...phases.map((p) => p.end));
  const sx = linearScale(
    { min, max },
    { start: 0, end: props.width },
  );
  const labelRowEnds = [-Infinity, -Infinity];
  return phases.map((p, i) => {
    const x = sx(p.start);
    const width = Math.max(1, sx(p.end) - sx(p.start));
    const duration = p.end - p.start;
    const text = `${p.label} ${duration}ms`;
    const estimatedTextWidth = text.length * 7 + 10;
    const labelX = Math.max(0, Math.min(x + 4, Math.max(0, props.width - estimatedTextWidth)));
    const labelRow = labelRowEnds.findIndex((end) => labelX >= end + 8);
    const canPlaceLabel = labelRow >= 0;
    const autoVisible = width >= 12 && canPlaceLabel;
    const labelVisible =
      (props.labelMode === 'all' && canPlaceLabel) || (props.labelMode === 'auto' && autoVisible);
    if (labelVisible) labelRowEnds[labelRow] = labelX + estimatedTextWidth;
    return {
      label: p.label,
      text,
      x,
      width,
      labelX,
      labelY: props.height + 10 + Math.max(labelRow, 0) * 12,
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
    :viewBox="`0 0 ${width} ${height + (showAxis ? 30 : 0)}`"
    :width="width"
    :height="height + (showAxis ? 30 : 0)"
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
        @pointerenter="(e: PointerEvent) => onEnter(i, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, e)"
      >
        <title>{{ p.label }}: {{ p.duration }}ms</title>
      </rect>
      <template v-if="showAxis">
        <text
          v-for="(p, i) in layout.filter((item) => labelMode !== 'none' && item.labelVisible)"
          :key="`l${i}`"
          :x="p.labelX"
          :y="p.labelY"
        >{{ p.text }}</text>
      </template>
    </template>
  </svg>
</template>
