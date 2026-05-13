<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CfForm, CfFormField, CfInput, CfTextarea, CfSelect, CfButton, CfCheckbox } from '@chufix-design/vue';

const locked = ref<boolean>(true);
const model = reactive({
  name: '陈奇',
  role: 'admin',
  bio: '管理员',
  agree: true,
});
const roles = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
];
</script>

<template>
  <div class="demo-stack">
    <CfButton size="sm" variant="tertiary" @click="locked = !locked">
      {{ locked ? '解锁表单' : '锁定表单' }}
    </CfButton>
    <CfForm :model="model" :disabled="locked" layout="vertical">
      <CfFormField label="姓名" name="name">
        <CfInput v-model="model.name" />
      </CfFormField>
      <CfFormField label="角色" name="role">
        <CfSelect v-model="model.role" :options="roles" />
      </CfFormField>
      <CfFormField label="备注" name="bio">
        <CfTextarea v-model="model.bio" :rows="2" />
      </CfFormField>
      <CfFormField name="agree">
        <CfCheckbox v-model="model.agree">同意保留此账号</CfCheckbox>
      </CfFormField>
    </CfForm>
  </div>
</template>
