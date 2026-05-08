<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix/vue';

const right = ref(false);
const left = ref(false);
const top = ref(false);
const bottom = ref(false);
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    <CfButton @click="right = true">右侧</CfButton>
    <CfButton variant="secondary" @click="left = true">左侧</CfButton>
    <CfButton variant="secondary" @click="top = true">顶部</CfButton>
    <CfButton variant="secondary" @click="bottom = true">底部</CfButton>
  </div>

  <CfDrawer v-model:open="right" title="右侧抽屉" placement="right">
    <p style="margin: 0;">从右侧滑入，按 Esc 或点击遮罩关闭。</p>
    <template #footer>
      <CfButton variant="ghost" @click="right = false">取消</CfButton>
      <CfButton @click="right = false">确定</CfButton>
    </template>
  </CfDrawer>

  <CfDrawer v-model:open="left" title="左侧抽屉" placement="left" />
  <CfDrawer v-model:open="top" title="顶部抽屉" placement="top" />
  <CfDrawer v-model:open="bottom" title="底部抽屉" placement="bottom" />
</template>
