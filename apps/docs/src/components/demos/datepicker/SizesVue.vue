<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix-design/vue';

const a = ref<string | null>('2026-05-09');
const b = ref<string | null>('2026-05-09');
const c = ref<string | null>('2026-05-09');
</script>

<template>
  <div class="demo-row">
    <CfDatePicker v-model="a" size="sm" clearable />
    <CfDatePicker v-model="b" size="md" clearable />
    <CfDatePicker v-model="c" size="lg" clearable />
  </div>
</template>
