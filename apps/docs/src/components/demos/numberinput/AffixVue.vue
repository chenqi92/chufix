<script setup lang="ts">
import { ref } from 'vue';
import { CfNumberInput } from '@chufix-design/vue';

const price = ref<number | null>(199);
const ratio = ref<number | null>(75);
const weight = ref<number | null>(1.5);
</script>

<template>
  <div class="demo-stack">
    <CfNumberInput v-model="price" :min="0" :step="0.1" :precision="2" prefix="￥" suffix="元" />
    <CfNumberInput v-model="ratio" :min="0" :max="100" :step="5" suffix="%" />
    <CfNumberInput v-model="weight" :min="0" :step="0.1" :precision="1" suffix="kg" />
  </div>
</template>
