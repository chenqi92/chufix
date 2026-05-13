<script setup lang="ts">
import { CfBadge, CfButton } from '@chufix-design/vue';
</script>

<template>
  <CfBadge :content="3">
    <CfButton variant="tertiary">默认 offset</CfButton>
  </CfBadge>

  <CfBadge :content="3" :offset="[-4, 4]">
    <CfButton variant="tertiary">[-4, 4] 向内</CfButton>
  </CfBadge>

  <CfBadge :content="3" :offset="[6, -6]">
    <CfButton variant="tertiary">[6, -6] 向外</CfButton>
  </CfBadge>

  <CfBadge dot tone="success" :offset="[-2, 2]">
    <CfButton variant="tertiary">圆点也可偏移</CfButton>
  </CfBadge>
</template>
