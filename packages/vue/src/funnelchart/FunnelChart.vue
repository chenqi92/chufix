<script setup lang="ts">
import { computed } from 'vue';
import type {
  FunnelChartInteractionPayload,
  FunnelChartProps,
} from './variants';

const props = withDefaults(defineProps<FunnelChartProps>(), {
  width: 360,
  height: 240,
  showLabels: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: FunnelChartInteractionPayload): void;
  (e: 'item-leave', payload: FunnelChartInteractionPayload): void;
}>();

function onEnter(i: number, ev: PointerEvent) {
  const step = props.steps?.[i];
  if (!step) return;
  emit('item-enter', { step, dataIndex: i, nativeEvent: ev });
}
function onLeave(i: number, ev: PointerEvent) {
  const step = props.steps?.[i];
  if (!step) return;
  emit('item-leave', { step, dataIndex: i, nativeEvent: ev });
}

const layout = computed(() => {
  const steps = props.steps ?? [];
  if (!steps.length) return null;
  const max = Math.max(...steps.map((s) => s.value), 1);
  const stepH = props.height / steps.length;
  return steps.map((s, i) => {
    const wTop = (steps[Math.max(0, i - 1)]?.value ?? max) / max * props.width;
    const wBot = (s.value / max) * props.width;
    const next = steps[i + 1];
    const wNextBot = next ? (next.value / max) * props.width : wBot;
    const top = i * stepH;
    const bot = (i + 1) * stepH;
    const tlX = (props.width - wTop) / 2;
    const trX = props.width - tlX;
    const blX = (props.width - wNextBot) / 2;
    const brX = props.width - blX;
    return {
      d: `M ${tlX} ${top} L ${trX} ${top} L ${brX} ${bot} L ${blX} ${bot} Z`,
      label: s.label,
      value: s.value,
      cx: props.width / 2,
      cy: top + stepH / 2,
      colorIndex: i % 8,
    };
  });
});
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '漏斗图'"
  >
    <template v-if="layout">
      <path
        v-for="(s, i) in layout"
        :key="i"
        :class="`cf-chart__bar--${s.colorIndex}`"
        :d="s.d"
        opacity="0.9"
        @pointerenter="(e: PointerEvent) => onEnter(i, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, e)"
      />
      <template v-if="showLabels">
        <text
          v-for="(s, i) in layout"
          :key="`l${i}`"
          :x="s.cx"
          :y="s.cy"
          text-anchor="middle"
          dominant-baseline="central"
          fill="var(--fg-on-viz)"
        >{{ s.label }} · {{ s.value }}</text>
      </template>
    </template>
  </svg>
</template>
