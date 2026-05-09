<script setup lang="ts">
import { CfMenuBar } from '@chufix/vue';
const menus = [
  {
    id: 'file', label: 'File',
    items: [
      { id: 'new', label: '新建', shortcut: '⌘N' },
      { id: 'open', label: '打开…', shortcut: '⌘O' },
      { separator: true },
      { id: 'save', label: '保存', shortcut: '⌘S' },
      { id: 'saveas', label: '另存为…', shortcut: '⌘⇧S' },
    ],
  },
  {
    id: 'edit', label: 'Edit',
    items: [
      { id: 'undo', label: '撤销', shortcut: '⌘Z' },
      { id: 'redo', label: '重做', shortcut: '⌘⇧Z' },
      { separator: true },
      { id: 'cut', label: '剪切', shortcut: '⌘X' },
      { id: 'copy', label: '复制', shortcut: '⌘C' },
      { id: 'paste', label: '粘贴', shortcut: '⌘V' },
    ],
  },
  {
    id: 'view', label: 'View',
    items: [
      { id: 'sidebar', label: '切换侧边栏', shortcut: '⌘B' },
      { id: 'palette', label: '命令面板…', shortcut: '⌘K' },
    ],
  },
];
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: visible;">
    <CfMenuBar :menus="menus" @select="(menuId, itemId) => alert(`${menuId} → ${itemId}`)" />
  </div>
</template>
