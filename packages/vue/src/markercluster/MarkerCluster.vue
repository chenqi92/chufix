<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  clusterRadius,
  gridCluster,
  type ClusterGroup,
  type MarkerClusterProps,
  type MarkerDatum,
} from './variants';
import { MAPTILE_CONTEXT_KEY } from '../maptile/variants';
import {
  computeExtent,
  projectFit,
} from '../choroplethmap/variants';

const props = withDefaults(defineProps<MarkerClusterProps>(), {
  width: 480,
  height: 280,
  cellSize: 60,
  minClusterSize: 2,
  clustersOnly: false,
});

const emit = defineEmits<{
  (e: 'clusterClick', cluster: ClusterGroup): void;
  (e: 'markerClick', marker: MarkerDatum): void;
}>();

const ctx = inject(MAPTILE_CONTEXT_KEY, null);
const liveViewport = computed(() => ctx?.());
const insideTile = computed(() => !!liveViewport.value);

const w = computed(() => (insideTile.value ? liveViewport.value!.viewport.width : props.width));
const h = computed(() => (insideTile.value ? liveViewport.value!.viewport.height : props.height));

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

const result = computed(() =>
  gridCluster(props.data, projectFn.value, props.cellSize, props.minClusterSize),
);

function onCluster(c: ClusterGroup, e: MouseEvent) {
  e.stopPropagation();
  emit('clusterClick', c);
  props.onClusterClick?.(c);
}

function onMarker(m: MarkerDatum, e: MouseEvent) {
  e.stopPropagation();
  emit('markerClick', m);
  props.onMarkerClick?.(m);
}
</script>

<template>
  <div
    class="cf-markercluster"
    :class="insideTile ? 'cf-markercluster--layer' : 'cf-markercluster--standalone'"
    :style="insideTile ? undefined : { width: w + 'px', height: h + 'px' }"
  >
    <svg
      class="cf-markercluster__svg"
      :viewBox="`0 0 ${w} ${h}`"
      :width="insideTile ? undefined : w"
      :height="insideTile ? undefined : h"
      role="img"
      aria-label="标记聚合"
    >
      <g v-if="!clustersOnly" class="cf-markercluster__singles">
        <circle
          v-for="m in result.singles"
          :key="String(m.id)"
          class="cf-markercluster__dot"
          :cx="m.x"
          :cy="m.y"
          r="4"
          @click="(e) => onMarker(m, e)"
        >
          <title v-if="m.name">{{ m.name }}</title>
        </circle>
      </g>
      <g class="cf-markercluster__clusters">
        <g
          v-for="c in result.clusters"
          :key="c.id"
          class="cf-markercluster__cluster"
          :transform="`translate(${c.x},${c.y})`"
          @click="(e) => onCluster(c, e)"
        >
          <circle
            class="cf-markercluster__cluster-halo"
            :r="clusterRadius(c.count) + 4"
          />
          <circle
            class="cf-markercluster__cluster-bg"
            :r="clusterRadius(c.count)"
          />
          <text
            class="cf-markercluster__cluster-text"
            text-anchor="middle"
            dominant-baseline="central"
          >{{ c.count }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>
