<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix-design/vue';

const layer1 = ref<boolean>(false);
const layer2 = ref<boolean>(false);
</script>

<template>
  <CfButton @click="layer1 = true">打开第一层</CfButton>

  <CfDrawer
    v-model:open="layer1"
    title="第一层 · 设置"
    description="可以在这一层再打开嵌套抽屉。"
    placement="right"
    size="md"
    ok-text="保存"
    cancel-text="取消"
  >
    <p class="adm-p">
      两层 drawer 同时存在时，组件维护内部 z-index 栈，每层自动 +10。
      Esc 只关闭最顶层，关闭后从栈里弹出。
    </p>
    <CfButton variant="tertiary" @click="layer2 = true">打开第二层（高级设置）</CfButton>

    <CfDrawer
      v-model:open="layer2"
      tone="warning"
      title="第二层 · 高级设置"
      description="这一层是从第一层里打开的；遮罩仍然位于第一层之上。"
      placement="right"
      size="sm"
      ok-text="知道了"
    >
      <p class="adm-p">嵌套抽屉的关闭路径独立于父层。</p>
    </CfDrawer>
  </CfDrawer>
</template>

<style scoped>
.adm-p { color: var(--fg-2); line-height: 1.6; margin: 0 0 12px; }
</style>
