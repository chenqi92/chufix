<script setup lang="ts">
import { CfColorSwatch } from '@chufix/vue';
const c = 'var(--accent-1)';
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 16px;">
    <CfColorSwatch size="sm" :color="c" />
    <CfColorSwatch size="md" :color="c" />
    <CfColorSwatch size="lg" :color="c" />
    <span style="width: 1px; height: 24px; background: var(--line-1); margin: 0 4px;" />
    <CfColorSwatch size="md" shape="round" :color="c" />
    <CfColorSwatch size="lg" shape="round" :color="c" />
    <span style="width: 1px; height: 24px; background: var(--line-1); margin: 0 4px;" />
    <CfColorSwatch :color="c" :selected="true" />
    <CfColorSwatch :color="c" disabled />
  </div>
</template>
