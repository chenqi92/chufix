<script setup lang="ts">
import { CfWordCloud, type WordCloudItem } from '@chufix-design/vue';

const items: WordCloudItem[] = [
  { text: 'Vue 3', weight: 100 },
  { text: 'TypeScript', weight: 96 },
  { text: 'React', weight: 92 },
  { text: 'OKLCH', weight: 88 },
  { text: 'a11y', weight: 70 },
  { text: 'tokens', weight: 64 },
  { text: 'SVG', weight: 62 },
  { text: 'monorepo', weight: 56 },
  { text: 'pnpm', weight: 48 },
  { text: 'Astro', weight: 44 },
  { text: 'modal', weight: 40 },
  { text: 'drawer', weight: 38 },
  { text: 'form', weight: 36 },
  { text: 'select', weight: 34 },
  { text: '组件', weight: 30 },
  { text: 'gantt', weight: 26 },
  { text: 'pivot', weight: 24 },
  { text: '设计系统', weight: 22 },
  { text: 'spreadsheet', weight: 20 },
  { text: 'sparkline', weight: 18 },
  { text: 'venn', weight: 16 },
  { text: 'tornado', weight: 14 },
  { text: 'parallel', weight: 12 },
];
</script>

<template>
  <CfWordCloud :items="items" :width="520" :height="280" />
</template>
