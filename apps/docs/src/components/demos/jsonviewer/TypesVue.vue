<script setup lang="ts">
import { CfJsonViewer } from '@chufix/vue';

const data = {
  string: '混合 中英文 with emoji 🎯',
  multilineString: 'line one\nline two',
  positiveNumber: 12345.678,
  negativeNumber: -0.42,
  zero: 0,
  trueValue: true,
  falseValue: false,
  nullValue: null,
  undefinedValue: undefined,
  emptyArray: [],
  emptyObject: {},
  nestedArray: [1, [2, [3, [4]]]],
};
</script>

<template>
  <CfJsonViewer :data="data" :default-expand-depth="2" show-types />
</template>
