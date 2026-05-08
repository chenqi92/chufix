<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@chufix/vue';

const a = ref(false);
const b = ref(false);
</script>

<template>
  <div class="demo-row">
    <Button variant="tertiary" @click="a = true">禁用遮罩关闭</Button>
    <Button variant="tertiary" @click="b = true">隐藏 × 按钮</Button>
  </div>

  <Modal v-model:open="a" title="只能从底部关闭" :close-on-overlay="false">
    <p style="margin: 0;">点遮罩不会关闭，只能用 Esc 或下面的按钮。</p>
    <template #footer>
      <Button @click="a = false">我知道了</Button>
    </template>
  </Modal>

  <Modal v-model:open="b" title="无右上角 ×" :show-close="false">
    <p style="margin: 0;">这个 Modal 隐藏了右上角的关闭按钮，必须靠 footer 操作或 Esc 关闭。</p>
    <template #footer>
      <Button @click="b = false">关闭</Button>
    </template>
  </Modal>
</template>
