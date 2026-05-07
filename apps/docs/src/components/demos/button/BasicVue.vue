<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@chukit/vue';

const count = ref(0);
const loading = ref(false);

async function load() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  loading.value = false;
}
</script>

<template>
  <div class="demo-row">
    <Button @click="count++">点击 {{ count }}</Button>
    <Button variant="soft">Soft</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button tone="danger">Danger</Button>
    <Button :loading="loading" @click="load">
      {{ loading ? '加载中' : '点击加载' }}
    </Button>
  </div>
</template>
