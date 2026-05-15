---
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/maps-vue': minor
'@chufix-design/maps-react': minor
'@chufix-design/tokens': minor
---

feat(media): add Media & Annotation family (SignaturePad / DrawingCanvas / ImageAnnotator / HotspotImage / AudioPlayer / VideoPlayer)

- SignaturePad: pointer + canvas 平滑签名板，暴露 clear/toDataURL/toBlob/isEmpty
- DrawingCanvas: 签名板 + 工具栏（画笔/橡皮/调色板/尺寸/撤销/重做/清空），笔画可序列化
- ImageAnnotator: 归一化坐标钉点标注，点击空白添加 / 拖动改坐标 / 选中删除
- HotspotImage: 图像 + SVG overlay 矩形 / 圆形热区，hover 显示 label
- AudioPlayer: 紧凑音频播放器，传 peaks 渲染波形进度条
- VideoPlayer: HTML5 video 之上的自定义控件栏，倍速菜单、全屏、字幕轨、idle 自动隐藏
- docs: 6 个 mdx + demos + 「媒体 / 标注」侧边栏分组 + 首页卡片
