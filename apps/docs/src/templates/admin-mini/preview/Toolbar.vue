<script setup lang="ts">
/**
 * admin-mini 演示顶部的"切换器"工具条。
 * 让浏览者直接看到主题 / 密度 / 菜单形态 / 主色 / 语言切换的实时效果。
 * 「查看源码」按钮通过 window CustomEvent 通知外层 Astro 容器开关源码面板。
 */
import { inject, ref, onMounted, onBeforeUnmount } from 'vue';
import { CfButton, CfSegmentedControl } from '@chufix-design/vue';
import {
  DemoStateKey,
  STRINGS,
  type DemoTheme,
  type DemoDensity,
  type DemoMenuForm,
  type DemoAccent,
  type DemoLocale,
} from './state';

const state = inject(DemoStateKey)!;
const sourceOpen = ref(false);

function s() { return STRINGS[state.locale.value]; }

function emitToggle() {
  sourceOpen.value = !sourceOpen.value;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chufix-tpl:toggle-source', { detail: { open: sourceOpen.value } }));
  }
}

function onSync(e: Event) {
  const ce = e as CustomEvent<{ open: boolean }>;
  sourceOpen.value = !!ce.detail?.open;
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('chufix-tpl:sync-source', onSync);
  }
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('chufix-tpl:sync-source', onSync);
  }
});

const themeOpts = (): { value: DemoTheme; label: string }[] => [
  { value: 'dark-cool', label: s().theme_dark_cool },
  { value: 'dark-warm', label: s().theme_dark_warm },
  { value: 'light',     label: s().theme_light },
];

const densityOpts = (): { value: DemoDensity; label: string }[] => [
  { value: 'comfortable', label: s().density_comfortable },
  { value: 'compact',     label: s().density_compact },
];

const menuOpts = (): { value: DemoMenuForm; label: string }[] => [
  { value: 'sidebar',   label: s().menu_sidebar },
  { value: 'topbar',    label: s().menu_topbar },
  { value: 'collapsed', label: s().menu_collapsed },
];

const accentOpts: { value: DemoAccent; color: string }[] = [
  { value: 'blue',   color: 'oklch(64% 0.16 263)' },
  { value: 'green',  color: 'oklch(68% 0.16 150)' },
  { value: 'purple', color: 'oklch(64% 0.18 300)' },
  { value: 'orange', color: 'oklch(72% 0.16 60)' },
  { value: 'rose',   color: 'oklch(66% 0.18 15)' },
];

const localeOpts: { value: DemoLocale; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'EN' },
];
</script>

<template>
  <div class="adm-toolbar">
    <div class="adm-toolbar__group">
      <span class="adm-toolbar__label">{{ s().switch_theme }}</span>
      <CfSegmentedControl
        :model-value="state.theme.value"
        :items="themeOpts().map(o => ({ value: o.value, label: o.label }))"
        size="sm"
        @update:modelValue="(v: string) => (state.theme.value = v as DemoTheme)"
      />
    </div>
    <div class="adm-toolbar__group">
      <span class="adm-toolbar__label">{{ s().switch_density }}</span>
      <CfSegmentedControl
        :model-value="state.density.value"
        :items="densityOpts().map(o => ({ value: o.value, label: o.label }))"
        size="sm"
        @update:modelValue="(v: string) => (state.density.value = v as DemoDensity)"
      />
    </div>
    <div class="adm-toolbar__group">
      <span class="adm-toolbar__label">{{ s().switch_menu }}</span>
      <CfSegmentedControl
        :model-value="state.menuForm.value"
        :items="menuOpts().map(o => ({ value: o.value, label: o.label }))"
        size="sm"
        @update:modelValue="(v: string) => (state.menuForm.value = v as DemoMenuForm)"
      />
    </div>
    <div class="adm-toolbar__group">
      <span class="adm-toolbar__label">{{ s().switch_accent }}</span>
      <div class="adm-toolbar__accents">
        <button
          v-for="o in accentOpts"
          :key="o.value"
          type="button"
          class="adm-toolbar__dot"
          :class="{ 'is-active': state.accent.value === o.value }"
          :style="{ background: o.color }"
          :aria-label="o.value"
          :aria-pressed="state.accent.value === o.value"
          @click="state.accent.value = o.value"
        />
      </div>
    </div>
    <div class="adm-toolbar__group">
      <span class="adm-toolbar__label">{{ s().switch_locale }}</span>
      <CfSegmentedControl
        :model-value="state.locale.value"
        :items="localeOpts.map(o => ({ value: o.value, label: o.label }))"
        size="sm"
        @update:modelValue="(v: string) => (state.locale.value = v as DemoLocale)"
      />
    </div>
    <div class="adm-toolbar__spacer" />
    <CfButton size="sm" :variant="sourceOpen ? 'secondary' : 'tertiary'" @click="emitToggle">
      {{ sourceOpen ? s().hide_source : s().view_source }}
    </CfButton>
  </div>
</template>

<style scoped>
.adm-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--line-1);
  flex-wrap: wrap;
  font-family: var(--font-sans);
}
.adm-toolbar__group { display: inline-flex; align-items: center; gap: 8px; }
.adm-toolbar__label {
  font-size: var(--t-11);
  color: var(--fg-3);
  font-weight: var(--w-medium);
  letter-spacing: 0.02em;
}
.adm-toolbar__accents { display: inline-flex; gap: 4px; }
.adm-toolbar__dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--line-1);
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease-out);
  padding: 0;
}
.adm-toolbar__dot:hover { transform: scale(1.1); }
.adm-toolbar__dot.is-active {
  outline: 2px solid var(--fg-1);
  outline-offset: 2px;
}
.adm-toolbar__spacer { flex: 1; }
</style>
