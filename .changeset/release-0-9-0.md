---
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/maps-vue': minor
'@chufix-design/maps-react': minor
'@chufix-design/tokens': minor
---

feat(dnd): add Drag & Drop family (Sortable / Draggable / Droppable / DragLayer / ReorderTable)

- Sortable: pointer-events 重排序容器，axis 'x'/'y'，handle 选择器，emit reorder + update:items
- Draggable / Droppable / DragLayer: 跨组件 DnD，共享 module-singleton dndStore；type 字符串过滤
- ReorderTable: 行拖拽重排的 grid 布局表格，首列固定手柄，cell-* 插槽 / column.render 自定义单元格
- 新 composable / hook: useDraggable / useDroppable / useDragDrop（订阅全局 store）
- docs: 5 个 mdx + 多个 Vue demos + 「拖拽 / Drag & Drop」侧边栏分组 + 首页卡片
