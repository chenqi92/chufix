<script setup lang="ts">
import { ref, watch } from 'vue';
import { CfDropzone, type DropzoneFileStatus } from '@chufix-design/vue';

const files = ref<File[]>([]);
const statuses = ref<DropzoneFileStatus[]>([]);

watch(files, (next) => {
  statuses.value = next.map((_, i) => statuses.value[i] ?? { progress: 0, status: 'pending' });
  next.forEach((_, i) => simulate(i));
});

function simulate(i: number) {
  if (statuses.value[i].status === 'success') return;
  statuses.value[i] = { progress: 0, status: 'uploading' };
  const tick = () => {
    const cur = statuses.value[i];
    if (!cur || cur.status !== 'uploading') return;
    const next = (cur.progress ?? 0) + 8 + Math.random() * 12;
    if (next >= 100) {
      statuses.value[i] = { progress: 100, status: 'success' };
    } else {
      statuses.value[i] = { progress: next, status: 'uploading' };
      setTimeout(tick, 280);
    }
  };
  setTimeout(tick, 200);
}
</script>

<template>
  <CfDropzone v-model="files" :statuses="statuses" hint="选择文件后会模拟上传进度" />
</template>
