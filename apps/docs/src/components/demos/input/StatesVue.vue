<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@chukit/vue';

const v = ref('outline 默认');
const f = ref('filled 变体');
const g = ref('ghost 下划线');
const e = ref('错误状态');
</script>

<template>
  <div style="display: grid; gap: 0.75rem; max-width: 22rem;">
    <Input v-model="v" />
    <Input v-model="f" variant="filled" />
    <Input v-model="g" variant="ghost" />
    <Input v-model="e" error />
    <Input model-value="禁用" disabled />
    <Input size="sm" placeholder="sm 尺寸" />
    <Input size="lg" placeholder="lg 尺寸" />
  </div>
</template>
