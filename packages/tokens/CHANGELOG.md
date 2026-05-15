# @chufix-design/tokens

## 0.9.0

### Minor Changes

- [`82c9c41`](https://github.com/chenqi92/chufix/commit/82c9c418659c681160d6a4b78473435a34010e93) Thanks [@chenqi92](https://github.com/chenqi92)! - feat(media): add Media & Annotation family (SignaturePad / DrawingCanvas / ImageAnnotator / HotspotImage / AudioPlayer / VideoPlayer)

  - SignaturePad: pointer + canvas 平滑签名板，暴露 clear/toDataURL/toBlob/isEmpty
  - DrawingCanvas: 签名板 + 工具栏（画笔/橡皮/调色板/尺寸/撤销/重做/清空），笔画可序列化
  - ImageAnnotator: 归一化坐标钉点标注，点击空白添加 / 拖动改坐标 / 选中删除
  - HotspotImage: 图像 + SVG overlay 矩形 / 圆形热区，hover 显示 label
  - AudioPlayer: 紧凑音频播放器，传 peaks 渲染波形进度条
  - VideoPlayer: HTML5 video 之上的自定义控件栏，倍速菜单、全屏、字幕轨、idle 自动隐藏
  - docs: 6 个 mdx + demos + 「媒体 / 标注」侧边栏分组 + 首页卡片

- [`a34dc09`](https://github.com/chenqi92/chufix/commit/a34dc09c927f4c48387f940554950bac584a9e9a) Thanks [@chenqi92](https://github.com/chenqi92)! - feat(devtools): add Developer Tools family (Flamegraph / LogViewer / Terminal / QueryBuilder / NetworkInspector / RequestTimeline)

  - Flamegraph: 层级矩形性能图，点击 zoom-in，hover 显示 value 与占比
  - LogViewer: 等宽日志流面板，level 着色 / search 高亮 / 自动跟随底部 / 滚开后「跳到底部」按钮
  - Terminal: macOS 三圆点终端面板，行级 command/output/error/warning/success/info 着色
  - QueryBuilder: 字段+操作符+值可视化过滤，emit AND/OR 可序列化 AST
  - NetworkInspector: 类 DevTools Network 面板，方法/URL/状态/类型/大小/耗时列 + headers/body 详情
  - RequestTimeline: 瀑布请求时序，phases 分段着色显示 dns/connect/wait/receive
  - docs: 6 个 mdx + demos + 「开发者工具」侧边栏分组 + 首页卡片

- [`0fc4876`](https://github.com/chenqi92/chufix/commit/0fc48768d41a4ce60ea0298a0f779af67c27b8c6) Thanks [@chenqi92](https://github.com/chenqi92)! - feat(collab,agent): add Collaboration & Agent visualization family (PresenceAvatars / RemoteCursor / TypingIndicator / PulseDot / PlanCard / ReasoningTree / AgentTimeline)

  - PresenceAvatars: 在线用户头像行，颜色按 id 哈希，self 加粗 ring，away 半透明，+N 折叠
  - RemoteCursor: 远端光标 overlay，跟 WebSocket / WebRTC 接坐标，跨用户颜色哈希
  - TypingIndicator: 三圆点 bouncing 动画 + 可选名字，prefers-reduced-motion 退化为静态
  - PulseDot: 状态脉冲点，6 tone × 3 size，可关闭动画
  - PlanCard: 多步骤计划卡片，每步 pending/active/done/failed/skipped + 时长 + 可折叠详情
  - ReasoningTree: Tree-of-Thoughts 可视化，每节点 score 自动配色，selected 路径加粗，子树折叠
  - AgentTimeline: 单 agent 行动流，6 种事件类型（thought/tool/action/observation/message/error）
  - docs: 7 个 mdx + demos + 「协作 / Agent 可视化」侧边栏分组 + 首页卡片

- [`f63e395`](https://github.com/chenqi92/chufix/commit/f63e395b42f40dc0f0e5d2f13a09525c9ec6ec47) Thanks [@chenqi92](https://github.com/chenqi92)! - feat(dnd): add Drag & Drop family (Sortable / Draggable / Droppable / DragLayer / ReorderTable)

  - Sortable: pointer-events 重排序容器，axis 'x'/'y'，handle 选择器，emit reorder + update:items
  - Draggable / Droppable / DragLayer: 跨组件 DnD，共享 module-singleton dndStore；type 字符串过滤
  - ReorderTable: 行拖拽重排的 grid 布局表格，首列固定手柄，cell-\* 插槽 / column.render 自定义单元格
  - 新 composable / hook: useDraggable / useDroppable / useDragDrop（订阅全局 store）
  - docs: 5 个 mdx + 多个 Vue demos + 「拖拽 / Drag & Drop」侧边栏分组 + 首页卡片

## 0.8.1

### Patch Changes

- [`571078f`](https://github.com/chenqi92/chufix/commit/571078f8f0a4bb9802a84c7eee5936def0a635ee) Thanks [@chenqi92](https://github.com/chenqi92)! - split map family into @chufix-design/maps-vue + maps-react packages; demos now use real OSM tiles

  - packages/maps-vue (new): CfMap, CfMapMiniMap, CfChoroplethMap, CfFlowMap, CfMapTile, CfMapLegend, CfMapScale, CfBubbleMap, CfHeatMap, CfMarkerCluster
  - packages/maps-react (new): same component set mirrored for React
  - packages/vue/src/index.ts: remove 10 map exports + map CSS imports; main bundle drops ~50KB JS + ~14KB CSS
  - packages/react/src/index.ts: same removals
  - apps/docs/package.json: add @chufix-design/maps-vue and @chufix-design/maps-react workspace deps
  - apps/docs/src/styles/global.css: import @chufix-design/maps-vue/style.css alongside @chufix-design/vue/style.css
  - apps/docs/src/components/demos/map and 10 map demos: switch imports to @chufix-design/maps-vue (CfBadge in map/BasicVue stays on @chufix-design/vue)
  - apps/docs/src/components/demos/{bubblemap,heatmap,markercluster,maplegend,mapscale}: rebuilt to wrap CfMapTile so demos show real OSM tile underneath instead of placeholder GeoJSON
  - apps/docs/src/content/docs/components/{bubblemap,heatmap,markercluster,maplegend,mapscale}.mdx: switch demos to client:only="vue" since CfMapTile uses pointer capture + dynamic image loading

  Consumer migration: `import { CfMapTile, CfBubbleMap, ... } from '@chufix-design/vue'` becomes `import { CfMapTile, CfBubbleMap, ... } from '@chufix-design/maps-vue'` (same for React). Install with `pnpm add @chufix-design/maps-vue` or `@chufix-design/maps-react`.

## 0.8.0

### Minor Changes

- [`d1f95e3`](https://github.com/chenqi92/chufix/commit/d1f95e39ca1ce1d28be8cd5717fb10fdc48c9fc2) Thanks [@chenqi92](https://github.com/chenqi92)! - add interactive map family

  - CfMapTile: XYZ tile map with pointer pan + wheel zoom; OSM default + dark CartoDB; Web Mercator projection injected to layer children via provide/inject (Vue) and context (React)
  - CfBubbleMap: proportional symbol map with sqrt radius scaling; standalone or as MapTile child layer
  - CfHeatMap: canvas KDE density heatmap with gradient LUT; geographic, distinct from CalendarHeatmap
  - CfMarkerCluster: grid clustering with click-to-drill-down; exports gridCluster utility
  - CfMapLegend: color / size legend in continuous and stepped modes; corner overlay or inline
  - CfMapScale: scale bar computing meters-per-pixel from lat + zoom; metric / imperial; auto-tracks parent MapTile viewport
  - CfChoroplethMap / CfFlowMap: add `projection` prop and auto-detect MapTile context to render as overlay layers
  - maptile/mercator helpers (lngLatToTile, tileToLngLat, makeProjection, makeUnproject, metersPerPixel) exported for custom layers

## 0.7.0

### Minor Changes

- [`c32d075`](https://github.com/chenqi92/chufix/commit/c32d075fd3f854448e1e714754c2349dca3aac4c) Thanks [@chenqi92](https://github.com/chenqi92)! - add form advanced + map family components

  - CfFieldRow: label / required / hint / error / control wrapper
  - CfFormGrid: container-width responsive grid with per-breakpoint columns
  - CfFormSection: title / description / anchor / collapsible
  - CfFormSchema: schema-driven form generator for 8 control types
  - useFormValidation (composable + hook): validators / change-blur-submit modes / async support
  - CfMapMiniMap: SVG overview map with GeoJSON outline and viewport rect
  - CfChoroplethMap: GeoJSON region fill map with sequential / diverging color scales, tooltip, legend
  - CfFlowMap: origin-destination curved arcs with value-to-width mapping

## 0.6.0

### Minor Changes

- [`ff00f2c`](https://github.com/chenqi92/chufix/commit/ff00f2c0ae624ede017d29afdb6587c2cf3b41fc) Thanks [@chenqi92](https://github.com/chenqi92)! - 数据 / 列表 / 虚拟化组件家族（8 个新组件）

  - `CfVirtualList` —— 纯虚拟列表；固定 / 变高行；overscan；scrollToIndex；十万行无掉帧
  - `CfVirtualGrid` —— 2D 虚拟网格；自动列数（minColumnWidth）+ 行虚拟化；图片墙 / 卡片墙
  - `CfTreeTable` —— 多列表格 + 行树形展开；chevron + indent + childrenKey + rowKey + striped
  - `CfMasonry` —— CSS columns 实现，零 JS 布局开销；自动列数或固定列数；SSR 友好
  - `CfFilterPanel` + `CfFilterSection` —— 筛选侧栏壳层 + section 子项；已保存视图横排；apply/reset footer
  - `CfBulkSelectionBar` —— 批量选中浮条；N/total 计数；sticky-top/sticky-bottom/inline 三档；自动隐藏
  - `CfColumnVisibilityMenu` —— 表格列显隐 + 拖拽排序 + pin left/right；locked 列禁改
  - `CfSpeedDial` —— 展开式 FAB；4 方向、5 位置；click/hover 触发；3 种 label 模式

  文档

  - 新增 `/components/{virtuallist,virtualgrid,treetable,masonry,filterpanel,bulkselectionbar,columnvisibilitymenu,speeddial}/` 8 个页面
  - sidebar 新增「数据 / 列表」分组（位于「AI 对话」之上）
  - components/index.mdx 加 数据 / 列表 卡片网格

## 0.5.0

### Minor Changes

- [`88ad8e1`](https://github.com/chenqi92/chufix/commit/88ad8e1ee0b584be7bfe6153413fbaf91793535f) Thanks [@chenqi92](https://github.com/chenqi92)! - AI / LLM 对话组件家族（10 个新组件）

  - `CfChatList` —— 自动滚到底部、stickToBottom 守卫、role/date 分组、"回到最新" 浮动按钮
  - `CfChatBubble` —— 三 role（user/assistant/system）+ 四态（sending/sent/streaming/error）+ hover 工具条（复制 / 重试 / 编辑 / 分支）
  - `CfPromptComposer` —— 多行输入、附件、`/` 命令、`@` mention、Enter / Cmd+Enter 提交、loading stop 按钮
  - `CfStreamingText` —— SSE token-by-token 渲染、闪烁光标、轻量 markdown（粗体 / 斜体 / `code`）不依赖 markdown-it
  - `CfThinkingTrace` —— 可折叠推理 trace；"Thought for X.Xs"；status `thinking → done` 时非受控自动收起
  - `CfToolCallCard` —— tool call 展示：name / input / output / pending|running|success|error / duration / errorMessage
  - `CfArtifactCard` —— 产物卡：code / doc / svg / html / image / csv / json，含 copy + Blob download + open 操作
  - `CfCitationMark` —— 行内 inline 引用 chip，hover 弹来源卡（title / domain / snippet / favicon / 打开链接）
  - `CfModelPicker` —— LLM 模型选择器，provider 分组 + capability badges + context window 自动 k/M 格式化
  - `CfTokenMeter` —— 上下文用量进度条，分段拆解（system / cached / fresh / completion），按比例自动 warning / error

  文档

  - 新增 `/components/{chatlist,chatbubble,promptcomposer,streamingtext,thinkingtrace,toolcallcard,artifactcard,citationmark,modelpicker,tokenmeter}/` 10 个页面
  - sidebar 新增「AI 对话」分组，置于「移动端 / 触控」之前
  - components/index.mdx 加 AI 对话卡片网格

## 0.4.0

### Minor Changes

- [`70b3ae1`](https://github.com/chenqi92/chufix/commit/70b3ae1064bd9cabbf827e0f1dbf2a82486fee2d) Thanks [@chenqi92](https://github.com/chenqi92)! - 移动端 / 触控组件家族

  新组件

  - `CfBottomSheet` —— 多停靠点（snap points）、grabber 拖动、下滑关闭、iOS 安全区适配
  - `CfPullToRefresh` —— 仅在 scrollTop=0 时启动；弹性阻尼、阈值反馈、受控刷新状态
  - `CfSwipeAction` —— 列表行左右滑暴露 action rail；velocity 或位移阈值吸附；点外关闭
  - `CfFab` —— 3 size × 3 variant × 3 position；extended pill、hideOnScroll、badge、safe-area
  - `CfTabBar` —— 底部路由级 tab；line / fill 激活样式、badge、safeArea padding

  手势 utility（Vue composable + React hook 镜像）

  - `useDrag` —— 通用拖拽底座：pointer-capture、轴向限制、阈值起拖、bounds 夹紧、100ms 速度窗口
  - `useSwipe` —— 四方向识别，在 useDrag 之上按 threshold 或 velocity 判定

  现有组件增强

  - `CfDrawer placement='bottom'` —— 新增 `showGrabber`、`dismissible` props；默认在 bottom 方向开启 grabber 与 swipe-down 关闭；自动加 `padding-bottom: env(safe-area-inset-bottom)`
  - `CfCarousel` —— 接入 useSwipe 支持移动端左右滑切换；保留 autoplay / indicator / 控制按钮

  Token 增量

  - `--touch-target-min: 48px`（Apple HIG 44pt / Material 48dp 取大）
  - `--bp-sm/md/lg/xl: 640 / 768 / 1024 / 1280px`（与 Tailwind 默认对齐）
  - `--safe-area-top/right/bottom/left: env(safe-area-inset-*, 0px)`
  - `--z-fab: 950`、`--z-bottomsheet: 1350`

  文档

  - DemoFrame 新增视口切换器（Desktop / 414 / 375px），选择持久化到 localStorage
  - 新增 `/components/{bottomsheet,pulltorefresh,swipeaction,fab,tabbar}/` 5 个页面
  - composables 文档新增「手势」章节涵盖 useDrag / useSwipe
  - sidebar 加「移动端 / 触控」分组

## 0.3.2

### Patch Changes

- [`65cff74`](https://github.com/chenqi92/chufix/commit/65cff74b92f991109826f6acb6bd11d37f093c27) Thanks [@chenqi92](https://github.com/chenqi92)! - 新增组件与图表

  - DetachedPanel 浮动面板
  - 10 个图表：DualAxis / Pareto / Slope / PolarBar / Marimekko / Tornado / WordCloud / Venn / Stream / Parallel
  - RadarChart 增加 vertex / axis pointer 事件

  组件能力增强

  - TreeSelect 重构：expand 状态、多选 cascade、indeterminate、search 自动展开祖先、defaultExpandedKeys、showLines、disabled 不被级联
  - NumberInput 新增 prefix / suffix 字符串与插槽
  - Sparkline hover 十字光标
  - Treemap padding 函数化、squarified 算法
  - Sankey 节点拖拽与跨层拖拽、重心法布局
  - Sunburst 钻取、焦点过渡、morph 与受控模式
  - MetricCard series 折叠展开 / 行点击

  工具函数（新增 25 个 composables + hooks，Vue 与 React 镜像）

  - 异步：useSingleFlight / useSubmitGuard / useAsync / useRetry / usePolling
  - 节流防抖：useDebouncedRef|useDebouncedValue / useDebouncedFn / useThrottledFn
  - DOM 与事件：useEventListener / useClickOutside / useFocusTrap / useScrollLock / useHotkeys / useMediaQuery / useIntersectionObserver / useResizeObserver
  - 存储与剪贴板：useLocalStorage / useSessionStorage / useClipboard
  - 主题：useTheme / useDensity / useReducedMotion
  - 工具：useId / usePrevious / useToggle / useTimeout / useInterval / useCounter

  文档

  - 左侧 sidebar 暴露图表分组
  - block detail 单文件采用 chart-style、多文件 fallback 模板
  - TreeSelect / NumberInput 文档新增章节
  - 新增 /utilities/composables/ 总览页
  - 修复浮层水合与演示稳定性
