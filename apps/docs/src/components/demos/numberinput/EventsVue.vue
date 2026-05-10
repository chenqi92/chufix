<script setup lang="ts">
import { ref } from 'vue';
import { CfBadge, CfNumberInput, type NumberInputChangeReason } from '@chufix-design/vue';

const value = ref<number | null>(25);
const phase = ref('ready');
const logs = ref(['输入、步进或提交后会显示事件流。']);

function record(name: string, detail: string) {
  logs.value = [`${name}: ${detail}`, ...logs.value].slice(0, 5);
}

function onChange(next: number | null, meta: { raw: string; reason: NumberInputChangeReason }) {
  value.value = next;
  phase.value = meta.reason;
  record('change', `${String(next ?? 'null')} / raw=${meta.raw || 'empty'} / ${meta.reason}`);
}
</script>

<template>
  <div class="number-events">
    <CfNumberInput
      :model-value="value"
      name="retry-budget"
      :min="0"
      :max="100"
      :step="5"
      placeholder="0 - 100"
      @input="(raw) => record('input', raw || 'empty')"
      @change="onChange"
      @step="(next, meta) => record('step', `${next} / direction=${meta.direction}`)"
      @invalid="(meta) => {
        phase = 'invalid';
        record('invalid', `${meta.raw} 不是有效数字`);
      }"
      @focus="record('focus', 'focused')"
      @blur="record('blur', 'committed')"
    />
    <div class="number-events__status">
      <CfBadge tone="info" :content="phase" />
      <div class="number-events__log" aria-live="polite">
        <code v-for="entry in logs" :key="entry">{{ entry }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.number-events {
  display: grid;
  gap: 12px;
  width: min(100%, 420px);
}

.number-events__status {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.number-events__log {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.number-events__log code {
  white-space: normal;
}
</style>
