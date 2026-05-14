import type { MapBounds, GeoJsonFeature } from '../mapminimap/variants';

export interface BubbleDatum {
  id: string | number;
  name?: string;
  lng: number;
  lat: number;
  value: number;
  tone?: string;
}

export interface BubbleMapProps {
  /** Bubble data (one circle per row). */
  data: BubbleDatum[];
  /** Optional GeoJSON outline when used standalone (no tile context). */
  geojson?: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
  /** Geographic extent for standalone projection. Auto-fit when omitted. */
  extent?: MapBounds;
  /** Override projection (used when nested inside a CfMapTile). */
  projection?: (lng: number, lat: number) => { x: number; y: number };
  /** SVG width / height for standalone use. Ignored when inside CfMapTile. */
  width?: number;
  height?: number;
  /** Radius bounds (px). Default `[3, 24]`. */
  radiusRange?: [number, number];
  /** Domain `[min, max]`. Auto when omitted. */
  domain?: [number, number];
  /** Bubble fill (any CSS color). Default uses accent token. */
  fill?: string;
  /** Bubble stroke. Default accent token. */
  stroke?: string;
  /** Opacity 0-1. Default 0.55. */
  opacity?: number;
  /** Show hover tooltip. Default true. */
  tooltip?: boolean;
  /** Unit shown in tooltip. */
  unit?: string;
}

export function valueToRadius(
  value: number,
  domain: [number, number],
  range: [number, number],
): number {
  const [vMin, vMax] = domain;
  const [rMin, rMax] = range;
  if (vMax === vMin || !Number.isFinite(value)) return rMin;
  // Area-proportional scaling (sqrt) so visually bigger values feel right.
  const t = Math.max(0, Math.min(1, (value - vMin) / (vMax - vMin)));
  const area = t;
  return rMin + Math.sqrt(area) * (rMax - rMin);
}

export function autoDomain(data: BubbleDatum[]): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const d of data) {
    if (!Number.isFinite(d.value)) continue;
    if (d.value < min) min = d.value;
    if (d.value > max) max = d.value;
  }
  if (!Number.isFinite(min)) return [0, 1];
  if (min === max) return [min, min + 1];
  return [min, max];
}
