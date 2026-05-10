<script setup lang="ts">
import { ref } from 'vue';
import {
  CfBadge,
  CfSelect,
  type SelectChangeMeta,
  type SelectOption,
  type SelectValue,
} from '@chufix-design/vue';

const options: SelectOption[] = [
  { value: 'api', label: 'API 事件' },
  { value: 'audit', label: '审计筛选' },
  { value: 'release', label: '发布分组' },
  { value: 'locked', label: '锁定项（不可选）', disabled: true },
];

const value = ref<SelectValue>('api');
const active = ref('api');
const logs = ref(['等待交互：打开菜单、移动 active、选择或清空。']);

function record(name: string, detail: string) {
  logs.value = [`${name}: ${detail}`, ...logs.value].slice(0, 4);
}

function onChange(next: SelectValue, meta: SelectChangeMeta) {
  value.value = next;
  record('change', `${String(next ?? 'null')} / ${meta.option?.label ?? '无选项'}`);
}

function onSelect(option: SelectOption) {
  active.value = String(option.value ?? '');
  record('select', option.label);
}

function onActiveChange(option: SelectOption | null, index: number) {
  active.value = option ? String(option.value) : 'none';
  record('active-change', `${index} / ${option?.label ?? '无'}`);
}
</script>

<template>
  <div class="select-events">
    <CfSelect
      :model-value="value"
      :options="options"
      placeholder="选择记录类型"
      clearable
      name="select-event-demo"
      @change="onChange"
      @select="onSelect"
      @clear="record('clear', 'value 已重置为 null')"
      @open-change="(open) => record('open-change', open ? 'opened' : 'closed')"
      @active-change="onActiveChange"
      @focus="record('focus', 'trigger focused')"
      @blur="record('blur', 'trigger blurred')"
    />
    <div class="select-events__status">
      <CfBadge tone="info" :content="active || 'none'" />
      <div class="select-events__log" aria-live="polite">
        <code v-for="entry in logs" :key="entry">{{ entry }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-events {
  display: grid;
  gap: 12px;
  width: min(100%, 420px);
}

.select-events__status {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.select-events__log {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.select-events__log code {
  white-space: normal;
}
</style>
