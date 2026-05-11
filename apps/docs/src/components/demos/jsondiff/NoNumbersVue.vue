<script setup lang="ts">
import { CfJsonDiff } from '@chufix-design/vue';

const before = {
  user: { id: 'u_001', plan: 'free' },
  settings: { theme: 'dark', density: 'comfortable' },
};
const after = {
  user: { id: 'u_001', plan: 'pro', renewedAt: '2026-05-01' },
  settings: { theme: 'light', density: 'comfortable' },
};
</script>

<template>
  <CfJsonDiff :left="before" :right="after" :line-numbers="false" />
</template>
