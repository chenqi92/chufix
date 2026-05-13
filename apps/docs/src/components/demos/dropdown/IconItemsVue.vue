<script setup lang="ts">
import { CfButton, CfDropdown } from '@chufix-design/vue';
import type { DropdownItem } from '@chufix-design/vue';

const items: DropdownItem[] = [
  { key: 'edit',     label: '编辑',     icon: '✏️' },
  { key: 'copy',     label: '复制',     icon: '📄' },
  { key: 'download', label: '下载',     icon: '⬇️' },
  { divider: true, label: '' },
  { key: 'delete',   label: '删除',     icon: '🗑', tone: 'danger' },
];
</script>

<template>
  <CfDropdown :items="items">
    <CfButton variant="secondary">带图标的菜单 ▾</CfButton>
  </CfDropdown>
</template>
