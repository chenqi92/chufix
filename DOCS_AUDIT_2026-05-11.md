# ChuFix Docs 全站组件审计（2026-05-11）

## 范围与方法

- 本地入口：`http://localhost:4321/`
- 扫描范围：195 个路由，包括首页、组件总览、Charts、Blocks、161 个组件页、30 个 Block 详情页。
- 视口：1440 x 1000。
- 检查信号：HTTP 状态、浏览器 console warning/error、SSR/hydration mismatch、顶部导航可见性、页面横向溢出、DemoFrame 空白/溢出/内部滚动、重点交互可用性。
- 交互复核：顶部导航 hover、BackTop、Affix、Blocks 卡片预览、ChartCrosshair。

## 总体结论

- 所有扫描路由均返回 200，未发现 404 页面级路由。
- 根级横向溢出为 0，整体页面 shell 宽度控制基本稳定。
- `BackTop` 与 `Affix` 在当前本地环境中功能可用：滚动后可出现、点击返回顶部；固钉滚动后进入 `is-fixed`。
- 顶部导航 hover 没有复现下划线污染：`Components / Charts / Blocks` hover 后 `text-decoration-line: none`。
- 当前最影响 docs 可信度的问题集中在三类：SSR/hydration、浮层 Teleport、Blocks 示例 API 不匹配。

## 修复进展

已在后续提交中处理：

- `Form.vue` 初始化快照不再直接 clone reactive proxy，Form demos 已恢复渲染。
- CommandPalette / Modal / Drawer / ContextMenu / FloatingInspector / HoverCard / ImagePreview / Snackbar / Tour / GlobalSearch / DetachedPanel / Dropdown / Popover / Tooltip / Toast 已增加客户端挂载后渲染保护，避免关闭态 Teleport 造成导航消失或 hydration mismatch。
- `MetricCard` Vue / React API 已补齐 `prefix` / `suffix` / `hint`，并兼容 `'up' | 'down' | 'flat'` trend preset，Blocks 中的 MetricCard 预览不再因 API 不匹配崩溃。
- Countdown / Statistic 已改为 mounted 后启动动态倒计时或动画，避免 SSR 初始文本不一致。
- Avatar / Tag / Spreadsheet / Table / Blocks 相关 demo 已清理外部 404、缺失 import、随机数据和不可写 const 绑定。
- TimePicker / TimeRangePicker 已修复嵌套 button 导致的无效 HTML 与 hydration mismatch。
- DonutChart / RadarChart / Gauge / ConnectionGraph 共用的 polar 坐标已稳定到 4 位小数，消除 Node 与浏览器三角函数尾差导致的 SVG path mismatch。
- MethodBadge 别名页已补充真实 DemoFrame，不再只有 import 代码块。

复核命令：

- `pnpm --filter=@chufix-design/vue build`
- `pnpm --filter=@chufix-design/react build`
- `pnpm build:docs`

## P0 阻塞问题

| 页面 / 范围 | 问题 | 证据 | 建议修复 |
|---|---|---|---|
| `/components/form/` | Form 页面 DemoFrame 全部消失，页面只剩文档文字和 API。 | Dev server 输出 `DataCloneError: #<Object> could not be cloned`，栈指向 `packages/vue/src/form/Form.vue:26`；巡检中 `demoCount=0`。 | `Form.vue` 不要对 Vue reactive proxy 直接 `structuredClone(props.model)`；先 `toRaw` / JSON clone 普通数据，或在 mounted 后保存初始快照。修复后重新确认所有 Form demos 渲染。 |
| `/components/commandpalette/`, `/components/confirmdialog/`, `/components/contextmenu/`, `/components/floatinginspector/`, `/components/hovercard/`, `/components/imagepreview/`, `/components/snackbar/`, `/components/tour/` | 页面 hydration 后顶部导航消失。 | 巡检显示 8 个页面 `navVisible=false`，同时有 Vue hydration mismatch。 | 与之前 DetachedPanel/GlobalSearch 类似：Teleport 不应在关闭态参与 hydration。把 `v-if="open"` 提到 `<Teleport>` 外层或改成客户端安全的 contained target；Modal/ConfirmDialog 也要一并处理。 |
| `/blocks/`, `/blocks/bulk-import/`, `/blocks/project-plan/` | Blocks 预览 hydration 崩溃，部分卡片预览为空或卡住。 | console: `Error hydrating /src/components/BlockPreview.vue TypeError: i.map is not a function`；调用链到 `Sparkline`。 | `ProjectPlan.vue` / `BulkImport.vue` 中 `CfMetricCard trend="up"` 传了字符串，但 `MetricCardProps.trend` 是 `number[]`。改成数组或扩展 MetricCard 支持 `'up' | 'down'` 预设。 |
| `/blocks/analytics-console/` 及部分 Blocks | `CfMetricCard` API 漂移，非法 props 下传到 DOM。 | console: `Failed setting prop "prefix" on <article>: value ¥ is invalid`。 | 统一 MetricCard Vue/React API：要么支持 `prefix/suffix/hint`，要么更新 block 示例为现有 `unit/delta/trend:number[]` API，避免未知 props 透传到 `<article>`。 |

## P1 高优先级问题

| 页面 / 范围 | 问题 | 证据 | 建议修复 |
|---|---|---|---|
| `/components/countdown/`, `/components/statistic/` | 服务端和客户端初始文本不同。 | `Countdown` SSR 为 `00:00:00`，client 期望 `00:01:00`；`Statistic` SSR 为最终数值，client 期望动画初始 `0`。 | 对动态时间/动画数字使用客户端渲染初值一致策略，或在 docs demo 中禁用 SSR / 延迟到 mounted 后启动。 |
| `/components/donutchart/`, `/components/latencyheatmap/`, `/components/metriccard/`, `/components/pivot/`, `/components/scatterplot/`, `/components/sparkline/` | 图表示例数据在 SSR 与 client 不一致，产生大量 path / fill / text hydration mismatch。 | 多个图表页出现 `Hydration attribute/text/style mismatch`。 | 所有 demo 随机数据改成固定 seed；不要在 SSR 和 client 分别调用 `Math.random()` / `Date.now()` 生成可见图形。 |
| `/components/timepicker/`, `/components/timerangepicker/` | 时间选择器子节点 hydration mismatch。 | console: `Hydration children mismatch`、`expected on client: Symbol(v-cmt)`。 | 检查弹层/清除按钮/可选列表是否在 SSR 与 client 条件渲染不一致；关闭态弹层也应避免 Teleport 参与 hydration。 |
| `/components/avatar/` | Avatar demo 会触发资源加载失败。 | 外部 `https://i.pravatar.cc/...` 在本地不可控；另有 `/__intentionally_404__.png` 触发 docs router 404。 | 用本地静态头像或 data URL；如果要演示 fallback，避免制造真实 404 console error。 |
| `/components/tag/` | Closable demo 缺少组件导入。 | Dev server: `Failed to resolve component: CfButton`，来源 `apps/docs/src/components/demos/tag/ClosableVue.vue`。 | 补充 `CfButton` import，或换成原生 button 并使用当前按钮类。 |
| `/components/timelinegantt/` | 第 3 个 demo 横向溢出。 | 巡检唯一 `demoOverflow=true`，内容宽 858，预览宽 914，但内部甘特时间轴仍超出。 | TimelineGantt demo 外层增加明确横向滚动或压缩 day width；DemoFrame 标记为 wide 不足以解决。 |

## P2 体验与文档完整性

| 页面 / 范围 | 问题 | 说明 | 建议 |
|---|---|---|---|
| `/components/methodbadge/` | 无 DemoFrame / demo 目录。 | 它是 `ProtocolBadge` 别名，但当前页面只有 import 代码块。 | 增加一个轻量 DemoFrame，展示 GET/POST/PUT/DELETE 与状态色；继续链接到 ProtocolBadge API。 |
| `/components/form/` | 文档本身写了 7 个 demo，但运行时全部消失。 | 这是 P0 的结果，也会被用户误判为“没有示例”。 | 修 Form SSR 后单独复扫。 |
| `/components/affix/`, `/components/backtop/`, `/components/anchor/`, `/components/infinitescroll/` | demo 内部滚动容器较明显。 | 有些滚动是组件语义需要，但当前 docs 视觉上仍显得窄。 | 保留组件语义滚动，但 DemoFrame 可给这些页面更大区域，避免用户误会“被内联滚动条挤坏”。 |
| `/components/kanban/`, `/components/table/`, `/components/datagrid/`, `/components/variableinput/`, `/components/code/`, `/components/scrollarea/` | 内部滚动存在。 | 多数是组件本身功能需要；`variableinput` overlay 宽度只有 24px 的样式值得复查。 | 把“预期滚动”和“展示空间不足”分开；对业务型组件默认使用 wide / taller demo。 |
| Charts / Blocks 总览 | 瀑布流和预览已有改善，但 Blocks 受 hydration crash 影响，部分预览仍会空。 | Blocks 卡片数 30，存在预览 rect 为 0 或无图形内容的卡片。 | 先修 P0 Blocks crash，再复查预览是否仍需重新布局。 |

## 组件能力缺口记录

这些不是本轮自动巡检能完全判定的 bug，但从文档与组件 API 看，下一轮能力补全应优先复核：

- `MetricCard`：docs/blocks 已经在使用 `prefix/suffix/hint/trend preset`，但 Vue props 只支持 `unit/delta/trend:number[]`。需要统一 API，否则 Blocks 继续不稳定。
- `Form`：能力描述很完整，但当前 SSR 失败；修复后应补充“异步校验 loading、字段级 validate trigger、表单禁用态、重置初始值”交互验收。
- `Map`：当前已具备 marker / overlay / route / click events 文档和基础 demo；下一轮可增加真实 overlay hover/active、tooltip、cluster、fitBounds、禁用覆盖物、键盘选择示例。
- `Transfer`：当前是基础两栏 + 搜索。可补全分页、大数据虚拟列表、one-way 模式、排序、分组、footer slot、禁用项批量选择策略。
- `Grid` / `Flex`：已覆盖基础，但 Grid 文档还缺“设计理念式 24 栅格视觉图”和响应式断点切换示例。
- `IconPicker` / `QRCode` / `Timeline` / `FloatButton` 等新补组件需要二次交互巡检：搜索、选择事件、复制/下载、键盘可达性、移动端布局。

## Hydration 问题清单

浏览器端有 warning/error 的路由：

- `/blocks/`
- `/blocks/analytics-console/`
- `/blocks/bulk-import/`
- `/blocks/project-plan/`
- `/components/avatar/`
- `/components/commandpalette/`
- `/components/confirmdialog/`
- `/components/contextmenu/`
- `/components/countdown/`
- `/components/donutchart/`
- `/components/floatinginspector/`
- `/components/hovercard/`
- `/components/imagepreview/`
- `/components/latencyheatmap/`
- `/components/metriccard/`
- `/components/pivot/`
- `/components/scatterplot/`
- `/components/snackbar/`
- `/components/sparkline/`
- `/components/statistic/`
- `/components/tag/`
- `/components/timepicker/`
- `/components/timerangepicker/`
- `/components/tour/`

服务端额外暴露：

- `/components/form/`：`DataCloneError`，导致 MDX runtime 中断。
- `/components/tag/`：`CfButton` 未解析。
- `/components/avatar/`：`/__intentionally_404__.png` 触发 docs 动态路由 404 warning。

## 已复核为正常或暂未复现

- 顶部导航 hover 下划线：未复现，hover 后 `text-decoration-line: none`。
- `/components/backtop/`：滚动容器到底部后按钮出现，点击后 `scrollTop=0`。
- `/components/affix/`：滚动后 `.cf-affix is-fixed`，内部元素 `position: fixed`，顶部对齐滚动容器。
- `/components/chartcrosshair/`：当前有 SVG 图表和十字线，不再是空白占位。

## 建议修复顺序

1. 先修 `Form.vue` 的 `structuredClone` 问题，恢复 Form 页面所有 demo。
2. 批量修 Vue overlay/Teleport 关闭态 hydration：CommandPalette、Modal/ConfirmDialog、ContextMenu、FloatingInspector、HoverCard、ImagePreview、Snackbar、Tour。
3. 统一 `MetricCard` API，并修 Blocks 中 `trend="up"`、`prefix/suffix/hint` 的不匹配。
4. 把所有随机图表 demo 改成固定 seed，消除图表 hydration mismatch。
5. 修 `Tag` demo import、Avatar 本地资源、TimelineGantt 横向溢出。
6. 做第二轮巡检：移动端 390px、暗色/亮色 + 多强调色、键盘可达性、弹层关闭/焦点回收。
