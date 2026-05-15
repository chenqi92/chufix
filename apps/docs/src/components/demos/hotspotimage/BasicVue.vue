<script setup lang="ts">
import { ref } from 'vue';
import { CfHotspotImage, type HotspotItem } from '@chufix-design/vue';

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">' +
  '<rect width="100%" height="100%" fill="#26272a"/>' +
  '<rect x="80" y="80" width="180" height="180" fill="#404048" stroke="#656571" stroke-width="2" rx="8"/>' +
  '<rect x="300" y="150" width="220" height="50" fill="#404048" stroke="#656571" stroke-width="2" rx="4"/>' +
  '<circle cx="450" cy="80" r="48" fill="#404048" stroke="#656571" stroke-width="2"/>' +
  '</svg>';
const imgSrc = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const hotspots: HotspotItem[] = [
  {
    id: 'cpu',
    shape: 'rect',
    rect: { x: 0.13, y: 0.22, w: 0.3, h: 0.5 },
    label: 'CPU 区',
    tone: 'success',
  },
  {
    id: 'pcie',
    shape: 'rect',
    rect: { x: 0.5, y: 0.42, w: 0.36, h: 0.14 },
    label: 'PCIe 插槽',
    tone: 'info',
  },
  {
    id: 'fan',
    shape: 'circle',
    circle: { cx: 0.75, cy: 0.22, r: 0.08 },
    label: '机箱风扇',
    tone: 'warning',
  },
];

const last = ref('点击区域查看坐标');

function onClick(h: HotspotItem) {
  last.value = `clicked: ${h.id} (${h.label ?? '-'})`;
}
</script>

<template>
  <div class="hs-demo">
    <CfHotspotImage
      :src="imgSrc"
      alt="hardware"
      :hotspots="hotspots"
      show-outlines
      @hotspot-click="onClick"
    />
    <code class="hs-demo__meta">{{ last }}</code>
  </div>
</template>

<style scoped>
.hs-demo {
  display: grid;
  gap: 8px;
}
.hs-demo__meta {
  padding: 4px 8px;
  background: var(--bg-inset);
  border-radius: var(--r-2);
  font-size: var(--t-12);
  color: var(--fg-2);
}
</style>
