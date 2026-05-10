<script setup lang="ts">
import { CfEmpty, CfStatusIllustration } from '@chufix-design/vue';
</script>

<template>
  <div class="empty-illustration-demo">
    <CfEmpty title="没有搜索结果" description="换个关键词或清空筛选条件试试。">
      <template #icon>
        <CfStatusIllustration variant="search" />
      </template>
    </CfEmpty>
    <CfEmpty title="还没有文件" description="拖拽文件到这里，或点击上传。">
      <template #icon>
        <CfStatusIllustration variant="upload" />
      </template>
    </CfEmpty>
  </div>
</template>

<style scoped>
.empty-illustration-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  width: 100%;
}
</style>
