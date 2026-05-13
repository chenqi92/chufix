<script setup lang="ts">
import { CfJsonDiff } from '@chufix-design/vue';

const left = { id: 1, status: 'pending' };
const right = { id: 1, status: 'approved', approvedBy: 'admin' };
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <div>
      <CfJsonDiff :left="left" :right="right" size="sm" />
    </div>
    <div>
      <CfJsonDiff :left="left" :right="right" size="md" />
    </div>
    <div>
      <CfJsonDiff :left="left" :right="right" size="lg" />
    </div>
  </div>
</template>
