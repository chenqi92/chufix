<script setup lang="ts">
import { CfMarkerCluster } from '@chufix-design/vue';
import { sampleGeo } from '../_shared/sample-geo';

// Sprinkle 200 markers across the sample world.
const data = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  lng: -50 + Math.random() * 160,
  lat: 5 + Math.random() * 70,
}));

function onClusterClick(c: { count: number }) {
  console.log('cluster', c.count);
}
</script>

<template>
  <CfMarkerCluster
    :data="data"
    :geojson="sampleGeo"
    :cellSize="50"
    :width="480"
    :height="280"
    @clusterClick="onClusterClick"
  />
</template>
