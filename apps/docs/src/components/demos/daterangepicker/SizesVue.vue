<script setup lang="ts">
import { ref } from 'vue';
import { CfDateRangePicker, type DateRangeValue } from '@chufix-design/vue';

const a = ref<DateRangeValue>(['2026-05-01', '2026-05-09']);
const b = ref<DateRangeValue>(['2026-05-01', '2026-05-09']);
const c = ref<DateRangeValue>(['2026-05-01', '2026-05-09']);
</script>

<template>
  <div class="demo-row">
    <CfDateRangePicker v-model="a" size="sm" clearable />
    <CfDateRangePicker v-model="b" size="md" clearable />
    <CfDateRangePicker v-model="c" size="lg" clearable />
  </div>
</template>
