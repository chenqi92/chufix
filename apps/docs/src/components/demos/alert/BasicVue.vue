<script setup lang="ts">
import { CfAlert } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <CfAlert tone="info" title="一条信息">这是一段补充说明，用于解释当前状态。</CfAlert>
    <CfAlert tone="success" title="保存成功">数据已写入后端，可以继续下一步操作。</CfAlert>
    <CfAlert tone="warning" title="磁盘空间不足">剩余空间小于 10%，请尽快清理或扩容。</CfAlert>
    <CfAlert tone="error" title="无法连接到服务" closable>请检查网络后重试。如果问题持续，联系系统管理员。</CfAlert>
  </div>
</template>
