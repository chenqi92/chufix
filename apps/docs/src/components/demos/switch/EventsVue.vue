<script setup lang="ts">
import { ref } from 'vue';
import { CfBadge, CfSwitch, type SwitchChangeMeta } from '@chufix-design/vue';

const enabled = ref(false);
const loading = ref(false);
const phase = ref('idle');
const logs = ref(['点击开关后会模拟异步提交，并显示事件 meta。']);

function push(entry: string) {
  logs.value = [entry, ...logs.value].slice(0, 5);
}

async function onChange(next: boolean, meta: SwitchChangeMeta) {
  loading.value = true;
  phase.value = 'saving';
  push(`change: checked=${next} / name=${meta.name ?? '-'}`);
  await new Promise((resolve) => setTimeout(resolve, 450));
  enabled.value = next;
  loading.value = false;
  phase.value = next ? 'enabled' : 'disabled';
  push(`saved: ${next ? 'enabled' : 'disabled'}`);
}
</script>

<template>
  <div class="switch-events">
    <CfSwitch
      :model-value="enabled"
      :loading="loading"
      name="auto-sync"
      @change="onChange"
      @focus="push('focus: trigger focused')"
      @blur="push('blur: trigger blurred')"
    >
      自动同步
    </CfSwitch>
    <div class="switch-events__status">
      <CfBadge tone="info" :content="phase" />
      <div class="switch-events__log" aria-live="polite">
        <code v-for="entry in logs" :key="entry">{{ entry }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch-events {
  display: grid;
  gap: 12px;
  width: min(100%, 460px);
}

.switch-events__status {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.switch-events__log {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.switch-events__log code {
  white-space: normal;
}
</style>
