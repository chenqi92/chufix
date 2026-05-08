<script setup lang="ts">
import { ref } from 'vue';
import { CfNumberInput } from '@chufix/vue';

const a = ref<number | null>(10);
const b = ref<number | null>(0.25);
const c = ref<number | null>(null);
const d = ref<number | null>(50);
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row" style="gap: 1rem;">
      <CfNumberInput v-model="a" :min="0" :max="100" />
      <CfNumberInput v-model="b" :step="0.05" :min="0" :max="1" />
      <CfNumberInput v-model="c" placeholder="可空" />
    </div>
    <div class="demo-row" style="gap: 1rem;">
      <CfNumberInput v-model="d" size="sm" />
      <CfNumberInput v-model="d" size="md" />
      <CfNumberInput v-model="d" size="lg" />
    </div>
    <CfNumberInput v-model="d" hide-steppers placeholder="不带步进按钮" />
  </div>
</template>
