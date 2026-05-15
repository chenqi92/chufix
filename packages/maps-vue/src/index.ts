import '@chufix-design/tokens/tokens.css';
import './styles/map.css';
import './styles/mapminimap.css';
import './styles/choroplethmap.css';
import './styles/flowmap.css';
import './styles/maptile.css';
import './styles/maplegend.css';
import './styles/mapscale.css';
import './styles/bubblemap.css';
import './styles/heatmap.css';
import './styles/markercluster.css';
import './styles/terrain3d.css';

/* All exports use the Cf prefix to match @chufix-design/vue. */

// Normalized vector map (0..100 coords)
export { default as CfMap } from './map/Map.vue';
export type {
  MapProps,
  MapCoord,
  MapMarker,
  MapOverlay,
  MapRoute,
  MapViewport,
  MapMarkerEvent,
  MapOverlayEvent,
  MapCanvasEvent,
  MapTone,
} from './map/variants';

// Geographic overview
export { default as CfMapMiniMap } from './mapminimap/MapMiniMap.vue';
export type { MapMiniMapProps, MapBounds, GeoJsonFeature } from './mapminimap/variants';
export { WORLD_BOUNDS, projectToBox, polygonToPath } from './mapminimap/variants';

// Static thematic maps (SVG, no tiles)
export { default as CfChoroplethMap } from './choroplethmap/ChoroplethMap.vue';
export type {
  ChoroplethMapProps,
  ChoroplethDatum,
  ColorScaleKind,
  ColorScaleFn,
} from './choroplethmap/variants';
export { default as CfFlowMap } from './flowmap/FlowMap.vue';
export type { FlowMapProps, FlowPoint, FlowEdge } from './flowmap/variants';

// Interactive tile map + overlay layers
export { default as CfMapTile } from './maptile/MapTile.vue';
export type {
  MapTileProps,
  TileSource,
  LngLat,
  Viewport,
  MapTileContext,
} from './maptile/variants';
export { OSM_TILES, CARTO_DARK_TILES, MAPTILE_CONTEXT_KEY } from './maptile/variants';
export {
  lngLatToTile,
  tileToLngLat,
  makeProjection,
  makeUnproject,
  metersPerPixel,
  TILE_SIZE,
} from './maptile/mercator';

// Controls
export { default as CfMapLegend } from './maplegend/MapLegend.vue';
export type {
  MapLegendProps,
  MapLegendStop,
  MapLegendKind,
  MapLegendPosition,
} from './maplegend/variants';
export { default as CfMapScale } from './mapscale/MapScale.vue';
export type { MapScaleProps, MapScaleUnit, MapScalePosition } from './mapscale/variants';

// Point visualizations
export { default as CfBubbleMap } from './bubblemap/BubbleMap.vue';
export type { BubbleMapProps, BubbleDatum } from './bubblemap/variants';
export { default as CfHeatMap } from './heatmap/HeatMap.vue';
export type { HeatMapProps, HeatPoint } from './heatmap/variants';
export { default as CfMarkerCluster } from './markercluster/MarkerCluster.vue';
export type {
  MarkerClusterProps,
  MarkerDatum,
  ClusterGroup,
  ClusterResult,
} from './markercluster/variants';

// 3D Terrain (requires `three` peer dependency)
export { default as CfTerrain3D } from './terrain3d/Terrain3D.vue';
export type {
  Terrain3DProps,
  Terrain3DBounds,
  Terrain3DCamera,
  Terrain3DColorScale,
} from './terrain3d/variants';
export { COLOR_SCALES, resolveColorScale, normalizeHeights } from './terrain3d/variants';
