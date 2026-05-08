<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CfProgress } from '@chufix/vue';

const v = ref(30);
let timer: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  timer = setInterval(() => {
    v.value = (v.value + 7) % 100;
  }, 800);
});
onBeforeUnmount(() => timer && clearInterval(timer));
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 28rem;">
    <CfProgress :value="v" show-label />
    <CfProgress :value="60" tone="success" show-label />
    <CfProgress :value="80" tone="warning" />
    <CfProgress :value="20" tone="danger" size="sm" />
    <CfProgress indeterminate />
    <div style="display: flex; gap: 16px; align-items: center;">
      <CfProgress variant="circle" :value="v" show-label />
      <CfProgress variant="circle" :value="100" tone="success" size="sm" show-label />
      <CfProgress variant="circle" indeterminate size="lg" />
    </div>
  </div>
</template>
