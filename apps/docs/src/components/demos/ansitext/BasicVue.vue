<script setup lang="ts">
import { CfAnsiText } from '@chufix/vue';
const sample = '\x1b[1;32m✓\x1b[0m build succeeded in \x1b[36m1.2s\x1b[0m\n\x1b[33m⚠\x1b[0m  warning: 3 unused exports\n\x1b[31m✗\x1b[0m \x1b[1mtest failed\x1b[0m\n\n  expected: \x1b[42m\x1b[30m foo \x1b[0m\n  received: \x1b[41m\x1b[37m bar \x1b[0m\n';
</script>

<template>
  <CfAnsiText :text="sample" />
</template>
