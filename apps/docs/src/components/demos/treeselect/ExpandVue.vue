<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeSelect, type TreeSelectNode } from '@chufix-design/vue';

const a = ref<string | undefined>(undefined);
const b = ref<string | undefined>(undefined);

const options: TreeSelectNode[] = [
  {
    value: 'cn',
    label: '中国',
    children: [
      {
        value: 'cn-east',
        label: '华东',
        children: [
          { value: 'sh', label: '上海' },
          { value: 'hz', label: '杭州' },
        ],
      },
      {
        value: 'cn-south',
        label: '华南',
        children: [
          { value: 'gz', label: '广州' },
          { value: 'sz', label: '深圳' },
        ],
      },
    ],
  },
  {
    value: 'us',
    label: '美国',
    children: [
      { value: 'us-west', label: '西海岸' },
      { value: 'us-east', label: '东海岸' },
    ],
  },
];
</script>

<template>
  <div class="demo-stack">
    <CfTreeSelect
      v-model="a"
      :options="options"
      placeholder="默认全部展开"
      default-expanded-keys="all"
      searchable
    />
    <CfTreeSelect
      v-model="b"
      :options="options"
      placeholder="只展开根 + 华东"
      :default-expanded-keys="['cn', 'cn-east']"
    />
  </div>
</template>
