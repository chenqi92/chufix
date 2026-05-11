<script setup lang="ts">
import { ref } from 'vue';
import { CfRangeSlider } from '@chufix-design/vue';
const a = ref<[number, number]>([10, 50]);
const b = ref<[number, number]>([30, 70]);
const c = ref<[number, number]>([60, 90]);
</script>

<template>
  <div class="rangeslider-tones">
    <CfRangeSlider v-model="a" tone="success" />
    <CfRangeSlider v-model="b" tone="warning" />
    <CfRangeSlider v-model="c" tone="error" disabled />
  </div>
</template>

<style scoped>
.rangeslider-tones {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(100%, 640px);
}
</style>
