<script setup lang="ts">
import { CfMapTile, CfMapLegend, CfBubbleMap } from '@chufix-design/maps-vue';

const stops = [
  { value: 200, swatch: 'oklch(from var(--accent-1) l c h / 0.18)' },
  { value: 800, swatch: 'oklch(from var(--accent-1) l c h / 0.45)' },
  { value: 1500, swatch: 'oklch(from var(--accent-1) l c h / 0.70)' },
  { value: 2500, swatch: 'oklch(from var(--accent-1) l c h / 0.95)' },
];

const cities = [
  { id: 'BJ', name: '北京', lng: 116.4, lat: 39.9, value: 2154 },
  { id: 'SH', name: '上海', lng: 121.5, lat: 31.2, value: 2487 },
  { id: 'GZ', name: '广州', lng: 113.3, lat: 23.1, value: 1530 },
  { id: 'XA', name: '西安', lng: 108.9, lat: 34.3, value: 1295 },
];
</script>

<template>
  <div class="demo-stack">
    <CfMapTile
      :center="{ lng: 112, lat: 32 }"
      :zoom="4"
      :width="720"
      :height="500"
    >
      <CfBubbleMap :data="cities" unit=" 万" />
      <CfMapLegend
        :stops="stops"
        title="人口（分级）"
        unit=" 万"
        position="top-left"
      />
      <CfMapLegend
        kind="size"
        :domain="[200, 2500]"
        title="点位大小"
        unit=" 万"
        position="bottom-right"
      />
    </CfMapTile>
  </div>
</template>

<style scoped>
.demo-stack { display: flex; gap: 16px; flex-wrap: wrap; }
</style>
