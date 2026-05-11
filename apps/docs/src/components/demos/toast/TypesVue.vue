<script setup lang="ts">
import { CfButton, toast } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row">
    <CfButton variant="secondary" @click="toast('默认通知')">默认</CfButton>
    <CfButton variant="primary" @click="toast.success('保存成功')">success</CfButton>
    <CfButton variant="danger" @click="toast.error('保存失败，请稍后重试')">error</CfButton>
    <CfButton variant="tertiary" @click="toast.warning('磁盘空间不足 10%')">warning</CfButton>
    <CfButton variant="ghost" @click="toast.info('已复制到剪贴板')">info</CfButton>
  </div>
</template>
