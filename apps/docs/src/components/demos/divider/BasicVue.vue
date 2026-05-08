<script setup lang="ts">
import { CfDivider } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 28rem;">
    <p>实线分割（默认）</p>
    <CfDivider />
    <p>虚线 + 标签</p>
    <CfDivider variant="dashed">分组 A</CfDivider>
    <p>点线 + 左对齐标签</p>
    <CfDivider variant="dotted" align="start">日志</CfDivider>
    <p>
      文本 <CfDivider orientation="vertical" /> 中间 <CfDivider orientation="vertical" /> 也能用竖线
    </p>
  </div>
</template>
