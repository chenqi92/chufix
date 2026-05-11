<script setup lang="ts">
import { computed } from 'vue';
import { diffLines, type DiffEditorProps } from './variants';

const props = withDefaults(defineProps<DiffEditorProps>(), {
  size: 'md',
  mode: 'split',
  showLineNumbers: true,
  leftLabel: '原文',
  rightLabel: '修改',
});

const rows = computed(() => diffLines(props.left, props.right));

const cls = computed(() => [
  'cf-diff',
  `cf-diff--${props.size}`,
  `cf-diff--${props.mode}`,
  props.showLineNumbers && 'cf-diff--gutter',
]);
</script>

<template>
  <div :class="cls">
    <div class="cf-diff__header">
      <span class="cf-diff__label cf-diff__label--left">{{ leftLabel }}</span>
      <span v-if="mode === 'split'" class="cf-diff__label cf-diff__label--right">{{
        rightLabel
      }}</span>
    </div>
    <div class="cf-diff__body">
      <template v-if="mode === 'split'">
        <div
          v-for="(row, i) in rows"
          :key="i"
          class="cf-diff__row"
          :data-op="row.op"
        >
          <span v-if="showLineNumbers" class="cf-diff__num cf-diff__num--left">{{
            row.leftLine ?? ''
          }}</span>
          <span class="cf-diff__cell cf-diff__cell--left" :data-empty="row.op === 'add' || undefined">
            <span v-if="row.op === 'del'" class="cf-diff__sigil">-</span>
            <span v-else-if="row.op === 'eq'" class="cf-diff__sigil"> </span>
            <span class="cf-diff__text">{{ row.leftText ?? '' }}</span>
          </span>
          <span v-if="showLineNumbers" class="cf-diff__num cf-diff__num--right">{{
            row.rightLine ?? ''
          }}</span>
          <span class="cf-diff__cell cf-diff__cell--right" :data-empty="row.op === 'del' || undefined">
            <span v-if="row.op === 'add'" class="cf-diff__sigil">+</span>
            <span v-else-if="row.op === 'eq'" class="cf-diff__sigil"> </span>
            <span class="cf-diff__text">{{ row.rightText ?? '' }}</span>
          </span>
        </div>
      </template>
      <template v-else>
        <template v-for="(row, i) in rows" :key="i">
          <div v-if="row.op !== 'add'" class="cf-diff__line" :data-op="row.op === 'eq' ? 'eq' : 'del'">
            <span v-if="showLineNumbers" class="cf-diff__num">{{ row.leftLine ?? '' }}</span>
            <span class="cf-diff__sigil">{{ row.op === 'del' ? '-' : ' ' }}</span>
            <span class="cf-diff__text">{{ row.leftText ?? '' }}</span>
          </div>
          <div v-if="row.op === 'add'" class="cf-diff__line" data-op="add">
            <span v-if="showLineNumbers" class="cf-diff__num">{{ row.rightLine ?? '' }}</span>
            <span class="cf-diff__sigil">+</span>
            <span class="cf-diff__text">{{ row.rightText ?? '' }}</span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
