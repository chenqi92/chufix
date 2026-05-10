<script setup lang="ts">
import { CfSplitButton } from '@chufix-design/vue';
const items = [
  { label: 'Save as draft', value: 'draft' },
  { label: 'Save and publish', value: 'publish' },
];
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 12px;">
    <CfSplitButton size="sm" :items="items">Small</CfSplitButton>
    <CfSplitButton size="md" :items="items">Medium</CfSplitButton>
    <CfSplitButton size="lg" :items="items">Large</CfSplitButton>
  </div>
</template>
