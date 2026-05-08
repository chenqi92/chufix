<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@chufix/vue';

const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
const open = ref(false);

function show(s: typeof size.value) {
  size.value = s;
  open.value = true;
}
</script>

<template>
  <div class="demo-row">
    <Button variant="outline" @click="show('sm')">sm</Button>
    <Button variant="outline" @click="show('md')">md</Button>
    <Button variant="outline" @click="show('lg')">lg</Button>
    <Button variant="outline" @click="show('xl')">xl</Button>
    <Button variant="outline" @click="show('full')">full</Button>
  </div>
  <Modal v-model:open="open" :size="size" :title="`size = ${size}`">
    <p style="margin: 0;">点上面不同的按钮可以切换 Modal 的尺寸。</p>
  </Modal>
</template>
