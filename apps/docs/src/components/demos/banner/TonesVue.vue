<script setup lang="ts">
import { CfBanner } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 6px;">
    <CfBanner tone="info">info — 蓝色，中性公告</CfBanner>
    <CfBanner tone="success">success — 绿色，确认已完成</CfBanner>
    <CfBanner tone="warning">warning — 黄色，需要注意</CfBanner>
    <CfBanner tone="danger">danger — 红色，紧急中断</CfBanner>
    <CfBanner tone="accent">accent — 主色，营销 / 新版本</CfBanner>
    <CfBanner tone="neutral">neutral — 灰色，与页面背景对比小</CfBanner>
  </div>
</template>
