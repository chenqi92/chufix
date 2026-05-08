<script setup lang="ts">
import { Button, Tooltip } from '@chukit/vue';
</script>

<template>
  <div class="demo-row">
    <Tooltip content="顶部 Tooltip · 默认 placement">
      <Button variant="outline">Top</Button>
    </Tooltip>
    <Tooltip content="底部 Tooltip" placement="bottom">
      <Button variant="outline">Bottom</Button>
    </Tooltip>
    <Tooltip content="左侧 Tooltip" placement="left">
      <Button variant="outline">Left</Button>
    </Tooltip>
    <Tooltip content="右侧 Tooltip" placement="right">
      <Button variant="outline">Right</Button>
    </Tooltip>
    <Tooltip content="内容比较长，会自动换行并限制最大宽度，避免一行甩到屏幕外。">
      <Button variant="ghost">长文本</Button>
    </Tooltip>
  </div>
</template>
