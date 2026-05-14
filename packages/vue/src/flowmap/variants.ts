import type { GeoJsonFeature, MapBounds } from '../mapminimap/variants';
import {
  computeExtent,
  polygonToFitPath,
  polygonToProjectedPath,
  projectFit,
} from '../choroplethmap/variants';

export interface FlowPoint {
  id: string | number;
  name?: string;
  lng: number;
  lat: number;
}

export interface FlowEdge {
  from: string | number;
  to: string | number;
  value?: number;
  label?: string;
}

export interface FlowMapProps {
  /** Optional GeoJSON background outline. */
  geojson?: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
  /** Place nodes with their geographic coordinates. */
  points: FlowPoint[];
  /** Origin-destination edges connecting node ids. */
  edges: FlowEdge[];
  /** Geographic extent for projection. Auto-fit when omitted. */
  extent?: MapBounds;
  /** Override projection (used inside CfMapTile). */
  projection?: (lng: number, lat: number) => { x: number; y: number };
  /** SVG width in px. Default 480. */
  width?: number;
  /** SVG height in px. Default 280. */
  height?: number;
  /** Map node value to a stroke width range. Default `[0.6, 3]`. */
  widthRange?: [number, number];
  /** Curvature factor for arcs. 0 = straight, 0.4 = strongly curved. Default 0.22. */
  curvature?: number;
  /** Show arrow heads at the destination. Default true. */
  showArrow?: boolean;
  /** Show node dots. Default true. */
  showNodes?: boolean;
  /** Show labels for nodes. Default false. */
  showLabels?: boolean;
}

export function pointBoundsExtent(points: FlowPoint[]): MapBounds {
  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;
  for (const p of points) {
    if (p.lng < west) west = p.lng;
    if (p.lng > east) east = p.lng;
    if (p.lat < south) south = p.lat;
    if (p.lat > north) north = p.lat;
  }
  if (!Number.isFinite(north)) return { north: 85, south: -85, east: 180, west: -180 };
  const padX = Math.max(1, (east - west) * 0.08);
  const padY = Math.max(1, (north - south) * 0.08);
  return { north: north + padY, south: south - padY, east: east + padX, west: west - padX };
}

export function curvedArc(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  k: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * k;
  const cy = my + dx * k;
  return `M${x1.toFixed(2)},${y1.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

export function valueToWidth(
  value: number | undefined,
  min: number,
  max: number,
  range: [number, number],
): number {
  if (value == null || !Number.isFinite(value) || max === min) return range[0];
  const t = (value - min) / (max - min);
  return range[0] + t * (range[1] - range[0]);
}

export { computeExtent, projectFit, polygonToFitPath, polygonToProjectedPath };
