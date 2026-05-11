<script setup lang="ts">
import { CfButton, toast } from '@chufix-design/vue';
</script>

<template>
  <CfButton @click="toast({ title: '操作成功', description: '配置已保存。' })">
    弹一条 Toast
  </CfButton>
</template>
