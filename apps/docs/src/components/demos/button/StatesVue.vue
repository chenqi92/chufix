<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@chufix/vue';

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
      <Button :loading="loading" @click="load">{{ loading ? '加载中…' : '点击加载' }}</Button>
      <Button disabled>Disabled</Button>
      <Button variant="tertiary" disabled>Outline Disabled</Button>
    </div>
    <Button block>整行铺满（block）</Button>
  </div>
</template>
