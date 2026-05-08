<script setup lang="ts">
import { ref } from 'vue';
import { Tabs } from '@chufix/vue';

const sm = ref('one');
const md = ref('one');
const lg = ref('one');
const items = [
  { value: 'one', label: 'Tab 1' },
  { value: 'two', label: 'Tab 2' },
  { value: 'three', label: 'Tab 3' },
];
</script>

<template>
  <div class="demo-stack">
    <Tabs v-model="sm" :items="items" size="sm" />
    <Tabs v-model="md" :items="items" size="md" />
    <Tabs v-model="lg" :items="items" size="lg" />
  </div>
</template>
