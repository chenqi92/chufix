<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix-design/vue';

const info = ref(false);
const success = ref(false);
const warning = ref(false);
const error = ref(false);
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    <CfButton variant="tertiary" @click="info = true">info</CfButton>
    <CfButton variant="tertiary" @click="success = true">success</CfButton>
    <CfButton variant="tertiary" @click="warning = true">warning</CfButton>
    <CfButton variant="tertiary" @click="error = true">error</CfButton>
  </div>

  <CfDrawer
    v-model:open="info"
    tone="info"
    title="新版本上线"
    description="0.2.0 — 拖拽面板、tone 变体、命令式 service。"
    ok-text="知道了"
  >
    <p style="margin: 0;">使用 tone 在 header 上自动加圆形语义图标。</p>
  </CfDrawer>

  <CfDrawer
    v-model:open="success"
    tone="success"
    title="部署成功"
    description="cd-12 已发布到生产环境"
    ok-text="完成"
  >
    <p style="margin: 0;">tone="success" 适合状态提示型抽屉。</p>
  </CfDrawer>

  <CfDrawer
    v-model:open="warning"
    tone="warning"
    title="存在未保存的修改"
    description="离开前请先保存草稿"
    ok-text="保存并离开"
    cancel-text="取消"
  >
    <p style="margin: 0;">两侧按钮 + warning 头像。</p>
  </CfDrawer>

  <CfDrawer
    v-model:open="error"
    tone="error"
    title="即将永久删除项目"
    description="该操作不可撤销。"
    ok-text="删除"
    cancel-text="取消"
  >
    <p style="margin: 0;">tone="error" 时默认 OK 按钮自动切到 danger 红色。</p>
  </CfDrawer>
</template>
