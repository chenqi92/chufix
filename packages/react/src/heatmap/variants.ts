import type { MapBounds, GeoJsonFeature } from '../mapminimap/variants';

export interface HeatPoint {
  lng: number;
  lat: number;
  /** Weight (intensity). Default 1. */
  weight?: number;
}

export interface HeatMapProps {
  data: HeatPoint[];
  /** Optional GeoJSON outline for standalone use. */
  geojson?: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
  /** Geographic extent for standalone projection. */
  extent?: MapBounds;
  /** Override projection (used inside CfMapTile). */
  projection?: (lng: number, lat: number) => { x: number; y: number };
  /** Canvas width/height for standalone use. */
  width?: number;
  height?: number;
  /** Per-point kernel radius in px. Default 32. */
  radius?: number;
  /** Maximum density before clamp. Default auto. */
  maxIntensity?: number;
  /** Gradient stops: 0..1 → color. Default cool→warm. */
  gradient?: Array<{ stop: number; color: string }>;
  /** Overall opacity. Default 0.7. */
  opacity?: number;
}

export const DEFAULT_HEAT_GRADIENT: Array<{ stop: number; color: string }> = [
  { stop: 0, color: 'rgba(0,0,255,0)' },
  { stop: 0.25, color: 'rgba(0,153,255,0.85)' },
  { stop: 0.5, color: 'rgba(0,255,153,0.85)' },
  { stop: 0.75, color: 'rgba(255,255,0,0.85)' },
  { stop: 1, color: 'rgba(255,0,0,0.95)' },
];
