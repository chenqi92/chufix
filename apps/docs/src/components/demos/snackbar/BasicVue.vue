<script setup lang="ts">
import { ref } from 'vue';
import { CfSnackbar, CfButton } from '@chufix-design/vue';
const open = ref(false);
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = true">删除一项</CfButton>
    <CfSnackbar
      v-model:open="open"
      tone="success"
      message="Deleted login.request"
      action-label="撤销"
      action-shortcut="⌘Z"
      @action="open = false"
    />
  </div>
</template>
