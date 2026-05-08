<script setup lang="ts">
import { Button, toast } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <Button @click="toast('默认通知')">默认</Button>
    <Button tone="primary" @click="toast.success('保存成功')">success</Button>
    <Button tone="danger" @click="toast.error('保存失败，请稍后重试')">error</Button>
    <Button variant="outline" @click="toast.warning('磁盘空间不足 10%')">warning</Button>
    <Button variant="ghost" @click="toast.info('已复制到剪贴板')">info</Button>
  </div>
</template>
