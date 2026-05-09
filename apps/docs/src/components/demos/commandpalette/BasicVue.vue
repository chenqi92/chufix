<script setup lang="ts">
import { ref } from 'vue';
import { CfCommandPalette, CfButton } from '@chufix/vue';
const open = ref(false);
const items = [
  { id: 'new', label: 'New File', group: 'Commands', shortcut: '⌘N' },
  { id: 'open', label: 'Open File…', group: 'Commands', shortcut: '⌘O' },
  { id: 'save', label: 'Save', group: 'Commands', shortcut: '⌘S' },
  { id: 'find', label: 'Find in Files', group: 'Commands', shortcut: '⌘⇧F' },
  { id: 'theme', label: '切换主题', group: 'Settings' },
  { id: 'density', label: '切换密度', group: 'Settings' },
  { id: 'orders', label: '/v1/orders', group: 'Requests', description: 'GET' },
  { id: 'login', label: '/v1/login', group: 'Requests', description: 'POST' },
];
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = true">⌘K 打开</CfButton>
    <CfCommandPalette
      :open="open"
      :items="items"
      @update:open="(v) => open = v"
      @select="(id) => alert(`Picked: ${id}`)"
    />
  </div>
</template>
