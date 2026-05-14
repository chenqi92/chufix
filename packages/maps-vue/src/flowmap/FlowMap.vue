<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  computeExtent,
  curvedArc,
  pointBoundsExtent,
  polygonToFitPath,
  polygonToProjectedPath,
  projectFit,
  valueToWidth,
  type FlowMapProps,
} from './variants';
import type { GeoJsonFeature } from '../mapminimap/variants';
import { MAPTILE_CONTEXT_KEY } from '../maptile/variants';

const props = withDefaults(defineProps<FlowMapProps>(), {
  width: 480,
  height: 280,
  curvature: 0.22,
  showArrow: true,
  showNodes: true,
  showLabels: false,
});

const ctx = inject(MAPTILE_CONTEXT_KEY, null);
const liveViewport = computed(() => ctx?.());
const insideTile = computed(() => !!liveViewport.value);

const w = computed(() => (insideTile.value ? liveViewport.value!.viewport.width : props.width));
const h = computed(() => (insideTile.value ? liveViewport.value!.viewport.height : props.height));

const customProject = computed<((lng: number, lat: number) => { x: number; y: number }) | null>(() => {
  if (props.projection) return props.projection;
  if (liveViewport.value) return liveViewport.value.project;
  return null;
});

const extent = computed(() =>
  props.extent ??
  (props.geojson?.features?.length
    ? computeExtent(props.geojson.features)
    : pointBoundsExtent(props.points)),
);

const range = computed<[number, number]>(() => props.widthRange ?? [0.6, 3]);

const pointIndex = computed(() => {
  const m = new Map<string, { x: number; y: number; name: string }>();
  for (const p of props.points) {
    const xy = customProject.value
      ? customProject.value(p.lng, p.lat)
      : projectFit(p.lng, p.lat, extent.value, w.value, h.value);
    m.set(String(p.id), { x: xy.x, y: xy.y, name: p.name ?? String(p.id) });
  }
  return m;
});

const valueRange = computed<[number, number]>(() => {
  let min = Infinity;
  let max = -Infinity;
  for (const e of props.edges) {
    if (e.value == null || !Number.isFinite(e.value)) continue;
    if (e.value < min) min = e.value;
    if (e.value > max) max = e.value;
  }
  if (!Number.isFinite(min)) return [0, 1];
  if (min === max) return [min, min + 1];
  return [min, max];
});

const basePaths = computed(() => {
  const features = props.geojson?.features ?? [];
  if (insideTile.value) return [];
  return features.map((f, i) => {
    const geom = (f as GeoJsonFeature).geometry;
    const multi = geom.type === 'MultiPolygon';
    return {
      id: i,
      d: customProject.value
        ? polygonToProjectedPath(geom.coordinates as never, multi, customProject.value)
        : polygonToFitPath(
            geom.coordinates as never,
            multi,
            extent.value,
            w.value,
            h.value,
          ),
    };
  });
});

const arcs = computed(() => {
  const out: { id: number; d: string; width: number; label?: string }[] = [];
  const [vmin, vmax] = valueRange.value;
  for (let i = 0; i < props.edges.length; i++) {
    const e = props.edges[i];
    const a = pointIndex.value.get(String(e.from));
    const b = pointIndex.value.get(String(e.to));
    if (!a || !b) continue;
    const w = valueToWidth(e.value, vmin, vmax, range.value);
    out.push({ id: i, d: curvedArc(a.x, a.y, b.x, b.y, props.curvature), width: w, label: e.label });
  }
  return out;
});

const nodes = computed(() => {
  return Array.from(pointIndex.value.entries()).map(([id, p]) => ({ id, ...p }));
});
</script>

<template>
  <svg
    class="cf-flowmap"
    :class="insideTile ? 'cf-flowmap--layer' : 'cf-flowmap--standalone'"
    :viewBox="`0 0 ${w} ${h}`"
    :width="insideTile ? undefined : w"
    :height="insideTile ? undefined : h"
    role="img"
    aria-label="迁徙地图"
  >
    <defs>
      <marker
        v-if="showArrow"
        id="cf-flowmap-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        markerUnits="userSpaceOnUse"
        orient="auto-start-reverse"
      >
        <path class="cf-flowmap__arrow-head" d="M0,0 L10,5 L0,10 z" />
      </marker>
    </defs>
    <rect v-if="!insideTile" class="cf-flowmap__bg" x="0" y="0" :width="w" :height="h" />
    <path
      v-for="bp in basePaths"
      :key="`base-${bp.id}`"
      class="cf-flowmap__land"
      :d="bp.d"
    />
    <g class="cf-flowmap__arcs">
      <path
        v-for="a in arcs"
        :key="`arc-${a.id}`"
        class="cf-flowmap__arc"
        :d="a.d"
        :stroke-width="a.width"
        :marker-end="showArrow ? 'url(#cf-flowmap-arrow)' : undefined"
      >
        <title v-if="a.label">{{ a.label }}</title>
      </path>
    </g>
    <g v-if="showNodes" class="cf-flowmap__nodes">
      <g v-for="n in nodes" :key="`n-${n.id}`" class="cf-flowmap__node">
        <circle class="cf-flowmap__dot" :cx="n.x" :cy="n.y" r="2.6" />
        <text
          v-if="showLabels"
          class="cf-flowmap__label"
          :x="n.x + 5"
          :y="n.y - 5"
        >{{ n.name }}</text>
      </g>
    </g>
  </svg>
</template>
