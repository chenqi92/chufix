# @chufix-design/react

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

### Patch Changes

- Updated dependencies [[`ff00f2c`](https://github.com/chenqi92/chufix/commit/ff00f2c0ae624ede017d29afdb6587c2cf3b41fc)]:
  - @chufix-design/tokens@0.6.0
  - @chufix-design/icons@0.6.0

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

### Patch Changes

- Updated dependencies [[`88ad8e1`](https://github.com/chenqi92/chufix/commit/88ad8e1ee0b584be7bfe6153413fbaf91793535f)]:
  - @chufix-design/tokens@0.5.0
  - @chufix-design/icons@0.5.0

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

### Patch Changes

- Updated dependencies [[`70b3ae1`](https://github.com/chenqi92/chufix/commit/70b3ae1064bd9cabbf827e0f1dbf2a82486fee2d)]:
  - @chufix-design/tokens@0.4.0
  - @chufix-design/icons@0.4.0

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

- Updated dependencies [[`65cff74`](https://github.com/chenqi92/chufix/commit/65cff74b92f991109826f6acb6bd11d37f093c27)]:
  - @chufix-design/tokens@0.3.2
  - @chufix-design/icons@0.3.2
