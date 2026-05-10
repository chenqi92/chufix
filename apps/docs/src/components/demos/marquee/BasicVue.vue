<script setup lang="ts">
import { CfMarquee } from '@chufix-design/vue';
</script>

<template>
  <CfMarquee :duration="20">
    <span style="color: var(--fg-1);">📢 系统将于今晚 23:00 进行升级维护，预计 30 分钟 · 期间订单系统不可用 · 请提前安排</span>
  </CfMarquee>
</template>
