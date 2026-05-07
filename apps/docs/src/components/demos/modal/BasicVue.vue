<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal, Input } from '@chukit/vue';

const open = ref(false);
const openLg = ref(false);
const name = ref('');

function submit() {
  open.value = false;
  alert(`Vue 提交：${name.value || '空'}`);
}
</script>

<template>
  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
    <Button @click="open = true">打开 Modal</Button>
    <Button variant="outline" @click="openLg = true">大尺寸（lg）</Button>
  </div>

  <Modal v-model:open="open" title="新建项目">
    <p style="margin: 0 0 0.75rem 0;">填写项目名后回车或点击「创建」。试试 Tab、Shift+Tab、Esc。</p>
    <Input v-model="name" placeholder="项目名" autofocus />
    <template #footer>
      <Button variant="ghost" @click="open = false">取消</Button>
      <Button @click="submit">创建</Button>
    </template>
  </Modal>

  <Modal v-model:open="openLg" size="lg" title="大尺寸">
    <p>这个 Modal 用 <code>size="lg"</code>，最大宽度 640px。</p>
    <p style="color: hsl(var(--ck-muted-fg));">
      点击遮罩或按 Esc 都能关掉，可以在 props 里关掉这两个行为。
    </p>
    <template #footer>
      <Button @click="openLg = false">知道了</Button>
    </template>
  </Modal>
</template>
