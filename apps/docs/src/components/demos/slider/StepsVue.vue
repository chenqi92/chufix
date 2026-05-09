<script setup lang="ts">
import { ref } from 'vue';
import { CfSlider } from '@chufix/vue';

const stars = ref(3);
const percent = ref(40);
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 32rem;">
    <CfSlider v-model="stars" :min="0" :max="5" :step="1" ticks show-value />
    <CfSlider v-model="percent" :step="10" ticks show-value />
  </div>
</template>
