<script setup lang="ts">
import { CfContextMenu } from '@chufix/vue';
const items = [
  { label: '新建文件', value: 'newfile', shortcut: '⌘N' },
  { label: '新建文件夹', value: 'newdir', shortcut: '⌘⇧N' },
  { separator: true },
  { label: '导入...', value: 'import' },
  { label: '导出 OpenAPI', value: 'export', disabled: true },
  { separator: true },
  { label: '永久删除', value: 'delete', shortcut: '⌫', danger: true },
];
</script>

<template>
  <CfContextMenu :items="items" @select="(v) => alert(`Selected: ${v}`)">
    <div style="padding: 36px; border: 1px dashed var(--line-2); border-radius: var(--r-6); text-align: center; color: var(--fg-2); background: var(--bg-1);">
      右键 → 查看完整菜单（含 disabled / danger / separator）
    </div>
  </CfContextMenu>
</template>
