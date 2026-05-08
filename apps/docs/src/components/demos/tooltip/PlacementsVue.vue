<script setup lang="ts">
import { Button, Tooltip } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1rem;">
    <Tooltip content="顶部" placement="top">
      <Button variant="outline">Top</Button>
    </Tooltip>
    <Tooltip content="底部" placement="bottom">
      <Button variant="outline">Bottom</Button>
    </Tooltip>
    <Tooltip content="左侧" placement="left">
      <Button variant="outline">Left</Button>
    </Tooltip>
    <Tooltip content="右侧" placement="right">
      <Button variant="outline">Right</Button>
    </Tooltip>
  </div>
</template>
