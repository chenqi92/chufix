<script setup lang="ts">
import { ref } from 'vue';
import { CfRegexBuilder } from '@chufix-design/vue';
const pattern = ref('\\b([A-Z][a-z]+)\\s(\\d+)');
const flags = ref('g');
const text = ref('Order 1234, Item 9876, Refund 42, Login 7890');
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
