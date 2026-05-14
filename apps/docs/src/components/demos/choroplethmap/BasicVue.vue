<script setup lang="ts">
import { CfChoroplethMap } from '@chufix-design/maps-vue';
import { sampleGeo } from '../_shared/sample-geo';

const data = [
  { id: 'N', name: '北区', value: 820 },
  { id: 'S', name: '南区', value: 410 },
  { id: 'E', name: '东区', value: 1200 },
  { id: 'W', name: '西区', value: 180 },
];
</script>

<template>
  <CfChoroplethMap
    :geojson="sampleGeo"
    :data="data"
    idField="id"
    nameField="name"
    colorScale="sequential"
    unit=" 万"
    :width="480"
    :height="260"
  />
</template>
