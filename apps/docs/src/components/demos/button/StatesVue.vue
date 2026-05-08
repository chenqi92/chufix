<script setup lang="ts">
import { ref } from 'vue';
import { CfButton } from '@chufix/vue';

const loading = ref(false);
async function load() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  loading.value = false;
}
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <CfButton :loading="loading" @click="load">{{ loading ? '加载中…' : '点击加载' }}</CfButton>
      <CfButton disabled>Disabled</CfButton>
      <CfButton variant="tertiary" disabled>Outline Disabled</CfButton>
    </div>
    <CfButton block>整行铺满（block）</CfButton>
  </div>
</template>
