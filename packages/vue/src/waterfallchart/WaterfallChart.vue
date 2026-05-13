<script setup lang="ts">
import { computed } from 'vue';
import { linearScale } from '../_charts/scale';
import type {
  WaterfallChartInteractionPayload,
  WaterfallChartProps,
} from './variants';

const props = withDefaults(defineProps<WaterfallChartProps>(), {
  width: 480,
  height: 240,
  showGrid: true,
  showLabels: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: WaterfallChartInteractionPayload): void;
  (e: 'item-leave', payload: WaterfallChartInteractionPayload): void;
}>();

const layout = computed(() => {
  const steps = props.steps ?? [];
  if (!steps.length) return null;
  const padLeft = 32;
  const padRight = 12;
  const padTop = 16;
  const padBottom = props.showLabels ? 24 : 12;
  const innerW = props.width - padLeft - padRight;
  const innerH = props.height - padTop - padBottom;

  let running = 0;
  const bars = steps.map((s) => {
    const isTotal = s.kind === 'total';
    const start = isTotal ? 0 : running;
    const end = isTotal ? s.value : running + s.value;
    running = end;
    return { step: s, start, end, isTotal, delta: end - start };
  });

  const all = bars.flatMap((b) => [b.start, b.end]);
  const min = Math.min(0, ...all);
  const max = Math.max(...all);
  const sy = linearScale({ min, max }, { start: padTop + innerH, end: padTop });
  const slot = innerW / bars.length;
  const barW = Math.max(4, slot * 0.65);

  const placed = bars.map((b, i) => {
    const x = padLeft + slot * (i + 0.5) - barW / 2;
    const y1 = sy(Math.max(b.start, b.end));
    const y2 = sy(Math.min(b.start, b.end));
    const tone = b.isTotal ? 'total' : b.delta >= 0 ? 'positive' : 'negative';
    return {
      ...b,
      x,
      y: y1,
      w: barW,
      h: Math.max(1, y2 - y1),
      centerX: padLeft + slot * (i + 0.5),
      tone,
      labelY: y1 - 4,
    };
  });

  const connectors = placed.slice(0, -1).map((b, i) => {
    const next = placed[i + 1];
    const yEnd = sy(b.end);
    return {
      x1: b.x + b.w,
      x2: next.x,
      y: yEnd,
    };
  });

  return {
    placed,
    connectors,
    sy,
    zeroY: sy(0),
    padLeft,
    padTop,
    innerW,
    innerH,
  };
});

function onEnter(i: number, ev: PointerEvent) {
  const item = layout.value?.placed[i];
  if (!item) return;
  emit('item-enter', {
    step: item.step,
    dataIndex: i,
    cumulative: item.end,
    delta: item.delta,
    nativeEvent: ev,
  });
}
function onLeave(i: number, ev: PointerEvent) {
  const item = layout.value?.placed[i];
  if (!item) return;
  emit('item-leave', {
    step: item.step,
    dataIndex: i,
    cumulative: item.end,
    delta: item.delta,
    nativeEvent: ev,
  });
}

function fmt(v: number): string {
  return props.valueFormatter ? props.valueFormatter(v) : v.toFixed(0);
}
</script>

<template>
  <svg
    class="cf-chart cf-waterfall"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '瀑布图'"
  >
    <template v-if="layout">
      <line
        v-if="showGrid"
        class="cf-chart__axis"
        :x1="layout.padLeft"
        :x2="layout.padLeft + layout.innerW"
        :y1="layout.zeroY"
        :y2="layout.zeroY"
      />
      <line
        v-for="(c, i) in layout.connectors"
        :key="`c${i}`"
        class="cf-waterfall__connector"
        :x1="c.x1"
        :x2="c.x2"
        :y1="c.y"
        :y2="c.y"
      />
      <rect
        v-for="(b, i) in layout.placed"
        :key="`b${i}`"
        :class="['cf-waterfall__bar', `cf-waterfall__bar--${b.tone}`]"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        @pointerenter="(e: PointerEvent) => onEnter(i, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, e)"
      >
        <title>{{ b.step.label }}: {{ fmt(b.delta) }}</title>
      </rect>
      <template v-if="showLabels">
        <text
          v-for="(b, i) in layout.placed"
          :key="`t${i}`"
          :x="b.centerX"
          :y="b.labelY"
          text-anchor="middle"
          class="cf-waterfall__value"
        >{{ fmt(b.isTotal ? b.end : b.delta) }}</text>
        <text
          v-for="(b, i) in layout.placed"
          :key="`l${i}`"
          :x="b.centerX"
          :y="height - 6"
          text-anchor="middle"
          class="cf-waterfall__label"
        >{{ b.step.label }}</text>
      </template>
    </template>
  </svg>
</template>
