---
'@chufix-design/vue': patch
'@chufix-design/react': patch
'@chufix-design/maps-vue': patch
'@chufix-design/maps-react': patch
'@chufix-design/tokens': patch
---

fix(styles): 0.9.0 系统排查后清扫 light theme 对比度与全局 pre/code 污染

- Flamegraph 矩形上的文字色从 `var(--bg-0)`（light theme 下是白）改成固定 `oklch(18%)` 暗色，保证在三套主题下都有可读对比度
- PlanCard `.cf-plan__detail` / AgentTimeline `.cf-agentt__content` / NetworkInspector `.cf-net__detail pre` 显式 `border: 0` + `overflow-x: auto`，避免被 docs global `pre { border, padding 1rem }` 规则污染
- NetworkInspector `.cf-net__detail header code` 显式 `padding: 0; background: transparent; border-radius: 0;`，覆盖 docs global `code { padding 0.4em, background var(--bg-2) }` 默认样式
- demos: AudioPlayer / VideoPlayer 替换为可访问的公共示例资源（CodeSkulptor mp3 + gtv-videos-bucket BigBuckBunny mp4）；RemoteCursor 动画改为围绕基准点 oscillate（替代之前累积 `+=` 导致漂走）
