<script setup lang="ts">
import { ref } from 'vue';
import { CfBadge, CfRadio, CfRadioGroup, type RadioChangeMeta } from '@chufix-design/vue';

const region = ref<'cn' | 'eu' | 'us'>('cn');
const logs = ref(['切换区域后会显示 value、name 与 checked。']);

function record(value: string | number | boolean | null, meta: RadioChangeMeta) {
  logs.value = [
    `change: value=${value ?? '-'} / name=${meta.name ?? '-'} / checked=${meta.checked}`,
    ...logs.value,
  ].slice(0, 5);
}
</script>

<template>
  <div class="radio-events">
    <CfRadioGroup v-model="region" name="deploy-region" direction="column" @change="record">
      <CfRadio value="cn">华东节点 · 低延迟</CfRadio>
      <CfRadio value="eu">欧洲节点 · 合规隔离</CfRadio>
      <CfRadio value="us">美西节点 · 灰度发布</CfRadio>
    </CfRadioGroup>
    <div class="radio-events__status">
      <CfBadge tone="info" :content="region" />
      <div class="radio-events__log" aria-live="polite">
        <code v-for="entry in logs" :key="entry">{{ entry }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radio-events {
  display: grid;
  gap: 12px;
  width: min(100%, 560px);
}

.radio-events__status {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.radio-events__log {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.radio-events__log code {
  white-space: normal;
}
</style>
