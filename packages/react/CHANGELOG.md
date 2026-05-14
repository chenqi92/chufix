# @chufix-design/react

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
