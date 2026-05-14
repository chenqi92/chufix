<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { autoDomain, valueToRadius, type BubbleMapProps } from './variants';
import { MAPTILE_CONTEXT_KEY } from '../maptile/variants';
import {
  computeExtent,
  polygonToFitPath,
  projectFit,
} from '../choroplethmap/variants';
import type { GeoJsonFeature } from '../mapminimap/variants';

const props = withDefaults(defineProps<BubbleMapProps>(), {
  width: 480,
  height: 280,
  radiusRange: () => [3, 24],
  opacity: 0.55,
  tooltip: true,
});

const ctx = inject(MAPTILE_CONTEXT_KEY, null);

const insideTile = computed(() => !!ctx?.());

const liveViewport = computed(() => ctx?.());

const w = computed(() => (insideTile.value ? liveViewport.value!.viewport.width : props.width));
const h = computed(() => (insideTile.value ? liveViewport.value!.viewport.height : props.height));

const projectFn = computed(() => {
  if (props.projection) return props.projection;
  if (liveViewport.value) return liveViewport.value.project;
  // Standalone mode — auto-fit projection.
  const extent =
    props.extent ??
    (props.geojson?.features?.length
      ? computeExtent(props.geojson.features)
      : { north: 85, south: -85, east: 180, west: -180 });
  return (lng: number, lat: number) => projectFit(lng, lat, extent, w.value, h.value);
});

const domain = computed(() => props.domain ?? autoDomain(props.data));

const basePaths = computed(() => {
  const features = props.geojson?.features ?? [];
  if (insideTile.value) return [];
  const extent = props.extent ?? (features.length ? computeExtent(features) : null);
  if (!extent) return [];
  return features.map((f, i) => {
    const geom = (f as GeoJsonFeature).geometry;
    const multi = geom.type === 'MultiPolygon';
    return {
      id: i,
      d: polygonToFitPath(geom.coordinates as never, multi, extent, w.value, h.value),
    };
  });
});

const bubbles = computed(() => {
  return props.data.map((d) => {
    const p = projectFn.value(d.lng, d.lat);
    return {
      ...d,
      x: p.x,
      y: p.y,
      r: valueToRadius(d.value, domain.value, props.radiusRange),
    };
  });
});

const hover = ref<{ x: number; y: number; name: string; value: number } | null>(null);

function onEnter(e: PointerEvent, b: { name?: string; id: string | number; value: number }) {
  if (!props.tooltip) return;
  const svg = (e.currentTarget as SVGElement).ownerSVGElement;
  const rect = svg?.getBoundingClientRect();
  hover.value = {
    x: rect ? e.clientX - rect.left : e.offsetX,
    y: rect ? e.clientY - rect.top : e.offsetY,
    name: String(b.name ?? b.id),
    value: b.value,
  };
}
function onMove(e: PointerEvent) {
  if (!hover.value) return;
  const svg = (e.currentTarget as SVGElement).ownerSVGElement;
  const rect = svg?.getBoundingClientRect();
  if (!rect) return;
  hover.value = { ...hover.value, x: e.clientX - rect.left, y: e.clientY - rect.top };
}
function onLeave() {
  hover.value = null;
}

const fill = computed(() => props.fill ?? `oklch(from var(--accent-1) l c h / ${props.opacity})`);
const stroke = computed(() => props.stroke ?? 'var(--accent-1)');
</script>

<template>
  <div
    class="cf-bubblemap"
    :class="insideTile ? 'cf-bubblemap--layer' : 'cf-bubblemap--standalone'"
    :style="insideTile ? undefined : { width: w + 'px', height: h + 'px' }"
  >
    <svg
      class="cf-bubblemap__svg"
      :viewBox="`0 0 ${w} ${h}`"
      :width="insideTile ? undefined : w"
      :height="insideTile ? undefined : h"
      role="img"
      aria-label="气泡地图"
      @pointerleave="onLeave"
    >
      <path
        v-for="bp in basePaths"
        :key="bp.id"
        class="cf-bubblemap__land"
        :d="bp.d"
      />
      <circle
        v-for="b in bubbles"
        :key="String(b.id)"
        class="cf-bubblemap__bubble"
        :cx="b.x"
        :cy="b.y"
        :r="b.r"
        :fill="b.tone ?? fill"
        :stroke="stroke"
        @pointerenter="(e) => onEnter(e, b)"
        @pointermove="onMove"
      />
    </svg>
    <div
      v-if="tooltip && hover"
      class="cf-bubblemap__tooltip"
      :style="{ left: hover.x + 'px', top: hover.y + 'px' }"
      role="tooltip"
    >
      <span class="cf-bubblemap__tooltip-name">{{ hover.name }}</span>
      <span class="cf-bubblemap__tooltip-value">{{ hover.value }}{{ unit ?? '' }}</span>
    </div>
  </div>
</template>
