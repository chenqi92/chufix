<script setup lang="ts">
import { CfDiffEditor } from '@chufix/vue';
const left = `function greet(name) {
  console.log('Hello ' + name);
  return null;
}

greet('world');`;
const right = `function greet(name: string): string {
  if (!name) return 'Hello stranger';
  return \`Hello \${name}\`;
}

greet('world');`;
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px; font-family: var(--font-mono);">mode = unified</div>
      <CfDiffEditor :left="left" :right="right" mode="unified" />
    </div>
  </div>
</template>
