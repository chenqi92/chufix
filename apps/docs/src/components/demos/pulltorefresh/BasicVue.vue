<script setup lang="ts">
import { ref } from 'vue';
import { CfPullToRefresh } from '@chufix-design/vue';

const items = ref(Array.from({ length: 8 }, (_, i) => `条目 #${i + 1}`));

async function onRefresh() {
  await new Promise((r) => setTimeout(r, 1000));
  const stamp = Date.now();
  items.value = Array.from({ length: 8 }, (_, i) => `刷新 ${stamp.toString().slice(-4)} #${i + 1}`);
}
</script>

<template>
  <CfPullToRefresh class="demo-scroller" :threshold="64" @refresh="onRefresh">
    <ul class="demo-list">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </CfPullToRefresh>
</template>

<style scoped>
.demo-scroller { height: 260px; border: 1px solid var(--line-1); border-radius: var(--r-4); }
.demo-list { list-style: none; margin: 0; padding: 0; }
.demo-list li { padding: 14px 16px; border-bottom: 1px solid var(--line-1); color: var(--fg-1); }
</style>
