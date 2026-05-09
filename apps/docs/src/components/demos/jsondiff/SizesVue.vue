<script setup lang="ts">
import { CfJsonDiff } from '@chufix/vue';

const left = { id: 1, status: 'pending' };
const right = { id: 1, status: 'approved', approvedBy: 'admin' };
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = sm</div>
      <CfJsonDiff :left="left" :right="right" size="sm" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = md</div>
      <CfJsonDiff :left="left" :right="right" size="md" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = lg</div>
      <CfJsonDiff :left="left" :right="right" size="lg" />
    </div>
  </div>
</template>
