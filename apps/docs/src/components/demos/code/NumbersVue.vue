<script setup lang="ts">
import { CfCodeBlock } from '@chufix/vue';

const code = `function fib(n) {
  if (n <= 1) return n;
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`;
</script>

<template>
  <CfCodeBlock :code="code" language="js" title="fib.js" show-line-numbers />
</template>
