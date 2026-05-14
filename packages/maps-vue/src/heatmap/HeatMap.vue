<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { projectAndWeight, renderHeat } from './renderer';
import type { HeatMapProps } from './variants';
import { MAPTILE_CONTEXT_KEY } from '../maptile/variants';
import {
  computeExtent,
  polygonToFitPath,
  projectFit,
} from '../choroplethmap/variants';
import type { GeoJsonFeature } from '../mapminimap/variants';

const props = withDefaults(defineProps<HeatMapProps>(), {
  width: 480,
  height: 280,
  radius: 32,
  opacity: 0.7,
});

const ctx = inject(MAPTILE_CONTEXT_KEY, null);
const liveViewport = computed(() => ctx?.());
const insideTile = computed(() => !!liveViewport.value);

const w = computed(() => (insideTile.value ? liveViewport.value!.viewport.width : props.width));
const h = computed(() => (insideTile.value ? liveViewport.value!.viewport.height : props.height));

const canvasRef = ref<HTMLCanvasElement | null>(null);

const projectFn = computed(() => {
  if (props.projection) return props.projection;
  if (liveViewport.value) return liveViewport.value.project;
  const extent =
    props.extent ??
    (props.geojson?.features?.length
      ? computeExtent(props.geojson.features)
      : { north: 85, south: -85, east: 180, west: -180 });
  return (lng: number, lat: number) => projectFit(lng, lat, extent, w.value, h.value);
});

const basePaths = computed(() => {
  const features = props.geojson?.features ?? [];
  if (insideTile.value) return [];
  const extent = props.extent ?? (features.length ? computeExtent(features) : null);
  if (!extent) return [];
  return features.map((f, i) => {
    const geom = (f as GeoJsonFeature).geometry;
    const multi = geom.type === 'MultiPolygon';
    return { id: i, d: polygonToFitPath(geom.coordinates as never, multi, extent, w.value, h.value) };
  });
});

function paint() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  if (canvas.width !== w.value * dpr || canvas.height !== h.value * dpr) {
    canvas.width = w.value * dpr;
    canvas.height = h.value * dpr;
    canvas.style.width = w.value + 'px';
    canvas.style.height = h.value + 'px';
    const c = canvas.getContext('2d');
    c?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const projected = projectAndWeight(props.data, projectFn.value, w.value, h.value);
  renderHeat(canvas, projected, {
    radius: props.radius,
    maxIntensity: props.maxIntensity,
    gradient: props.gradient,
    opacity: props.opacity,
  });
}

let rafId: number | null = null;
function schedule() {
  if (rafId != null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    paint();
  });
}

onMounted(() => paint());
onUnmounted(() => {
  if (rafId != null) cancelAnimationFrame(rafId);
});

watch(
  [() => props.data, () => props.radius, () => props.opacity, () => props.gradient, w, h, projectFn],
  () => schedule(),
  { deep: false },
);
</script>

<template>
  <div
    class="cf-heatmap"
    :class="insideTile ? 'cf-heatmap--layer' : 'cf-heatmap--standalone'"
    :style="insideTile ? undefined : { width: w + 'px', height: h + 'px' }"
  >
    <svg
      v-if="basePaths.length"
      class="cf-heatmap__base"
      :viewBox="`0 0 ${w} ${h}`"
      :width="w"
      :height="h"
      aria-hidden="true"
    >
      <path
        v-for="bp in basePaths"
        :key="bp.id"
        class="cf-heatmap__land"
        :d="bp.d"
      />
    </svg>
    <canvas ref="canvasRef" class="cf-heatmap__canvas" />
  </div>
</template>
