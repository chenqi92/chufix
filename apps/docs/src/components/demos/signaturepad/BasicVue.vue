<script setup lang="ts">
import { ref } from 'vue';
import { CfSignaturePad, CfButton } from '@chufix-design/vue';

const pad = ref<InstanceType<typeof CfSignaturePad> | null>(null);
const empty = ref(true);
const preview = ref('');

function onChange(isEmpty: boolean) {
  empty.value = isEmpty;
  if (!isEmpty) preview.value = pad.value?.toDataURL() ?? '';
}
function doClear() {
  pad.value?.clear();
  preview.value = '';
}
function doExport() {
  if (!pad.value) return;
  preview.value = pad.value.toDataURL();
}
</script>

<template>
  <div class="sig-demo">
    <CfSignaturePad
      ref="pad"
      :height="160"
      stroke-color="#f8fafc"
      background="oklch(20% 0.012 260)"
      @change="onChange"
    />
    <div class="sig-demo__bar">
      <CfButton variant="tertiary" :disabled="empty" @click="doClear">清空</CfButton>
      <CfButton variant="primary" :disabled="empty" @click="doExport">导出 PNG</CfButton>
    </div>
    <img v-if="preview" :src="preview" class="sig-demo__preview" alt="signature" />
  </div>
</template>

<style scoped>
.sig-demo {
  display: grid;
  gap: 10px;
}
.sig-demo__bar {
  display: flex;
  gap: 8px;
}
.sig-demo__preview {
  max-height: 60px;
  background: #fff;
  border-radius: var(--r-2);
  padding: 4px;
}
</style>
