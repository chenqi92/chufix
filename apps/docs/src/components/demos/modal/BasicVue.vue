<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@chufix/vue';

const open = ref(false);
</script>

<template>
  <Button @click="open = true">打开 Modal</Button>
  <Modal v-model:open="open" title="确认操作">
    <p style="margin: 0;">这是一个最简弹窗。点击遮罩 / Esc / × 都能关闭。</p>
    <template #footer>
      <Button variant="ghost" @click="open = false">取消</Button>
      <Button @click="open = false">确定</Button>
    </template>
  </Modal>
</template>
