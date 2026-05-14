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

/* All exports use the Cf prefix to match @chufix-design/react. */

// Normalized vector map (0..100 coords)
export { Map as CfMap } from './map/Map';
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
export { MapMiniMap as CfMapMiniMap } from './mapminimap/MapMiniMap';
export type { MapMiniMapProps, MapBounds, GeoJsonFeature } from './mapminimap/variants';
export { WORLD_BOUNDS, projectToBox, polygonToPath } from './mapminimap/variants';

// Static thematic maps (SVG, no tiles)
export { ChoroplethMap as CfChoroplethMap } from './choroplethmap/ChoroplethMap';
export type {
  ChoroplethMapProps,
  ChoroplethDatum,
  ColorScaleKind,
  ColorScaleFn,
} from './choroplethmap/variants';
export { FlowMap as CfFlowMap } from './flowmap/FlowMap';
export type { FlowMapProps, FlowPoint, FlowEdge } from './flowmap/variants';

// Interactive tile map + overlay layers
export { MapTile as CfMapTile, type MapTileHandle } from './maptile/MapTile';
export type {
  MapTileProps,
  TileSource,
  LngLat,
  Viewport,
  MapTileContext,
} from './maptile/variants';
export { OSM_TILES, CARTO_DARK_TILES, MapTileCtx } from './maptile/variants';
export {
  lngLatToTile,
  tileToLngLat,
  makeProjection,
  makeUnproject,
  metersPerPixel,
  TILE_SIZE,
} from './maptile/mercator';

// Controls
export { MapLegend as CfMapLegend } from './maplegend/MapLegend';
export type {
  MapLegendProps,
  MapLegendStop,
  MapLegendKind,
  MapLegendPosition,
} from './maplegend/variants';
export { MapScale as CfMapScale } from './mapscale/MapScale';
export type { MapScaleProps, MapScaleUnit, MapScalePosition } from './mapscale/variants';

// Point visualizations
export { BubbleMap as CfBubbleMap } from './bubblemap/BubbleMap';
export type { BubbleMapProps, BubbleDatum } from './bubblemap/variants';
export { HeatMap as CfHeatMap } from './heatmap/HeatMap';
export type { HeatMapProps, HeatPoint } from './heatmap/variants';
export { MarkerCluster as CfMarkerCluster } from './markercluster/MarkerCluster';
export type {
  MarkerClusterProps,
  MarkerDatum,
  ClusterGroup,
  ClusterResult,
} from './markercluster/variants';
