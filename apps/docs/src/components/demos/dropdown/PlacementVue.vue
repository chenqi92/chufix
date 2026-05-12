<script setup lang="ts">
import { CfButton, CfDropdown } from '@chufix-design/vue';
import type { DropdownItem } from '@chufix-design/vue';

const items: DropdownItem[] = [
  { key: 'rename',  label: '重命名' },
  { key: 'archive', label: '归档' },
  { divider: true, label: '' },
  { key: 'delete',  label: '删除', tone: 'danger' },
];
</script>

<template>
  <div class="adm-grid">
    <CfDropdown :items="items" placement="top">
      <CfButton variant="secondary">placement = top</CfButton>
    </CfDropdown>
    <CfDropdown :items="items" placement="bottom">
      <CfButton variant="secondary">placement = bottom</CfButton>
    </CfDropdown>
    <CfDropdown :items="items" placement="left">
      <CfButton variant="secondary">placement = left</CfButton>
    </CfDropdown>
    <CfDropdown :items="items" placement="right">
      <CfButton variant="secondary">placement = right</CfButton>
    </CfDropdown>
  </div>
</template>

<style scoped>
.adm-grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 16px;
  padding: 40px 0;
  justify-content: center;
}
</style>
