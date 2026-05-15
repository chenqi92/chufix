<script setup lang="ts">
import { CfMapTile, CfMarkerCluster } from '@chufix-design/maps-vue';

// Random markers across China.
const data = Array.from({ length: 300 }, (_, i) => ({
  id: i,
  name: `点位 ${i}`,
  lng: 80 + Math.random() * 50,
  lat: 18 + Math.random() * 32,
}));

function onClusterClick(c: { count: number }) {
  console.log('cluster', c.count);
}
</script>

<template>
  <CfMapTile
    :center="{ lng: 105, lat: 35 }"
    :zoom="3"
    :width="720"
    :height="520"
  >
    <CfMarkerCluster
      :data="data"
      :cellSize="60"
      @clusterClick="onClusterClick"
    />
  </CfMapTile>
</template>
