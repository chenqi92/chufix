<script setup lang="ts">
import { CfMapMiniMap } from '@chufix-design/vue';
import { sampleGeo } from '../_shared/sample-geo';

const viewport = { north: 60, south: 20, east: 60, west: 0 };
const extent = { north: 80, south: 0, east: 120, west: -60 };
</script>

<template>
  <CfMapMiniMap
    :geojson="sampleGeo"
    :extent="extent"
    :visibleRect="viewport"
    :width="240"
    :height="140"
  />
</template>
