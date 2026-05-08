<script setup lang="ts">
import { CfBadge, CfButton } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1.5rem;">
    <CfBadge :content="3">
      <CfButton variant="tertiary">3 条</CfButton>
    </CfBadge>
    <CfBadge :content="120">
      <CfButton variant="tertiary">默认 max=99</CfButton>
    </CfBadge>
    <CfBadge :content="120" :max="999">
      <CfButton variant="tertiary">max=999</CfButton>
    </CfBadge>
    <CfBadge :content="0" show-zero tone="success">
      <CfButton variant="tertiary">show-zero</CfButton>
    </CfBadge>
  </div>
</template>
