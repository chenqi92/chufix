<script setup lang="ts">
import { ref } from 'vue';
import { CfNavMenu, type NavMenuItem } from '@chufix-design/vue';

const a = ref('home');
const b = ref('home');
const c = ref('home');
const items: NavMenuItem[] = [
  { key: 'home', label: '首页', href: '#' },
  { key: 'docs', label: '文档', href: '#' },
  { key: 'about', label: '关于', href: '#' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="background: var(--bg-1); padding: 8px 12px; border: 1px solid var(--line-1); border-radius: 8px;">
        <CfNavMenu :items="items" :active="a" variant="underline" />
      </div>
    </div>
    <div>
      <div style="background: var(--bg-1); padding: 8px 12px; border: 1px solid var(--line-1); border-radius: 8px;">
        <CfNavMenu :items="items" :active="b" variant="pill" />
      </div>
    </div>
    <div>
      <div style="background: var(--bg-1); padding: 8px 12px; border: 1px solid var(--line-1); border-radius: 8px;">
        <CfNavMenu :items="items" :active="c" variant="minimal" />
      </div>
    </div>
  </div>
</template>
