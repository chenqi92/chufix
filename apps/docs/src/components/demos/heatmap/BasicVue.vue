<script setup lang="ts">
import { CfHeatMap } from '@chufix-design/vue';
import { sampleGeo } from '../_shared/sample-geo';

// Generate ~ 400 weighted random points clustered around 3 centers.
const centers = [
  { lng: 40, lat: 55 },
  { lng: 85, lat: 35 },
  { lng: -20, lat: 30 },
];
const data: { lng: number; lat: number; weight?: number }[] = [];
for (const c of centers) {
  for (let i = 0; i < 130; i++) {
    data.push({
      lng: c.lng + (Math.random() - 0.5) * 30,
      lat: c.lat + (Math.random() - 0.5) * 20,
      weight: 0.4 + Math.random() * 0.6,
    });
  }
}
</script>

<template>
  <CfHeatMap
    :data="data"
    :geojson="sampleGeo"
    :radius="28"
    :width="480"
    :height="280"
  />
</template>
