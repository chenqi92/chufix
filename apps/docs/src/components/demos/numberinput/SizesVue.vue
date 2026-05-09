<script setup lang="ts">
import { ref } from 'vue';
import { CfNumberInput } from '@chufix/vue';

const a = ref<number | null>(50);
const b = ref<number | null>(50);
const c = ref<number | null>(50);
</script>

<template>
  <div class="demo-row" style="gap: 1rem;">
    <CfNumberInput v-model="a" size="sm" />
    <CfNumberInput v-model="b" size="md" />
    <CfNumberInput v-model="c" size="lg" />
  </div>
</template>
