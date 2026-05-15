<script setup lang="ts">
import { CfTerminal, type TerminalLine } from '@chufix-design/vue';

const lines: TerminalLine[] = [
  { type: 'command', text: 'pnpm --filter @chufix-design/vue build' },
  { type: 'output', text: '> @chufix-design/vue@0.10.0 build' },
  { type: 'output', text: '> vite build && vue-tsc --emitDeclarationOnly --outDir dist' },
  { type: 'info', text: 'vite v5.4.21 building for production...' },
  { type: 'output', text: 'transforming...' },
  { type: 'success', text: '✓ 843 modules transformed.' },
  { type: 'output', text: 'rendering chunks...' },
  { type: 'output', text: 'dist/style.css  389.84 kB │ gzip: 55.67 kB' },
  { type: 'output', text: 'dist/index.js   1,157.44 kB │ gzip: 262.38 kB' },
  { type: 'success', text: '✓ built in 4.30s' },
  { type: 'command', text: 'pnpm tokens:check' },
  { type: 'success', text: 'tokens · ok · scanned 368 stylesheet(s), all references resolve to 152 defined tokens.' },
  { type: 'command', text: 'git status' },
  { type: 'warning', text: 'On branch main' },
  { type: 'output', text: 'nothing to commit, working tree clean' },
];
</script>

<template>
  <CfTerminal :lines="lines" title="build.log" :height="320" />
</template>
