<script setup lang="ts">
import { computed } from 'vue';
import {
  polygonToPath,
  projectToBox,
  WORLD_BOUNDS,
  type GeoJsonFeature,
  type MapMiniMapProps,
} from './variants';

const props = withDefaults(defineProps<MapMiniMapProps>(), {
  width: 160,
  height: 90,
});

const extent = computed(() => props.extent ?? WORLD_BOUNDS);

const paths = computed(() => {
  const features = props.geojson?.features ?? [];
  return features.map((f, i) => {
    const geom = (f as GeoJsonFeature).geometry;
    const multi = geom.type === 'MultiPolygon';
    return { id: i, d: polygonToPath(geom.coordinates as never, multi, extent.value, props.width, props.height) };
  });
});

const rect = computed(() => {
  if (!props.visibleRect) return null;
  const tl = projectToBox(props.visibleRect.west, props.visibleRect.north, extent.value, props.width, props.height);
  const br = projectToBox(props.visibleRect.east, props.visibleRect.south, extent.value, props.width, props.height);
  return {
    x: Math.min(tl.x, br.x),
    y: Math.min(tl.y, br.y),
    width: Math.abs(br.x - tl.x),
    height: Math.abs(br.y - tl.y),
  };
});
</script>

<template>
  <svg
    class="cf-mapminimap"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    aria-label="缩略地图"
  >
    <rect class="cf-mapminimap__bg" x="0" y="0" :width="width" :height="height" />
    <path
      v-for="p in paths"
      :key="p.id"
      class="cf-mapminimap__land"
      :d="p.d"
    />
    <rect
      v-if="rect"
      class="cf-mapminimap__viewport"
      :x="rect.x"
      :y="rect.y"
      :width="rect.width"
      :height="rect.height"
    />
  </svg>
</template>
