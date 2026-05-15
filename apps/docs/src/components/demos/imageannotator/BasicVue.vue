<script setup lang="ts">
import { ref } from 'vue';
import { CfImageAnnotator, type ImageAnnotation } from '@chufix-design/vue';

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">' +
  '<rect width="100%" height="100%" fill="#26272a"/>' +
  '<rect x="80" y="80" width="180" height="180" fill="#404048" stroke="#656571" stroke-width="2" rx="8"/>' +
  '<rect x="300" y="150" width="220" height="50" fill="#404048" stroke="#656571" stroke-width="2" rx="4"/>' +
  '<text x="170" y="350" fill="#99999f" font-family="sans-serif" font-size="14" text-anchor="middle">主板示意图（点击空白添加，拖动钉点）</text>' +
  '</svg>';
const imgSrc = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const annotations = ref<ImageAnnotation[]>([
  { id: 'cpu', x: 0.22, y: 0.34, label: 'CPU 散热片', tone: 'success' },
  { id: 'mem', x: 0.55, y: 0.48, label: '内存条', tone: 'info' },
]);
const selectedId = ref<string | undefined>('cpu');
</script>

<template>
  <div class="ia-demo">
    <CfImageAnnotator
      :src="imgSrc"
      alt="主板示意"
      :annotations="annotations"
      :selected-id="selectedId"
      @update:annotations="annotations = $event"
      @select="(id) => (selectedId = id)"
    />
    <code class="ia-demo__meta">
      {{ annotations.length }} 个标记 · selected = {{ selectedId ?? '-' }}
    </code>
  </div>
</template>

<style scoped>
.ia-demo {
  display: grid;
  gap: 8px;
}
.ia-demo__meta {
  padding: 4px 8px;
  background: var(--bg-inset);
  border-radius: var(--r-2);
  font-size: var(--t-12);
  color: var(--fg-2);
}
</style>
