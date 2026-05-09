<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix/vue';

const open = ref(false);
</script>

<template>
  <CfButton @click="open = true">打开抽屉</CfButton>
  <CfDrawer v-model:open="open" title="基础抽屉">
    <p style="margin: 0;">从右侧滑入。按 Esc 或点击遮罩关闭。</p>
    <template #footer>
      <CfButton variant="ghost" @click="open = false">取消</CfButton>
      <CfButton @click="open = false">确定</CfButton>
    </template>
  </CfDrawer>
</template>
