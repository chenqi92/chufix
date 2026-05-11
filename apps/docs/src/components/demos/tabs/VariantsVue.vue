<script setup lang="ts">
import { ref } from 'vue';
import { CfTabs } from '@chufix-design/vue';

const a = ref('one');
const b = ref('one');
const c = ref('one');
const items = [
  { value: 'one', label: '一' },
  { value: 'two', label: '二' },
  { value: 'three', label: '三' },
];
</script>

<template>
  <div class="demo-stack">
    <CfTabs v-model="a" :items="items" variant="line" />
    <CfTabs v-model="b" :items="items" variant="segmented" />
    <CfTabs v-model="c" :items="items" variant="pill" />
  </div>
</template>
