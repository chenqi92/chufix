<script setup lang="ts">
import { ref } from 'vue';
import { CfSwitch } from '@chufix/vue';

const wifi = ref(true);
</script>

<template>
  <CfSwitch v-model="wifi">Wi-Fi {{ wifi ? '已开启' : '已关闭' }}</CfSwitch>
</template>
