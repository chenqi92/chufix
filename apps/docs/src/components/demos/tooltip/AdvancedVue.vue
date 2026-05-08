<script setup lang="ts">
import { Button, Tooltip } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1rem;">
    <Tooltip content="0 延迟显示" :delay="0">
      <Button variant="tertiary">无延迟</Button>
    </Tooltip>
    <Tooltip content="500ms 延迟" :delay="500">
      <Button variant="tertiary">500ms</Button>
    </Tooltip>
    <Tooltip
      content="内容比较长会自动换行，限制最大宽度避免一行甩到屏幕外去；超出视口边缘也会自动翻转方向。"
      :max-width="220"
    >
      <Button variant="tertiary">长文本</Button>
    </Tooltip>
  </div>
</template>
