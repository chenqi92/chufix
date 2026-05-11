<script setup lang="ts">
import { CfButton, drawer, toast } from '@chufix-design/vue';

async function openSettings() {
  const ok = await drawer.confirm({
    title: '设置',
    description: '快速调整服务参数 —— 不需要关心 v-model。',
    placement: 'right',
    size: 'md',
    content: '这里通常会嵌入一个 Form 子组件。点击保存以应用更改。',
    onOk: async () => {
      await new Promise((r) => setTimeout(r, 600));
    },
  });
  if (ok) toast({ type: 'success', message: '设置已保存' });
}

async function deleteFlow() {
  const ok = await drawer.danger({
    title: '永久删除该工作区？',
    description: '所有数据将被清除，且无法恢复。',
    placement: 'right',
    okText: '我已了解，删除',
    cancelText: '保留',
    content: '建议先导出工作区作为备份。',
  });
  toast({
    type: ok ? 'error' : 'info',
    message: ok ? '工作区已删除' : '已取消删除',
  });
}
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    <CfButton @click="openSettings">drawer.confirm()</CfButton>
    <CfButton variant="danger" @click="deleteFlow">drawer.danger()</CfButton>
  </div>
</template>
