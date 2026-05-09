# ChuFix UI · 组件路线图

来源：`chufix-design/` 下 28 个 ProtoForge 设计参考页（atoms / overlays / base / base2 / forms-plus / navigation / rich / data / layout / charts / charts2 / editors / sql / terminal / network / protocols / plugins / domain / system / multiwindow / onboarding / crash 等）。
完成一项把对应行 `- [ ]` 改成 `- [x]`，commit 即可。

每条行末括号里标的是 ProtoForge 里这个组件的来源页面，方便对照视觉做。

**目标**：把设计稿里**全部**视觉单元具象为组件 —— atom / composite / template（页面模块）三档都要进。
模版组件可以是一个壳，内部用 Tabs 组合多个子模块（例如 `ProtocolPane` 内部 tab 切 SSE/MQTT/Kafka/gRPC）。

---

## 已发布 · 151 / 151 ✓ — 全部组件都已具象化

### 表单 · Form (27)

- [x] Button (atoms · B.1.1)
- [x] IconButton (atoms · B.1.2)
- [x] Input (atoms · B.1.3)
- [x] Textarea (atoms · B.1.4)
- [x] Select (atoms · B.1.6)
- [x] Switch (atoms · B.1.8)
- [x] Checkbox (atoms · B.1.9)
- [x] Radio · RadioGroup (atoms · B.1.10)
- [x] ColorSwatch (atoms · B.1.14)
- [x] SearchInput (base2 · SearchInput)
- [x] NumberInput (base2 · NumberInput)
- [x] Slider (atoms · #slider)
- [x] RangeSlider (rich · #range)
- [x] InputGroup (base2 · InputGroup)
- [x] OtpInput (forms-plus · OTPInput)
- [x] Form / FormField (base · B.16)
- [x] Combobox (forms-plus · Combobox)
- [x] TagInput (forms-plus · TagInput)
- [x] Dropzone (forms-plus · FileDropzone / rich · Upload)
- [x] FilePicker (rich · #file)
- [x] ColorPicker (forms-plus · ColorPicker / rich)
- [x] DatePicker (rich · DatePicker · Range)
- [x] DateRangePicker (forms-plus · DateRangePicker)
- [x] PasswordStrength (forms-plus · B.f.7)
- [x] PhoneInput (forms-plus · B.f.8)
- [x] SplitButton (base2 · B2.03)
- [x] VariableAwareInput (atoms · B.1.5)

### 容器 · Container (4)

- [x] Card (base · B.08)
- [x] PageHeader (layout · #pageheader)
- [x] AppShell (layout · #appshell)
- [x] Splitter (navigation · Splitter / rich)

### 数据展示 · Display (19)

- [x] Tag (atoms · B.2.1)
- [x] Badge (atoms · B.2.1)
- [x] Avatar · AvatarGroup (atoms · B.2.5)
- [x] List (base2 · List)
- [x] DescriptionList (base2 · DescriptionList)
- [x] Stat / KPI (base2 · KPI · Stat / rich)
- [x] Statistic (rich)
- [x] Table (base · B.16 / data · #table)
- [x] DataGrid (data · #datagrid)
- [x] TreeView (data · #tree / rich · Tree)
- [x] Timeline (rich · Timeline)
- [x] Image (rich · Image)
- [x] ImagePreview (rich · ImagePreview)
- [x] Carousel (rich · Carousel)
- [x] Highlight (rich · Highlight)
- [x] CalendarHeatmap (rich · CalendarHeatmap)
- [x] ProtocolBadge (atoms · B.2.2)
- [x] MethodBadge (alias of ProtocolBadge)
- [x] StatusCodeBadge (atoms · B.2.3)

### 反馈与覆盖层 · Feedback / Overlay (15)

- [x] Modal (overlays · #modal)
- [x] Tooltip (overlays · #tooltip)
- [x] Toast (overlays · #toast)
- [x] Alert (base · B.10)
- [x] Skeleton (atoms · B.2.8)
- [x] Drawer (overlays · #drawer)
- [x] Popover (overlays · #popover)
- [x] HoverCard (overlays · B.3.11)
- [x] ContextMenu (overlays · B.3.4)
- [x] CommandPalette (overlays · B.3.9)
- [x] ConfirmDialog (overlays · B.3.10)
- [x] Snackbar (overlays · B.3.12)
- [x] Banner (navigation · Banner)
- [x] Result (rich · Result)
- [x] Tour (onboarding · Tour)

### 导航 · Navigation (11)

- [x] Tabs (base · B.09)
- [x] Breadcrumb (base · B.14)
- [x] Pagination (base · B.14 / data · #pagination)
- [x] Dropdown / DropdownMenu (overlays · #menu)
- [x] Stepper (navigation · Stepper · Wizard / base2 · Stepper)
- [x] Sidebar (navigation · Sidebar)
- [x] NavMenu (base · B.15)
- [x] BackTop (navigation · BackTop)
- [x] Affix (navigation · Affix)
- [x] FloatButton (navigation · FloatButton)
- [x] Anchor (base2 · Anchor)

### 布局与状态 · Layout (9)

- [x] Divider (atoms · B.2.9)
- [x] Empty (base2 · EmptyState)
- [x] Progress (atoms · B.2.7)
- [x] Spinner (base2 · Spinner · Loader)
- [x] Accordion (base · B.09 揭示模式)
- [x] Watermark (rich · Watermark)
- [x] Marquee (rich · Marquee)
- [x] TextEllipsis (base2 · TextEllipsis)
- [x] Toolbar (layout · B.6.6)

### 动效与状态 · Motion (4)

- [x] Tour (onboarding · Tour)
- [x] CountDown (rich · CountDown)
- [x] InfiniteScroll (rich · InfiniteScroll)
- [x] QRCode (rich · QRCode)

### 时间组件 · Time (3)

- [x] TimePicker (rich · TimePicker)
- [x] TimeRangePicker (rich · TimeRangePicker)
- [x] Cascader (rich · Cascader)

### 数据交互 · Data Interaction (1)

- [x] Transfer (rich · Transfer)

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

- [x] **Form / FormField** (base · B.16) —— 表单封装层，统一 label / 错误信息 / 校验流。把所有现有 input 接进来
- [x] **Combobox · TagInput** (forms-plus · Combobox / TagInput) —— Select + 输入过滤；TagInput 多标签输入
- [x] **FileDropzone / Upload** (forms-plus · FileDropzone / rich · Upload) —— 拖拽 + 点击 + 进度条
- [x] **ColorPicker** (forms-plus · ColorPicker / rich) —— hex/rgb/hsl/oklch 输入 + 调色板 + 透明度滑块
- [x] **DatePicker** (rich · DatePicker · Range) —— 日期 / 月份 / 年份选择
- [x] **DateRangePicker** (forms-plus · DateRangePicker) —— 日期范围
- [x] **OTP Input** (forms-plus · OTPInput / rich) —— 一次性密码格子
- [x] **InputGroup** (base2 · InputGroup) —— 把多个 input/btn 拼到一起，共用边框

## 路线图 · 优先级 P2（容器/导航/状态扩展）· 7

- [x] **AppShell / Layout** (layout · #appshell) —— 顶栏 + 侧边栏 + 主区域骨架，用作整站脚手架
- [x] **Sidebar** (navigation · Sidebar) —— 可折叠侧栏，支持嵌套菜单
- [x] **Splitter / Resizable** (navigation · Splitter / rich) —— 可拖拽分隔的双面板
- [x] **PageHeader** (layout · #pageheader) —— 标题 + 面包屑 + 操作区一体的页头
- [x] **Stepper · Wizard** (navigation · Stepper · Wizard / base2 · Stepper) —— 多步流程
- [x] **NavigationMenu** (base · B.15) —— 顶部主导航 + hover 富面板
- [x] **Banner · Announcement** (navigation · Banner) —— 顶部全宽提示条

## 路线图 · 优先级 P3（数据展示重型）· 6

- [x] **Table** (base · B.16 / data · #table) —— 轻量表格，列定义、排序、空状态
- [x] **DataGrid** (data · #datagrid) —— 重量表格，虚拟滚动、列拖动、单元格编辑
- [x] **TreeView** (data · #tree / rich · Tree) —— 树形列表，可选/可拖
- [x] **List** (base2 · List) —— 通用列表，支持选中、分组、虚拟滚动
- [x] **DescriptionList** (base2 · DescriptionList) —— `dt/dd` 风格的键值描述
- [x] **KPI · Stat** (base2 · KPI · Stat / rich) —— 关键指标卡片（数字 + 标签 + 趋势）

## 路线图 · 优先级 P4（小件/utility）· 8

- [x] **Kbd · KeyCombo** (atoms · #kbd / base2 · Kbd) —— 键盘按键展示（`Ctrl+K`）
- [x] **Code · InlineCode · CodeBlock** (base2 · Code) —— 代码片段展示
- [x] **Link** (base2 · Link) —— 设计稿一致的链接样式
- [x] **TableOfContents · Anchor** (base2 · TOC) —— 文章侧边目录
- [x] **Rating** (rich · Rating) —— 星级评分
- [x] **AspectRatio** (base · B.16) —— 锁定宽高比的容器
- [x] **ScrollArea** (base · B.16) —— 自定义滚动条容器
- [x] **SegmentedControl 单独导出** (atoms · #segmented) —— 当前是 `Tabs variant=segmented`，加个语义化的别名导出

## 路线图 · 优先级 P5（特殊场景，按需）· 6

- [x] **Calendar** (base · B.14 / rich · Calendar) —— 月视图日历
- [x] **Kanban Board** (rich · Kanban) —— 看板列拖动
- [x] **JSONViewer** (data · #json) —— 折叠/展开 JSON 树
- [x] **JSONDiff** (data · #jsondiff) —— 双侧 JSON 对比
- [x] **KVEditor** (data · #kv) —— 键值对编辑（行式表单）
- [x] **Mention / RichText** (forms-plus · Mention) —— 富文本 `@` 提及

---

## 路线图 · 优先级 P6（atoms 补齐）· 13

通用基础原子，设计稿明确画了但还没做。最简单一批，估计一周可以全部刷完。

- [x] **IconButton** (atoms · B.1.2) —— 仅图标方形按钮，强制 `aria-label`，支持 `aria-pressed` toggle
- [x] **ColorSwatch** (atoms · B.1.14) —— 单色块，含色值 + 一键复制
- [x] **ContextMenu** (overlays · B.3.4) —— 右键菜单，复用 Dropdown + `contextmenu` 事件
- [x] **HoverCard** (overlays · B.3.11) —— 悬停卡片，Tooltip 富内容版
- [x] **CommandPalette** ★ (overlays · B.3.9 / navigation) —— ⌘K 全局命令搜索
- [x] **ConfirmDialog** (overlays 派生) —— Modal + 危险确认语义糖
- [x] **Snackbar** (overlays 派生) —— 底部 undo 通知，Toast 横向变体
- [x] **Toolbar** (layout · #toolbar) —— 按钮组工具条，支持分组与溢出收起
- [x] **SplitButton** (base2) —— 主按钮 + 下拉箭头复合
- [x] **PasswordStrength** (forms-plus) —— 密码强度条 + 提示规则
- [x] **PhoneInput** (forms-plus) —— 国家码 + 号码格式化
- [x] **RangeSlider** (rich) —— 双 knob slider（基于现有 Slider 扩展）
- [x] **FilePicker** (rich / atoms) —— 文件选择对话框（区别于 Dropzone 的拖拽落区）

## 路线图 · 优先级 P7（领域 atoms · ProtoForge 专属）· 4

设计稿原作者打了 ★ 的领域标记，但本质上是通用 badge / 输入框的语义子类，做成 atom 收益不亏。

- [x] **ProtocolBadge** (atoms · B.2.2) —— GET/POST/PUT/PATCH/DELETE/WS/MQTT/gRPC 语义色 badge，复用 `--proto-*` token
- [x] **MethodBadge** —— ProtocolBadge 的别名导出，HTTP method 专用
- [x] **StatusCodeBadge** (atoms · B.2.3) —— 2xx/3xx/4xx/5xx 自动配色
- [x] **VariableAwareInput** ★ (atoms · B.1.5) —— Input 增强版，识别 `{{var}}` 语法高亮 + 补全

## 路线图 · 优先级 P8（编辑器家族）· 5

定位：**视觉容器 + 轻交互**，不自造 lexer / parser / language server。重型能力请用户自带 Monaco/CodeMirror，本组件提供 token 主题外壳。

- [x] **CodeEditor** (editors · MonacoWrapper) —— 升级版 CodeBlock，支持单行编辑、行号、minimap 占位
- [x] **DiffEditor** (editors · DiffEditor / sql · DiffEditor) —— 双栏文本对比（jsondiff 是 JSON 专用，本组件通用文本）
- [x] **MarkdownEditor** (editors · MarkdownEditor) —— split preview，左编辑右预览
- [x] **RegexBuilder** (editors · RegexBuilder) —— 正则可视化拼装 + 测试匹配
- [x] **AnsiText** (terminal · AnsiText) —— ANSI 转义序列 → 着色 span，纯展示组件，不依赖 xterm.js

## 路线图 · 优先级 P9（系统壳层）· 5

桌面 App 风格的窗口装饰。Web App 也有部分场景能用（StatusBar、NotificationCenter），但 TitleBar / MenuBar 在浏览器里没意义。
**实现策略**：放在主包但用文档明确标注"适用于 Tauri / Electron / 准桌面 web 应用"。

- [x] **TitleBar** (system · TitleBar) —— 应用窗口标题栏（含最小化/最大化/关闭按钮槽）
- [x] **StatusBar** (system · StatusBar) —— 底部状态条（左中右槽，支持点击展开）
- [x] **MenuBar** (system · MenuBar) —— 应用顶部菜单栏（File / Edit / View 风格）
- [x] **NotificationCenter** (system · NotificationCenter) —— 通知中心面板（Toast 历史记录列表）
- [x] **GlobalSearch** (system · GlobalSearch) —— 全局搜索壳（CommandPalette 的全屏变体）

## 路线图 · 优先级 P10（多窗口布局）· 4

可拖拽多面板布局，VSCode / Postman / 数据库工具风格。`DockLayout` 是其中最大件，预计 1500+ 行，单独排期。

- [x] **DockLayout** (multiwindow · DockLayout) —— 多面板可拖拽 / 可折叠 / 可重排布局壳（v1：递归 split + tabbed pane，v2 加 splitter resize / drag-to-dock）
- [x] **DetachedPanel** (multiwindow · DetachedPanel) —— 浮动可分离面板（拖出即变独立窗口槽）
- [x] **FloatingInspector** (multiwindow · FloatingInspector) —— 全局浮动检查器面板
- [x] **TearOffTab** (multiwindow · TearOffTab) —— 可撕离的 Tab（拖出主窗口）

---

## 模版 · Templates / 页面模块 · 8

> **设计原则**：每个模版是一个**带 Tabs 或多分区的复合壳**，内部组合多个原子组件。
> 用户的工程视角是"页面也是组件"——给一行 `<CfProtocolPane />` 就能拿到完整功能区。
> 模版内的子模块（如 SSE 监视器、HAR 时序图）都用现有 atoms 拼，不再自造单独导出。
> 命名约定：`Cf<Domain>Pane` / `Cf<Domain>Workbench` / `Cf<Domain>Flow`。

- [x] **CfProtocolPane** (protocols.html) —— 协议监视器面板，Tabs 切 SSE / MQTT / Kafka / gRPC
  - SSE tab: 事件流时间轴 + 重连状态
  - MQTT tab: topic 树 + 订阅消息列表
  - Kafka tab: partition grid + offset / lag 矩阵
  - gRPC tab: service / method 列表 + 调用历史
- [x] **CfNetworkPane** (network.html) —— HTTP / TCP 监视面板，Tabs 切 HAR / Hex / PCAP / Cert / Cookie
  - HAR Timeline: 请求瀑布图（依赖 P8 ChartCrosshair + 时间条）
  - HexViewer: 16 进制 + ASCII 双栏
  - PCAPRow: 抓包行项
  - CertViewer: X.509 证书字段树
  - CookieJar: 域级 cookie 管理
- [x] **CfSqlWorkbench** (sql.html) —— SQL 工作台，包含 Editor / Console / History 三区
  - 上：SQL 编辑器（基于 P8 CodeEditor）
  - 中：执行结果表（DataGrid）
  - 下/侧：查询历史（List）
- [x] **CfTerminalPane** (terminal.html) —— 终端面板壳
  - OutputBlock: 等宽输出区（基于 P8 AnsiText）
  - CommandLine: 命令输入行（基于 Input + History）
  - 完整 PTY 交互需用户自接 xterm.js
- [x] **CfCrashPane** (crash.html) —— 崩溃报告面板，包含 Dialog / StackTrace / DumpUploader
  - CrashDialog: 错误对话框（Modal 派生）
  - ErrorReport: Sentry 风格堆栈
  - DumpUploader: dump 文件上传槽（基于 Dropzone）
  - SafeModeLauncher: 安全模式启动入口
- [x] **CfPluginPane** (plugins.html) —— 插件中心面板
  - PluginCard / PluginGrid
  - PermissionDialog
  - SandboxBadge / ManifestViewer
  - Marketplace（搜索 + 列表 + 详情，复合多个 atoms）
- [x] **CfDomainPane** (domain.html) —— API 调试领域面板
  - CollectionTree（左侧 REST 集合树）
  - RequestBuilder（中间请求构造器，最大件）
  - ResponsePanel（下方响应检查器）
  - MockRuleCard / WorkflowNode / ChaosPolicyPanel 作为子卡片
- [x] **CfOnboardingFlow** (onboarding.html) —— 完整引导流，FirstRunWizard + HotspotTour + 多步流程

---

## 路线图 · 优先级 P11（数据可视化 · 22）

**重要决策**：图表全部**纯 SVG 自己画**，沿用 `--viz-1..8` token 色板，与项目"零三方依赖"原则一致。
不引入 ECharts / Recharts / Chart.js。预期共享一个内部 `_useScale` / `_usePath` 工具层，22 个组件压在 3000 行内。

可考虑做成独立子包 `@chufix/charts` 减少主包体积，但开发阶段先放主包共享 build，最后再决定是否拆分。

### P11.1 时序 (4)

- [x] **LineChart** (charts · B.5.1)
- [x] **AreaChart** (charts · B.5.2)
- [x] **Sparkline** (charts · B.5.5) —— 行内微缩图
- [x] **CandlestickChart** (charts2 · B.5.18) —— OHLC K 线

### P11.2 分类 (4)

- [x] **BarChart** (charts · B.5.3)
- [x] **Histogram** (charts · B.5.4)
- [x] **StackedBar100** (charts2 · B.5.20)
- [x] **BulletChart** (charts2 · B.5.19) —— 子弹进度条

### P11.3 占比 (4)

- [x] **DonutChart** (charts2 · B.5.14)
- [x] **FunnelChart** (charts2 · B.5.15)
- [x] **Treemap** (charts2 · B.5.17)
- [x] **SankeyDiagram** (charts2 · B.5.16)

### P11.4 多维 (4)

- [x] **ScatterPlot** (charts2 · B.5.11)
- [x] **BoxPlot** (charts2 · B.5.12)
- [x] **RadarChart** (charts2 · B.5.13)
- [x] **RidgePlot** (charts2 · B.5.21) —— 密度脊图

### P11.5 单值 / 性能 (5)

- [x] **Gauge** (charts · B.5.6) —— 圆环进度
- [x] **MetricCard** (charts · B.5.10) —— 数值卡片 + 趋势 + sparkline
- [x] **TimingBar** (charts · B.5.7) —— 请求瀑布
- [x] **LatencyHeatmap** (charts · B.5.8) —— 延迟热力图
- [x] **ConnectionGraph** (charts · B.5.9) —— 网络拓扑图

### P11.6 通用工具 (1)

- [x] **ChartCrosshair** + **ChartToolbar** (charts2 · B.5.22 / B.5.23) —— 共享给上面所有图表的浮层工具

---

## 不做 · 永久排除

只剩这些**真的**不进核心包：

- 重型编辑器引擎本身（Monaco / CodeMirror / Prosemirror —— 用户按需自接）
- 完整终端模拟器（xterm.js —— 用户按需自接，本库只做 AnsiText 视觉层）
- 大地图可视化（Leaflet / Mapbox —— rich.html Map 仅做占位 placeholder，不实现）

需要重型能力时，由消费方自行集成上述库，本组件只提供 token-driven 容器外壳。

---

## 工作流约定

每完成一个组件：

1. 按 `CLAUDE.md §13` 的 checklist 把 vue/react/styles/demos/mdx 全部到位
2. 跑 `pnpm --filter @chufix/vue build && pnpm --filter @chufix/react build && pnpm tokens:check && pnpm --filter docs build`
3. 把这个文件里对应的 `- [ ]` 改成 `- [x]`
4. `pnpm sync:docs` → `cd ../../chukit-docs && git add -A && git commit && git push`
5. 主仓库一并 commit（包括 ROADMAP.md 的勾选）

完成进度可以看 git log 也可以看这一份的 `[x]` 数。
