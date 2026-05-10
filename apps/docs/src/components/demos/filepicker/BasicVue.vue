<script setup lang="ts">
import { ref } from 'vue';
import { CfFilePicker } from '@chufix-design/vue';
const files = ref<File[]>([]);
</script>

<template>
  <CfFilePicker v-model="files" multiple accept="image/*,application/json" />
</template>
