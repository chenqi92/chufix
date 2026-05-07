# ChuKit UI · 础件

> 初见即用的基础组件库 —— Vue 3 与 React 同源、CSS 变量可主题、shadcn 风格可复制。

## 目录结构

```
chukit/
├── packages/
│   ├── tokens/      @chukit/tokens   设计 token（CSS 变量 + 可选 Tailwind preset）
│   ├── vue/         @chukit/vue      Vue 3 组件包
│   └── react/       @chukit/react    React 组件包
└── apps/
    └── docs/        Astro + Starlight 文档站（同页面跑 Vue + React 实例）
```

## 本地启动

需要 Node 18+ 和 pnpm 9+。

```bash
cd chukit
pnpm install

# 一键启动：先把组件包打到 dist，再开文档站
pnpm build:packages
pnpm dev:docs
```

访问 http://localhost:4321 即可看到首页和组件页，Vue / React 两个实例都是真实组件，能交互。

## 开发联调

修改组件源码时让组件包保持 watch 模式：

```bash
# 终端 1
pnpm dev:vue
# 终端 2
pnpm dev:react
# 终端 3
pnpm dev:docs
```

## 在外部项目里本地用（发版前的本地试用）

通过 `pnpm link` 或 `npm link`：

```bash
# 在 chukit/packages/vue 下
pnpm link --global

# 在你的外部 Vue 项目里
pnpm link --global @chukit/vue
```

或用 `file:` 协议指向 dist：

```jsonc
// 你的项目 package.json
{
  "dependencies": {
    "@chukit/vue": "file:../base-compoent/chukit/packages/vue"
  }
}
```

## 路线

- [x] Button（Vue + React + 文档双 demo）
- [ ] Input / Card / Modal / Switch / Tabs
- [ ] `npx chukit add <component>` CLI（shadcn 风格源码拷贝）
- [ ] 暗色模式切换器
- [ ] Form / Select / Tooltip / Dropdown
- [ ] 发布到 npm
