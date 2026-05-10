<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfSelect, type SelectOption } from '@chufix-design/vue';

const COUNTRIES = [
  '中国', '日本', '韩国', '美国', '加拿大', '英国', '法国', '德国',
  '意大利', '西班牙', '葡萄牙', '荷兰', '比利时', '瑞士', '瑞典',
  '挪威', '丹麦', '芬兰', '俄罗斯', '巴西', '墨西哥', '阿根廷',
  '澳大利亚', '新西兰', '南非', '埃及', '印度', '新加坡', '马来西亚',
  '泰国', '越南', '印度尼西亚', '土耳其', '希腊', '波兰', '捷克',
];

const options: SelectOption[] = COUNTRIES.map((c) => ({ value: c, label: c }));
const value = ref<string | null>(null);
</script>

<template>
  <CfSelect
    v-model="value"
    searchable
    clearable
    :options="options"
    placeholder="选择国家 / 地区"
    style="max-width: 280px;"
  />
</template>
