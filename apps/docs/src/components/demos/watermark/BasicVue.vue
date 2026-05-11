<script setup lang="ts">
import { CfWatermark } from '@chufix-design/vue';
</script>

<template>
  <CfWatermark content="ChuFix UI · Confidential">
    <div style="padding: 32px; min-height: 200px; background: var(--bg-1); border: 1px solid var(--line-1); border-radius: 8px;">
      <h3 style="margin: 0 0 8px;">敏感内容</h3>
      <p style="margin: 0; color: var(--fg-2);">水印覆盖整个容器，倾斜重复渲染。截图后水印仍可见，便于追溯泄漏来源。</p>
    </div>
  </CfWatermark>
</template>
