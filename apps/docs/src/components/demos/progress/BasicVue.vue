<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CfProgress } from '@chufix-design/vue';

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
  <div style="width: 100%; max-width: 28rem;">
    <CfProgress :value="v" show-label />
  </div>
</template>
