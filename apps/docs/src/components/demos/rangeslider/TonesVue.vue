<script setup lang="ts">
import { ref } from 'vue';
import { CfRangeSlider } from '@chufix/vue';
const a = ref<[number, number]>([10, 50]);
const b = ref<[number, number]>([30, 70]);
const c = ref<[number, number]>([60, 90]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px; max-width: 360px;">
    <span style="font-size: 11px; color: var(--fg-3);">tone = success</span>
    <CfRangeSlider v-model="a" tone="success" />
    <span style="font-size: 11px; color: var(--fg-3);">tone = warning</span>
    <CfRangeSlider v-model="b" tone="warning" />
    <span style="font-size: 11px; color: var(--fg-3);">tone = error / disabled</span>
    <CfRangeSlider v-model="c" tone="error" disabled />
  </div>
</template>
