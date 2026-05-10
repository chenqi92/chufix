<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal, CfInput } from '@chufix-design/vue';

const open = ref(false);
const phrase = ref('');

async function onBeforeOk() {
  // 模拟服务端校验：必须输入 'delete'
  await new Promise((r) => setTimeout(r, 800));
  if (phrase.value !== 'delete') {
    // 阻止关闭
    return false;
  }
  // 真删
  await new Promise((r) => setTimeout(r, 600));
}
</script>

<template>
  <CfButton variant="danger" @click="open = true">删除项目（异步）</CfButton>

  <CfModal
    v-model:open="open"
    tone="error"
    title="确认删除"
    description="这是不可撤销的操作。请输入 'delete' 确认。"
    :on-before-ok="onBeforeOk"
    ok-text="确认删除"
    cancel-text="取消"
  >
    <CfInput v-model="phrase" placeholder="输入 delete 启用确认按钮" />
  </CfModal>
</template>
