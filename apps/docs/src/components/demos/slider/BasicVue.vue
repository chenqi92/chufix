<script setup lang="ts">
import { ref } from 'vue';
import { CfSlider } from '@chufix/vue';

const a = ref(40);
const b = ref(70);
const c = ref(3);
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 32rem;">
    <CfSlider v-model="a" show-value />
    <CfSlider v-model="b" tone="success" :step="5" show-value />
    <CfSlider v-model="c" :min="0" :max="5" :step="1" ticks tone="warning" />
    <CfSlider v-model="a" size="sm" />
    <CfSlider v-model="a" size="lg" tone="danger" />
    <CfSlider :model-value="50" disabled />
  </div>
</template>
