<script setup lang="ts">
import { ref } from 'vue';
import { CfTabBar, type TabBarItem } from '@chufix-design/vue';

const active = ref('home');
const items: TabBarItem[] = [
  { key: 'home',     label: '首页', iconPath: 'M12 3l9 8h-3v10h-4v-6h-4v6H6V11H3z' },
  { key: 'discover', label: '发现', iconPath: 'M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5L14 13l-4.5 1.5L11 10z' },
  { key: 'inbox',    label: '消息', iconPath: 'M4 4h16v12H7l-3 3V4z', badge: 3 },
  { key: 'me',       label: '我的', iconPath: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H5z' },
];
</script>

<template>
  <div class="demo-scope">
    <CfTabBar v-model="active" :items="items" :fixed="false" />
    <p class="demo-hint">当前：<code>{{ active }}</code> — 真实使用时设 <code>fixed</code> 为 true 贴底，并启用 <code>safeArea</code>。</p>
  </div>
</template>

<style scoped>
.demo-scope { background: var(--bg-1); border-radius: var(--r-6); overflow: hidden; }
.demo-hint { padding: 12px 16px; margin: 0; color: var(--fg-3); }
</style>
