<script setup lang="ts">
import { ref } from 'vue';
import { CfCommandPalette, CfButton } from '@chufix-design/vue';
const open = ref(false);
const items = [
  { id: 'theme-dark', label: '切换到深色主题', group: '主题', shortcut: '⌘D' },
  { id: 'theme-light', label: '切换到浅色主题', group: '主题', shortcut: '⌘L' },
  { id: 'theme-warm', label: '切换到暖色暗', group: '主题' },
  { id: 'density-c', label: '舒适密度', group: '密度' },
  { id: 'density-co', label: '紧凑密度', group: '密度' },
];
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = true">不显示底部提示</CfButton>
    <CfCommandPalette
      :open="open"
      :items="items"
      hide-footer
      placeholder="hide-footer = true 节省空间"
      @update:open="(v) => open = v"
      @select="(id) => alert(`Picked: ${id}`)"
    />
  </div>
</template>
