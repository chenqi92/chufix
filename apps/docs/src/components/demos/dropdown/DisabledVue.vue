<script setup lang="ts">
import { CfButton, CfDropdown } from '@chufix-design/vue';
import type { DropdownItem } from '@chufix-design/vue';

const items: DropdownItem[] = [
  { key: 'one',   label: '选项一' },
  { key: 'two',   label: '选项二' },
  { key: 'three', label: '选项三' },
];
</script>

<template>
  <div class="demo-row">
    <CfDropdown :items="items">
      <CfButton variant="secondary">正常 ▾</CfButton>
    </CfDropdown>
    <CfDropdown :items="items" disabled>
      <CfButton variant="secondary" disabled>禁用 ▾</CfButton>
    </CfDropdown>
  </div>
</template>
