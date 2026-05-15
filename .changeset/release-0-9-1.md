---
'@chufix-design/vue': patch
'@chufix-design/react': patch
'@chufix-design/maps-vue': patch
'@chufix-design/maps-react': patch
'@chufix-design/tokens': patch
---

fix(styles): 修复 0.9.0 新增组件的字体与火焰图错位问题

- DrawingCanvas / ReorderTable / ImageAnnotator / AudioPlayer / VideoPlayer / LogViewer / QueryBuilder / NetworkInspector / PlanCard / ReasoningTree / Flamegraph 的 css 显式继承 `font-family: var(--font-sans)` 并对内部 `button` / `select` / `input` 加 `font: inherit`，避免浏览器默认 -webkit-small-control 字体污染（之前看上去字号偏小、字体不一致）
- Flamegraph 不再用 `<svg preserveAspectRatio="none">` 渲染：矩形改为绝对定位 div，标签走 HTML `text-overflow: ellipsis`，之前横向被 SVG 缩放拉伸成扁字的问题修复
- maps-vue/maps-react/tokens 跟随 workspace 版本对齐
