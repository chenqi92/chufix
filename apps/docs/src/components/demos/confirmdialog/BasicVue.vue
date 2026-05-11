<script setup lang="ts">
import { ref } from 'vue';
import { CfConfirmDialog, CfButton } from '@chufix-design/vue';
const open = ref(false);
const dangerOpen = ref(false);
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = true">提示确认</CfButton>
    <CfButton variant="danger" @click="dangerOpen = true">危险确认</CfButton>
    <CfConfirmDialog
      v-model:open="open"
      title="确认操作"
      description="这个操作可以稍后撤销。"
      @confirm="open = false"
    />
    <CfConfirmDialog
      v-model:open="dangerOpen"
      tone="danger"
      title="永久删除？"
      description="此操作不可逆，相关数据会立即销毁。"
      confirm-text="永久删除"
      @confirm="dangerOpen = false"
    />
  </div>
</template>
