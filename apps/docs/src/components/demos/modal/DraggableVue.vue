<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal } from '@chufix-design/vue';

const open = ref(false);
</script>

<template>
  <CfButton @click="open = true">打开可拖拽 + 可缩放</CfButton>
  <CfModal
    v-model:open="open"
    title="可移动 / 可缩放"
    description="拖标题栏移动；右下角拖把柄缩放最小 280×160。"
    draggable
    resizable
    :centered="false"
    ok-text="完成"
    cancel-text="取消"
  >
    <p style="line-height: 1.6;">
      在桌面应用风格的工具型 modal 里很常用：用户希望并排看背景内容时移动 modal，或拉大到屏幕大小看长内容。
    </p>
  </CfModal>
</template>
