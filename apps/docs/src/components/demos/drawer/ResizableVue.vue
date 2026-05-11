<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix-design/vue';

const right = ref(false);
const bottom = ref(false);
</script>

<template>
  <div style="display: flex; gap: 8px;">
    <CfButton @click="right = true">右侧可缩放</CfButton>
    <CfButton variant="tertiary" @click="bottom = true">底部可缩放</CfButton>
  </div>

  <CfDrawer
    v-model:open="right"
    placement="right"
    size="md"
    resizable
    title="右侧可缩放"
    description="抓住面板的左边缘横向拖拽（最小 240px）。"
  >
    <p style="margin: 0;">这种交互对“调试 / 详情”类抽屉非常实用 —— 用户可以根据自己屏幕宽度自由调整。</p>
  </CfDrawer>

  <CfDrawer
    v-model:open="bottom"
    placement="bottom"
    size="md"
    resizable
    title="底部可缩放"
    description="抓住面板的上边缘竖向拖拽（最小 160px）。"
  >
    <p style="margin: 0;">底部抽屉常用于日志、控制台、playground 等可调高度的工具区。</p>
  </CfDrawer>
</template>
