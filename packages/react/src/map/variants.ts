import type { KeyboardEvent, MouseEvent } from 'react';

export type MapTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface MapCoord {
  x: number;
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
  nativeEvent: MouseEvent<Element> | KeyboardEvent<Element>;
}

export interface MapOverlayEvent {
  overlay: MapOverlay;
  nativeEvent: MouseEvent<Element> | KeyboardEvent<Element>;
}

export interface MapCanvasEvent {
  point: MapCoord;
  nativeEvent: MouseEvent<SVGSVGElement>;
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
  className?: string;
  onMarkerClick?: (event: MapMarkerEvent) => void;
  onMarkerEnter?: (event: MapMarkerEvent) => void;
  onMarkerLeave?: (event: MapMarkerEvent) => void;
  onOverlayClick?: (event: MapOverlayEvent) => void;
  onMapClick?: (event: MapCanvasEvent) => void;
  onViewportChange?: (viewport: MapViewport) => void;
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
