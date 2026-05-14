---
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/tokens': minor
---

add interactive map family

- CfMapTile: XYZ tile map with pointer pan + wheel zoom; OSM default + dark CartoDB; Web Mercator projection injected to layer children via provide/inject (Vue) and context (React)
- CfBubbleMap: proportional symbol map with sqrt radius scaling; standalone or as MapTile child layer
- CfHeatMap: canvas KDE density heatmap with gradient LUT; geographic, distinct from CalendarHeatmap
- CfMarkerCluster: grid clustering with click-to-drill-down; exports gridCluster utility
- CfMapLegend: color / size legend in continuous and stepped modes; corner overlay or inline
- CfMapScale: scale bar computing meters-per-pixel from lat + zoom; metric / imperial; auto-tracks parent MapTile viewport
- CfChoroplethMap / CfFlowMap: add `projection` prop and auto-detect MapTile context to render as overlay layers
- maptile/mercator helpers (lngLatToTile, tileToLngLat, makeProjection, makeUnproject, metersPerPixel) exported for custom layers
