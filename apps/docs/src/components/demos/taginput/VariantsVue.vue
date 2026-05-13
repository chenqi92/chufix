<script setup lang="ts">
import { ref } from 'vue';
import { CfTagInput } from '@chufix-design/vue';

const a = ref<string[]>(['outline']);
const b = ref<string[]>(['filled']);
const c = ref<string[]>(['ghost']);
const d = ref<string[]>([]);
</script>

<template>
  <div class="demo-stack">
    <CfTagInput v-model="a" variant="outline" placeholder="outline" />
    <CfTagInput v-model="b" variant="filled" placeholder="filled" />
    <CfTagInput v-model="c" variant="ghost" placeholder="ghost" />
    <CfTagInput v-model="d" error placeholder="error 态" />
  </div>
</template>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 10px; }
</style>
