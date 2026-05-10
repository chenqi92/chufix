<script setup lang="ts">
import { CfButton, CfTooltip } from '@chufix-design/vue';
</script>

<template>
  <!-- 3×3 grid: each direction has its own quadrant so auto-flip doesn't fire. -->
  <div class="tt-grid">
    <span></span>
    <CfTooltip content="顶部" placement="top">
      <CfButton variant="tertiary">Top</CfButton>
    </CfTooltip>
    <span></span>

    <CfTooltip content="左侧" placement="left">
      <CfButton variant="tertiary">Left</CfButton>
    </CfTooltip>
    <span></span>
    <CfTooltip content="右侧" placement="right">
      <CfButton variant="tertiary">Right</CfButton>
    </CfTooltip>

    <span></span>
    <CfTooltip content="底部" placement="bottom">
      <CfButton variant="tertiary">Bottom</CfButton>
    </CfTooltip>
    <span></span>
  </div>
</template>

<style scoped>
.tt-grid {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: center;
  gap: 56px 80px;
  padding: 56px 0;
}
</style>
