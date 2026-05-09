<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix/vue';

const value = ref<string | null>('2026-05-09');
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center;">
    <CfDatePicker v-model="value" clearable />
    <code style="font-size: 12px;">{{ value ?? '(无)' }}</code>
  </div>
</template>
