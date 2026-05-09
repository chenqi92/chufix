<script setup lang="ts">
import { computed } from 'vue';
import { buildWatermarkSvg, watermarkClass, type WatermarkProps } from './variants';

const props = withDefaults(defineProps<WatermarkProps>(), {
  content: 'ChuFix',
  fontSize: 14,
  color: 'oklch(60% 0.01 264 / 0.18)',
  rotate: -22,
  gap: () => [160, 80] as [number, number],
  zIndex: 9,
});

const lines = computed(() => (Array.isArray(props.content) ? props.content : [props.content]));
const bg = computed(() =>
  buildWatermarkSvg({
    content: lines.value,
    fontSize: props.fontSize,
    color: props.color,
    rotate: props.rotate,
    gap: props.gap,
  }),
);
const overlayStyle = computed(() => ({
  backgroundImage: bg.value,
  zIndex: String(props.zIndex),
}));
</script>

<template>
  <div :class="watermarkClass({ className })">
    <slot />
    <div class="cf-watermark__overlay" :style="overlayStyle" aria-hidden="true" />
  </div>
</template>
