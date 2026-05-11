<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfBadge, CfCheckbox, type CheckboxChangeMeta } from '@chufix-design/vue';

const read = ref(true);
const write = ref(false);
const deploy = ref(false);
const phase = ref('mixed');
const logs = ref(['切换权限后会显示 checked、name、value 与 indeterminate。']);

const selected = computed(() => [read.value, write.value, deploy.value].filter(Boolean).length);
const all = computed({
  get: () => selected.value === 3,
  set(next: boolean) {
    read.value = next;
    write.value = next;
    deploy.value = next;
  },
});
const indeterminate = computed(() => selected.value > 0 && selected.value < 3);

function record(name: string, checked: boolean, meta: CheckboxChangeMeta) {
  phase.value = meta.indeterminate ? 'mixed' : checked ? 'checked' : 'empty';
  logs.value = [
    `${name}: checked=${checked} / name=${meta.name ?? '-'} / value=${meta.value ?? '-'} / mixed=${meta.indeterminate}`,
    ...logs.value,
  ].slice(0, 5);
}
</script>

<template>
  <div class="checkbox-events">
    <CfCheckbox
      v-model="all"
      name="permissions"
      value="all"
      :indeterminate="indeterminate"
      @change="(checked, meta) => record('all', checked, meta)"
    >
      全部权限
    </CfCheckbox>
    <div class="checkbox-events__children">
      <CfCheckbox v-model="read" name="permissions" value="read" @change="(checked, meta) => record('read', checked, meta)">读取</CfCheckbox>
      <CfCheckbox v-model="write" name="permissions" value="write" @change="(checked, meta) => record('write', checked, meta)">写入</CfCheckbox>
      <CfCheckbox v-model="deploy" name="permissions" value="deploy" @change="(checked, meta) => record('deploy', checked, meta)">发布</CfCheckbox>
    </div>
    <div class="checkbox-events__status">
      <CfBadge tone="info" :content="phase" />
      <div class="checkbox-events__log" aria-live="polite">
        <code v-for="entry in logs" :key="entry">{{ entry }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkbox-events {
  display: grid;
  gap: 12px;
  width: min(100%, 560px);
}

.checkbox-events__children {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-left: 24px;
}

.checkbox-events__status {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-events__log {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.checkbox-events__log code {
  white-space: normal;
}
</style>
