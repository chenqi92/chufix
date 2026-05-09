<script setup lang="ts">
import { CfAnsiText } from '@chufix/vue';
const sample = '\x1b[1;32m✓\x1b[0m \x1b[1mtest passed\x1b[0m\n\x1b[2m  duration:\x1b[0m \x1b[36m12ms\x1b[0m\n\x1b[31m  expected\x1b[0m: \x1b[42m\x1b[30m foo \x1b[0m\n\x1b[31m  actual\x1b[0m  : \x1b[41m\x1b[37m bar \x1b[0m\n';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <CfAnsiText :text="sample" size="sm" />
    <CfAnsiText :text="sample" size="md" />
    <CfAnsiText :text="sample" size="lg" />
  </div>
</template>
