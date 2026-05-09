<script setup lang="ts">
import { ref } from 'vue';
import { CfSegmentedControl } from '@chufix/vue';

const a = ref('day');
const b = ref('day');
const c = ref('day');

const items = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
];
</script>

<template>
  <div class="demo-stack" style="align-items: flex-start;">
    <CfSegmentedControl v-model="a" :items="items" size="sm" />
    <CfSegmentedControl v-model="b" :items="items" size="md" />
    <CfSegmentedControl v-model="c" :items="items" size="lg" />
  </div>
</template>
