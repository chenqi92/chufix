<script setup lang="ts">
import { CfAvatar, CfBadge, CfButton } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1.5rem;">
    <CfBadge :content="5">
      <CfButton variant="tertiary">收件箱</CfButton>
    </CfBadge>
    <CfBadge dot tone="success">
      <CfAvatar name="Chen Qi" />
    </CfBadge>
    <CfBadge dot tone="warning" placement="bottom-right">
      <CfAvatar name="Anna Lee" />
    </CfBadge>
    <CfBadge content="Pro" tone="info" placement="top-left">
      <CfButton variant="tertiary">账户</CfButton>
    </CfBadge>
  </div>
</template>
