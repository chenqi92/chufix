<script setup lang="ts">
import { ref } from 'vue';
import { CfRangeSlider } from '@chufix-design/vue';
const range = ref<[number, number]>([20, 80]);
</script>

<template>
  <div class="rangeslider-demo">
    <CfRangeSlider v-model="range" :min="0" :max="100" />
    <div class="rangeslider-demo__value">
      [{{ range[0] }}, {{ range[1] }}]
    </div>
  </div>
</template>

<style scoped>
.rangeslider-demo {
  width: min(100%, 640px);
  padding: 16px 0;
}

.rangeslider-demo__value {
  margin-top: 12px;
  color: var(--fg-3);
  font-family: var(--font-mono);
  font-size: 12px;
}
</style>
