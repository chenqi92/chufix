<script setup lang="ts">
import { ref } from 'vue';
import { CfCodeEditor } from '@chufix/vue';
const code = ref(`function fizzbuzz(n: number) {
  for (let i = 1; i <= n; i++) {
    let out = '';
    if (i % 3 === 0) out += 'Fizz';
    if (i % 5 === 0) out += 'Buzz';
    console.log(out || i);
  }
}

fizzbuzz(15);`);
</script>

<template>
  <CfCodeEditor v-model="code" language="typescript" :rows="12" />
</template>
