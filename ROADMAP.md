# ChuFix UI · 组件路线图

来源：`base-compoent/` 下 26 个 ProtoForge 设计参考页（atoms / overlays / base / base2 / forms-plus / navigation / rich / data / layout）。
完成一项把对应行 `- [ ]` 改成 `- [x]`，commit 即可。

每条行末的 `(ref)` 标的是 ProtoForge 里这个组件的来源页面，方便对照视觉做。

---

## 已发布 · 30 / 70+

### 表单 · Form (10)

- [x] Button (atoms · B.1.1)
- [x] Input (atoms · B.1.3)
- [x] Textarea (atoms · B.1.4)
- [x] Select (atoms · B.1.6)
- [x] Switch (atoms · B.1.8)
- [x] Checkbox (atoms · B.1.9)
- [x] Radio · RadioGroup (atoms · B.1.10)
- [x] SearchInput (base2 · SearchInput)
- [x] NumberInput (base2 · NumberInput)
- [x] Slider (atoms · #slider)

### 容器 · Container (1)

- [x] Card (base · B.08)

### 数据展示 · Display (3)

- [x] Tag (atoms · B.2.1)
- [x] Badge (atoms · B.2.1)
- [x] Avatar · AvatarGroup (atoms · B.2.5)

### 反馈与覆盖层 · Feedback / Overlay (7)

- [x] Modal (overlays · #modal)
- [x] Tooltip (overlays · #tooltip)
- [x] Toast (overlays · #toast)
- [x] Alert (base · B.10)
- [x] Skeleton (atoms · B.2.8)
- [x] Drawer (overlays · #drawer)
- [x] Popover (overlays · #popover)

### 导航 · Navigation (4)

- [x] Tabs (base · B.09)
- [x] Breadcrumb (base · B.14)
- [x] Pagination (base · B.14 / data · #pagination)
- [x] Dropdown / DropdownMenu (overlays · #menu)

### 布局与状态 · Layout (5)

- [x] Divider (atoms · B.2.9)
- [x] Empty (base2 · EmptyState)
- [x] Progress (atoms · B.2.7)
- [x] Spinner (base2 · Spinner · Loader)
- [x] Accordion (base · B.09 揭示模式)

---

## 路线图 · 优先级 P0（高频、相对简单）· 8

这一批先做完，扔出去就能解决 90% 的常见后台/管理界面需求。

- [x] **Spinner / Loader** (base2 · Spinner · Loader) —— 单独的转圈加载，独立于 Skeleton
- [x] **Drawer** (overlays · #drawer / navigation) —— Modal 的边缘变体（top/right/bottom/left 滑入）；走 Teleport，demo `client:only="vue"`
- [x] **Popover** (overlays · #popover) —— Tooltip 的可点击/可交互变体，支持表单内容；Teleport
- [x] **Dropdown / DropdownMenu** (overlays · #menu) —— Popover + 列表 + 键盘导航；Teleport
- [x] **Accordion / Collapsible** (base · B.09 揭示模式) —— 单/多展开
- [x] **NumberInput** (base2 · NumberInput) —— 带 +/− 步进按钮、键盘上下、min/max/step
- [x] **SearchInput** (base2 · SearchInput) —— Input 的预设变体，左 search 图标 + 右 clear
- [x] **Slider** (atoms · #slider) —— 单值滑块，支持 min/max/step、刻度、tooltip 显示当前值

## 路线图 · 优先级 P1（高价值，工作量中）· 8

- [ ] **Form / FormField** (base · B.16) —— 表单封装层，统一 label / 错误信息 / 校验流。把所有现有 input 接进来
- [ ] **Combobox · TagInput** (forms-plus · Combobox / TagInput) —— Select + 输入过滤；TagInput 多标签输入
- [ ] **FileDropzone / Upload** (forms-plus · FileDropzone / rich · Upload) —— 拖拽 + 点击 + 进度条
- [ ] **ColorPicker** (forms-plus · ColorPicker / rich) —— hex/rgb/hsl/oklch 输入 + 调色板 + 透明度滑块
- [ ] **DatePicker** (rich · DatePicker · Range) —— 日期 / 月份 / 年份选择
- [ ] **DateRangePicker** (forms-plus · DateRangePicker) —— 日期范围
- [ ] **OTP Input** (forms-plus · OTPInput / rich) —— 一次性密码格子
- [ ] **InputGroup** (base2 · InputGroup) —— 把多个 input/btn 拼到一起，共用边框

## 路线图 · 优先级 P2（容器/导航/状态扩展）· 7

- [ ] **AppShell / Layout** (layout · #appshell) —— 顶栏 + 侧边栏 + 主区域骨架，用作整站脚手架
- [ ] **Sidebar** (navigation · Sidebar) —— 可折叠侧栏，支持嵌套菜单
- [ ] **Splitter / Resizable** (navigation · Splitter / rich) —— 可拖拽分隔的双面板
- [ ] **PageHeader** (layout · #pageheader) —— 标题 + 面包屑 + 操作区一体的页头
- [ ] **Stepper · Wizard** (navigation · Stepper · Wizard / base2 · Stepper) —— 多步流程
- [ ] **NavigationMenu** (base · B.15) —— 顶部主导航 + hover 富面板
- [ ] **Banner · Announcement** (navigation · Banner) —— 顶部全宽提示条

## 路线图 · 优先级 P3（数据展示重型）· 6

- [ ] **Table** (base · B.16 / data · #table) —— 轻量表格，列定义、排序、空状态
- [ ] **DataGrid** (data · #datagrid) —— 重量表格，虚拟滚动、列拖动、单元格编辑
- [ ] **TreeView** (data · #tree / rich · Tree) —— 树形列表，可选/可拖
- [ ] **List** (base2 · List) —— 通用列表，支持选中、分组、虚拟滚动
- [ ] **DescriptionList** (base2 · DescriptionList) —— `dt/dd` 风格的键值描述
- [ ] **KPI · Stat** (base2 · KPI · Stat / rich) —— 关键指标卡片（数字 + 标签 + 趋势）

## 路线图 · 优先级 P4（小件/utility）· 8

- [ ] **Kbd · KeyCombo** (atoms · #kbd / base2 · Kbd) —— 键盘按键展示（`Ctrl+K`）
- [ ] **Code · InlineCode · CodeBlock** (base2 · Code) —— 代码片段展示
- [ ] **Link** (base2 · Link) —— 设计稿一致的链接样式
- [ ] **TableOfContents · Anchor** (base2 · TOC) —— 文章侧边目录
- [ ] **Rating** (rich · Rating) —— 星级评分
- [ ] **AspectRatio** (base · B.16) —— 锁定宽高比的容器
- [ ] **ScrollArea** (base · B.16) —— 自定义滚动条容器
- [ ] **SegmentedControl 单独导出** (atoms · #segmented) —— 当前是 `Tabs variant=segmented`，加个语义化的别名导出

## 路线图 · 优先级 P5（特殊场景，按需）· 6

- [ ] **Calendar** (base · B.14 / rich · Calendar) —— 月视图日历
- [ ] **Kanban Board** (rich · Kanban) —— 看板列拖动
- [ ] **JSONViewer** (data · #json) —— 折叠/展开 JSON 树
- [ ] **JSONDiff** (data · #jsondiff) —— 双侧 JSON 对比
- [ ] **KVEditor** (data · #kv) —— 键值对编辑（行式表单）
- [ ] **Mention / RichText** (forms-plus · Mention) —— 富文本 `@` 提及

## 不做 / 暂不在范围 · ProtoForge 专属

下面这些是 ProtoForge 自己的产品级 IDE 组件，跟通用 UI 库定位不符，**不收录到 chufix**：

- Terminal / OutputBlock / AnsiText / CommandLine
- SchemaTree / CellInspector / TableFilterBar
- SQLEditor / SQLConsole / QueryHistoryList / DiffEditor
- HARTimeline / HexViewer / PCAPRow / CertViewer / CookieJar
- EventStream / MQTTTopicTree / KafkaPartitionGrid / GRPCMethodList
- TitleBar / StatusBar / TabBar / MenuBar / NotificationCenter / GlobalSearch
- ProtocolBadge / MethodBadge / StatusCodeBadge / VariableAwareInput（领域绑死）
- 所有 Charts（22 种图表，更适合做成独立的 `@chufix/charts` 包）
- 所有 Editors（CodeMirror / Monaco 集成，适合 `@chufix/editors` 包）
- CrashDialog / Sentry-style ErrorReport / DumpUploader / SafeMode
- DockLayout / DetachedPanel / FloatingInspector / TearOffTab（多窗口管理）
- Plugins · PermissionDialog / SandboxBadge

如果将来确实有人要这些，单独开 `@chufix/<domain>` 子包，不混进核心。

---

## 工作流约定

每完成一个组件：

1. 按 `CLAUDE.md §13` 的 checklist 把 vue/react/styles/demos/mdx 全部到位
2. 跑 `pnpm --filter @chufix/vue build && pnpm --filter @chufix/react build && pnpm tokens:check && pnpm --filter docs build`
3. 把这个文件里对应的 `- [ ]` 改成 `- [x]`
4. `pnpm sync:docs` → `cd ../../chukit-docs && git add -A && git commit && git push`
5. 主仓库一并 commit（包括 ROADMAP.md 的勾选）

完成进度可以看 git log 也可以看这一份的 `[x]` 数。
