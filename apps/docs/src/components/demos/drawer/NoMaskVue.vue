<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix-design/vue';

const open = ref(false);
</script>

<template>
  <CfButton @click="open = true">打开（不锁背景）</CfButton>
  <p style="margin: 8px 0 0; color: var(--fg-3); font-size: 12px;">
    抽屉打开后页面其他地方仍可继续滚动 / 点击 —— 适合“常驻参考面板”型场景。
  </p>
  <CfDrawer
    v-model:open="open"
    placement="right"
    size="sm"
    :mask="false"
    title="参考面板"
    description="mask=false 时不渲染遮罩、不锁滚动。"
  >
    <p style="margin: 0;">尝试在抽屉打开的状态下滚动或点击页面其他位置 —— 都能正常交互。</p>
  </CfDrawer>
</template>
