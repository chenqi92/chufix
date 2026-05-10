<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix-design/vue';

const value = ref<string | null>(null);

function noWeekends(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}
</script>

<template>
  <CfDatePicker
    v-model="value"
    placeholder="工作日，2026 全年"
    min-date="2026-01-01"
    max-date="2026-12-31"
    :disabled-date="noWeekends"
    clearable
  />
</template>
