<script setup lang="ts">
import { ref } from 'vue';
import { CfRegexBuilder } from '@chufix/vue';
const pattern = ref('([unbalanced');
const flags = ref('g');
const text = ref('试试在上面输入合法的 pattern，比如 [a-z]+');
</script>

<template>
  <CfRegexBuilder
    :pattern="pattern"
    :flags="flags"
    :test-text="text"
    @update:pattern="(v) => pattern = v"
    @update:flags="(v) => flags = v"
    @update:test-text="(v) => text = v"
  />
</template>
