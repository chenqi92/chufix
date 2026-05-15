# @chufix-design/maps-vue

## 0.9.2

### Patch Changes

- [`55df25c`](https://github.com/chenqi92/chufix/commit/55df25c5a56992dfd211a21471f9bb3464fc8d8a) Thanks [@chenqi92](https://github.com/chenqi92)! - fix(styles): 0.9.0 系统排查后清扫 light theme 对比度与全局 pre/code 污染

  - Flamegraph 矩形上的文字色从 `var(--bg-0)`（light theme 下是白）改成固定 `oklch(18%)` 暗色，保证在三套主题下都有可读对比度
  - PlanCard `.cf-plan__detail` / AgentTimeline `.cf-agentt__content` / NetworkInspector `.cf-net__detail pre` 显式 `border: 0` + `overflow-x: auto`，避免被 docs global `pre { border, padding 1rem }` 规则污染
  - NetworkInspector `.cf-net__detail header code` 显式 `padding: 0; background: transparent; border-radius: 0;`，覆盖 docs global `code { padding 0.4em, background var(--bg-2) }` 默认样式
  - demos: AudioPlayer / VideoPlayer 替换为可访问的公共示例资源（CodeSkulptor mp3 + gtv-videos-bucket BigBuckBunny mp4）；RemoteCursor 动画改为围绕基准点 oscillate（替代之前累积 `+=` 导致漂走）

- Updated dependencies [[`55df25c`](https://github.com/chenqi92/chufix/commit/55df25c5a56992dfd211a21471f9bb3464fc8d8a)]:
  - @chufix-design/tokens@0.9.2

## 0.9.1

### Patch Changes

- [`1ab35b9`](https://github.com/chenqi92/chufix/commit/1ab35b97553ba6282ef967b02eb4f3df696c84d2) Thanks [@chenqi92](https://github.com/chenqi92)! - fix(styles): 修复 0.9.0 新增组件的字体与火焰图错位问题

  - DrawingCanvas / ReorderTable / ImageAnnotator / AudioPlayer / VideoPlayer / LogViewer / QueryBuilder / NetworkInspector / PlanCard / ReasoningTree / Flamegraph 的 css 显式继承 `font-family: var(--font-sans)` 并对内部 `button` / `select` / `input` 加 `font: inherit`，避免浏览器默认 -webkit-small-control 字体污染（之前看上去字号偏小、字体不一致）
  - Flamegraph 不再用 `<svg preserveAspectRatio="none">` 渲染：矩形改为绝对定位 div，标签走 HTML `text-overflow: ellipsis`，之前横向被 SVG 缩放拉伸成扁字的问题修复
  - maps-vue/maps-react/tokens 跟随 workspace 版本对齐

- Updated dependencies [[`1ab35b9`](https://github.com/chenqi92/chufix/commit/1ab35b97553ba6282ef967b02eb4f3df696c84d2)]:
  - @chufix-design/tokens@0.9.1

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

### Patch Changes

- Updated dependencies [[`82c9c41`](https://github.com/chenqi92/chufix/commit/82c9c418659c681160d6a4b78473435a34010e93), [`a34dc09`](https://github.com/chenqi92/chufix/commit/a34dc09c927f4c48387f940554950bac584a9e9a), [`0fc4876`](https://github.com/chenqi92/chufix/commit/0fc48768d41a4ce60ea0298a0f779af67c27b8c6), [`f63e395`](https://github.com/chenqi92/chufix/commit/f63e395b42f40dc0f0e5d2f13a09525c9ec6ec47)]:
  - @chufix-design/tokens@0.9.0

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

- Updated dependencies [[`571078f`](https://github.com/chenqi92/chufix/commit/571078f8f0a4bb9802a84c7eee5936def0a635ee)]:
  - @chufix-design/tokens@0.8.1
