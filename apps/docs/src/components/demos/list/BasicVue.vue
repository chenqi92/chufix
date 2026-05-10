<script setup lang="ts">
import { ref } from 'vue';
import { CfList, type ListItem } from '@chufix-design/vue';

const value = ref<string | string[] | null>('alice');
const items: ListItem[] = [
  { key: 'alice', label: 'Alice Chen', description: '前端工程师 · 上海' },
  { key: 'bob', label: 'Bob Wang', description: '后端工程师 · 北京' },
  { key: 'carol', label: 'Carol Liu', description: '设计师 · 深圳', disabled: true },
  { key: 'dave', label: 'Dave Zhang', description: '产品经理 · 杭州' },
];
</script>

<template>
  <CfList
    v-model="value"
    selectable="single"
    :items="items"
  />
</template>
