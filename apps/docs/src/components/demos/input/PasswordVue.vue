<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfInput, CfIconButton, CfIcon } from '@chufix-design/vue';

const pwd = ref<string>('');
const visible = ref<boolean>(false);
const inputType = computed<'text' | 'password'>(() => (visible.value ? 'text' : 'password'));
</script>

<template>
  <CfInput v-model="pwd" :type="inputType" placeholder="请输入密码">
    <template #suffix>
      <CfIconButton
        size="sm"
        :aria-label="visible ? '隐藏密码' : '显示密码'"
        :pressed="visible"
        @click="visible = !visible"
      >
        <CfIcon :name="visible ? 'eye-off' : 'eye'" />
      </CfIconButton>
    </template>
  </CfInput>
</template>
