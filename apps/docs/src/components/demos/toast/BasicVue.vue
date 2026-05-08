<script setup lang="ts">
import { Button, toast } from '@chufix/vue';
</script>

<template>
  <Button @click="toast({ title: '操作成功', description: '配置已保存。' })">
    弹一条 Toast
  </Button>
</template>
