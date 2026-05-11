<script setup lang="ts">
import { CfMention } from '@chufix-design/vue';

const sample = '@alice 这条只读的评论给你看一眼。';
const options = [
  { value: 'alice', label: 'Alice 张' },
  { value: 'bob', label: 'Bob 李' },
];
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">readonly</div>
      <CfMention :model-value="sample" :options="options" readonly :rows="2" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">disabled</div>
      <CfMention :model-value="sample" :options="options" disabled :rows="2" />
    </div>
  </div>
</template>
