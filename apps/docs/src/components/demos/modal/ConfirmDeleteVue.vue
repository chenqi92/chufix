<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal, toast } from '@chufix-design/vue';

const open = ref<boolean>(false);
const target = ref<string>('config-2026-q2.json');

async function doDelete(): Promise<boolean> {
  await new Promise<void>((resolve) => setTimeout(resolve, 700));
  // 演示态：随机模拟一次失败用于展示 onBeforeOk 阻止关闭
  if (Math.random() < 0) {
    toast.error('删除失败');
    return false;
  }
  toast.success(`已删除 ${target.value}`);
  return true;
}
</script>

<template>
  <CfButton variant="danger" @click="open = true">删除文件…</CfButton>
  <CfModal
    v-model:open="open"
    tone="error"
    title="确认删除？"
    :description="`将永久删除 ${target}，无法撤销。`"
    size="sm"
    ok-text="删除"
    ok-variant="danger"
    cancel-text="取消"
    :on-before-ok="doDelete"
  />
</template>
