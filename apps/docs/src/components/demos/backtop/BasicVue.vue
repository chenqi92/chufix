<script setup lang="ts">
import { CfBackTop } from '@chufix-design/vue';
</script>

<template>
  <div style="height: 600px; overflow-y: auto; border: 1px solid var(--line-1); border-radius: 8px; padding: 12px; position: relative;">
    <p v-for="i in 24" :key="i">第 {{ i }} 段 — 滚动到底部，右下角会出现返回顶部按钮。</p>
    <CfBackTop target=".demo-scroll-root" :visibility-height="120" />
  </div>
</template>
