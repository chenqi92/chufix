<script setup lang="ts">
import { ref } from 'vue';
import { CfTagInput } from '@chufix/vue';

const a = ref<string[]>(['neutral']);
const b = ref<string[]>(['accent', 'highlight']);
const c = ref<string[]>(['ok']);
const d = ref<string[]>(['warn']);
const e = ref<string[]>(['error']);
</script>

<template>
  <div style="display:flex; flex-direction: column; gap: 8px;">
    <CfTagInput v-model="a" tone="neutral" placeholder="neutral" />
    <CfTagInput v-model="b" tone="accent" placeholder="accent" />
    <CfTagInput v-model="c" tone="success" placeholder="success" />
    <CfTagInput v-model="d" tone="warning" placeholder="warning" />
    <CfTagInput v-model="e" tone="danger" placeholder="danger" />
  </div>
</template>
