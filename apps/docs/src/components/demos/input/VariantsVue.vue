<script setup lang="ts">
import { CfInput } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfInput variant="outline" placeholder="outline · 默认" />
    <CfInput variant="filled" placeholder="filled · 灰色填充" />
    <CfInput variant="ghost" placeholder="ghost · 无边框，聚焦才出现" />
  </div>
</template>
