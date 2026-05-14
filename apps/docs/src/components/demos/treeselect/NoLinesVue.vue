<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeSelect, type TreeSelectNode } from '@chufix-design/vue';

const value = ref<string | undefined>(undefined);
const options: TreeSelectNode[] = [
  {
    value: 'design',
    label: '设计系统',
    children: [
      { value: 'tokens', label: 'Tokens' },
      { value: 'components', label: 'Components' },
    ],
  },
  {
    value: 'engineering',
    label: '工程',
    children: [
      { value: 'frontend', label: '前端' },
      { value: 'backend', label: '后端' },
    ],
  },
];
</script>

<template>
  <CfTreeSelect
    v-model="value"
    :options="options"
    placeholder="紧凑：关闭引导线"
    :show-lines="false"
    default-expanded-keys="all"
  />
</template>
