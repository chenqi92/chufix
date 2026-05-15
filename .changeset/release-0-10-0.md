---
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/maps-vue': minor
'@chufix-design/maps-react': minor
'@chufix-design/tokens': minor
---

feat(maps): add CfTerrain3D + 老地图 demo 真瓦片化 + 默认尺寸放大

- maps-vue / maps-react: 新增 `CfTerrain3D` —— three.js 实现的 3D 高程网格渲染。water-depth / elevation / delta / viridis 四套内置色阶，OrbitControls 拖拽，点击拾取经纬度网格行列。
- maps-vue / maps-react: `three` 作为 optional peerDependency；包大小 ~60 KB（不含 three）；vite/tsup external 不打包 three。
- docs: choroplethmap / flowmap demo 改为包在 `CfMapTile` 真 OSM 瓦片底图上、使用真实中国坐标（华北 / 华东 / 华南 / 西部 / 东北 5 区，BJ/SH/GZ/CD/XA/SY 6 城市）。
- docs: 所有交互地图 demo（maptile / bubblemap / heatmap / markercluster / maplegend / mapscale / choroplethmap / flowmap）默认尺寸统一 720×500-520（原 320-340）。
- docs: 加 terrain3d.mdx + BasicVue demo（96×72 高斯河床），「交互地图」侧边栏 + 首页卡片新增 Terrain3D 项。
