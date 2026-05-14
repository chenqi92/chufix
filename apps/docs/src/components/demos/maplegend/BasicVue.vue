<script setup lang="ts">
import { CfMapLegend } from '@chufix-design/vue';

const stops = [
  { value: 100, swatch: 'oklch(from var(--accent-1) l c h / 0.18)' },
  { value: 500, swatch: 'oklch(from var(--accent-1) l c h / 0.45)' },
  { value: 1000, swatch: 'oklch(from var(--accent-1) l c h / 0.70)' },
  { value: 2000, swatch: 'oklch(from var(--accent-1) l c h / 0.95)' },
];

const gradient = [
  { offset: 0, color: 'oklch(from var(--accent-1) l c h / 0.08)' },
  { offset: 1, color: 'oklch(from var(--accent-1) l c h / 0.95)' },
];
</script>

<template>
  <div class="demo-scope">
    <CfMapLegend
      inline
      :stops="stops"
      title="人口（分级）"
      unit=" 万"
    />
    <CfMapLegend
      inline
      :gradient="gradient"
      :domain="[0, 2500]"
      title="人口（连续）"
      unit=" 万"
    />
    <CfMapLegend
      inline
      kind="size"
      :domain="[100, 2000]"
      title="点位大小"
      unit=" 万"
    />
  </div>
</template>

<style scoped>
.demo-scope { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
