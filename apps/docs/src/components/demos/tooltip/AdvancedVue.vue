<script setup lang="ts">
import { CfButton, CfTooltip } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1rem;">
    <CfTooltip content="0 延迟显示" :delay="0">
      <CfButton variant="tertiary">无延迟</CfButton>
    </CfTooltip>
    <CfTooltip content="500ms 延迟" :delay="500">
      <CfButton variant="tertiary">500ms</CfButton>
    </CfTooltip>
    <CfTooltip
      content="内容比较长会自动换行，限制最大宽度避免一行甩到屏幕外去；超出视口边缘也会自动翻转方向。"
      :max-width="220"
    >
      <CfButton variant="tertiary">长文本</CfButton>
    </CfTooltip>
  </div>
</template>
