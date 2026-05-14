import { createContext } from 'react';
import type { LngLat, Viewport } from './mercator';

export type { LngLat, Viewport };

export interface TileSource {
  url: string;
  attribution?: string;
  maxZoom?: number;
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
  center?: LngLat;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  tileSource?: TileSource;
  width?: number;
  height?: number;
  showZoomControl?: boolean;
  showAttribution?: boolean;
  staticView?: boolean;
  onCenterChange?: (v: LngLat) => void;
  onZoomChange?: (v: number) => void;
  onMove?: (v: { center: LngLat; zoom: number }) => void;
  children?: React.ReactNode;
}

export interface MapTileContext {
  viewport: Viewport;
  project: (lng: number, lat: number) => { x: number; y: number };
  unproject: (x: number, y: number) => LngLat;
}

export const MapTileCtx = createContext<MapTileContext | null>(null);

export function fillTileUrl(template: string, z: number, x: number, y: number, subdomains?: string[]): string {
  let s = '';
  if (subdomains && subdomains.length) s = subdomains[Math.abs((x + y) % subdomains.length)];
  return template
    .replace('{z}', String(z))
    .replace('{x}', String(x))
    .replace('{y}', String(y))
    .replace('{s}', s);
}
