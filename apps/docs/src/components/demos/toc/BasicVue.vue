<script setup lang="ts">
import { CfToc, type TocItem } from '@chufix-design/vue';

const items: TocItem[] = [
  { id: 'intro', label: '介绍', depth: 1 },
  { id: 'install', label: '安装', depth: 1 },
  { id: 'usage', label: '基本用法', depth: 1 },
  { id: 'theme', label: '主题', depth: 1 },
];
</script>

<template>
  <div style="max-width: 220px;">
    <CfToc :items="items" :active-id="'install'" title="本页目录" />
  </div>
</template>
