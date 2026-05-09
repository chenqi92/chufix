<script setup lang="ts">
import { CfDiffEditor } from '@chufix/vue';
const left = `function greet(name) {
  return 'Hello ' + name;
}

greet('world');`;
const right = `function greet(name: string): string {
  if (!name) return 'Hello stranger';
  return \`Hello \${name}\`;
}

greet('world');`;
</script>

<template>
  <CfDiffEditor :left="left" :right="right" />
</template>
