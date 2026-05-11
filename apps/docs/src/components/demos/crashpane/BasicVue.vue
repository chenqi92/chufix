<script setup lang="ts">
import { CfCrashPane, CfDropzone } from '@chufix-design/vue';
</script>

<template>
  <div style="height: 280px;">
    <CfCrashPane>
      <template #panel-dialog><p style="color: var(--fg-2);">崩溃确认对话框（CfModal + 红色确认）。</p></template>
      <template #panel-stack><pre style="font-family: var(--font-mono); font-size: 11px; color: var(--fg-2);">at fetchOrders (orders.ts:42)
at handleSubmit (form.ts:18)
at click (button.ts:7)</pre></template>
      <template #panel-uploader>
        <CfDropzone />
      </template>
      <template #panel-safemode><p style="color: var(--fg-2);">安全模式启动入口。</p></template>
    </CfCrashPane>
  </div>
</template>
