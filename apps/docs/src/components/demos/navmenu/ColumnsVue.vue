<script setup lang="ts">
import { CfNavMenu, type NavMenuItem } from '@chufix-design/vue';

const sharedLinks = [
  { label: '组件库', description: 'Vue 3 与 React 双框架同源', href: '#' },
  { label: 'Tokens', description: 'OKLCH 设计变量与三套主题', href: '#' },
  { label: '图标', description: '16x16 sprite', href: '#' },
  { label: 'CLI', description: 'npx chufix add', href: '#' },
  { label: '模板', description: '完整页面级骨架', href: '#' },
  { label: '示例', description: '可复制片段', href: '#' },
];

const items: NavMenuItem[] = [
  { key: 'one', label: 'columns=1', columns: 1, links: sharedLinks.slice(0, 3) },
  { key: 'two', label: 'columns=2', columns: 2, links: sharedLinks },
  { key: 'three', label: 'columns=3', columns: 3, links: sharedLinks },
];
</script>

<template>
  <CfNavMenu :items="items" active="two" trigger="click" />
  <p class="adm-hint">
    点击每个菜单项查看不同 <code>columns</code> 配置下的面板布局。
  </p>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-top: 12px; }
code { font-family: var(--font-mono); color: var(--fg-2); }
</style>
