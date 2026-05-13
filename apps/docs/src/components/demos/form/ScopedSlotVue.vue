<script setup lang="ts">
import { reactive } from 'vue';
import { CfForm, CfFormField, CfButton } from '@chufix-design/vue';

const model = reactive({ url: '' });
const rules = {
  url: [{ required: true, type: 'url' as const, message: '请输入合法 URL' }],
};

function onSubmit(e: { valid: boolean; values: Record<string, unknown> }): void {
  if (e.valid) alert(`提交：${(e.values as { url: string }).url}`);
}
</script>

<template>
  <CfForm :model="model" :rules="rules" layout="vertical" @submit="onSubmit">
    <CfFormField label="资源地址" name="url" hint="必须是 http(s):// 开头">
      <template #default="{ id, describedBy, invalid }">
        <input
          :id="id"
          v-model="model.url"
          :aria-describedby="describedBy"
          :aria-invalid="invalid"
          placeholder="https://example.com"
          class="raw-input"
        />
      </template>
    </CfFormField>
    <CfButton variant="primary" type="submit">提交</CfButton>
  </CfForm>
</template>

<style scoped>
.raw-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--line-2);
  border-radius: var(--r-4);
  background: var(--bg-inset);
  color: var(--fg-1);
  font: inherit;
}
.raw-input[aria-invalid='true'] {
  border-color: var(--status-error);
}
.raw-input:focus { outline: none; box-shadow: var(--focus-ring); }
</style>
