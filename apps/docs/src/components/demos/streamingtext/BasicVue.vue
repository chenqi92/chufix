<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { CfStreamingText, CfButton } from '@chufix-design/vue';

const full = 'ChuFix UI is a **Vue + React** component library with OKLCH tokens, _three themes_, and `cf-*` class prefixes. This demo streams the message one token every 40ms.';
const text = ref('');
const done = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

function start() {
  if (timer) clearInterval(timer);
  text.value = '';
  done.value = false;
  let i = 0;
  timer = setInterval(() => {
    i += 1;
    text.value = full.slice(0, i);
    if (i >= full.length) {
      if (timer) clearInterval(timer);
      timer = null;
      done.value = true;
    }
  }, 40);
}

onMounted(start);
onBeforeUnmount(() => { if (timer) clearInterval(timer); });
</script>

<template>
  <div class="demo-stack">
    <CfStreamingText :text="text" :done="done" format="markdown" />
    <CfButton variant="tertiary" size="sm" @click="start">重放</CfButton>
  </div>
</template>
