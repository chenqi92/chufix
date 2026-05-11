<script setup lang="ts">
import { ref } from 'vue';
import {
  CfAvatar,
  CfBadge,
  CfButton,
  CfCard,
  CfCheckbox,
  CfInput,
  CfModal,
  CfRadio,
  CfRadioGroup,
  CfSelect,
  CfSwitch,
  CfTag,
  CfTextarea,
  CfToaster,
  CfTooltip,
  toast,
} from '@chufix-design/vue';

/* This file is the smoke-test entry: every component is mounted at least
 * once so that any token-undefined / class-rename regression surfaces here
 * instead of in user projects. After a token rename:
 *   pnpm --filter @chufix-design/example-vite-vue dev
 * and visually confirm shadows, borders, radii, focus rings still render. */

const text = ref('hello');
const checked = ref(true);
const radio = ref('a');
const sel = ref('one');
const open = ref(false);

const opts = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
];
</script>

<template>
  <main class="page">
    <h1>ChuFix UI · 烟囱测试</h1>
    <p class="lede">
      若任何组件出现"无阴影 / 无圆角 / 焦点环消失 / 颜色变白"等异常，
      说明组件 CSS 引用了 tokens.css 里没定义的变量名，请到组件 CSS 里修正。
    </p>

    <section>
      <h2>Button · 5 variants × 3 sizes</h2>
      <div class="row">
        <CfButton variant="primary">Primary</CfButton>
        <CfButton variant="secondary">Secondary</CfButton>
        <CfButton variant="tertiary">Tertiary</CfButton>
        <CfButton variant="ghost">Ghost</CfButton>
        <CfButton variant="danger">Danger</CfButton>
      </div>
      <div class="row">
        <CfButton size="sm">sm</CfButton>
        <CfButton size="md">md</CfButton>
        <CfButton size="lg">lg</CfButton>
        <CfButton shape="pill">pill</CfButton>
        <CfButton shape="square" aria-label="x">×</CfButton>
        <CfButton loading>loading</CfButton>
        <CfButton disabled>disabled</CfButton>
      </div>
    </section>

    <section>
      <h2>Form controls</h2>
      <div class="row">
        <CfInput v-model="text" placeholder="Input" />
        <CfTextarea v-model="text" placeholder="Textarea" rows="2" />
        <CfSelect v-model="sel" :options="opts" />
      </div>
      <div class="row">
        <CfCheckbox v-model="checked" label="Checkbox" />
        <CfSwitch v-model="checked" />
        <CfRadioGroup v-model="radio">
          <CfRadio value="a">A</CfRadio>
          <CfRadio value="b">B</CfRadio>
          <CfRadio value="c">C</CfRadio>
        </CfRadioGroup>
      </div>
    </section>

    <section>
      <h2>Display</h2>
      <div class="row">
        <CfTag tone="primary">Primary</CfTag>
        <CfTag tone="success">Success</CfTag>
        <CfTag tone="danger" closable>Danger</CfTag>
        <CfBadge :content="3"><CfButton variant="tertiary">收件箱</CfButton></CfBadge>
        <CfAvatar name="Chen Qi" />
        <CfAvatar name="A" />
      </div>
    </section>

    <section>
      <h2>Card</h2>
      <CfCard variant="elevated" style="max-width: 22rem;">
        <template #header>项目设置</template>
        <p>这里是卡片正文，验证 bg-3 / line-1 / shadow-2 是否生效。</p>
        <template #footer>
          <CfButton size="sm" variant="tertiary">取消</CfButton>
          <CfButton size="sm">保存</CfButton>
        </template>
      </CfCard>
    </section>

    <section>
      <h2>Overlays</h2>
      <div class="row">
        <CfTooltip content="提示文字">
          <CfButton variant="tertiary">Hover 我</CfButton>
        </CfTooltip>
        <CfButton @click="open = true">打开 Modal</CfButton>
        <CfButton variant="secondary" @click="toast.success('保存成功')">触发 Toast</CfButton>
      </div>
      <CfModal v-model:open="open" title="烟囱测试 Modal">
        <p>验证 z-modal 层级、shadow-4 阴影、backdrop 半透明。</p>
      </CfModal>
    </section>

    <CfToaster />
  </main>
</template>

<style>
@import '@chufix-design/vue/style.css';

.page {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}
.page h1 { margin: 0 0 4px; font-size: var(--t-28); line-height: var(--lh-28); }
.page .lede { color: var(--fg-2); margin: 0 0 24px; font-size: var(--t-13); line-height: var(--lh-13); }
.page section { margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--line-1); }
.page section h2 { font-size: var(--t-16); line-height: var(--lh-16); margin: 0 0 12px; color: var(--fg-1); }
.page .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; }
</style>
