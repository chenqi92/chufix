<script setup lang="ts">
import { ref } from 'vue';
import { CfSlider } from '@chufix-design/vue';

const a = ref(60);
const b = ref(60);
const c = ref(60);
const d = ref(60);
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 32rem;">
    <CfSlider v-model="a" tone="primary" show-value />
    <CfSlider v-model="b" tone="success" show-value />
    <CfSlider v-model="c" tone="warning" show-value />
    <CfSlider v-model="d" tone="danger" show-value />
  </div>
</template>
