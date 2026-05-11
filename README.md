<div align="center">

# ChuFix UI · 础件

**初见即用的基础组件库 —— Vue 3 与 React 同源**

[![npm](https://img.shields.io/npm/v/@chufix-design/vue?label=%40chufix-design%2Fvue)](https://www.npmjs.com/package/@chufix-design/vue)
[![npm](https://img.shields.io/npm/v/@chufix-design/react?label=%40chufix-design%2Freact)](https://www.npmjs.com/package/@chufix-design/react)
[![license](https://img.shields.io/npm/l/@chufix-design/vue)](./LICENSE)
[![docs](https://img.shields.io/badge/docs-chufix.com-3b82f6)](https://chufix.com)

[文档站](https://chufix.com) · [组件总览](https://chufix.com/components/) · [图表库](https://chufix.com/charts/) · [Blocks 模板](https://chufix.com/blocks/)

</div>

---

## 是什么

**ChuFix UI**（中文名 **础件**）是一套同源的 Vue 3 / React 组件库：

- **120+ 基础原子**（Button / Input / Modal / DataGrid / Toast …）
- **20+ 数据可视化图表**（LineChart / DonutChart / Treemap / LatencyHeatmap …）
- **25+ 页面级 Blocks**（Dashboard / Login / SettingsPage / DBWorkbench …）
- **OKLCH 设计 token** + 三套主题（dark-cool / dark-warm / light）+ 两种密度
- **CSS 类前缀 `cf-*`**，组件前缀 `Cf*`，与其他库零冲突
- 纯 HTML / JS 项目也能直接用 CSS 类名

设计 token 与组件 CSS 同源，理论上你只引 `@chufix-design/tokens` 一个包，配合 BEM 类名也能在原生 HTML 里跑通。

## 安装

```bash
# Vue 3
pnpm add @chufix-design/vue @chufix-design/tokens

# React 18+
pnpm add @chufix-design/react @chufix-design/tokens
```

## 快速上手 · Vue 3

```ts
// main.ts
import '@chufix-design/tokens/tokens.css';
import '@chufix-design/vue/style.css';
```

```vue
<script setup lang="ts">
import { CfButton, CfCard, CfInput } from '@chufix-design/vue';
</script>

<template>
  <CfCard>
    <h3>登录</h3>
    <CfInput placeholder="邮箱" />
    <CfButton variant="primary" block>继续</CfButton>
  </CfCard>
</template>
```

## 快速上手 · React 18+

```tsx
// main.tsx
import '@chufix-design/tokens/tokens.css';
import '@chufix-design/react/style.css';
```

```tsx
import { CfButton, CfCard, CfInput } from '@chufix-design/react';

export function Login() {
  return (
    <CfCard>
      <h3>登录</h3>
      <CfInput placeholder="邮箱" />
      <CfButton variant="primary" block>继续</CfButton>
    </CfCard>
  );
}
```

## 主题与密度

在你的根元素（通常是 `<html>` 或 `<body>`）切两个 attribute：

```html
<html data-theme="dark-cool" data-density="comfortable">
```

- `data-theme`：`dark-cool`（默认） / `dark-warm` / `light`
- `data-density`：`comfortable`（控件 32px，默认） / `compact`（控件 28px）

主题与密度正交，可以任意组合。

## CLI · 拷贝 Block 源码到本地

```bash
# 列出所有可用 blocks
npx @chufix-design/cli list

# 把整套登录页拉到 ./src/blocks/login-basic/
npx @chufix-design/cli add login-basic

# 自定义目录
npx @chufix-design/cli add billing-page --out ./components/billing
```

block 源码会同时落 Vue 和 React 两份，你想用哪个保留哪个。

## 包说明

| 包 | 作用 |
| --- | --- |
| [`@chufix-design/tokens`](./packages/tokens) | 设计 token —— OKLCH CSS 变量 + 可选 Tailwind preset |
| [`@chufix-design/icons`](./packages/icons) | 16x16 SVG sprite + 类型化图标名 |
| [`@chufix-design/vue`](./packages/vue) | Vue 3 组件包 |
| [`@chufix-design/react`](./packages/react) | React 18+ 组件包 |
| [`@chufix-design/cli`](./packages/cli) | `chufix add <id>` —— 拷贝 block 源码 |

## 本地开发

需要 Node 18+ 和 pnpm 9+。

```bash
git clone https://github.com/chenqi92/chufix.git
cd chufix
pnpm install

# 一键启动：先打包再开文档站
pnpm build:packages
pnpm dev:docs
# → 访问 http://localhost:4321
```

监听模式联调：

```bash
pnpm dev:vue     # 终端 1：Vue 包 watch 模式
pnpm dev:react   # 终端 2：React 包 watch 模式
pnpm dev:docs    # 终端 3：文档站
```

## 仓库结构

```
chufix/
├── packages/
│   ├── tokens/      @chufix-design/tokens
│   ├── icons/       @chufix-design/icons
│   ├── vue/         @chufix-design/vue
│   ├── react/       @chufix-design/react
│   └── cli/         @chufix-design/cli
├── apps/
│   └── docs/        Astro 文档站（源码同源跑 Vue + React 实例）
├── examples/
│   └── vite-vue/    最小 Vite + Vue 烟囱测试
└── scripts/         构建 / 同步 / 检查脚本
```

## 发布流程

本仓库使用 [changesets](https://github.com/changesets/changesets) + GitHub Actions 自动发版：

1. 改完代码后，`pnpm changeset` 选包、选 patch/minor/major、写一句话说明
2. 把 `.changeset/*.md` 草稿一起 commit & push
3. GitHub Actions 自动开 "Version Packages" PR
4. Merge 那个 PR，自动 publish 到 npm，并产生 GitHub Release

详见 [`.changeset/README.md`](./.changeset/README.md)。

## License

[MIT](./LICENSE) © chenqi92
