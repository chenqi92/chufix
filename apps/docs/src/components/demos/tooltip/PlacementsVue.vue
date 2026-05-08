<script setup lang="ts">
import { Button, Tooltip } from '@chufix/vue';
</script>

<template>
  <!-- 3×3 grid: each direction has its own quadrant so auto-flip doesn't fire. -->
  <div class="tt-grid">
    <span></span>
    <Tooltip content="顶部" placement="top">
      <Button variant="tertiary">Top</Button>
    </Tooltip>
    <span></span>

    <Tooltip content="左侧" placement="left">
      <Button variant="tertiary">Left</Button>
    </Tooltip>
    <span></span>
    <Tooltip content="右侧" placement="right">
      <Button variant="tertiary">Right</Button>
    </Tooltip>

    <span></span>
    <Tooltip content="底部" placement="bottom">
      <Button variant="tertiary">Bottom</Button>
    </Tooltip>
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
