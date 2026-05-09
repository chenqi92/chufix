<script setup lang="ts">
import { CfStatusBar } from '@chufix/vue';
const left = [
  { id: 'branch', label: '⎇ main' },
  { id: 'sync', label: '↑ 0 ↓ 0' },
  { id: 'errors', label: '✗ 0', tone: 'error' as const },
  { id: 'warnings', label: '⚠ 3', tone: 'warning' as const },
];
const center = [
  { id: 'cursor', label: 'Ln 142, Col 18' },
  { id: 'indent', label: 'Spaces: 2' },
  { id: 'eol', label: 'LF' },
  { id: 'lang', label: 'TypeScript' },
];
const right = [
  { id: 'live', label: '● Live' },
];
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <div style="height: 80px; background: var(--bg-inset); display: flex; align-items: center; justify-content: center; color: var(--fg-3);">编辑器主区</div>
    <CfStatusBar :left-items="left" :center-items="center" :right-items="right" />
  </div>
</template>
