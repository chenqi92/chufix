<script setup lang="ts">
import { CfToc, type TocItem } from '@chufix/vue';

const items: TocItem[] = [
  { id: 'intro', label: '介绍', depth: 1 },
  { id: 'install', label: '安装', depth: 1 },
  { id: 'install-vue', label: 'Vue 3', depth: 2 },
  { id: 'install-react', label: 'React 18', depth: 2 },
  { id: 'install-vanilla', label: '纯 HTML', depth: 2 },
  { id: 'usage', label: '基本用法', depth: 1 },
  { id: 'theme', label: '主题与 Tokens', depth: 1 },
  { id: 'theme-dark', label: 'dark-cool', depth: 2 },
  { id: 'theme-warm', label: 'dark-warm', depth: 2 },
  { id: 'theme-detail', label: '颜色细节', depth: 3 },
];
</script>

<template>
  <div style="max-width: 220px;">
    <CfToc :items="items" :active-id="'install-vue'" title="本页目录" />
  </div>
</template>
