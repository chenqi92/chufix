<script setup lang="ts">
import { CfMapTile, CfHeatMap } from '@chufix-design/maps-vue';

// ~ 600 random weighted points clustered around 4 Chinese megacities.
const centers = [
  { lng: 116.4, lat: 39.9 }, // Beijing
  { lng: 121.5, lat: 31.2 }, // Shanghai
  { lng: 113.3, lat: 23.1 }, // Guangzhou
  { lng: 104.1, lat: 30.7 }, // Chengdu
];
const data: { lng: number; lat: number; weight?: number }[] = [];
for (const c of centers) {
  for (let i = 0; i < 150; i++) {
    data.push({
      lng: c.lng + (Math.random() - 0.5) * 6,
      lat: c.lat + (Math.random() - 0.5) * 4,
      weight: 0.3 + Math.random() * 0.7,
    });
  }
}
</script>

<template>
  <CfMapTile
    :center="{ lng: 112, lat: 32 }"
    :zoom="4"
    :width="560"
    :height="340"
  >
    <CfHeatMap :data="data" :radius="22" :opacity="0.75" />
  </CfMapTile>
</template>
