<script setup lang="ts">
import { ref } from 'vue';
import { CfCalendar } from '@chufix/vue';

const today = new Date();
const min = new Date(today.getFullYear(), today.getMonth(), 1);
const max = new Date(today.getFullYear(), today.getMonth() + 2, 0);
const date = ref<Date | null>(null);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px; align-items: flex-start;">
    <CfCalendar v-model="date" :min="min" :max="max" />
    <span style="font-size: 12px; color: var(--fg-3);">
      允许范围：<code>{{ min.toISOString().slice(0, 10) }}</code>
      ~ <code>{{ max.toISOString().slice(0, 10) }}</code>
    </span>
  </div>
</template>
