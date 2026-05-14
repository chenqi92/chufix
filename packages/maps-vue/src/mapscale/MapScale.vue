<script setup lang="ts">
import { computed, inject } from 'vue';
import { computeBar, type MapScaleProps } from './variants';
import { MAPTILE_CONTEXT_KEY } from '../maptile/variants';
import { metersPerPixel } from '../maptile/mercator';

const props = withDefaults(defineProps<MapScaleProps>(), {
  unit: 'metric',
  maxWidth: 120,
  position: 'bottom-left',
  inline: false,
});

const ctx = inject(MAPTILE_CONTEXT_KEY, null);

const liveViewport = computed(() => ctx?.());

const lat = computed(() => liveViewport.value?.viewport.center.lat ?? props.lat ?? 0);
const zoom = computed(() => liveViewport.value?.viewport.zoom ?? props.zoom ?? 0);

const bar = computed(() => {
  const mpp = metersPerPixel(lat.value, zoom.value);
  return computeBar(mpp, props.maxWidth, props.unit);
});
</script>

<template>
  <div
    class="cf-mapscale"
    :class="inline ? 'cf-mapscale--inline' : `cf-mapscale--corner cf-mapscale--${position}`"
  >
    <div class="cf-mapscale__bar" :style="{ width: bar.pixels + 'px' }" />
    <div class="cf-mapscale__label">{{ bar.label }}</div>
  </div>
</template>
