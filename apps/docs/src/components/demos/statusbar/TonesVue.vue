<script setup lang="ts">
import { CfStatusBar } from '@chufix-design/vue';
const tones = ['default', 'accent', 'success', 'warning', 'error', 'info'] as const;
const items = [
  { id: '1', label: '⎇ main' },
  { id: '2', label: 'TypeScript' },
  { id: '3', label: 'UTF-8' },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px;">
    <div v-for="t in tones" :key="t" style="border: 1px solid var(--line-1); border-radius: var(--r-4); overflow: hidden;">
      <CfStatusBar :tone="t" :left-items="items" :right-items="[{ id: '0', label: t }]" />
    </div>
  </div>
</template>
