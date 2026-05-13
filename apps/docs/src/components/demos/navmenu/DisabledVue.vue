<script setup lang="ts">
import { CfNavMenu, type NavMenuItem } from '@chufix-design/vue';

const items: NavMenuItem[] = [
  { key: 'home', label: '首页', href: '#' },
  {
    key: 'products',
    label: '产品',
    links: [
      { label: '组件库', href: '#' },
      { label: 'CLI', href: '#' },
    ],
  },
  { key: 'pricing', label: '价格', href: '#', disabled: true },
  { key: 'beta', label: 'Beta（即将上线）', href: '#', disabled: true },
];
</script>

<template>
  <CfNavMenu :items="items" active="home" />
  <p class="adm-hint">
    给 <code>item.disabled = true</code> 的项不响应 hover / click，
    同时获得灰显样式与 <code>aria-disabled</code>。
  </p>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-top: 12px; line-height: 1.6; }
code { font-family: var(--font-mono); color: var(--fg-2); }
</style>
