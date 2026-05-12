<script setup lang="ts">
import { ref } from 'vue';
import { CfIconButton, CfIcon } from '@chufix-design/vue';

const bold = ref<boolean>(false);
const italic = ref<boolean>(false);
const underline = ref<boolean>(false);
</script>

<template>
  <div class="adm-toolbar">
    <CfIconButton :pressed="bold"      aria-label="粗体"  @click="bold = !bold">
      <CfIcon name="bold" />
    </CfIconButton>
    <CfIconButton :pressed="italic"    aria-label="斜体"  @click="italic = !italic">
      <CfIcon name="italic" />
    </CfIconButton>
    <CfIconButton :pressed="underline" aria-label="下划线" @click="underline = !underline">
      <CfIcon name="underline" />
    </CfIconButton>
    <span class="adm-toolbar__sep" aria-hidden="true" />
    <CfIconButton aria-label="对齐：左">
      <CfIcon name="align-left" />
    </CfIconButton>
    <CfIconButton aria-label="对齐：居中">
      <CfIcon name="align-center" />
    </CfIconButton>
    <CfIconButton aria-label="对齐：右">
      <CfIcon name="align-right" />
    </CfIconButton>
  </div>
</template>

<style scoped>
.adm-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
}
.adm-toolbar__sep {
  width: 1px;
  height: 18px;
  background: var(--line-1);
  margin: 0 4px;
}
</style>
