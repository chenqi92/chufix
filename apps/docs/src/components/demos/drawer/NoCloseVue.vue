<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix/vue';

const open = ref(false);
</script>

<template>
  <CfButton @click="open = true">打开（仅按钮可关）</CfButton>
  <CfDrawer
    v-model:open="open"
    title="表单填写中"
    :close-on-overlay="false"
    :close-on-esc="false"
    :show-close="false"
  >
    <p style="margin: 0;">遮罩 / Esc / 右上角 × 全部禁用 — 用户必须通过底部按钮显式提交或取消。</p>
    <template #footer>
      <CfButton variant="ghost" @click="open = false">取消</CfButton>
      <CfButton @click="open = false">提交</CfButton>
    </template>
  </CfDrawer>
</template>
