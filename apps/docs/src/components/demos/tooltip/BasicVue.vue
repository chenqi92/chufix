<script setup lang="ts">
import { Button, Tooltip } from '@chufix/vue';
</script>

<template>
  <Tooltip content="鼠标悬停或键盘聚焦都会显示">
    <Button variant="outline">悬停我</Button>
  </Tooltip>
</template>
