<script setup lang="ts">
import { ref } from 'vue';
import { CfRating } from '@chufix/vue';

const a = ref(3);
const b = ref(3.5);
const c = ref(4);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px; align-items: flex-start;">
    <CfRating v-model="a" />
    <CfRating v-model="b" allow-half show-value />
    <CfRating :model-value="c" readonly show-value />
    <CfRating :model-value="2" disabled />
  </div>
</template>
