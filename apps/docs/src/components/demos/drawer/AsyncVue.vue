<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer, CfInput, toast } from '@chufix-design/vue';

const open = ref(false);
const name = ref('');

function onBeforeOk(): Promise<boolean | void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name.value.trim().length < 2) {
        toast({ type: 'error', message: '名称至少 2 个字符' });
        reject(new Error('invalid'));
        return;
      }
      toast({ type: 'success', message: `已保存：${name.value}` });
      resolve();
    }, 900);
  });
}
</script>

<template>
  <CfButton @click="open = true">编辑配置</CfButton>
  <CfDrawer
    v-model:open="open"
    placement="right"
    size="md"
    title="编辑配置"
    description="保存按钮接异步 onBeforeOk —— 期间所有关闭路径屏蔽。"
    ok-text="保存"
    cancel-text="取消"
    :on-before-ok="onBeforeOk"
    @ok="open = false; name = ''"
  >
    <div style="display: grid; gap: 8px;">
      <label style="font-size: 12px; color: var(--fg-3);">名称</label>
      <CfInput v-model="name" placeholder="输入≥2字符" />
    </div>
  </CfDrawer>
</template>
