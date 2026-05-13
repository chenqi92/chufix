<script setup lang="ts">
import { ref } from 'vue';
import { CfCombobox, type ComboboxOption } from '@chufix-design/vue';

const value = ref<string | number | null>(null);

const options: ComboboxOption[] = [
  { value: 'beijing', label: '北京 · BJ · 010' },
  { value: 'shanghai', label: '上海 · SH · 021' },
  { value: 'guangzhou', label: '广州 · GZ · 020' },
  { value: 'shenzhen', label: '深圳 · SZ · 0755' },
  { value: 'hangzhou', label: '杭州 · HZ · 0571' },
  { value: 'chengdu', label: '成都 · CD · 028' },
];

// 拼音首字母 / 区号 / 全称都能匹配
function fuzzy(query: string, opt: ComboboxOption): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    opt.label.toLowerCase().includes(q) ||
    String(opt.value).toLowerCase().includes(q)
  );
}
</script>

<template>
  <CfCombobox
    v-model="value"
    :options="options"
    :filter="fuzzy"
    placeholder="输入拼音 / 区号 / 城市名"
    clearable
  />
  <p class="adm-hint">
    自定义 <code>filter(query, option)</code> 同时匹配中文名、拼音和区号 — 试试输入 "021"。
  </p>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-top: 8px; }
code { font-family: var(--font-mono); color: var(--fg-2); }
</style>
