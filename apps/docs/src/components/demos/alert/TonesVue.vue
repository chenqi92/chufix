<script setup lang="ts">
import { CfAlert } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <CfAlert tone="info" title="一条信息">蓝色，中性提示。</CfAlert>
    <CfAlert tone="success" title="保存成功">绿色，正向反馈。</CfAlert>
    <CfAlert tone="warning" title="磁盘空间不足">黄色，需要注意但非阻塞。</CfAlert>
    <CfAlert tone="error" title="无法连接到服务">红色，严重错误。</CfAlert>
  </div>
</template>
