<script setup lang="ts">
import { ref } from 'vue';
import { CfNumberInput } from '@chufix/vue';

const ratio = ref<number | null>(0.25);
const price = ref<number | null>(99.9);
const optional = ref<number | null>(null);
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row" style="gap: 1rem;">
      <CfNumberInput v-model="ratio" :step="0.05" :min="0" :max="1" />
      <CfNumberInput v-model="price" :step="0.1" :precision="2" />
      <CfNumberInput v-model="optional" placeholder="留空表示不限" />
    </div>
  </div>
</template>
