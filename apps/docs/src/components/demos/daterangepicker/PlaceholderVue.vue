<script setup lang="ts">
import { ref } from 'vue';
import { CfDateRangePicker, type DateRangeValue } from '@chufix/vue';

const a = ref<DateRangeValue>([null, null]);
const b = ref<DateRangeValue>([null, null]);
</script>

<template>
  <div class="demo-stack">
    <CfDateRangePicker v-model="a" :placeholder="['起始日期', '结束日期']" separator="至" />
    <CfDateRangePicker v-model="b" :placeholder="['Start', 'End']" separator="—" />
  </div>
</template>
