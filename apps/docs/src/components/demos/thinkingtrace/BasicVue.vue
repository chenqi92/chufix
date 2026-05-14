<script setup lang="ts">
import { CfThinkingTrace } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfThinkingTrace status="thinking" :duration="3200">
      检查用户原始查询，识别意图为 SQL 优化…
      正在比对索引结构与执行计划…
    </CfThinkingTrace>
    <CfThinkingTrace status="done" :duration="12400" default-open>
      1. 解析 SQL，识别全表扫描
      2. 在 (user_id, created_at) 上加复合索引
      3. 验证执行计划，扫描行数 320k → 12
      4. 输出 EXPLAIN 与建议
    </CfThinkingTrace>
  </div>
</template>
