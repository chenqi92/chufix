<script setup lang="ts">
import { ref } from 'vue';
import { CfIconButton } from '@chufix/vue';
const pinned = ref(true);
const liked = ref(false);
const star = `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.9 4 4.4.4-3.3 3 .9 4.3L8 11.5 4.1 13.7l.9-4.3-3.3-3 4.4-.4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 16px;">
    <CfIconButton :pressed="pinned" aria-label="固定" @click="pinned = !pinned">
      <span v-html="star" style="display: contents;"/>
    </CfIconButton>
    <CfIconButton :pressed="liked" variant="danger" aria-label="收藏" @click="liked = !liked">
      <span v-html="star" style="display: contents;"/>
    </CfIconButton>
    <CfIconButton loading aria-label="加载中">
      <span v-html="star" style="display: contents;"/>
    </CfIconButton>
    <CfIconButton disabled aria-label="禁用">
      <span v-html="star" style="display: contents;"/>
    </CfIconButton>
    <span v-if="pinned" style="font-size: 12px; color: var(--accent-1); font-family: var(--font-mono);">已固定</span>
    <span v-if="liked" style="font-size: 12px; color: var(--status-error); font-family: var(--font-mono);">已收藏</span>
  </div>
</template>
