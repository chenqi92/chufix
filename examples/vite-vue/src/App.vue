<script setup lang="ts">
import { ref } from 'vue';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tag,
  Textarea,
  Toaster,
  Tooltip,
  toast,
} from '@chufix/vue';

/* This file is the smoke-test entry: every component is mounted at least
 * once so that any token-undefined / class-rename regression surfaces here
 * instead of in user projects. After a token rename:
 *   pnpm --filter @chufix/example-vite-vue dev
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
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div class="row">
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
        <Button shape="pill">pill</Button>
        <Button shape="square" aria-label="x">×</Button>
        <Button loading>loading</Button>
        <Button disabled>disabled</Button>
      </div>
    </section>

    <section>
      <h2>Form controls</h2>
      <div class="row">
        <Input v-model="text" placeholder="Input" />
        <Textarea v-model="text" placeholder="Textarea" rows="2" />
        <Select v-model="sel" :options="opts" />
      </div>
      <div class="row">
        <Checkbox v-model="checked" label="Checkbox" />
        <Switch v-model="checked" />
        <RadioGroup v-model="radio">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
          <Radio value="c">C</Radio>
        </RadioGroup>
      </div>
    </section>

    <section>
      <h2>Display</h2>
      <div class="row">
        <Tag tone="primary">Primary</Tag>
        <Tag tone="success">Success</Tag>
        <Tag tone="danger" closable>Danger</Tag>
        <Badge :content="3"><Button variant="tertiary">收件箱</Button></Badge>
        <Avatar name="Chen Qi" />
        <Avatar name="A" />
      </div>
    </section>

    <section>
      <h2>Card</h2>
      <Card variant="elevated" style="max-width: 22rem;">
        <template #header>项目设置</template>
        <p>这里是卡片正文，验证 bg-3 / line-1 / shadow-2 是否生效。</p>
        <template #footer>
          <Button size="sm" variant="tertiary">取消</Button>
          <Button size="sm">保存</Button>
        </template>
      </Card>
    </section>

    <section>
      <h2>Overlays</h2>
      <div class="row">
        <Tooltip content="提示文字">
          <Button variant="tertiary">Hover 我</Button>
        </Tooltip>
        <Button @click="open = true">打开 Modal</Button>
        <Button variant="secondary" @click="toast.success('保存成功')">触发 Toast</Button>
      </div>
      <Modal v-model:open="open" title="烟囱测试 Modal">
        <p>验证 z-modal 层级、shadow-4 阴影、backdrop 半透明。</p>
      </Modal>
    </section>

    <Toaster />
  </main>
</template>

<style>
@import '@chufix/vue/style.css';

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
