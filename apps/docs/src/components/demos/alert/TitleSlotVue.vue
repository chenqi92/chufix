<script setup lang="ts">
import { CfAlert } from '@chufix-design/vue';
</script>

<template>
  <CfAlert tone="info">
    <template #title>
      新版本 <strong>v0.3</strong> 已发布 ·
      <a href="#" class="adm-link">查看更新日志</a>
    </template>
    包含若干 docs 增强与 token 修正。
  </CfAlert>

  <CfAlert tone="warning">
    <template #title>
      <span class="adm-title-row">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M8 2l6 11H2z" />
          <path d="M8 7v3" />
        </svg>
        磁盘空间剩余 <code>2.1 GB</code>
      </span>
    </template>
    建议立即清理或扩容，避免写入失败。
  </CfAlert>
</template>

<style scoped>
.adm-link { color: inherit; text-decoration: underline; }
.adm-title-row { display: inline-flex; align-items: center; gap: 6px; }
code { font-family: var(--font-mono); font-size: 0.9em; }
</style>
