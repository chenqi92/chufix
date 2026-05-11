<script setup lang="ts">
import { CfIconButton } from '@chufix-design/vue';
const star = `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.9 4 4.4.4-3.3 3 .9 4.3L8 11.5 4.1 13.7l.9-4.3-3.3-3 4.4-.4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 16px;">
    <CfIconButton size="sm" aria-label="星标 (sm)"><span v-html="star" style="display: contents;"/></CfIconButton>
    <CfIconButton size="md" aria-label="星标 (md)"><span v-html="star" style="display: contents;"/></CfIconButton>
    <CfIconButton size="lg" aria-label="星标 (lg)"><span v-html="star" style="display: contents;"/></CfIconButton>
    <span style="width: 1px; height: 24px; background: var(--line-1); margin: 0 8px;" />
    <CfIconButton size="md" shape="round" aria-label="圆形"><span v-html="star" style="display: contents;"/></CfIconButton>
    <CfIconButton size="lg" shape="round" aria-label="圆形 lg"><span v-html="star" style="display: contents;"/></CfIconButton>
  </div>
</template>
