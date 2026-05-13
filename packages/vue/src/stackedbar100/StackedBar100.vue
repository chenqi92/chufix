<script setup lang="ts">
import { computed } from 'vue';
import type {
  StackedBar100InteractionPayload,
  StackedBar100Props,
} from './variants';

const props = withDefaults(defineProps<StackedBar100Props>(), {
  width: 480,
  height: 24,
  showLegend: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: StackedBar100InteractionPayload): void;
  (e: 'item-leave', payload: StackedBar100InteractionPayload): void;
}>();

function onEnter(i: number, pct: number, ev: PointerEvent) {
  const segment = props.segments?.[i];
  if (!segment) return;
  emit('item-enter', { segment, dataIndex: i, pct, nativeEvent: ev });
}
function onLeave(i: number, pct: number, ev: PointerEvent) {
  const segment = props.segments?.[i];
  if (!segment) return;
  emit('item-leave', { segment, dataIndex: i, pct, nativeEvent: ev });
}

const layout = computed(() => {
  const segs = props.segments ?? [];
  const total = segs.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  return segs.map((s, i) => {
    const start = (acc / total) * 100;
    acc += s.value;
    const end = (acc / total) * 100;
    return {
      ...s,
      colorIndex: s.colorIndex ?? i % 8,
      pct: end - start,
      start,
    };
  });
});
</script>

<template>
  <div class="cf-stacked100" role="img" :aria-label="ariaLabel ?? '占比柱'">
    <div
      class="cf-stacked100__bar"
      :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    >
      <span
        v-for="(seg, i) in layout"
        :key="i"
        :class="[`cf-stacked100__seg`, `cf-chart__bar--${seg.colorIndex}`]"
        :style="{ width: `${seg.pct}%` }"
        :title="`${seg.name}: ${seg.value}`"
        @pointerenter="(e: PointerEvent) => onEnter(i, seg.pct, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, seg.pct, e)"
      />
    </div>
    <ul v-if="showLegend" class="cf-stacked100__legend">
      <li v-for="(seg, i) in layout" :key="i">
        <span :class="['cf-stacked100__dot', `cf-chart__bar--${seg.colorIndex}`]" />
        {{ seg.name }}
        <span class="cf-stacked100__pct">{{ seg.pct.toFixed(1) }}%</span>
      </li>
    </ul>
  </div>
</template>
