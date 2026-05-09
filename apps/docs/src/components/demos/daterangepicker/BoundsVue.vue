<script setup lang="ts">
import { ref } from 'vue';
import { CfDateRangePicker, type DateRangeValue } from '@chufix/vue';

const value = ref<DateRangeValue>([null, null]);
</script>

<template>
  <CfDateRangePicker
    v-model="value"
    min-date="2026-01-01"
    max-date="2026-12-31"
    clearable
    :placeholder="['起始', '结束']"
  />
</template>
