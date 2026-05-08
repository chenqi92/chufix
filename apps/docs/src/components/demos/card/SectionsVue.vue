<script setup lang="ts">
import { CfButton, CfCard } from '@chufix/vue';
</script>

<template>
  <CfCard variant="elevated" style="max-width: 22rem;">
    <template #header>项目设置</template>
    <p style="margin: 0;">这是一段卡片正文，介绍当前项目的基本信息。</p>
    <p style="margin: 0.6rem 0 0; color: var(--fg-2); font-size: 0.85rem;">
      上次更新：2026-05-08
    </p>
    <template #footer>
      <CfButton size="sm" variant="tertiary">取消</CfButton>
      <CfButton size="sm">保存</CfButton>
    </template>
  </CfCard>
</template>
