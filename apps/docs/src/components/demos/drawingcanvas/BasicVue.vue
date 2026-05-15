<script setup lang="ts">
import { ref } from 'vue';
import { CfDrawingCanvas, type DrawingStroke } from '@chufix-design/vue';

const strokes = ref<DrawingStroke[]>([]);
</script>

<template>
  <div class="dc-demo">
    <CfDrawingCanvas :height="280" @change="(s) => (strokes = s)" />
    <code class="dc-demo__meta">{{ strokes.length }} 条笔画</code>
  </div>
</template>

<style scoped>
.dc-demo {
  display: grid;
  gap: 8px;
}
.dc-demo__meta {
  padding: 4px 8px;
  background: var(--bg-inset);
  border-radius: var(--r-2);
  font-size: var(--t-12);
  color: var(--fg-2);
  width: max-content;
}
</style>
