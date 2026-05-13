<script setup lang="ts">
import { ref } from 'vue';
import { CfTagInput } from '@chufix-design/vue';

const a = ref<string[]>(['sm', 'tag']);
const b = ref<string[]>(['md', 'tag']);
const c = ref<string[]>(['lg', 'tag']);
</script>

<template>
  <div class="demo-stack">
    <CfTagInput v-model="a" size="sm" placeholder="sm" />
    <CfTagInput v-model="b" size="md" placeholder="md" />
    <CfTagInput v-model="c" size="lg" placeholder="lg" />
  </div>
</template>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 10px; }
</style>
