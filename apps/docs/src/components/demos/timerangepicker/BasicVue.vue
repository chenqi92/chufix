<script setup lang="ts">
import { ref } from 'vue';
import { CfTimeRangePicker, type TimeRangeValue } from '@chufix/vue';

const range = ref<TimeRangeValue>(['09:00', '18:00']);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
    <CfTimeRangePicker v-model="range" clearable />
    <span style="font-size: 12px; color: var(--fg-3);">
      已选：<code>{{ range ? `${range[0] ?? '?'} – ${range[1] ?? '?'}` : '(无)' }}</code>
    </span>
  </div>
</template>
