<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfBulkSelectionBar, CfButton } from '@chufix-design/vue';

const total = 12;
const selected = ref<number[]>([1, 3, 5]);

function toggle(id: number) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((x) => x !== id)
    : [...selected.value, id];
}

const allOn = computed(() => selected.value.length === total);
function selectAll() {
  selected.value = allOn.value ? [] : Array.from({ length: total }, (_, i) => i);
}
function onDelete() {
  selected.value = [];
}
</script>

<template>
  <div class="demo-scope">
    <CfBulkSelectionBar
      :count="selected.length"
      :total="total"
      position="inline"
      @clear="selected = []"
    >
      <CfButton size="sm" variant="tertiary" @click="selectAll">{{ allOn ? '取消全选' : '全选' }}</CfButton>
      <CfButton size="sm" variant="tertiary">归档</CfButton>
      <CfButton size="sm" variant="tertiary" @click="onDelete">删除</CfButton>
    </CfBulkSelectionBar>
    <ul class="demo-list">
      <li v-for="i in total" :key="i" :class="selected.includes(i - 1) && 'is-selected'">
        <input type="checkbox" :checked="selected.includes(i - 1)" @change="toggle(i - 1)" />
        条目 #{{ i }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.demo-scope { display: flex; flex-direction: column; gap: 12px; }
.demo-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.demo-list li { padding: 8px; background: var(--bg-2); border-radius: var(--r-4); display: flex; align-items: center; gap: 8px; }
.demo-list li.is-selected { background: var(--accent-soft); color: var(--accent-1); }
</style>
