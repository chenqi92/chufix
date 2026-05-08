<script setup lang="ts">
import { CfButton, CfDropdown } from '@chufix/vue';
import type { DropdownItem } from '@chufix/vue';

const items: DropdownItem[] = [
  { key: 'profile', label: '个人资料' },
  { key: 'settings', label: '设置' },
  { divider: true, label: '' },
  { header: true, label: '操作' },
  { key: 'rename', label: '重命名' },
  { key: 'archive', label: '归档', disabled: true },
  { key: 'delete', label: '删除', tone: 'danger' },
];

function onSelect(item: DropdownItem) {
  console.log('selected:', item.key);
}
</script>

<template>
  <CfDropdown :items="items" placement="bottom" @select="onSelect">
    <CfButton variant="secondary">操作菜单 ▾</CfButton>
  </CfDropdown>
</template>
