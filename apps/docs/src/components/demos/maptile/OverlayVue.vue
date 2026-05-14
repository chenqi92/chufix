<script setup lang="ts">
import { CfMapTile, CfBubbleMap, CfMapLegend, CfMapScale } from '@chufix-design/vue';

const cities = [
  { id: 'BJ', name: '北京', lng: 116.4, lat: 39.9, value: 2154 },
  { id: 'SH', name: '上海', lng: 121.5, lat: 31.2, value: 2487 },
  { id: 'GZ', name: '广州', lng: 113.3, lat: 23.1, value: 1530 },
  { id: 'CD', name: '成都', lng: 104.1, lat: 30.7, value: 1644 },
  { id: 'WH', name: '武汉', lng: 114.3, lat: 30.6, value: 1232 },
  { id: 'XA', name: '西安', lng: 108.9, lat: 34.3, value: 1295 },
];
</script>

<template>
  <CfMapTile
    :center="{ lng: 112, lat: 32 }"
    :zoom="4"
    :width="560"
    :height="340"
  >
    <CfBubbleMap :data="cities" unit=" 万" />
    <CfMapLegend
      kind="size"
      :domain="[1000, 2500]"
      title="人口"
      unit=" 万"
      position="top-left"
    />
    <CfMapScale position="bottom-left" />
  </CfMapTile>
</template>
