<script setup lang="ts">
import { CfCitationMark } from '@chufix-design/vue';
</script>

<template>
  <p class="demo-prose">
    OKLCH 是一种感知均匀的颜色空间<CfCitationMark
      :index="1"
      :source="{ title: 'OKLCH in CSS — Evil Martians', domain: 'evilmartians.com', snippet: 'Why and how to use OKLCH color space in CSS' }"
    />，被设计令牌系统广泛采用<CfCitationMark
      :index="2"
      :source="{ title: 'Color spaces for design', domain: 'developer.chrome.com', url: 'https://developer.chrome.com/docs/css-ui/color-spaces' }"
    />。
  </p>
</template>

<style scoped>
.demo-prose { color: var(--fg-1); line-height: 1.7; }
</style>
