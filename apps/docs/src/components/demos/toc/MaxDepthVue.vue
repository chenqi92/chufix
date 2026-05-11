<script setup lang="ts">
import { CfToc, type TocItem } from '@chufix-design/vue';

const items: TocItem[] = [
  { id: 'a', label: '一级标题', depth: 1 },
  { id: 'a1', label: '二级标题', depth: 2 },
  { id: 'a1a', label: '三级 — 仅 maxDepth=3 显示', depth: 3 },
  { id: 'a1ai', label: '四级 — 仅 maxDepth>=4 显示', depth: 4 },
];
</script>

<template>
  <div style="display: flex; gap: 16px;">
    <div style="max-width: 200px;">
      <CfToc :items="items" :max-depth="2" />
    </div>
    <div style="max-width: 240px;">
      <CfToc :items="items" :max-depth="4" />
    </div>
  </div>
</template>
