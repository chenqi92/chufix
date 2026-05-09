<script setup lang="ts">
import { CfDivider } from '@chufix/vue';
</script>

<template>
  <div style="display: flex; align-items: center; gap: 8px;">
    <span>左侧</span>
    <CfDivider orientation="vertical" />
    <span>中间</span>
    <CfDivider orientation="vertical" variant="dashed" />
    <span>右侧</span>
  </div>
</template>
