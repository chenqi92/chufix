<script setup lang="ts">
import { CfSplitButton } from '@chufix/vue';
const items = [
  { label: 'Save', value: 'save' },
  { label: 'Save as draft', value: 'draft' },
  { label: 'Save and publish', value: 'publish' },
];
</script>

<template>
  <div class="demo-row">
    <CfSplitButton :items="items" @click="alert('Save')" @select="(v) => alert(`Picked: ${v}`)">
      Save
    </CfSplitButton>
    <CfSplitButton variant="secondary" :items="items">More</CfSplitButton>
    <CfSplitButton variant="danger" :items="[{label: '永久删除', value: 'delete', danger: true}]">Delete</CfSplitButton>
  </div>
</template>
