---
'@chufix-design/tokens': minor
'@chufix-design/icons': minor
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/cli': minor
---

数据 / 列表 / 虚拟化组件家族（8 个新组件）

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
