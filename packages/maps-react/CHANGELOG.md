# @chufix-design/maps-react

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
