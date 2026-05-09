<script setup lang="ts">
import { computed } from 'vue';
import { buildQrSvg, qrcodeClass, type QRCodeProps } from './variants';

const props = withDefaults(defineProps<QRCodeProps>(), {
  ecc: 'M',
  size: 160,
  margin: 2,
  color: 'currentColor',
  background: 'transparent',
});

const cls = computed(() => qrcodeClass({ className: props.className }));

const svg = computed(() =>
  buildQrSvg({
    value: props.value,
    ecc: props.ecc,
    size: props.size,
    margin: props.margin,
    color: props.color,
    background: props.background,
  }),
);
</script>

<template>
  <span :class="cls" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg
      :viewBox="svg.viewBox"
      shape-rendering="crispEdges"
      role="img"
      :aria-label="value"
    >
      <rect width="100%" height="100%" :fill="background" />
      <path :d="svg.path" :fill="color" />
    </svg>
  </span>
</template>
