import type { InjectionKey } from 'vue';
import type { LngLat, Viewport } from './mercator';

export type { LngLat, Viewport };

export interface TileSource {
  /** URL template using `{z}/{x}/{y}` placeholders. */
  url: string;
  /** Attribution HTML for the legal corner. */
  attribution?: string;
  /** Max integer zoom this source serves. Default 19. */
  maxZoom?: number;
  /** Optional sub-domains, used in `{s}` placeholder. */
  subdomains?: string[];
}

export const OSM_TILES: TileSource = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
  maxZoom: 19,
};

export const CARTO_DARK_TILES: TileSource = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OSM</a>, © <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
  subdomains: ['a', 'b', 'c', 'd'],
  maxZoom: 19,
};

export interface MapTileProps {
  /** Initial center longitude. */
  center?: LngLat;
  /** Initial zoom (fractional allowed). */
  zoom?: number;
  /** Min / max zoom clamp. */
  minZoom?: number;
  maxZoom?: number;
  /** Tile source. Default OSM. */
  tileSource?: TileSource;
  /** SVG width in px. */
  width?: number;
  /** SVG height in px. */
  height?: number;
  /** Show built-in zoom buttons. */
  showZoomControl?: boolean;
  /** Show attribution overlay. */
  showAttribution?: boolean;
  /** Disable mouse / touch interactions. */
  staticView?: boolean;
}

/** Builds a screen projection function so layer components can render in sync. */
export interface MapTileContext {
  viewport: Viewport;
  project: (lng: number, lat: number) => { x: number; y: number };
  unproject: (x: number, y: number) => LngLat;
}

export const MAPTILE_CONTEXT_KEY: InjectionKey<() => MapTileContext> = Symbol('cf-maptile-ctx');

export function fillTileUrl(template: string, z: number, x: number, y: number, subdomains?: string[]): string {
  let s = '';
  if (subdomains && subdomains.length) s = subdomains[Math.abs((x + y) % subdomains.length)];
  return template
    .replace('{z}', String(z))
    .replace('{x}', String(x))
    .replace('{y}', String(y))
    .replace('{s}', s);
}
