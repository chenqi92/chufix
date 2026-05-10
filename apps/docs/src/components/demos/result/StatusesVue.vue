<script setup lang="ts">
import { CfResult } from '@chufix-design/vue';
</script>

<template>
  <div class="result-status-demo">
    <CfResult status="404" size="sm" description="页面可能已移动或被删除。" />
    <CfResult status="403" size="sm" description="当前账号没有访问权限。" />
    <CfResult status="500" size="sm" description="服务暂时不可用，请稍后重试。" />
  </div>
</template>

<style scoped>
.result-status-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  width: 100%;
}
</style>
