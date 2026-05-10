<script setup lang="ts">
import { ref } from 'vue';
import { CfTimePicker } from '@chufix-design/vue';

const t1 = ref<string | null>('09:30');
const t2 = ref<string | null>(null);
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">时（HH:mm）</div>
      <CfTimePicker v-model="t1" clearable />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">含秒（HH:mm:ss）</div>
      <CfTimePicker v-model="t2" show-seconds clearable />
    </div>
    <span style="font-size: 12px; color: var(--fg-3);">已选：<code>{{ t1 ?? '(无)' }}</code> / <code>{{ t2 ?? '(无)' }}</code></span>
  </div>
</template>
