<script setup lang="ts">
import { CfContextMenu } from '@chufix/vue';
const items = [
  { label: '复制', value: 'copy', shortcut: '⌘C' },
  { label: '剪切', value: 'cut', shortcut: '⌘X' },
  { label: '粘贴', value: 'paste', shortcut: '⌘V' },
  { separator: true },
  { label: '查看属性', value: 'props' },
  { separator: true },
  { label: '删除', value: 'delete', shortcut: '⌫', danger: true },
];
</script>

<template>
  <CfContextMenu :items="items" @select="(v) => alert(`Selected: ${v}`)">
    <div style="padding: 24px; border: 1px dashed var(--line-2); border-radius: var(--r-6); text-align: center; color: var(--fg-2);">
      在这里点击右键 →
    </div>
  </CfContextMenu>
</template>
