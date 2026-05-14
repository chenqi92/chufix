import type { GeoJsonFeature, MapBounds } from '../mapminimap/variants';

export type ColorScaleKind = 'sequential' | 'diverging';

export type ColorScaleFn = (value: number, domain: [number, number]) => string;

export interface ChoroplethDatum {
  id: string | number;
  value: number;
  name?: string;
}

export interface ChoroplethMapProps {
  /** GeoJSON FeatureCollection. */
  geojson: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
  /** Data rows keyed by `idField`. */
  data: ChoroplethDatum[];
  /** Property name on each feature used to match `data[].id`. Default `'id'`. */
  idField?: string;
  /** Property name used as label fallback. Default `'name'`. */
  nameField?: string;
  /** Domain for the color scale. Auto-computed from `data` when omitted. */
  domain?: [number, number];
  /** Color scale. Built-in 'sequential' / 'diverging', or a custom fn. */
  colorScale?: ColorScaleKind | ColorScaleFn;
  /** Geographic extent used for projection. Auto from features when omitted. */
  extent?: MapBounds;
  /**
   * Override projection (used inside `CfMapTile`). When omitted the component
   * falls back to its own equirectangular fit projection, or the projection
   * provided by an enclosing `CfMapTile`.
   */
  projection?: (lng: number, lat: number) => { x: number; y: number };
  /** SVG width in px. Default 480. */
  width?: number;
  /** SVG height in px. Default 280. */
  height?: number;
  /** Show tooltip on hover. Default true. */
  tooltip?: boolean;
  /** Show legend bar. Default true. */
  legend?: boolean;
  /** Optional unit suffix appended to the legend / tooltip value. */
  unit?: string;
}

export const SEQUENTIAL_SCALE: ColorScaleFn = (value, [min, max]) => {
  if (!Number.isFinite(value) || max === min) return 'oklch(from var(--accent-1) l c h / 0.08)';
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const alpha = 0.12 + t * 0.78;
  return `oklch(from var(--accent-1) l c h / ${alpha.toFixed(3)})`;
};

export const DIVERGING_SCALE: ColorScaleFn = (value, [min, max]) => {
  if (!Number.isFinite(value)) return 'oklch(from var(--bg-2) l c h / 0.6)';
  const mid = (min + max) / 2;
  const span = Math.max(Math.abs(max - mid), Math.abs(mid - min)) || 1;
  const t = (value - mid) / span;
  const alpha = 0.15 + Math.min(1, Math.abs(t)) * 0.7;
  const base = t >= 0 ? '--status-error' : '--status-info';
  return `oklch(from var(${base}) l c h / ${alpha.toFixed(3)})`;
};

export function resolveColorScale(
  kind: ColorScaleKind | ColorScaleFn | undefined,
): ColorScaleFn {
  if (typeof kind === 'function') return kind;
  if (kind === 'diverging') return DIVERGING_SCALE;
  return SEQUENTIAL_SCALE;
}

export function computeDomain(data: ChoroplethDatum[]): [number, number] {
  if (!data.length) return [0, 1];
  let min = Infinity;
  let max = -Infinity;
  for (const d of data) {
    if (!Number.isFinite(d.value)) continue;
    if (d.value < min) min = d.value;
    if (d.value > max) max = d.value;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) return [min, min + 1];
  return [min, max];
}

export function computeExtent(features: GeoJsonFeature[]): MapBounds {
  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;
  for (const f of features) {
    const geom = f.geometry;
    const coords = geom.coordinates as unknown;
    const rings = (geom.type === 'MultiPolygon'
      ? (coords as number[][][][]).flat()
      : (coords as number[][][])) as number[][][];
    for (const ring of rings) {
      for (const [lng, lat] of ring) {
        if (lng < west) west = lng;
        if (lng > east) east = lng;
        if (lat < south) south = lat;
        if (lat > north) north = lat;
      }
    }
  }
  if (!Number.isFinite(north)) return { north: 85, south: -85, east: 180, west: -180 };
  const padX = (east - west) * 0.04;
  const padY = (north - south) * 0.04;
  return { north: north + padY, south: south - padY, east: east + padX, west: west - padX };
}

/** Project preserving aspect ratio: fit `extent` into width×height while centering. */
export function projectFit(
  lng: number,
  lat: number,
  bounds: MapBounds,
  width: number,
  height: number,
): { x: number; y: number } {
  const w = bounds.east - bounds.west || 1;
  const h = bounds.north - bounds.south || 1;
  const scale = Math.min(width / w, height / h);
  const offsetX = (width - w * scale) / 2;
  const offsetY = (height - h * scale) / 2;
  return {
    x: offsetX + (lng - bounds.west) * scale,
    y: offsetY + (bounds.north - lat) * scale,
  };
}

export function polygonToFitPath(
  coords: number[][][] | number[][][][],
  multi: boolean,
  bounds: MapBounds,
  width: number,
  height: number,
): string {
  const rings = (multi
    ? (coords as number[][][][]).flat()
    : (coords as number[][][])) as number[][][];
  return rings
    .map((ring) => {
      let d = '';
      for (let i = 0; i < ring.length; i++) {
        const [lng, lat] = ring[i];
        const p = projectFit(lng, lat, bounds, width, height);
        d += (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ',' + p.y.toFixed(2);
      }
      return d + 'Z';
    })
    .join(' ');
}

/** Like polygonToFitPath but using a caller-supplied projection (lng,lat) → (x,y). */
export function polygonToProjectedPath(
  coords: number[][][] | number[][][][],
  multi: boolean,
  project: (lng: number, lat: number) => { x: number; y: number },
): string {
  const rings = (multi
    ? (coords as number[][][][]).flat()
    : (coords as number[][][])) as number[][][];
  return rings
    .map((ring) => {
      let d = '';
      for (let i = 0; i < ring.length; i++) {
        const [lng, lat] = ring[i];
        const p = project(lng, lat);
        d += (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ',' + p.y.toFixed(2);
      }
      return d + 'Z';
    })
    .join(' ');
}
