<script setup lang="ts">
import { ref } from 'vue';
import { CfNavMenu, type NavMenuItem } from '@chufix/vue';

const active = ref('products');
const items: NavMenuItem[] = [
  {
    key: 'products',
    label: '产品',
    columns: 2,
    links: [
      { label: '组件库', description: 'Vue 3 与 React 双框架同源', href: '#' },
      { label: 'Tokens', description: 'OKLCH 设计变量与三套主题', href: '#' },
      { label: '图标', description: '16x16 sprite，CSS currentColor', href: '#' },
      { label: 'CLI', description: 'npx chufix add 拷贝源码到自己仓库', href: '#' },
    ],
  },
  {
    key: 'docs',
    label: '文档',
    columns: 1,
    links: [
      { label: '快速开始', href: '#' },
      { label: '主题', href: '#' },
      { label: '组件清单', href: '#' },
    ],
  },
  { key: 'pricing', label: '价格', href: '#' },
  { key: 'about', label: '关于', href: '#' },
];
</script>

<template>
  <div style="background: var(--bg-1); padding: 8px 12px; border: 1px solid var(--line-1); border-radius: 8px;">
    <CfNavMenu :items="items" :active="active" />
  </div>
</template>
