<script setup lang="ts">
import { ref } from 'vue';
import { CfSplitter } from '@chufix-design/vue';

const size = ref(40);
</script>

<template>
  <CfSplitter v-model="size" disabled>
    <template #start>
      <div style="padding: 16px; color: var(--fg-3);">禁用 — 无法拖拽</div>
    </template>
    <template #end>
      <div style="padding: 16px; color: var(--fg-3);">分隔条仅作展示</div>
    </template>
  </CfSplitter>
</template>
