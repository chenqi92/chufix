<script setup lang="ts">
import { CfMapTile, CfChoroplethMap } from '@chufix-design/maps-vue';
import { sampleGeoChina } from '../_shared/sample-geo';

const data = [
  { id: 'huabei', name: '华北', value: 820 },
  { id: 'huadong', name: '华东', value: 1480 },
  { id: 'huanan', name: '华南', value: 1120 },
  { id: 'xibu', name: '西部', value: 540 },
  { id: 'dongbei', name: '东北', value: 380 },
];
</script>

<template>
  <CfMapTile
    :center="{ lng: 110, lat: 33 }"
    :zoom="3"
    :width="720"
    :height="520"
  >
    <CfChoroplethMap
      :geojson="sampleGeoChina"
      :data="data"
      idField="id"
      nameField="name"
      colorScale="sequential"
      unit=" 万"
    />
  </CfMapTile>
</template>
