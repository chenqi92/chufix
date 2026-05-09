<script setup lang="ts">
import { computed } from 'vue';
import { diffJson, jsonDiffClass, type JsonDiffProps } from './variants';

const props = withDefaults(defineProps<JsonDiffProps>(), {
  size: 'md',
  bordered: true,
  lineNumbers: true,
});

const lines = computed(() => diffJson(props.left, props.right));
const cls = computed(() =>
  jsonDiffClass({
    size: props.size,
    bordered: props.bordered,
    lineNumbers: props.lineNumbers,
    className: props.className,
  }),
);

function sigil(op: 'eq' | 'add' | 'del') {
  return op === 'add' ? '+' : op === 'del' ? '-' : ' ';
}
</script>

<template>
  <pre :class="cls">
<span
  v-for="(line, i) in lines"
  :key="i"
  :class="['cf-jdiff__line', `cf-jdiff__line--${line.op}`]"
><span v-if="lineNumbers" class="cf-jdiff__num">{{ i + 1 }}</span><span class="cf-jdiff__sigil">{{ sigil(line.op) }}</span><span class="cf-jdiff__text">{{ line.text }}</span>
</span></pre>
</template>
