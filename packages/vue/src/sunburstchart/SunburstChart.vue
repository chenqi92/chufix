<script setup lang="ts">
import { computed } from 'vue';
import { buildLayout, pathTo, sumValue } from './layout';
import type {
  SunburstChartInteractionPayload,
  SunburstChartProps,
} from './variants';

const props = withDefaults(defineProps<SunburstChartProps>(), {
  size: 240,
  innerRadiusRatio: 0.2,
  showLabels: true,
  labelMinAngle: 12,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: SunburstChartInteractionPayload): void;
  (e: 'item-leave', payload: SunburstChartInteractionPayload): void;
}>();

const layout = computed(() =>
  buildLayout(props.root, {
    size: props.size,
    innerRadiusRatio: props.innerRadiusRatio,
  }),
);

function buildPayload(idx: number, ev: PointerEvent): SunburstChartInteractionPayload | null {
  const seg = layout.value.segments[idx];
  if (!seg) return null;
  return {
    node: seg.node,
    depth: seg.depth,
    pathNames: pathTo(props.root, seg.node),
    totalValue: sumValue(seg.node),
    nativeEvent: ev,
  };
}
function onEnter(idx: number, ev: PointerEvent) {
  const p = buildPayload(idx, ev);
  if (p) emit('item-enter', p);
}
function onLeave(idx: number, ev: PointerEvent) {
  const p = buildPayload(idx, ev);
  if (p) emit('item-leave', p);
}

function labelXY(seg: { midAngle: number; midRadius: number }) {
  const a = ((seg.midAngle - 90) * Math.PI) / 180;
  const cx = props.size / 2;
  const cy = props.size / 2;
  return { x: cx + seg.midRadius * Math.cos(a), y: cy + seg.midRadius * Math.sin(a) };
}
</script>

<template>
  <svg
    class="cf-chart cf-sunburst"
    :viewBox="`0 0 ${size} ${size}`"
    :width="size"
    :height="size"
    role="img"
    :aria-label="ariaLabel ?? '旭日图'"
  >
    <g>
      <path
        v-for="(seg, i) in layout.segments"
        :key="i"
        :class="['cf-sunburst__segment', `cf-chart__bar--${seg.colorIndex}`]"
        :d="seg.path"
        @pointerenter="(e: PointerEvent) => onEnter(i, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, e)"
      >
        <title>{{ seg.node.name }}</title>
      </path>
      <template v-if="showLabels">
        <text
          v-for="(seg, i) in layout.segments.filter((s) => s.endAngle - s.startAngle >= labelMinAngle)"
          :key="`l${i}`"
          class="cf-sunburst__label"
          :x="labelXY(seg).x"
          :y="labelXY(seg).y"
          text-anchor="middle"
          dominant-baseline="central"
        >{{ seg.node.name }}</text>
      </template>
    </g>
  </svg>
</template>
