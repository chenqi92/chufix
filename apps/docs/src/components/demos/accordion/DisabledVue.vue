<script setup lang="ts">
import { CfAccordion } from '@chufix/vue';

const items = [
  { value: 'a', title: '可点击的项', content: '正常展开 / 折叠。' },
  { value: 'b', title: '禁用项 — 点不动', content: '此项被锁定。', disabled: true },
  { value: 'c', title: '可点击的项', content: '正常展开 / 折叠。' },
];
</script>

<template>
  <div style="width: 100%; max-width: 36rem;">
    <CfAccordion :items="items" variant="bordered" :default-open="'a'" />
  </div>
</template>
