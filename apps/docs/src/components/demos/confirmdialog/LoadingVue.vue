<script setup lang="ts">
import { ref } from 'vue';
import { CfConfirmDialog, CfButton } from '@chufix-design/vue';
const open = ref(false);
const loading = ref(false);
async function onConfirm() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  loading.value = false;
  open.value = false;
}
</script>

<template>
  <div class="demo-row">
    <CfButton variant="danger" @click="open = true">删除并等待 1.5s</CfButton>
    <CfConfirmDialog
      v-model:open="open"
      tone="danger"
      title="删除项目？"
      description="模拟一个 1.5s 的异步删除操作，期间确认按钮显示 spinner、取消按钮被禁用。"
      :loading="loading"
      confirm-text="永久删除"
      @confirm="onConfirm"
    />
  </div>
</template>
