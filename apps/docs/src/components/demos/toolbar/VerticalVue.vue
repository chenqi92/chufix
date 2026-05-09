<script setup lang="ts">
import { CfToolbar, CfToolbarSeparator, CfIconButton } from '@chufix/vue';
const star = `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.9 4 4.4.4-3.3 3 .9 4.3L8 11.5 4.1 13.7l.9-4.3-3.3-3 4.4-.4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
</script>

<template>
  <div class="demo-row" style="align-items: flex-start; gap: 16px;">
    <CfToolbar orientation="vertical">
      <CfIconButton aria-label="项目 1"><span v-html="star" style="display: contents;"/></CfIconButton>
      <CfIconButton aria-label="项目 2"><span v-html="star" style="display: contents;"/></CfIconButton>
      <CfToolbarSeparator />
      <CfIconButton aria-label="项目 3"><span v-html="star" style="display: contents;"/></CfIconButton>
    </CfToolbar>
    <CfToolbar variant="plain">
      <CfIconButton aria-label="撤销">↶</CfIconButton>
      <CfIconButton aria-label="重做">↷</CfIconButton>
      <CfToolbarSeparator />
      <CfIconButton aria-label="更多">⋯</CfIconButton>
    </CfToolbar>
  </div>
</template>
