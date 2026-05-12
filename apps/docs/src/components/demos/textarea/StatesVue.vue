<script setup lang="ts">
import { ref } from 'vue';
import { CfTextarea } from '@chufix-design/vue';

const a = ref<string>('禁用状态下不可输入也不可获取焦点');
const b = ref<string>('只读：可以选中复制，但不能修改');
const c = ref<string>('错误态：边框与焦点环都会变红，常用于校验失败');
</script>

<template>
  <div class="demo-stack">
    <CfTextarea v-model="a" disabled :rows="2" />
    <CfTextarea v-model="b" readonly :rows="2" />
    <CfTextarea v-model="c" error    :rows="2" />
  </div>
</template>
