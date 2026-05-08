<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@chufix/vue';

const wifi = ref(true);
</script>

<template>
  <Switch v-model="wifi">Wi-Fi {{ wifi ? '已开启' : '已关闭' }}</Switch>
</template>
