<script setup lang="ts">
import { CfBubbleMap } from '@chufix-design/vue';
import { sampleGeo } from '../_shared/sample-geo';

const data = [
  { id: 'a', name: '点位 A', lng: 30, lat: 60, value: 200 },
  { id: 'b', name: '点位 B', lng: 90, lat: 40, value: 800 },
  { id: 'c', name: '点位 C', lng: 30, lat: 20, value: 350 },
  { id: 'd', name: '点位 D', lng: -30, lat: 40, value: 120 },
  { id: 'e', name: '点位 E', lng: 60, lat: 50, value: 1500 },
];
</script>

<template>
  <CfBubbleMap
    :data="data"
    :geojson="sampleGeo"
    unit=" 万"
    :width="480"
    :height="280"
  />
</template>
