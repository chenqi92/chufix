<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfDatePicker, CfTimePicker } from '@chufix-design/vue';

const date = ref<string | null>('2026-05-09');
const time = ref<string | null>('14:30');

const combined = computed<string>(() => {
  if (!date.value) return '—';
  return `${date.value}${time.value ? ` ${time.value}` : ''}`;
});
</script>

<template>
  <div class="demo-row">
    <CfDatePicker v-model="date" clearable />
    <CfTimePicker v-model="time" show-seconds clearable />
    <span class="adm-out">→ <code>{{ combined }}</code></span>
  </div>
</template>

<style scoped>
.adm-out { color: var(--fg-3); font-size: var(--t-12); align-self: center; }
code { font-family: var(--font-mono); color: var(--fg-2); }
</style>
