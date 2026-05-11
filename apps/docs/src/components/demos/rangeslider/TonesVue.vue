<script setup lang="ts">
import { ref } from 'vue';
import { CfRangeSlider } from '@chufix-design/vue';
const a = ref<[number, number]>([10, 50]);
const b = ref<[number, number]>([30, 70]);
const c = ref<[number, number]>([60, 90]);
</script>

<template>
  <div class="rangeslider-tones">
    <span class="rangeslider-tones__label">tone = success</span>
    <CfRangeSlider v-model="a" tone="success" />
    <span class="rangeslider-tones__label">tone = warning</span>
    <CfRangeSlider v-model="b" tone="warning" />
    <span class="rangeslider-tones__label">tone = error / disabled</span>
    <CfRangeSlider v-model="c" tone="error" disabled />
  </div>
</template>

<style scoped>
.rangeslider-tones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(100%, 640px);
}

.rangeslider-tones__label {
  color: var(--fg-3);
  font-size: 11px;
}
</style>
