<script setup lang="ts">
import { CfMapTile, CfBubbleMap, CfMapLegend } from '@chufix-design/maps-vue';

const cities = [
  { id: 'BJ', name: '北京', lng: 116.4, lat: 39.9, value: 2154 },
  { id: 'SH', name: '上海', lng: 121.5, lat: 31.2, value: 2487 },
  { id: 'GZ', name: '广州', lng: 113.3, lat: 23.1, value: 1530 },
  { id: 'CD', name: '成都', lng: 104.1, lat: 30.7, value: 1644 },
  { id: 'WH', name: '武汉', lng: 114.3, lat: 30.6, value: 1232 },
  { id: 'XA', name: '西安', lng: 108.9, lat: 34.3, value: 1295 },
  { id: 'KM', name: '昆明', lng: 102.7, lat: 25.0, value: 685 },
  { id: 'HZ', name: '杭州', lng: 120.2, lat: 30.3, value: 1237 },
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
      :domain="[600, 2500]"
      title="人口"
      unit=" 万"
      position="top-left"
    />
  </CfMapTile>
</template>
