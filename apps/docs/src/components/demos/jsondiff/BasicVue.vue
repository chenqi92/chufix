<script setup lang="ts">
import { CfJsonDiff } from '@chufix/vue';

const left = {
  name: 'ChuFix',
  version: '0.1.0',
  features: ['theme', 'density'],
  beta: true,
};
const right = {
  name: 'ChuFix UI',
  version: '0.2.0',
  features: ['theme', 'density', 'i18n'],
  beta: false,
};
</script>

<template>
  <CfJsonDiff :left="left" :right="right" />
</template>
