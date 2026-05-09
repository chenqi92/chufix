<script setup lang="ts">
import { CfStackedBar100 } from '@chufix/vue';
const browsers2024 = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 9 },
  { name: 'Edge', value: 5 },
  { name: 'Other', value: 3 },
];
const browsers2025 = [
  { name: 'Chrome', value: 62 },
  { name: 'Safari', value: 20 },
  { name: 'Firefox', value: 7 },
  { name: 'Edge', value: 8 },
  { name: 'Other', value: 3 },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px;">
    <div>
      <div style="font-size: 12px; color: var(--fg-2); margin-bottom: 4px;">2024 浏览器份额</div>
      <CfStackedBar100 :segments="browsers2024" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-2); margin-bottom: 4px;">2025 浏览器份额</div>
      <CfStackedBar100 :segments="browsers2025" />
    </div>
  </div>
</template>
