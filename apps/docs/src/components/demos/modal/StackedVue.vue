<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal } from '@chufix-design/vue';

const layer1 = ref(false);
const layer2 = ref(false);
</script>

<template>
  <CfButton @click="layer1 = true">打开第一层</CfButton>

  <CfModal
    v-model:open="layer1"
    title="第一层"
    description="可以在这一层再打开嵌套的对话框。"
    ok-text="确定"
    cancel-text="取消"
  >
    <p style="line-height: 1.6; margin-bottom: 12px;">两层 modal 同时存在时，组件维护内部 z-index 栈，每层自动 +10。Esc 只关闭最顶层。</p>
    <CfButton variant="tertiary" @click="layer2 = true">打开第二层</CfButton>

    <CfModal
      v-model:open="layer2"
      tone="warning"
      title="第二层"
      description="这一层是从第一层里弹出来的；遮罩仍然位于第一层之上。"
      ok-text="知道了"
    />
  </CfModal>
</template>
