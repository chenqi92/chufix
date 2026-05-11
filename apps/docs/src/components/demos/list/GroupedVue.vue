<script setup lang="ts">
import { ref } from 'vue';
import { CfList, type ListItem } from '@chufix-design/vue';

const value = ref<string[]>(['alice', 'eve']);
const items: ListItem[] = [
  { key: 'alice', label: 'Alice', group: '工程' },
  { key: 'bob', label: 'Bob', group: '工程' },
  { key: 'carol', label: 'Carol', group: '设计' },
  { key: 'dave', label: 'Dave', group: '设计' },
  { key: 'eve', label: 'Eve', group: '产品' },
];
</script>

<template>
  <CfList
    v-model="value"
    selectable="multiple"
    :items="items"
    variant="default"
  />
</template>
