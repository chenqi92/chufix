<script setup lang="ts">
import { CfAnchor, type AnchorItem } from '@chufix-design/vue';

const items: AnchorItem[] = [
  { href: '#anchor-intro', label: '概述' },
  { href: '#anchor-usage', label: '基础用法' },
  { href: '#anchor-api', label: 'API' },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 160px; gap: 24px; max-height: 320px; overflow-y: auto; border: 1px solid var(--line-1); border-radius: 8px; padding: 16px;">
    <div>
      <h3 id="anchor-intro" style="margin-top: 0;">概述</h3>
      <p style="color: var(--fg-2);" v-for="i in 4" :key="`a-${i}`">这是概述部分的第 {{ i }} 段示例文本。</p>
      <h3 id="anchor-usage">基础用法</h3>
      <p style="color: var(--fg-2);" v-for="i in 4" :key="`b-${i}`">这是基础用法部分的第 {{ i }} 段示例文本。</p>
      <h3 id="anchor-api">API</h3>
      <p style="color: var(--fg-2);" v-for="i in 4" :key="`c-${i}`">这是 API 部分的第 {{ i }} 段示例文本。</p>
    </div>
    <CfAnchor :items="items" :offset-top="0" />
  </div>
</template>
