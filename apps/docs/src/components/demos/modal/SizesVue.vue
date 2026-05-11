<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal } from '@chufix-design/vue';

const sm = ref(false);
const md = ref(false);
const lg = ref(false);
const xl = ref(false);
const full = ref(false);
</script>

<template>
  <div class="demo-row">
    <CfButton variant="tertiary" @click="sm = true">sm · 360px</CfButton>
    <CfButton variant="tertiary" @click="md = true">md · 480px</CfButton>
    <CfButton variant="tertiary" @click="lg = true">lg · 640px</CfButton>
    <CfButton variant="tertiary" @click="xl = true">xl · 800px</CfButton>
    <CfButton variant="tertiary" @click="full = true">full · 几乎铺满</CfButton>
  </div>

  <CfModal v-model:open="sm" size="sm" title="size = sm">
    <p style="margin: 0;">最大宽度 360px，适合精简的确认弹窗。</p>
  </CfModal>
  <CfModal v-model:open="md" size="md" title="size = md（默认）">
    <p style="margin: 0;">最大宽度 480px，是大多数表单的合理尺寸。</p>
  </CfModal>
  <CfModal v-model:open="lg" size="lg" title="size = lg">
    <p style="margin: 0;">最大宽度 640px，适合内容较多的弹窗。</p>
  </CfModal>
  <CfModal v-model:open="xl" size="xl" title="size = xl">
    <p style="margin: 0;">最大宽度 800px，适合复杂表单或预览面板。</p>
  </CfModal>
  <CfModal v-model:open="full" size="full" title="size = full">
    <p style="margin: 0;">几乎铺满视口（保留 1.5rem 外边距），适合设置面板或全屏预览。</p>
  </CfModal>
</template>
