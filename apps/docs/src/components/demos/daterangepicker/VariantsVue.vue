<script setup lang="ts">
import { ref } from 'vue';
import { CfDateRangePicker, type DateRangeValue } from '@chufix/vue';

const a = ref<DateRangeValue>(['2026-05-01', '2026-05-07']);
const b = ref<DateRangeValue>(['2026-05-01', '2026-05-07']);
const c = ref<DateRangeValue>(['2026-05-01', '2026-05-07']);
</script>

<template>
  <div class="demo-stack">
    <CfDateRangePicker v-model="a" variant="outline" />
    <CfDateRangePicker v-model="b" variant="filled" />
    <CfDateRangePicker v-model="c" variant="ghost" />
  </div>
</template>
