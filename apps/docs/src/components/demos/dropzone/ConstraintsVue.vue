<script setup lang="ts">
import { ref } from 'vue';
import { CfDropzone, type DropzoneRejection } from '@chufix/vue';

const files = ref<File[]>([]);
const reasons: Record<string, string> = {
  'too-large': '超出 1 MB',
  'too-many': '最多 3 个',
  'wrong-type': '只接受图片',
  duplicate: '重复',
};
const errors = ref<string[]>([]);

function onReject(items: DropzoneRejection[]) {
  errors.value = items.map((it) => `${it.file.name} · ${reasons[it.reason]}`);
  setTimeout(() => (errors.value = []), 4000);
}
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px;">
    <CfDropzone
      v-model="files"
      accept="image/*"
      :max-size="1024 * 1024"
      :max-files="3"
      hint="只接受图片，单文件最大 1 MB，最多 3 个"
      @reject="onReject"
    />
    <ul
      v-if="errors.length"
      style="margin: 0; padding-left: 16px; font-size: 12px; color: var(--status-error);"
    >
      <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
    </ul>
  </div>
</template>
