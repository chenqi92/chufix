<script setup lang="ts">
import { ref } from 'vue';
import { CfResult, CfButton, CfStatusCodeBadge, CfDescriptionList } from '@chufix-design/vue';
const retrying = ref(false);
async function retry() {
  retrying.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  retrying.value = false;
}
const debug = [
  { label: 'URL', value: 'https://api.protoforge.io/v1/orders' },
  { label: 'Method', value: 'GET' },
  { label: 'Status', value: '0 (network unreachable)' },
  { label: 'Trace', value: 'a8b2-3914-c012' },
];
</script>

<template>
  <div class="err">
    <CfResult
      status="500"
      title="网络异常"
      description="无法连接到服务，请检查你的网络或稍后重试。"
    >
      <template #footer>
        <div class="err__actions">
          <CfButton variant="primary" :loading="retrying" @click="retry">{{ retrying ? '重试中…' : '重试' }}</CfButton>
          <CfButton variant="tertiary">检测网络</CfButton>
        </div>
        <details class="err__debug">
          <summary>诊断信息</summary>
          <CfDescriptionList :items="debug" />
        </details>
      </template>
    </CfResult>
  </div>
</template>

<style scoped>
.err {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 540px;
  font-family: var(--font-sans);
}
.err__actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 12px;
}
.err__debug {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 12px;
  font-size: var(--t-12);
  color: var(--fg-3);
}
.err__debug > summary {
  cursor: pointer;
  margin-bottom: 8px;
}
</style>
