<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal } from '@chufix-design/vue';

const open = ref<'info' | 'success' | 'warning' | 'error' | null>(null);
function set(t: typeof open.value) { open.value = t; }
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <CfButton variant="tertiary" @click="set('info')">Info</CfButton>
    <CfButton variant="tertiary" @click="set('success')">Success</CfButton>
    <CfButton variant="tertiary" @click="set('warning')">Warning</CfButton>
    <CfButton variant="danger" @click="set('error')">Error</CfButton>
  </div>

  <CfModal
    :open="open === 'info'"
    @update:open="(v) => set(v ? 'info' : null)"
    tone="info"
    title="新功能上线"
    description="表格组件现已支持双向虚拟化与 ResizeObserver 自动测高。"
    ok-text="知道了"
  />
  <CfModal
    :open="open === 'success'"
    @update:open="(v) => set(v ? 'success' : null)"
    tone="success"
    title="部署成功"
    description="v0.1.5 已发布到生产环境。"
    ok-text="完成"
  />
  <CfModal
    :open="open === 'warning'"
    @update:open="(v) => set(v ? 'warning' : null)"
    tone="warning"
    title="离开当前页面？"
    description="未保存的更改会丢失。"
    ok-text="离开"
    cancel-text="留下"
  />
  <CfModal
    :open="open === 'error'"
    @update:open="(v) => set(v ? 'error' : null)"
    tone="error"
    title="删除工作区"
    description="工作区内的所有数据将被立即清除，且无法恢复。"
    ok-text="确认删除"
    cancel-text="取消"
  />
</template>
