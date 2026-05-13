<script setup lang="ts">
import { CfNavMenu, type NavMenuItem } from '@chufix-design/vue';

const ICONS = {
  cube: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1l6 3.5v7L8 15l-6-3.5v-7z"/><path d="M2 4.5L8 8l6-3.5M8 8v7"/></svg>',
  palette: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5c-3.6 0-6.5 2.6-6.5 5.9 0 2 1.9 3 3.4 3 .8 0 1.4.5 1.4 1.4 0 .5-.2.9-.2 1.4 0 .8.7 1.4 1.9 1.4 3.6 0 6.5-2.6 6.5-5.9 0-3.6-2.9-7.2-6.5-7.2z"/><circle cx="4.5" cy="6" r="0.8" fill="currentColor"/><circle cx="6.5" cy="3.8" r="0.8" fill="currentColor"/><circle cx="10" cy="3.8" r="0.8" fill="currentColor"/><circle cx="12" cy="6.5" r="0.8" fill="currentColor"/></svg>',
  terminal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="3" width="13" height="10" rx="1"/><path d="M4 7l2 2-2 2M7.5 11h4"/></svg>',
  book: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3v10s2-1 6-1 6 1 6 1V3s-2-1-6-1-6 1-6 1z"/><path d="M8 2v11"/></svg>',
};

const items: NavMenuItem[] = [
  {
    key: 'resources',
    label: '资源',
    columns: 2,
    links: [
      { label: '组件库', description: 'Vue 3 与 React 同源', href: '#', icon: ICONS.cube },
      { label: 'Tokens',  description: 'OKLCH 三套主题',     href: '#', icon: ICONS.palette },
      { label: 'CLI',     description: 'npx chufix add',     href: '#', icon: ICONS.terminal },
      { label: '文档',     description: '完整指南与示例',     href: '#', icon: ICONS.book },
    ],
  },
];
</script>

<template>
  <CfNavMenu :items="items" active="resources" trigger="click" />
  <p class="adm-hint">
    <code>link.icon</code> 接收原始 SVG 字符串（通过 <code>v-html</code> 注入）。
    SVG 用 <code>currentColor</code> 描边会自动跟随面板文字色。
  </p>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-top: 12px; line-height: 1.6; }
code { font-family: var(--font-mono); color: var(--fg-2); }
</style>
