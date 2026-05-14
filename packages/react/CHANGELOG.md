# @chufix-design/react

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
