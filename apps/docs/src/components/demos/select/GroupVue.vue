<script setup lang="ts">
import { ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix-design/vue';

const options: SelectOption[] = [
  { value: 'us-east', label: 'US East', group: '美洲' },
  { value: 'us-west', label: 'US West', group: '美洲' },
  { value: 'sa-east', label: 'SA East', group: '美洲' },
  { value: 'eu-west', label: 'EU West', group: '欧洲' },
  { value: 'eu-central', label: 'EU Central', group: '欧洲' },
  { value: 'ap-tokyo', label: 'AP Tokyo', group: '亚太' },
  { value: 'ap-singapore', label: 'AP Singapore', group: '亚太' },
  { value: 'ap-shanghai', label: 'AP Shanghai', group: '亚太' },
];

const value = ref<string | null>('eu-west');
</script>

<template>
  <CfSelect
    v-model="value"
    searchable
    :options="options"
    placeholder="选择 region"
    style="max-width: 280px;"
  />
</template>
