<script setup lang="ts">
import { CfIconButton } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <CfIconButton aria-label="刷新">
      <svg viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 1 1 1.5 3.5M3 8V5m0 3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </CfIconButton>
    <CfIconButton variant="primary" aria-label="保存">
      <svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </CfIconButton>
    <CfIconButton variant="danger" aria-label="删除">
      <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </CfIconButton>
    <CfIconButton :pressed="true" aria-label="固定">
      <svg viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 4v.01M5 5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </CfIconButton>
  </div>
</template>
