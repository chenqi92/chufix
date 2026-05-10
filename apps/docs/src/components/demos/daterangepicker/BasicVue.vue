<script setup lang="ts">
import { ref } from 'vue';
import { CfDateRangePicker, type DateRangeValue } from '@chufix-design/vue';

const value = ref<DateRangeValue>(['2026-05-01', '2026-05-12']);
</script>

<template>
  <div style="display:flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <CfDateRangePicker v-model="value" clearable />
    <code style="font-size: 12px;">{{ value.join(' / ') || '(无)' }}</code>
  </div>
</template>
