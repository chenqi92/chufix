<script setup lang="ts">
import { ref } from 'vue';
import { CfVariableAwareInput } from '@chufix-design/vue';

const value = ref('请求 {{base_url}}/v2/users/{{user_id}}?token={{token}}');
const lastAction = ref('输入 {{ 触发候选；点击变量查看详情。');
const variables = [
  {
    name: 'base_url',
    label: 'Base URL',
    value: 'https://api.chufix.dev',
    description: '项目级 API 根地址，可在弹层中修改。',
    scope: 'project',
    editable: true,
  },
  {
    name: 'user_id',
    label: 'User ID',
    value: 'u_1024',
    description: '当前登录用户 ID。',
    scope: 'local',
  },
  {
    name: 'token',
    label: 'Auth Token',
    value: 'cf_live_xxx',
    description: '授权令牌，由外层业务控制保存。',
    scope: 'global',
    editable: true,
  },
];
</script>

<template>
  <div style="width: 100%; max-width: 920px;">
    <CfVariableAwareInput
      v-model="value"
      :variables="variables"
      placeholder="输入 {{ 触发变量选择"
      @variable-select="(variable) => lastAction = `插入变量：${variable.name}`"
      @variable-update="(payload) => lastAction = `请求更新 ${payload.name} = ${payload.value}`"
      @variable-create="(payload) => lastAction = `请求创建变量：${payload.name}`"
    />
    <div style="margin-top: 10px; color: var(--fg-3); font-size: 12px;">
      {{ lastAction }}
    </div>
  </div>
</template>
