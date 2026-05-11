<script setup lang="ts">
import { CfAppShell } from '@chufix-design/vue';
</script>

<template>
  <CfAppShell :sidebar-width="160" :aside-width="200">
    <template #header><strong>顶栏</strong></template>
    <template #sidebar><nav>左侧导航</nav></template>
    <template #aside>
      <div style="padding: 8px;">右侧 aside — 详情 / 大纲 / 提示</div>
    </template>
    <template #footer>底栏</template>
    <div style="padding: 12px;">主内容区，左右两侧栏 + 顶底栏的完整脚手架。</div>
  </CfAppShell>
</template>
