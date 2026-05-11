export type MapTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface MapCoord {
  /** Normalized x position in the 0-100 map coordinate space. */
  x: number;
  /** Normalized y position in the 0-100 map coordinate space. */
  y: number;
}

export interface MapMarker extends MapCoord {
  id: string;
  label: string;
  description?: string;
  value?: string | number;
  tone?: MapTone;
  disabled?: boolean;
}

export interface MapOverlay {
  id: string;
  label: string;
  points: MapCoord[];
  tone?: MapTone;
  interactive?: boolean;
}

export interface MapRoute {
  id: string;
  label?: string;
  points: MapCoord[];
  tone?: MapTone;
  dashed?: boolean;
}

export interface MapViewport {
  center: MapCoord;
  zoom: number;
}

export interface MapMarkerEvent {
  marker: MapMarker;
  nativeEvent: MouseEvent | KeyboardEvent;
}

export interface MapOverlayEvent {
  overlay: MapOverlay;
  nativeEvent: MouseEvent | KeyboardEvent;
}

export interface MapCanvasEvent {
  point: MapCoord;
  nativeEvent: MouseEvent;
}

export interface MapProps {
  markers?: MapMarker[];
  overlays?: MapOverlay[];
  routes?: MapRoute[];
  height?: number | string;
  center?: MapCoord;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  controls?: boolean;
  activeId?: string;
  ariaLabel?: string;
}

export const defaultMapViewport: MapViewport = {
  center: { x: 50, y: 50 },
  zoom: 1,
};

export function toneClass(tone: MapTone | undefined, prefix: string) {
  return `${prefix}--${tone ?? 'default'}`;
}

export function clampZoom(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
