<script setup lang="ts">
import { ref } from 'vue';
import { CfNavMenu, type NavMenuItem } from '@chufix-design/vue';

const a = ref('products');
const b = ref('products');
const items: NavMenuItem[] = [
  {
    key: 'products',
    label: '产品',
    columns: 1,
    links: [
      { label: '组件库', href: '#' },
      { label: 'Tokens', href: '#' },
      { label: '图标', href: '#' },
    ],
  },
  { key: 'docs', label: '文档', href: '#' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">trigger = hover（默认）</div>
      <div style="background: var(--bg-1); padding: 8px 12px; border: 1px solid var(--line-1); border-radius: 8px;">
        <CfNavMenu :items="items" :active="a" trigger="hover" />
      </div>
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">trigger = click</div>
      <div style="background: var(--bg-1); padding: 8px 12px; border: 1px solid var(--line-1); border-radius: 8px;">
        <CfNavMenu :items="items" :active="b" trigger="click" />
      </div>
    </div>
  </div>
</template>
