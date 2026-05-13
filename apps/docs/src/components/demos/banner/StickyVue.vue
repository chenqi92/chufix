<script setup lang="ts">
import { CfBanner, CfButton } from '@chufix-design/vue';
</script>

<template>
  <div class="adm-scroll">
    <CfBanner tone="warning" sticky dismissible>
      存储空间已使用 86% — 滚动下方内容时 banner 会粘在顶部。
      <template #action>
        <CfButton size="sm" variant="tertiary">清理</CfButton>
      </template>
    </CfBanner>

    <div class="adm-body">
      <p v-for="i in 8" :key="i">
        第 {{ i }} 段示例正文 —— sticky banner 通过 <code>position: sticky</code> 实现，
        必须放在一个有滚动行为的祖先容器内（这里给外层加了 <code>overflow:auto</code>）。
      </p>
    </div>
  </div>
</template>

<style scoped>
.adm-scroll {
  height: 240px;
  overflow: auto;
  border: 1px solid var(--line-1);
  border-radius: var(--r-4);
  background: var(--bg-1);
}
.adm-body { padding: 0 16px 16px; color: var(--fg-2); line-height: 1.7; }
.adm-body p { margin: 12px 0; }
code { font-family: var(--font-mono); font-size: 0.9em; color: var(--fg-2); }
</style>
