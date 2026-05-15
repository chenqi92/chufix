---
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/maps-vue': minor
'@chufix-design/maps-react': minor
'@chufix-design/tokens': minor
---

feat(devtools): add Developer Tools family (Flamegraph / LogViewer / Terminal / QueryBuilder / NetworkInspector / RequestTimeline)

- Flamegraph: 层级矩形性能图，点击 zoom-in，hover 显示 value 与占比
- LogViewer: 等宽日志流面板，level 着色 / search 高亮 / 自动跟随底部 / 滚开后「跳到底部」按钮
- Terminal: macOS 三圆点终端面板，行级 command/output/error/warning/success/info 着色
- QueryBuilder: 字段+操作符+值可视化过滤，emit AND/OR 可序列化 AST
- NetworkInspector: 类 DevTools Network 面板，方法/URL/状态/类型/大小/耗时列 + headers/body 详情
- RequestTimeline: 瀑布请求时序，phases 分段着色显示 dns/connect/wait/receive
- docs: 6 个 mdx + demos + 「开发者工具」侧边栏分组 + 首页卡片
