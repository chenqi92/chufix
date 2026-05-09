<script setup lang="ts">
import { CfBanner, CfButton } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px;">
    <CfBanner tone="info" dismissible>系统将于今晚 22:00 - 22:30 进行维护，部分功能可能不可用。</CfBanner>
    <CfBanner tone="success">您的订单已支付完成，物流单号将在 1 小时内更新。</CfBanner>
    <CfBanner tone="warning" dismissible>
      存储空间已使用 86%，请尽快清理或升级配额。
      <template #action>
        <CfButton size="sm" variant="tertiary">清理</CfButton>
      </template>
    </CfBanner>
    <CfBanner tone="danger">数据库连接已断开，正在尝试重连…</CfBanner>
  </div>
</template>
