<script setup lang="ts">
import { ref } from 'vue';
import { CfCalendar } from '@chufix-design/vue';

const date = ref<Date | null>(new Date());
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px; align-items: flex-start;">
    <CfCalendar v-model="date" />
    <span style="font-size: 12px; color: var(--fg-3);">
      已选：<code>{{ date ? date.toISOString().slice(0, 10) : '无' }}</code>
    </span>
  </div>
</template>
