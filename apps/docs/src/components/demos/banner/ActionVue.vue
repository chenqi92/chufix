<script setup lang="ts">
import { CfBanner, CfButton } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 6px;">
    <CfBanner tone="warning" dismissible>
      存储空间已使用 86%，请尽快清理或升级配额。
      <template #action>
        <CfButton size="sm" variant="tertiary">清理</CfButton>
      </template>
    </CfBanner>
    <CfBanner tone="info" dismissible>
      点右侧 × 可关闭，并触发 dismiss 事件。
    </CfBanner>
  </div>
</template>
