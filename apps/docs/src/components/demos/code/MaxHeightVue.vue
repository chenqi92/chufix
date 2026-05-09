<script setup lang="ts">
import { CfCodeBlock } from '@chufix/vue';

const lines = Array.from({ length: 30 }, (_, i) => `console.log('行 ${i + 1}');`);
const code = lines.join('\n');
</script>

<template>
  <CfCodeBlock :code="code" language="js" title="long-output.js" show-line-numbers :max-height="200" />
</template>
