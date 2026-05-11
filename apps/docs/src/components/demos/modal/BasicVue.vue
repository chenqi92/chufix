<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal } from '@chufix-design/vue';

const open = ref(false);
</script>

<template>
  <CfButton @click="open = true">打开 Modal</CfButton>
  <CfModal v-model:open="open" title="确认操作">
    <p style="margin: 0;">这是一个最简弹窗。点击遮罩 / Esc / × 都能关闭。</p>
    <template #footer>
      <CfButton variant="ghost" @click="open = false">取消</CfButton>
      <CfButton @click="open = false">确定</CfButton>
    </template>
  </CfModal>
</template>
