<script setup lang="ts">
import { Button, Toaster, toast } from '@chukit/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <Button @click="toast({ title: '通用通知', description: '这是一条默认 Toast。' })">默认</Button>
      <Button tone="primary" @click="toast.success({ title: '保存成功', description: '配置已写入。' })">success</Button>
      <Button tone="danger" @click="toast.error({ title: '保存失败', description: '请检查网络后重试。' })">error</Button>
      <Button variant="outline" @click="toast.warning('磁盘空间不足 10%')">warning</Button>
      <Button variant="ghost" @click="toast.info('已复制到剪贴板')">info</Button>
    </div>
    <p class="demo-hint">右上角是 <code>Toaster</code> 渲染区，每条 Toast 默认 4s 自动关闭，点 × 可手动关闭。</p>
    <Toaster position="top-right" />
  </div>
</template>
