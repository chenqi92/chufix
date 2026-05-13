<script setup lang="ts">
/**
 * 右侧抽屉：主题 / 密度 / 菜单形态 / 主色 设置面板。
 * 替代之前平铺在最顶上的 toolbar，让外壳更像真实后台。
 */
import { computed, inject } from 'vue';
import { CfDrawer, CfSegmentedControl } from '@chufix-design/vue';
import {
  DemoStateKey,
  STRINGS,
  type DemoTheme,
  type DemoDensity,
  type DemoMenuForm,
  type DemoAccent,
} from './state';

const state = inject(DemoStateKey)!;
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

const t = computed(() => STRINGS[state.locale.value]);

const themeOpts = computed<{ value: DemoTheme; label: string }[]>(() => [
  { value: 'dark-cool', label: t.value.theme_dark_cool },
  { value: 'dark-warm', label: t.value.theme_dark_warm },
  { value: 'light',     label: t.value.theme_light },
]);
const densityOpts = computed<{ value: DemoDensity; label: string }[]>(() => [
  { value: 'comfortable', label: t.value.density_comfortable },
  { value: 'compact',     label: t.value.density_compact },
]);
const menuOpts = computed<{ value: DemoMenuForm; label: string }[]>(() => [
  { value: 'sidebar',   label: t.value.menu_sidebar },
  { value: 'topbar',    label: t.value.menu_topbar },
  { value: 'collapsed', label: t.value.menu_collapsed },
]);

const accentOpts: { value: DemoAccent; color: string }[] = [
  { value: 'blue',   color: 'oklch(64% 0.16 263)' },
  { value: 'green',  color: 'oklch(68% 0.16 150)' },
  { value: 'purple', color: 'oklch(64% 0.18 300)' },
  { value: 'orange', color: 'oklch(72% 0.16 60)' },
  { value: 'rose',   color: 'oklch(66% 0.18 15)' },
];
</script>

<template>
  <CfDrawer
    :open="props.open"
    placement="right"
    size="sm"
    :title="t.settings"
    :show-close="true"
    :mask="true"
    @update:open="(v) => emit('update:open', v)"
  >
    <div class="adm-settings">
      <section class="adm-settings__group">
        <h4 class="adm-settings__label">{{ t.switch_theme }}</h4>
        <CfSegmentedControl
          :model-value="state.theme.value"
          :items="themeOpts"
          size="sm"
          @update:modelValue="(v: string) => (state.theme.value = v as DemoTheme)"
        />
      </section>

      <section class="adm-settings__group">
        <h4 class="adm-settings__label">{{ t.switch_density }}</h4>
        <CfSegmentedControl
          :model-value="state.density.value"
          :items="densityOpts"
          size="sm"
          @update:modelValue="(v: string) => (state.density.value = v as DemoDensity)"
        />
      </section>

      <section class="adm-settings__group">
        <h4 class="adm-settings__label">{{ t.switch_menu }}</h4>
        <CfSegmentedControl
          :model-value="state.menuForm.value"
          :items="menuOpts"
          size="sm"
          @update:modelValue="(v: string) => (state.menuForm.value = v as DemoMenuForm)"
        />
      </section>

      <section class="adm-settings__group">
        <h4 class="adm-settings__label">{{ t.switch_accent }}</h4>
        <div class="adm-settings__accents">
          <button
            v-for="o in accentOpts"
            :key="o.value"
            type="button"
            class="adm-settings__dot"
            :class="{ 'is-active': state.accent.value === o.value }"
            :style="{ background: o.color }"
            :aria-label="o.value"
            :aria-pressed="state.accent.value === o.value"
            @click="state.accent.value = o.value"
          />
        </div>
      </section>
    </div>
  </CfDrawer>
</template>

<style scoped>
.adm-settings {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px;
}
.adm-settings__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.adm-settings__label {
  margin: 0;
  font-size: var(--t-11);
  font-weight: var(--w-medium);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--fg-3);
}
.adm-settings__accents {
  display: inline-flex;
  gap: 8px;
}
.adm-settings__dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--line-1);
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease-out);
  padding: 0;
}
.adm-settings__dot:hover { transform: scale(1.1); }
.adm-settings__dot.is-active {
  outline: 2px solid var(--fg-1);
  outline-offset: 2px;
}
</style>
