<script setup lang="ts">
import { CfCrashPane, CfDropzone, CfBanner, CfButton } from '@chufix-design/vue';
</script>

<template>
  <div style="height: 320px;">
    <CfCrashPane>
      <template #panel-dialog>
        <CfBanner tone="error" title="应用意外崩溃" description="UncaughtTypeError: cannot read property 'foo' of undefined">
          <template #actions>
            <CfButton variant="danger" size="sm">重启</CfButton>
          </template>
        </CfBanner>
      </template>
      <template #panel-stack>
        <pre style="margin: 0; padding: 8px; font-family: var(--font-mono); font-size: 11px; line-height: 16px; color: var(--fg-1); background: var(--bg-2); border-radius: var(--r-3); overflow-x: auto;">TypeError: Cannot read property 'foo' of undefined
  at fetchOrders (orders.ts:42:18)
  at handleSubmit (form.ts:18:7)
  at Object.click (button.ts:7:23)
  at HTMLButtonElement.&lt;anonymous&gt; (event.ts:14:9)</pre>
      </template>
      <template #panel-uploader>
        <CfDropzone />
      </template>
      <template #panel-safemode>
        <CfBanner tone="warning" title="进入安全模式将禁用所有插件" description="只保留核心组件，便于排查冲突。" />
        <div style="margin-top: 12px;">
          <CfButton variant="secondary">进入安全模式</CfButton>
        </div>
      </template>
    </CfCrashPane>
  </div>
</template>
