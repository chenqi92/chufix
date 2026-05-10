<script setup lang="ts">
import { ref } from 'vue';
import { CfRangeSlider } from '@chufix-design/vue';
const range = ref<[number, number]>([20, 80]);
</script>

<template>
  <div style="padding: 12px 0; max-width: 360px;">
    <CfRangeSlider v-model="range" :min="0" :max="100" />
    <div style="margin-top: 12px; font-size: 12px; color: var(--fg-3); font-family: var(--font-mono);">
      [{{ range[0] }}, {{ range[1] }}]
    </div>
  </div>
</template>
