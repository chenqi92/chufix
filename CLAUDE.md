# ChuFix UI · 项目规则

本仓库的所有协作规则。Claude 在此工作目录下处理任务时**必须**遵守以下规范。

---

## 1. 品牌与命名

- 项目名：**ChuFix UI**（中文：础件）
- 域名：`chufix.com`
- npm 包前缀：`@chufix/*`（`tokens` / `vue` / `react`）
- **CSS 类前缀：`cf-*`**（cf 来自 **chufix**；不是 ck，不是 chu，不是 chufix）
- **CSS 变量：无前缀，直接 `--bg-1` `--accent-1` `--r-4` 等**（沿用 ProtoForge 命名）
- **组件导出名：`Cf` 前缀**（`CfButton` / `CfInput` / `CfTooltip` / `CfModal` 等），与 CSS 前缀对齐
- 想短名？消费方在 import 时 alias 即可：`import { CfButton as Button } from '@chufix/vue'`

为什么前缀很重要：用户很可能同时引入 `@chufix/vue` 和 `element-plus` / `ant-design-vue`，全都导出 `Button`。带 `Cf` 前缀让模板里 `<CfButton>` 一眼可识别，既不冲突也不需要 import 别名。CSS 类同理：`cf-btn` 跟其他库的 `el-button` `ant-btn` 物理隔离。

之前的命名变更历史（**不要再来回改**）：项目最早叫 chukit，CSS 用 `ck-`；改名 chufix 后短暂出现过让 `ck-` 保留的误判，最终敲定 **`cf-` + `Cf`**，原因就是和项目名首字母对得上。任何地方再看到 `ck-` 或 `Ck` 都视为漏改，应该批量替换。

不要在文档、README、营销文案里把本项目跟其他成熟产品（shadcn / Element / Ant Design / Material UI 等）做"我们像 X"、"X 风格"的对照。介绍能力时只描述能力本身，不借用其他产品的关键词。

## 2. 设计系统：ProtoForge tokens

设计源头是 `E:/workspace-freq/base-compoent/tokens.css` + `stage-b.css`（ProtoForge 工具栏组件库）。
设计 token 已搬到 `packages/tokens/src/tokens.css`，**不要再引入新的命名前缀**，也不要回到 HSL 通道格式。

### 2.1 颜色：OKLCH，从不写 hex

所有颜色用 `oklch(L C H)` 或 `oklch(L C H / alpha)` 表达。例：

```css
--accent-1: oklch(64% 0.16 263);
--accent-soft: oklch(64% 0.16 263 / 0.16);
```

需要在样式中加透明度时直接用 `oklch(... / 0.4)`，不要用 `var(--xxx) / 0.4` 这种 HSL 通道写法。

### 2.2 命名分层

| 类别 | token | 含义 |
|---|---|---|
| 表面 | `--bg-0..3` `--bg-inset` | 由低到高 5 层背景 |
| 前景 | `--fg-1..3` `--fg-on-accent` | 主文字 / 次文字 / 弱文字 / 落在 accent 上的文字 |
| 线条 | `--line-1` `--line-2` | 弱描边 / 强描边 |
| 主色 | `--accent-1..3` `--accent-soft` | 默认 / hover / active / 浅色背景 |
| 状态 | `--status-success/warning/error/info` 各带 `-soft` | 4 种语义 |
| 圆角 | `--r-2..r-8` `--r-pill` | 数字即像素 |
| 间距 | `--s-1..s-12`（4px 步进） | 数字非像素 |
| 字号 | `--t-11..t-28` 配套 `--lh-*` | 数字即像素 |
| 阴影 | `--shadow-1..4` | 1=细描边 4=模态 |
| 时长 | `--dur-instant/fast/base/slow` | 80/140/200/320ms |
| 缓动 | `--ease-out/in-out/spring` | |
| 层级 | `--z-sticky/dropdown/popover/tooltip/drawer/modal/cmdpalette/toast` | 100..1700 |
| 密度 | `--control-h` `--control-h-sm` `--control-h-lg` 等 | 由 `[data-density]` 控制 |
| 主题 | `--bg-*` 等被三套 `[data-theme]` 重写 | dark-cool / dark-warm / light |

### 2.3 三套主题

`[data-theme='dark-cool']`（默认） / `[data-theme='dark-warm']` / `[data-theme='light']`。
旧别名 `[data-theme='dark']` 仍指向 dark-cool。

### 2.4 两种密度

`[data-density='comfortable']`（默认，控件 32px） / `[data-density='compact']`（控件 28px）。
密度只动几何，不动颜色，**与主题正交**。

## 3. 组件 API 规范

### 3.1 Button：5 个 variant，**无 tone 概念**

```ts
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
```

视觉权重从重到轻：
- `primary` —— accent 实心，页面唯一主操作
- `secondary` —— bg-2 实色，弱主操作
- `tertiary` —— 透明 + 描边，次操作
- `ghost` —— 完全透明，最弱操作
- `danger` —— 红色实心，不可逆操作

**不要**再用 `variant="solid|soft|outline|link"` 或 `tone="primary|danger"`，那是旧 shadcn 风格 API，已被替换。

### 3.2 其他组件保留 variant + tone

Tag / Badge 等仍然 `variant`（视觉模式）+ `tone`（语义色）。这与 Button 的"权重等级"语义不同，是有意区分的。

## 4. DemoFrame 使用规范

每个 demo 用 `<DemoFrame>` 包裹。规则：

1. **预览只展示一份**实例。Vue / React 渲染结果完全相同，预览区不要左右双栏。
2. **代码区默认折叠**，用户主动点击 "查看代码" 才展开。
3. 代码区内可在 **Vue / React / CLI** 之间切换源码（tabs 在代码区内部）。
4. demo 实例由 MDX 默认 slot 提供，统一使用 Vue 实例（`packages/vue`）。React 端**只用代码字符串展示**，不再写 `BasicReact.tsx` 这种文件。

```mdx
<DemoFrame
  vueCode={`<Button>点击</Button>`}
  reactCode={`<Button>点击</Button>`}
>
  <BasicVue client:load />
</DemoFrame>
```

## 5. 文档结构

每个组件页面按 **功能维度** 拆成多个小节，从最基础到进阶逐层展开。每个小节都是一个独立的 `<DemoFrame>` 块，**不要把所有用法塞进一个 demo**。

通用拆分参考（按需取舍）：

- **基础用法**：最简单的一行调用
- **视觉变体**：variant
- **尺寸 / 形状**：size / shape
- **状态**：disabled / loading / error
- **进阶用法**：受控、复合、与其他组件组合
- **API**：Props / Events / 插槽 表

每节标题用 `## ` 二级标题，每节有 1–3 句解释 + 一个 DemoFrame。

每节配套的 demo 文件按节命名（不再统一叫 `BasicVue.vue`）：

```
src/components/demos/button/
  BasicVue.vue        # 基础
  SizesVue.vue        # 尺寸
  StatesVue.vue       # 状态
```

## 6. 提交风格

参见全局 `~/.claude/CLAUDE.md` 的 git commit 规则：

- 客观描述，不写"优化/重构/改进"等主观词
- 不要 `Co-Authored-By: Claude` 等 AI 标记
- HEREDOC，事实陈述

## 7. 仓库结构

- `packages/tokens` —— `@chufix/tokens`，CSS 变量 + Tailwind preset
- `packages/vue` —— `@chufix/vue`，Vue 3 SFC 组件
- `packages/react` —— `@chufix/react`，React 18 函数式组件
- `apps/docs` —— Astro 文档站（开发主战场）
- `examples/vite-vue` —— **烟囱测试**：最小 Vite + Vue 项目，每次大改后必须能跑通
- `chufix-docs/`（独立部署仓库的本地副本）—— `apps/docs` 的 snapshot，依赖路径用 `file:../chufix/packages/*`

发布到 GitHub 的两个仓库：

- 主仓库：`chenqi92/chufix`
- 文档独立仓库：`chenqi92/chufix-docs`

## 8. CSS 共享策略

- `packages/vue/src/styles/*.css` 与 `packages/react/src/styles/*.css` **保持完全相同**
- 修改样式时，写一遍后用 `cp` 同步到另一个包
- **类名前缀统一 `cf-`**，CSS 变量**无前缀**

### 8.1 CSS 加载（避免新组件样式不生效的坑）

Vue 包用 vite lib + `cssCodeSplit: false`，所有组件 CSS 会被聚合到 `packages/vue/dist/style.css`。React 包同理（tsup 输出 `packages/react/dist/index.css`）。

**docs 站点在 `apps/docs/src/styles/global.css` 顶部只导入这一份聚合文件**：

```css
@import '@chufix/tokens/tokens.css';
@import '@chufix/vue/style.css';
```

**不要回到一行一行 `@import '@chufix/vue/src/styles/<component>.css';` 的写法** —— 之前出过问题：新增组件后忘了往 global.css 里追加 import，于是 Toast、Tooltip、Select、Checkbox 的图标和容器全部失去样式。

新增组件后的检查清单：

1. 在 `packages/{vue,react}/src/index.ts` 里追加 `import './styles/<comp>.css';`
2. 重新跑 `pnpm --filter @chufix/vue build` + `pnpm --filter @chufix/react build`
3. docs 端不需要改 global.css —— 只要它仍然 `@import '@chufix/vue/style.css'` 就够了
4. **跑 `examples/vite-vue` 烟囱测试**确认外部消费者看到的视觉无差异
5. 跑 `pnpm --filter docs build` 验证静态站点能生成

### 8.2 组件内的 SVG 图标必须有明确尺寸

所有 SVG 图标的尺寸必须由 CSS 类（不是 SVG `viewBox` 默认）控制，且必须在该组件 CSS 文件里声明。例如：

```css
.cf-select__caret { width: 1em; height: 1em; }
.cf-checkbox__check { width: 80%; height: 80%; }
.cf-toast__icon svg { width: 0.85rem; height: 0.85rem; }
```

如果你新加了用 SVG 的组件，必须给它配一条 width/height 的 CSS 规则，否则一旦上层 CSS 没加载（比如旧 build），图标会按 viewBox 默认值渲染，看起来就是"图标超大、错位"。

### 8.3 CSS 变量先落地，再被引用

**在组件 CSS 里写 `var(--xxx)` 之前，必须确认 `packages/tokens/src/tokens.css` 里已经定义了 `--xxx`。**

之前出过的坑：Toast / Tooltip / Select 的浮层在 CSS 里写了 `box-shadow: var(--cf-shadow-md);`，但 tokens.css 里没定义这个名字，导致这些组件**完全没有阴影**——`var()` 没值就是空字符串，浏览器把 `box-shadow:` 当无效声明丢掉。

新增 token 时，**先 commit `tokens.css`，再去其他 CSS 文件里引用它**。

### 8.4 docs 全局样式不得污染组件

`apps/docs/src/styles/global.css` 可以给正文内容提供默认样式，但**不能要求组件去适配 docs 的偶然级联**。组件库样式必须在任何普通页面里都稳定。

已踩过的坑：docs 里有 `a:hover { text-decoration: underline; }`，它适合正文链接，但会污染用 `<a>` 渲染的按钮、NavMenu 面板项、卡片链接等，让组件内部出现多余下划线。

硬规则：

1. **任何可渲染成 `<a>` 的组件类**，例如 `.cf-btn`、`.cf-navmenu__trigger`、`.cf-navmenu__link`、`.cf-card--link`、`.cf-breadcrumb__link`，都必须在 base 和 hover 态显式写 `text-decoration: none`。例外只有 `CfLink` 的 underline/subtle 这类明确设计为链接文本的组件。
2. NavMenu 的 `underline` variant 只能通过组件自己的伪元素或边框画“激活指示线”，**不能让文字本身吃到浏览器/全局链接下划线**。
3. docs 的正文样式只作用于文档内容。写 `.cf-prose ul`、`.cf-prose a:hover`、`.cf-prose code` 这种规则时，必须确认不会影响 `.cf-demo` 里的真实组件实例；需要时用 `:not(.cf-demo)` 或更窄选择器隔离。
4. 新增或修改组件 CSS 后，至少检查一次该组件放在 docs DemoFrame 内时的 hover/focus 状态。重点看：无多余下划线、无列表左缩进污染、无正文 `code/pre/table` 样式污染、无字体/行高继承导致错位。
5. 如果一个组件本身包含 `ul/ol/li/a/button/code/pre/table` 这些原生标签，组件 CSS 必须重置自己的 `list-style`、`margin`、`padding`、`text-decoration`、`font`、`line-height` 等关键项，不能依赖外部页面“刚好没有全局样式”。

### 8.5 DemoFrame / 文档视觉防回归

docs 是组件库的真实使用场景，演示层问题会直接误导用户。下面这些问题以后按回归处理：

1. **浮层演示不能被裁切。** Select / Combobox / DatePicker / ColorPicker / NavMenu 这类内联浮层放进 DemoFrame 时，要确保预览区给出足够底部空间，或通过 DemoFrame 的浮层状态扩展 padding；不要用 `overflow: hidden` 把浮层截断。
2. **页面三栏独立滚动。** 左侧菜单、正文、右侧 TOC 必须各自滚动，鼠标在哪一栏就滚哪一栏；切换组件页面后左侧菜单滚动位置不能回到顶部。
3. **代码块行号必须和代码内容对齐。** CodeBlock 行号列和代码列用 grid / 明确 line-height 对齐；不要用易受长行横向滚动影响的裸 flex 拼接。
4. **AspectRatio 这类布局组件的演示内容必须真实填满容器。** 组件层应保证普通直接子元素默认 `width/height: 100%`；docs demo 不要靠一长串 inline style 做不可读占位。
5. **Icon 文档必须同时展示颜色和动效。** `CfIcon` 的 `color`、`currentColor` 继承、`motion="spin|pulse|bounce"` 都要有可见演示；动效样式必须遵循 `prefers-reduced-motion`。
6. 所有 docs demo 的展示控件应该优先用 scoped class 写样式，避免大段 inline style。inline style 只保留短小、解释性强的局部尺寸或布局。

## 9. 单例 UI 原语（Toaster / ConfirmProvider 等）

像 `Toaster` 这种需要在 DOM 中**唯一存在**的"广播接收器"组件，必须遵守：

1. **每个页面只挂一份**。多个 `<Toaster />` 同时存在时，它们共享同一个模块级 `toastStore`，每条 `toast()` 会被每个 Toaster 重复渲染（之前出现过点一次出 3 条 / 6 条 / 9 条的现象）。
2. **docs 站点**：`apps/docs/src/layouts/BaseLayout.astro` 里挂一份 `<Toaster client:load />` 作为全站单例。
3. **demo 文件不再自己挂 `<Toaster />`**——直接 `import { toast }` 调用即可。
4. MDX 的代码示例里**仍然写出 `<Toaster />`**，因为这是用户在自己应用里要做的事情；但 demo 的 Vue 文件里不要写。

### 9.1 ⚠ Module-singleton store 必须走 barrel import，禁止 deep src/ import

`@chufix/vue` 的 dist 是 vite library 模式打包出来的**单 chunk** `index.js`，里面把 `toast/store.ts` 的 module 状态打包成 dist 内的一份实例。同时 package.json 又有 `"./src/*": "./src/*"` 这个 export，允许 `import Foo from '@chufix/vue/src/foo/Foo.vue'` 直接读 src。

**deep src/ import 会绕过 dist，加载源码 → 拿到的是 src/store.ts 的另一份独立 module 实例**：

```
import Toaster from '@chufix/vue/src/toast/Toaster.vue'  → store 实例 A（来自 src）
import { toast } from '@chufix/vue'                       → store 实例 B（来自 dist 内嵌）
```

A 和 B 各自维护自己的 `items` / `listeners`。`toast()` push 到 B；Toaster 订阅 A。两边永不见面，toast 永远不显示，且不会报错（沉默失败最难调试）。

**规则**：所有有 module 单例的组件（`const items = []` / `new Set()` / `let counter = 0` 这种），消费方**必须**走 barrel import：

```ts
// ✅ 正确
import { Toaster, toast } from '@chufix/vue';

// ❌ 错误 —— deep src/ import 会创建第二份 store
import Toaster from '@chufix/vue/src/toast/Toaster.vue';
```

`./src/*` export 仅用于查看源码或 type 推导，**不用于运行时**。如果将来发布 npm，考虑直接删掉 `"./src/*"` export 杜绝这种误用。

### 9.2 ⚠ Teleport 组件在 Astro 里必须 client:only，不能 client:load

Vue 的 `<Teleport to="body">` 在 SSR 期间会输出特殊占位符，hydrate 时由客户端 Vue 把内容搬到 body。Astro 的 `client:load` 同时做了 SSR 和客户端 hydrate —— 两边对 Teleport 的处理时机不一致，会导致 hydration 静默失败：tooltip 部分方向不显示、modal 不弹出、toast 不渲染。

**规则**：所有用 Teleport 的组件（**Tooltip / Modal / Toaster** 已确认；将来新增 Drawer / Popover / Dropdown 也都属于此类）在 Astro 中必须用 `client:only="vue"`，**不能用 `client:load`**：

```astro
<!-- ✅ 正确 -->
<TooltipDemo client:only="vue" />
<ModalDemo   client:only="vue" />
<Toaster     client:only="vue" />

<!-- ❌ 错误 -->
<TooltipDemo client:load />
```

非 Teleport 的组件（Button / Input / Card / Tag / Tabs / Alert / Skeleton 等）继续用 `client:load`，享受 SSR 的首屏 HTML。

`client:only` 的代价是**没有 SSR fallback**，首屏会有一瞬空白，但对 demo 区块是可以接受的——demo 本来就是需要 JS 才能交互的。

## 10. 演示用法：复杂状态用独立实例

涉及 **size / variant / behavior 切换** 的演示，不要共用同一个组件实例 + 一个响应式 ref 来切换 prop。改成**每种状态一个独立实例**，按钮点开对应的那一个：

```vue
<Button @click="sm = true">sm</Button>
<Button @click="md = true">md</Button>

<Modal v-model:open="sm" size="sm" title="size = sm">…</Modal>
<Modal v-model:open="md" size="md" title="size = md">…</Modal>
```

为什么：每个独立实例可以在 prop 里写死值，让用户一眼看到"点这个按钮，对应这段代码效果"。共享 ref 的写法在 Vue Transition / appear 等场景下偶发"看起来切了，但视觉上没切"的错觉。

## 11. 变更同步策略 + 部署

### 11.1 工作仓 / 部署仓 双轨

- **工作仓** `chenqi92/chufix`（本目录）：monorepo，packages + apps + examples 全在这。开发主要在这里
- **部署仓** `chenqi92/chufix-docs`（本地 clone 在 `E:/workspace-freq/chukit-docs/`，未来可能改名为 `chufix-docs/`）：独立仓库，**Cloudflare Pages 监听这一份**，push main 即自动部署

部署仓里 docs 的依赖 `@chufix/{tokens,vue,react}` 必须能在 Cloudflare 构建机器上离线解析 —— 因此采用 **vendor 模式**：把 packages 的 `src/` + `dist/` + 改写过的 `package.json` 拷贝到 `chukit-docs/vendor/`，部署仓的 `package.json` 引用 `file:./vendor/*`。

不要再在部署仓 `package.json` 里写 `file:../chukit/packages/*` —— Cloudflare clone 时没有兄弟目录，会报 `ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND`。

### 11.2 同步流程：一条命令

修改 `apps/docs/` 或 `packages/` 后，在工作仓根目录跑：

```bash
pnpm sync:docs
```

这条命令做的事（见 `scripts/sync-docs.mjs`）：
1. `pnpm --filter @chufix/vue build` + `pnpm --filter @chufix/react build`，刷新 `dist/`
2. 把 `apps/docs/{src,public}` 完整覆盖到 `chukit-docs/{src,public}`
3. 把 `packages/{tokens,vue,react}/{src,dist,package.json}` 拷到 `chukit-docs/vendor/{tokens,vue,react}/`
4. 改写每个 vendor 包的 `package.json`：`workspace:* → file:../tokens`，剥掉 devDependencies 与 scripts
5. 改写 `chukit-docs/package.json` 里 `@chufix/*` 的依赖路径为 `file:./vendor/*`

跑完后 `cd ../../chukit-docs`，`git add -A && git commit && git push`，Cloudflare 自动重新构建并发布。

### 11.3 部署关键文件

放在 `apps/docs/public/` 下，会被 sync 复制到部署仓 `public/`，最终原样进入 `dist/` 根：

- `_headers` —— 控制响应头：`/_astro/*`、`*.css`、`*.js`、`*.woff2` 设 `max-age=31536000, immutable`；HTML 设 `max-age=0, must-revalidate`；安全头 `X-Frame-Options DENY` / `X-Content-Type-Options nosniff` / `Referrer-Policy strict-origin-when-cross-origin`
- `_redirects` —— 路径重定向，例如 `/docs/* /:splat 301`
- `robots.txt` —— `Allow: /` + `Sitemap: https://docs.chufix.com/sitemap-index.xml`

修改这三个文件**只改 `apps/docs/public/`**，sync 会自动覆盖部署仓那一份。

### 11.4 部署仓 .gitignore 不能含裸 `dist`

部署仓 `chufix-docs/.gitignore` 必须把 `dist` 写成 `/dist`（带前导斜杠），不能是裸 `dist`。原因：

- 裸 `dist` 是个 glob 模式，会忽略**任何路径下**叫 `dist` 的目录，包括 `vendor/{vue,react}/dist/`
- 这会导致 vendor 里的构建产物（`index.js` / `style.css` 等）被 git 静默丢弃
- 推上去后 Cloudflare 拉到的 vendor 只有 `src/` 没有 `dist/`，构建时报 `Failed to resolve entry for package "@chufix/vue"`

正确写法：

```gitignore
node_modules
/dist          # 只忽略仓库根的 Astro 构建产物
.astro
...
```

`pnpm sync:docs` 会在每次同步时检测这一项，发现裸 `dist` 时打印警告。

### 11.5 部署仓 package.json 不可改

部署仓的 `package.json` 是由 sync 自动生成的；除了 `packageManager` 与 `dependencies/devDependencies` 的版本号，**人不要去改它**——下次 sync 都会被覆盖。如果要新增运行时依赖（比如 `@astrojs/sitemap`）：
1. 先在 `apps/docs/package.json` 里加上
2. 然后在 sync 脚本里给部署仓的 `package.json` 加同名依赖（或者扩展 sync 让它从 apps/docs/package.json merge 一下）
3. 跑一次 `pnpm sync:docs`，`pnpm install` 重新生成 lockfile，再 commit 部署仓

## 11.6 ⚠ 批量改名时一定要大小写敏感

PowerShell `-replace` / JS `replace(/.../g)` **默认大小写敏感**，但 PowerShell 的 `-replace` 实际是 `-ireplace` 别名，**默认不敏感**。批量把组件名 `Button` 重命名成 `CfButton` 时如果忘了用大小写敏感，模式 `<Button` 会同时匹配到 `<button>` 这种原生 HTML 标签，把 `<button class="cf-btn">` 改成 `<CfButton class="cf-btn">`，瞬间炸出几十个"undefined component" 错误。

PowerShell 大小写敏感写法：

```powershell
# ❌ -replace 默认 case-INSENSITIVE，会误改 <button>
$c -replace '<Button(?=[\s/>])', '<CfButton'

# ✅ -creplace 强制 case-sensitive
$c -creplace '<Button(?=[\s/>])', '<CfButton'

# ✅ 或直接走 [regex]::Replace
[regex]::Replace($c, '<Button(?=[\s/>])', '<CfButton')
```

JavaScript `replace` / Bun `Bun.file().text()` 默认就是大小写敏感，没有这个坑；只在 PowerShell 上要小心。

## 12. 工作流提醒

- 每次大改之前先 `pnpm --filter @chufix/vue build` + `pnpm --filter @chufix/react build` 验证两个包能编译通过
- 改 docs 后跑 `pnpm --filter docs build` 验证静态站点能生成
- 改 token 或组件 CSS 后跑 `pnpm tokens:check`，确保 var(--xxx) 引用都能在 tokens.css 找到（带 fallback 的 `var(--x, default)` 跳过，视为可选 knob）
- **新增 token 或重命名 token 后，跑 `examples/vite-vue` 验证最终消费者看到的页面没出现"无阴影/无圆角/颜色变白"等 var 失值现象**
- 准备发布或推到部署仓时只用 `pnpm sync:docs`，不要手动 `cp -r`
- 不要让 dev server 在大批量字符串替换期间运行（watch 会反复重启拖慢操作）
- **样式看起来"丢了"时**：第一反应不是去翻每个 CSS 文件，而是检查 `apps/docs/src/styles/global.css` 是否在 `@import '@chufix/vue/style.css'`，并检查 `packages/vue/dist/style.css` 是否是最新 build。九成是这两个之一。剩下一成是组件 CSS 里写了 tokens.css 里没定义的变量名（参见 §8.3）。

## 13. 新增组件 checklist

按这个顺序做才不会漏：

1. `packages/vue/src/<comp>/variants.ts` —— 类型 + classMaker 函数（接收 props 返回 className 串）
2. `packages/vue/src/<comp>/<Comp>.vue` —— Vue SFC
3. `packages/vue/src/styles/<comp>.css` —— 用 ProtoForge tokens（`--bg-*` `--fg-*` `--accent-*` `--r-*` 等），类名前缀 `cf-<comp>`，所有 SVG 图标显式指定 width/height；可点击的 `<a>` / 链接型组件必须显式保护 `text-decoration: none`
4. `packages/vue/src/index.ts` —— 顶部加 `import './styles/<comp>.css'`，下方加 `export { default as Cf<Comp> } from './<comp>/<Comp>.vue'` + 类型导出（**Cf 前缀必须加**）
5. `packages/react/src/<comp>/variants.ts`、`<Comp>.tsx`、`styles/<comp>.css` —— 与 Vue 端**完全镜像**（class 名、tokens、props 默认值都一致）。CSS 用 `cp` 同步，不要手抄
6. `packages/react/src/index.ts` —— 同步 import 与 export
7. `apps/docs/src/components/demos/<comp>/<Section>Vue.vue` —— 至少一个 BasicVue，复杂组件按节拆分
8. `apps/docs/src/content/docs/components/<comp>.mdx` —— 基础用法 + variant + 尺寸 + API 表格，每节一个 DemoFrame
9. `apps/docs/src/content/docs/components/index.mdx` —— 加到对应分类的卡片网格
10. `apps/docs/src/config/site.ts` —— 加到 `sidebar` 数组
11. `apps/docs/src/pages/index.astro` —— 首页"现在已经有什么"加 pill；更新组件计数文案
12. 在 docs DemoFrame 里检查 hover/focus/展开态：无多余下划线、无列表缩进污染、浮层不被裁切、代码行号不偏移
13. 跑 `pnpm --filter @chufix/vue build && pnpm --filter @chufix/react build && pnpm tokens:check && pnpm --filter docs build`
14. 跑 `pnpm sync:docs` 同步到部署仓，commit + push 两个仓库
