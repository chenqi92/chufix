<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDropdown } from '@chufix-design/vue';
import type { DropdownItem } from '@chufix-design/vue';

const open = ref<boolean>(false);
const items: DropdownItem[] = [
  { key: 'duplicate', label: '复制' },
  { key: 'move',      label: '移动' },
  { key: 'delete',    label: '删除', tone: 'danger' },
];
</script>

<template>
  <div class="demo-row">
    <CfButton variant="tertiary" @click="open = !open">
      {{ open ? '从外部关闭' : '从外部打开' }}
    </CfButton>
    <CfDropdown v-model:open="open" :items="items">
      <CfButton variant="secondary">受控触发 ▾</CfButton>
    </CfDropdown>
  </div>
</template>
