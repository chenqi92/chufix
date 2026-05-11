<script setup lang="ts">
import { CfAppShell } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <div>
      <CfAppShell variant="condensed" :sidebar-width="140">
        <template #header>condensed 顶栏</template>
        <template #sidebar>侧栏</template>
        <div style="padding: 8px;">紧凑型 — 整体字号小一档</div>
      </CfAppShell>
    </div>
    <div>
      <CfAppShell variant="spacious" :sidebar-width="160">
        <template #header>spacious 顶栏</template>
        <template #sidebar>侧栏</template>
        <div style="padding: 12px;">宽松型 — 字号 / 内距大一档</div>
      </CfAppShell>
    </div>
  </div>
</template>
